package systems.cytohelix.klinikpro.tenancy.repository;

import systems.cytohelix.klinikpro.tenancy.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Sin filtro de tenant: Tenant es la raiz del aislamiento, no una tabla
 * tenant-scoped. Resolver por slug es lo primero que ocurre en /auth/login,
 * antes de que exista ningun tenant_id de contexto.
 */
public interface TenantRepository extends JpaRepository<Tenant, UUID> {

    Optional<Tenant> findBySlugAndActiveTrue(String slug);
}
