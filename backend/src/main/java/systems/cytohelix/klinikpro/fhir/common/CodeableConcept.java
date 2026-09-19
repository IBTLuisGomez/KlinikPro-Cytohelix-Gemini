package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Tipo FHIR R4 "CodeableConcept" — un concepto expresable con uno o mas
 * {@link Coding} y/o texto libre.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CodeableConcept(List<Coding> coding, String text) {

    public static CodeableConcept ofText(String text) {
        return new CodeableConcept(null, text);
    }
}
