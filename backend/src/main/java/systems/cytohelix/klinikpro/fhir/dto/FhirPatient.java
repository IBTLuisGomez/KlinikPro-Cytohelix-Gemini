package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.ContactPoint;
import systems.cytohelix.klinikpro.fhir.common.HumanName;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;

import java.time.LocalDate;
import java.util.List;

/**
 * Proyeccion FHIR R4 "Patient" de {@link systems.cytohelix.klinikpro.patients.domain.Patient}.
 *
 * <p>Simplificacion deliberada (arquitectura ligera, sin HAPI): el prototipo
 * tiene dos roles de practitioner por paciente (especialista/tratante) que
 * FHIR estandar no distingue dentro de {@code generalPractitioner} — por
 * convencion de KlinikPro, el primer elemento de la lista es el especialista
 * y el segundo el tratante (ver PatientFhirMapper).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirPatient(
        String resourceType,
        String id,
        Meta meta,
        List<Identifier> identifier,
        Boolean active,
        List<HumanName> name,
        List<ContactPoint> telecom,
        LocalDate birthDate,
        List<Reference> generalPractitioner,
        Reference managingOrganization
) {
}
