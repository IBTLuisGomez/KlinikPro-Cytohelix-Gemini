package systems.cytohelix.klinikpro.patients.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.core.exception.BusinessConflictException;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.core.exception.ValidationException;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.dto.PatientUpsertCommand;
import systems.cytohelix.klinikpro.patients.repository.PatientRepository;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.util.List;
import java.util.UUID;

/**
 * Reglas de negocio de pacientes, portadas del prototipo (KlinikPro.html,
 * submitPaciente/nextPacienteCodigo):
 *   1. codigo de 4 digitos, unico por sucursal — si no se manda explicito,
 *      se autogenera como (maximo actual + 1), zero-padded.
 *   2. Posible duplicado si coincide nombre O telefono en la misma sucursal.
 *      El prototipo pregunta al usuario si quiere guardar de todos modos
 *      (dialogo de confirmacion); una API sin UI no puede preguntar, asi que
 *      upsertFromFhir trata un match como "actualizar ese paciente" en vez
 *      de crear un duplicado silencioso. Es la interpretacion mas segura del
 *      mismo invariante para un flujo de import automatizado.
 *
 * upsertFromFhir es el UNICO punto de escritura usado por fhir/ (ver
 * docs/plan-implementacion-fhir.md §6.1) — nunca se llama al repositorio
 * directo desde un controller.
 */
@Service
public class PatientService extends AbstractTenantScopedService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Transactional(readOnly = true)
    public Patient findByIdForCurrentTenant(UUID id) {
        initTenantSession();
        return patientRepository.findById(id)
                .filter(Patient::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", id.toString()));
    }

    @Transactional(readOnly = true)
    public List<Patient> findAllActiveForCurrentBranch() {
        initTenantSession();
        UUID branchId = currentBranchId();
        return patientRepository.findAll().stream()
                .filter(Patient::isActive)
                .filter(p -> branchId.equals(p.getBranchId()))
                .toList();
    }

    @Transactional
    public Patient upsertFromFhir(PatientUpsertCommand cmd) {
        initTenantSession();
        UUID tenantId = currentTenantId();
        UUID branchId = currentBranchId();

        if (cmd.id() != null) {
            Patient existing = patientRepository.findById(cmd.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", cmd.id().toString()));
            applyCommand(existing, cmd, branchId);
            return patientRepository.save(existing);
        }

        // nombre es NOT NULL en la tabla (ver V4__patients.sql) y obligatorio en
        // el formulario del prototipo (formPaciente) — se valida aqui explicitamente
        // para no dejar que un valor faltante llegue como violacion de constraint sin
        // traducir en Hibernate (mismo criterio que AppointmentService, Parcela 4.2).
        // Solo aplica a la creacion: en applyCommand (update) un nombre ausente (null)
        // significa "no tocar", igual que el resto de campos parciales.
        if (cmd.nombre() == null || cmd.nombre().isBlank()) {
            throw ValidationException.required("nombre es obligatorio para crear un paciente.");
        }

        List<Patient> duplicates = patientRepository.findPossibleDuplicates(
                branchId, cmd.nombre(), cmd.telefono());
        if (!duplicates.isEmpty()) {
            Patient existing = duplicates.get(0);
            applyCommand(existing, cmd, branchId);
            return patientRepository.save(existing);
        }

        String codigo = cmd.codigo() != null && !cmd.codigo().isBlank()
                ? cmd.codigo()
                : nextCodigo(branchId);

        patientRepository.findByBranchIdAndCodigo(branchId, codigo).ifPresent(p -> {
            throw new BusinessConflictException(
                    "El codigo \"" + codigo + "\" ya esta asignado a otro paciente en esta sucursal.");
        });

        Patient patient = Patient.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .codigo(codigo)
                .nombre(cmd.nombre())
                .telefono(cmd.telefono())
                .email(cmd.email())
                .nacimiento(cmd.nacimiento())
                .especialistaId(cmd.especialistaId())
                .tratanteId(cmd.tratanteId())
                .active(cmd.active() == null || cmd.active())
                .build();

        return patientRepository.save(patient);
    }

    private void applyCommand(Patient patient, PatientUpsertCommand cmd, UUID branchId) {
        if (cmd.codigo() != null && !cmd.codigo().equals(patient.getCodigo())) {
            patientRepository.findByBranchIdAndCodigo(branchId, cmd.codigo()).ifPresent(other -> {
                if (!other.getId().equals(patient.getId())) {
                    throw new BusinessConflictException(
                            "El codigo \"" + cmd.codigo() + "\" ya esta asignado a otro paciente en esta sucursal.");
                }
            });
            patient.setCodigo(cmd.codigo());
        }
        if (cmd.nombre() != null) {
            patient.setNombre(cmd.nombre());
        }
        patient.setTelefono(cmd.telefono());
        patient.setEmail(cmd.email());
        patient.setNacimiento(cmd.nacimiento());
        patient.setEspecialistaId(cmd.especialistaId());
        patient.setTratanteId(cmd.tratanteId());
        if (cmd.active() != null) {
            patient.setActive(cmd.active());
        }
    }

    /** Replica nextPacienteCodigo() del prototipo: maximo actual + 1, zero-padded a 4 digitos. */
    private String nextCodigo(UUID branchId) {
        int max = patientRepository.findAllCodigosByBranchId(branchId).stream()
                .mapToInt(codigo -> {
                    try {
                        return Integer.parseInt(codigo);
                    } catch (NumberFormatException ex) {
                        return 0;
                    }
                })
                .max()
                .orElse(0);
        return String.format("%04d", max + 1);
    }
}
