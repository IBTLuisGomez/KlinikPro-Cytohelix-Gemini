package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Tipo FHIR R4 "Identifier" — un identificador de negocio namespaceado por
 * "system". En KlinikPro los systems se generan con
 * {@link systems.cytohelix.klinikpro.fhir.config.FhirSystems} para evitar
 * colisiones entre tenants/sucursales (ver plan-implementacion-fhir.md §3).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Identifier(String use, String system, String value) {

    public static Identifier of(String system, String value) {
        return new Identifier(null, system, value);
    }
}
