package systems.cytohelix.klinikpro.tenancy.security;

import java.util.UUID;

/**
 * Contenedor ThreadLocal del branch_id resuelto del JWT en la peticion
 * actual — mismo patron que {@link TenantContext}, pero PUEDE ser null: no
 * todo usuario tiene una sucursal fija (ver AppUser.branchId, nullable — un
 * ADMIN puede no estar atado a una sola sucursal). Los servicios que
 * necesitan branch obligatorio (patients/, agenda/) deben validarlo ellos
 * mismos, no asumir que siempre viene poblado.
 *
 * Igual que TenantContext, se limpia en el finally de JwtAuthenticationFilter
 * para no filtrar la sucursal de una peticion hacia el siguiente hilo
 * reutilizado por el pool del servlet container.
 */
public final class BranchContext {

    private static final ThreadLocal<UUID> CURRENT_BRANCH = new ThreadLocal<>();

    private BranchContext() {
    }

    public static void setBranchId(UUID branchId) {
        CURRENT_BRANCH.set(branchId);
    }

    public static UUID getBranchId() {
        return CURRENT_BRANCH.get();
    }

    public static void clear() {
        CURRENT_BRANCH.remove();
    }
}
