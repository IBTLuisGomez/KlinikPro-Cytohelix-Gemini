package systems.cytohelix.klinikpro.fhir.config;

import java.util.UUID;

/**
 * Namespaces (FHIR "system") usados para los {@code Identifier} que emite la
 * capa fhir/. Ver plan-implementacion-fhir.md §3.
 *
 * <p>El motivo de namespacear por tenant (y por sucursal donde aplica) es que
 * varios campos de negocio de KlinikPro NO son unicos globalmente — ej. el
 * codigo de paciente de 4 digitos es unico solo dentro de una sucursal. Sin
 * namespace, un sistema externo que consuma dos identifiers con el mismo
 * "value" pero de sucursales distintas creeria erroneamente que se trata del
 * mismo paciente. Mismo razonamiento que ya aplica a RLS por tenant_id.
 */
public final class FhirSystems {

    public static final String BASE = "urn:cytohelix:klinikpro";

    /**
     * Namespace del slug de tenant (ej. "recuperat"). A diferencia de los
     * demas, este es global (no se namespacea por tenantId) porque el slug
     * ya es unico globalmente (columna UNIQUE en tenants.slug).
     */
    public static final String TENANT_SLUG_SYSTEM = BASE + ":tenant-slug";

    private FhirSystems() {
    }

    /** Namespace del identifier "tenant-id" que expone Organization (ver FhirOrganization). */
    public static String tenantId(UUID tenantId) {
        return BASE + ":" + tenantId + ":tenant-id";
    }

    /** Namespace del identifier "branch-id" que expone Location (ver FhirLocation). */
    public static String branchId(UUID tenantId) {
        return BASE + ":" + tenantId + ":branch-id";
    }

    /**
     * Namespace del codigo de paciente (4 digitos), unico por sucursal, no
     * global. Se usara desde Parcela 1 (Patient).
     */
    public static String patientCode(UUID tenantId, UUID branchId) {
        return BASE + ":" + tenantId + ":" + branchId + ":patient-code";
    }
}
