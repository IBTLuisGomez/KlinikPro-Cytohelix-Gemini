package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Tipo FHIR R4 "Coding" — un codigo dentro de un sistema de codificacion.
 * Ver {@link CodeableConcept}.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Coding(String system, String code, String display) {
}
