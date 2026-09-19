package systems.cytohelix.klinikpro.tenancy.security;

import java.util.UUID;

/**
 * Contenedor ThreadLocal del tenant_id resuelto del JWT en la peticion actual.
 * NUNCA se llena desde un parametro que mande el cliente (ver ADR 3.3) —
 * solo JwtAuthenticationFilter lo escribe, a partir del token verificado.
 *
 * Debe limpiarse siempre en un finally (ver JwtAuthenticationFilter) para no
 * filtrar el tenant de una peticion hacia el siguiente hilo reutilizado por
 * el pool del servlet container.
 */
public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static UUID getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}
