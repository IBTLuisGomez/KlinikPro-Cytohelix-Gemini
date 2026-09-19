package systems.cytohelix.klinikpro.fhir.service;

import org.springframework.stereotype.Service;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.tenancy.domain.Tenant;
import systems.cytohelix.klinikpro.tenancy.repository.TenantRepository;
import systems.cytohelix.klinikpro.tenancy.security.TenantContext;

import java.util.UUID;

/**
 * Consulta de Tenant para la proyeccion FHIR Organization.
 *
 * <p>A diferencia de Branch/AppUser, {@code Tenant} NO tiene RLS ni filtro de
 * Hibernate (es la raiz del aislamiento — ver V1__baseline_tenancy.sql y
 * AbstractTenantScopedService). Por eso este servicio NO extiende
 * AbstractTenantScopedService: en su lugar, valida a mano que el id pedido
 * coincida exactamente con el tenant del token (TenantContext). Sin este
 * chequeo, cualquier tenant autenticado podria leer el Organization de
 * CUALQUIER otro tenant simplemente adivinando su UUID — este es el unico
 * punto de todo fhir/ donde el aislamiento no viene "gratis" de RLS/filtro,
 * asi que el chequeo es obligatorio y va primero.
 */
@Service
public class TenantQueryService {

    private final TenantRepository tenantRepository;

    public TenantQueryService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public Tenant findByIdForCurrentTenant(UUID id) {
        UUID currentTenantId = TenantContext.getTenantId();
        if (currentTenantId == null) {
            throw new IllegalStateException(
                    "No hay tenant en contexto. TenantContext.getTenantId() es null — "
                            + "revisa que la peticion haya pasado por JwtAuthenticationFilter.");
        }

        // No distinguimos "no existe" de "existe pero es de otro tenant": mismo
        // 404 para ambos casos, para no filtrar informacion entre tenants.
        if (!currentTenantId.equals(id)) {
            throw new ResourceNotFoundException("Organization", id.toString());
        }

        return tenantRepository.findById(id)
                .filter(Tenant::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", id.toString()));
    }
}
