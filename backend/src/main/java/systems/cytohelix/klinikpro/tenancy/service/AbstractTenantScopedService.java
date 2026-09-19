package systems.cytohelix.klinikpro.tenancy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import systems.cytohelix.klinikpro.tenancy.security.BranchContext;
import systems.cytohelix.klinikpro.tenancy.security.TenantContext;

import java.util.UUID;

/**
 * Base para servicios que tocan tablas tenant-scoped (Branch, AppUser, y en
 * fases futuras patients/agenda/pos/treatments/finance).
 *
 * Cada metodo @Transactional de una subclase debe llamar initTenantSession()
 * como PRIMERA linea, antes de cualquier query. Eso hace dos cosas dentro de
 * la MISMA conexion/transaccion:
 *   1. Habilita el filtro de Hibernate "tenantFilter" (capa de aplicacion).
 *   2. Fija la variable de sesion de Postgres app.current_tenant via
 *      set_config(..., true) — "true" = local a la transaccion, se resetea
 *      sola al hacer commit/rollback, para que las policies de RLS de
 *      V1__baseline_tenancy.sql puedan evaluarla.
 *
 * Se hace explicito (no con un aspecto AOP automatico) a proposito: es facil
 * de leer, facil de razonar sobre el orden de ejecucion, y no depende de que
 * el orden de los advisors de Spring quede bien configurado. Si el equipo
 * crece y esto se vuelve repetitivo, es un buen candidato para un
 * HandlerInterceptor + @Transactional bien ordenado (Fase 4 — endurecimiento).
 */
public abstract class AbstractTenantScopedService {

    @PersistenceContext
    protected EntityManager entityManager;

    protected UUID currentTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new IllegalStateException(
                    "No hay tenant en contexto. TenantContext.getTenantId() es null — "
                            + "revisa que la peticion haya pasado por JwtAuthenticationFilter.");
        }
        return tenantId;
    }

    /**
     * Para servicios de recursos con sucursal obligatoria (patients/, agenda/).
     * A diferencia de currentTenantId(), no todos los tokens traen branch_id
     * (ver BranchContext) — este metodo es solo para los servicios donde SI
     * es requerido; los que no lo necesiten simplemente no lo llaman.
     */
    protected UUID currentBranchId() {
        UUID branchId = BranchContext.getBranchId();
        if (branchId == null) {
            throw new IllegalStateException(
                    "Esta operacion requiere una sucursal en contexto y el usuario actual no tiene "
                            + "branch_id en su token (ver AppUser.branchId).");
        }
        return branchId;
    }

    protected void initTenantSession() {
        UUID tenantId = currentTenantId();

        entityManager.unwrap(Session.class)
                .enableFilter("tenantFilter")
                .setParameter("tenantId", tenantId);

        entityManager.createNativeQuery("SELECT set_config('app.current_tenant', :tenantId, true)")
                .setParameter("tenantId", tenantId.toString())
                .getSingleResult();
    }
}
