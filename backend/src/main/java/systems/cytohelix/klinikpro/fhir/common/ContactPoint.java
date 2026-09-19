package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Tipo FHIR R4 "ContactPoint" — telefono, email, fax, etc. "system" aqui es
 * el campo FHIR propio (phone|email|fax|...), no confundir con los
 * namespaces de {@link Identifier} generados por
 * {@link systems.cytohelix.klinikpro.fhir.config.FhirSystems}.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ContactPoint(String system, String value, String use) {

    public static ContactPoint phone(String value) {
        return new ContactPoint("phone", value, null);
    }

    public static ContactPoint email(String value) {
        return new ContactPoint("email", value, null);
    }
}
