package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.fhir.common.ContactPoint;
import systems.cytohelix.klinikpro.fhir.common.HumanName;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirPatient;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.dto.PatientUpsertCommand;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Entidad <-> DTO FHIR, en ambas direcciones:
 *   - toFhir: export, entidad -> FhirPatient (solo lectura).
 *   - toUpsertCommand: import, FhirPatient recibido en POST /fhir/Patient ->
 *     PatientUpsertCommand. NUNCA construye ni toca un Patient/repositorio
 *     directo — el comando se le pasa a PatientService.upsertFromFhir, que
 *     es quien aplica las invariantes (ver esa clase).
 */
@Component
public class PatientFhirMapper {

    public FhirPatient toFhir(Patient patient) {
        List<Identifier> identifiers = List.of(
                Identifier.of(FhirSystems.patientCode(patient.getTenantId(), patient.getBranchId()), patient.getCodigo())
        );

        List<ContactPoint> telecom = new ArrayList<>();
        if (patient.getTelefono() != null && !patient.getTelefono().isBlank()) {
            telecom.add(ContactPoint.phone(patient.getTelefono()));
        }
        if (patient.getEmail() != null && !patient.getEmail().isBlank()) {
            telecom.add(ContactPoint.email(patient.getEmail()));
        }

        // Convencion KlinikPro (ver FhirPatient): [0]=especialista, [1]=tratante.
        List<Reference> generalPractitioner = new ArrayList<>();
        if (patient.getEspecialistaId() != null) {
            generalPractitioner.add(Reference.to("Practitioner", patient.getEspecialistaId()));
        }
        if (patient.getTratanteId() != null) {
            generalPractitioner.add(Reference.to("Practitioner", patient.getTratanteId()));
        }

        return new FhirPatient(
                "Patient",
                patient.getId().toString(),
                Meta.of(patient.getVersion(), patient.getUpdatedAt()),
                identifiers,
                patient.isActive(),
                List.of(HumanName.ofText(patient.getNombre())),
                telecom.isEmpty() ? null : telecom,
                patient.getNacimiento(),
                generalPractitioner.isEmpty() ? null : generalPractitioner,
                Reference.to("Organization", patient.getTenantId())
        );
    }

    public PatientUpsertCommand toUpsertCommand(FhirPatient fhirPatient) {
        UUID id = fhirPatient.id() == null ? null : UUID.fromString(fhirPatient.id());

        String codigo = fhirPatient.identifier() != null && !fhirPatient.identifier().isEmpty()
                ? fhirPatient.identifier().get(0).value()
                : null;

        String nombre = fhirPatient.name() != null && !fhirPatient.name().isEmpty()
                ? nombreDe(fhirPatient.name().get(0))
                : null;

        String telefono = telecomValue(fhirPatient, "phone");
        String email = telecomValue(fhirPatient, "email");

        UUID especialistaId = practitionerIdAt(fhirPatient, 0);
        UUID tratanteId = practitionerIdAt(fhirPatient, 1);

        return new PatientUpsertCommand(
                id, codigo, nombre, telefono, email, fhirPatient.birthDate(),
                especialistaId, tratanteId, fhirPatient.active());
    }

    private String nombreDe(HumanName name) {
        if (name.text() != null && !name.text().isBlank()) {
            return name.text();
        }
        StringBuilder sb = new StringBuilder();
        if (name.given() != null) {
            name.given().forEach(g -> sb.append(g).append(' '));
        }
        if (name.family() != null) {
            sb.append(name.family());
        }
        return sb.toString().trim();
    }

    private String telecomValue(FhirPatient fhirPatient, String system) {
        if (fhirPatient.telecom() == null) {
            return null;
        }
        return fhirPatient.telecom().stream()
                .filter(cp -> system.equals(cp.system()))
                .map(ContactPoint::value)
                .findFirst()
                .orElse(null);
    }

    private UUID practitionerIdAt(FhirPatient fhirPatient, int index) {
        if (fhirPatient.generalPractitioner() == null || fhirPatient.generalPractitioner().size() <= index) {
            return null;
        }
        String reference = fhirPatient.generalPractitioner().get(index).reference();
        if (reference == null || !reference.contains("/")) {
            return null;
        }
        return UUID.fromString(reference.substring(reference.indexOf('/') + 1));
    }
}
