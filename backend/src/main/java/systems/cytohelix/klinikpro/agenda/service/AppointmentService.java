package systems.cytohelix.klinikpro.agenda.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.dto.AppointmentUpsertCommand;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.core.exception.BusinessConflictException;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.core.exception.ValidationException;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Reglas de negocio de citas, portadas del prototipo (KlinikPro.html,
 * submitCita/setCitaEstado):
 *   1. Al crear, el estado SIEMPRE inicia en Pendiente (el prototipo ignora
 *      cualquier estado que venga del formulario de alta).
 *   2. Choque de horario: si se asigna practitioner, no puede haber otra
 *      cita del MISMO practitioner en la MISMA sucursal+fecha+hora que no
 *      este cancelada ("sameSlot" del prototipo). A diferencia del
 *      duplicado de paciente (que el prototipo solo advierte), esto SI
 *      bloquea — es un conflicto de agenda real, no una sugerencia de UI.
 *
 * upsertFromFhir es el UNICO punto de escritura usado por fhir/.
 */
@Service
public class AppointmentService extends AbstractTenantScopedService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional(readOnly = true)
    public Appointment findByIdForCurrentTenant(UUID id) {
        initTenantSession();
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id.toString()));
    }

    @Transactional(readOnly = true)
    public List<Appointment> findAllForCurrentBranch() {
        initTenantSession();
        UUID branchId = currentBranchId();
        return appointmentRepository.findAll().stream()
                .filter(a -> branchId.equals(a.getBranchId()))
                .toList();
    }

    /** Historial de citas de un paciente en la sucursal actual — ver FhirPatientController $everything. */
    @Transactional(readOnly = true)
    public List<Appointment> findAllForPatientInCurrentBranch(UUID patientId) {
        initTenantSession();
        UUID branchId = currentBranchId();
        return appointmentRepository.findByBranchIdAndPatientId(branchId, patientId);
    }

    @Transactional
    public Appointment upsertFromFhir(AppointmentUpsertCommand cmd) {
        initTenantSession();
        UUID tenantId = currentTenantId();
        UUID branchId = currentBranchId();

        if (cmd.id() != null) {
            Appointment existing = appointmentRepository.findById(cmd.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", cmd.id().toString()));

            boolean slotChanged = !Objects.equals(existing.getPractitionerId(), cmd.practitionerId())
                    || !Objects.equals(existing.getFecha(), cmd.fecha())
                    || !Objects.equals(existing.getHora(), cmd.hora());
            AppointmentStatus nuevoEstado = cmd.estado() != null ? cmd.estado() : existing.getEstado();
            if (slotChanged && cmd.practitionerId() != null && nuevoEstado != AppointmentStatus.Cancelada) {
                checkNoConflict(branchId, cmd.practitionerId(), cmd.fecha(), cmd.hora(), existing.getId());
            }

            applyCommand(existing, cmd);
            return appointmentRepository.save(existing);
        }

        // fecha/hora/patientLabel son NOT NULL en la tabla (ver V5__agenda.sql) y
        // siempre obligatorios al crear en el prototipo (submitCita) — se valida
        // aqui explicitamente para no dejar que un valor faltante llegue como
        // violacion de constraint sin traducir en Hibernate. ValidationException
        // se traduce a 422 + OperationOutcome en FhirExceptionHandler (Parcela 4.2).
        if (cmd.fecha() == null || cmd.hora() == null) {
            throw ValidationException.required("fecha y hora son obligatorias para crear una cita.");
        }
        if (cmd.patientLabel() == null || cmd.patientLabel().isBlank()) {
            throw ValidationException.required("patientLabel (nombre del paciente) es obligatorio para crear una cita.");
        }

        if (cmd.practitionerId() != null) {
            checkNoConflict(branchId, cmd.practitionerId(), cmd.fecha(), cmd.hora(), null);
        }

        Appointment appointment = Appointment.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .patientId(cmd.patientId())
                .patientLabel(cmd.patientLabel())
                .telefono(cmd.telefono())
                .serviceId(cmd.serviceId())
                .serviceLabel(cmd.serviceLabel())
                .practitionerId(cmd.practitionerId())
                .practitionerLabel(cmd.practitionerLabel())
                .fecha(cmd.fecha())
                .hora(cmd.hora())
                .estado(AppointmentStatus.Pendiente)
                .build();

        return appointmentRepository.save(appointment);
    }

    private void checkNoConflict(UUID branchId, UUID practitionerId, LocalDate fecha,
                                  LocalTime hora, UUID excludeAppointmentId) {
        List<Appointment> conflicts = appointmentRepository
                .findByBranchIdAndPractitionerIdAndFechaAndHoraAndEstadoNot(
                        branchId, practitionerId, fecha, hora, AppointmentStatus.Cancelada);
        boolean hayConflicto = conflicts.stream()
                .anyMatch(a -> excludeAppointmentId == null || !a.getId().equals(excludeAppointmentId));
        if (hayConflicto) {
            throw new BusinessConflictException(
                    "Ya existe una cita para ese especialista en la misma fecha y hora en esta sucursal.");
        }
    }

    
    //  * Actualizacion parcial deliberada: un campo ausente (null) en el comando
    //  * significa "no tocar", NUNCA "borrar". Importante sobre todo para
    //  * telefono/service*/practitioner* — un cliente que solo llama a esto para
    //  * cambiar el estado (equivalente a setCitaEstado del prototipo) no
    //  * deberia poder borrar sin querer quien atendio la cita con un payload
    //  * parcial. patientLabel/fecha/hora ademas son NOT NULL en BD (ver
    //  * V5__agenda.sql), asi que ignorarlos cuando vienen null es obligatorio,
    //  * no solo conveniente.
    
    private void applyCommand(Appointment appointment, AppointmentUpsertCommand cmd) {
        if (cmd.patientId() != null) {
            appointment.setPatientId(cmd.patientId());
        }
        if (cmd.patientLabel() != null) {
            appointment.setPatientLabel(cmd.patientLabel());
        }
        if (cmd.telefono() != null) {
            appointment.setTelefono(cmd.telefono());
        }
        if (cmd.serviceId() != null) {
            appointment.setServiceId(cmd.serviceId());
        }
        if (cmd.serviceLabel() != null) {
            appointment.setServiceLabel(cmd.serviceLabel());
        }
        if (cmd.practitionerId() != null) {
            appointment.setPractitionerId(cmd.practitionerId());
        }
        if (cmd.practitionerLabel() != null) {
            appointment.setPractitionerLabel(cmd.practitionerLabel());
        }
        if (cmd.fecha() != null) {
            appointment.setFecha(cmd.fecha());
        }
        if (cmd.hora() != null) {
            appointment.setHora(cmd.hora());
        }
        if (cmd.estado() != null) {
            appointment.setEstado(cmd.estado());
        }
    }
}
