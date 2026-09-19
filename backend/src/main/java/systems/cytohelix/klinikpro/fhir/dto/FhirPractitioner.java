package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.CodeableConcept;
import systems.cytohelix.klinikpro.fhir.common.HumanName;
import systems.cytohelix.klinikpro.fhir.common.Meta;

import java.util.List;

/**
 * Proyeccion FHIR R4 "Practitioner" de {@link systems.cytohelix.klinikpro.patients.domain.Practitioner}.
 *
 * <p>Simplificacion deliberada: FHIR real modela "qualification" como un
 * BackboneElement (code + period + issuer); aqui se representa la
 * especialidad como un {@link CodeableConcept} de solo texto, suficiente
 * para una proyeccion ligera sin HAPI.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirPractitioner(
        String resourceType,
        String id,
        Meta meta,
        Boolean active,
        List<HumanName> name,
        List<CodeableConcept> qualification
) {
}
