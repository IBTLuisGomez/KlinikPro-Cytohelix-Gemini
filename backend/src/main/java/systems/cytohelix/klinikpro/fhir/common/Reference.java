package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Tipo FHIR R4 "Reference" — apunta a otro recurso, tipicamente como
 * "{Tipo}/{id}" (ej. "Organization/3f2...", "Location/9ab..."). El id usado
 * es siempre el UUID publico de la entidad de dominio (mismo id que
 * {@code Tenant.id}/{@code Branch.id}, etc.), nunca el codigo de negocio.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Reference(String reference, String type, String display) {

    public static Reference to(String resourceType, Object id) {
        return new Reference(resourceType + "/" + id, resourceType, null);
    }

    public static Reference to(String resourceType, Object id, String display) {
        return new Reference(resourceType + "/" + id, resourceType, display);
    }
}
