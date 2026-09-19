package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Tipo FHIR R4 "HumanName". Se usara desde Parcela 1 (Patient/Practitioner)
 * en adelante; se define aqui, junto al resto de tipos comunes, para no
 * repartir los tipos comunes de fhir/common entre varias entregas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record HumanName(String use, String text, String family, List<String> given) {

    public static HumanName ofText(String text) {
        return new HumanName(null, text, null, null);
    }
}
