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

        List<systems.cytohelix.klinikpro.fhir.common.Extension> extensions = new ArrayList<>();
        extensions.add(systems.cytohelix.klinikpro.fhir.common.Extension.ofBoolean("http://cytohelix.systems/fhir/StructureDefinition/patient-aseguradora", patient.isAseguradora()));
        extensions.add(systems.cytohelix.klinikpro.fhir.common.Extension.ofBoolean("http://cytohelix.systems/fhir/StructureDefinition/patient-derivacion", patient.isDerivacion()));
        if (patient.getNotas() != null && !patient.getNotas().isBlank()) {
            extensions.add(systems.cytohelix.klinikpro.fhir.common.Extension.ofString("http://cytohelix.systems/fhir/StructureDefinition/patient-notas", patient.getNotas()));
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
                Reference.to("Organization", patient.getTenantId()),
                extensions
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
        
        Boolean aseguradora = getExtensionBoolean(fhirPatient, "http://cytohelix.systems/fhir/StructureDefinition/patient-aseguradora");
        Boolean derivacion = getExtensionBoolean(fhirPatient, "http://cytohelix.systems/fhir/StructureDefinition/patient-derivacion");
        String notas = getExtensionString(fhirPatient, "http://cytohelix.systems/fhir/StructureDefinition/patient-notas");

        return new PatientUpsertCommand(
                id, codigo, nombre, telefono, email, fhirPatient.birthDate(),
                especialistaId, tratanteId, fhirPatient.active(), aseguradora, derivacion, notas);
    }
    
    private Boolean getExtensionBoolean(FhirPatient fhirPatient, String url) {
        if (fhirPatient.extension() == null) return null;
        return fhirPatient.extension().stream().filter(e -> url.equals(e.url())).map(systems.cytohelix.klinikpro.fhir.common.Extension::valueBoolean).findFirst().orElse(null);
    }
    
    private String getExtensionString(FhirPatient fhirPatient, String url) {
        if (fhirPatient.extension() == null) return null;
        return fhirPatient.extension().stream().filter(e -> url.equals(e.url())).map(systems.cytohelix.klinikpro.fhir.common.Extension::valueString).findFirst().orElse(null);
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
