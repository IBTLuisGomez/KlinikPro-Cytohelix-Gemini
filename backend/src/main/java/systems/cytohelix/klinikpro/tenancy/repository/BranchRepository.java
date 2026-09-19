package systems.cytohelix.klinikpro.tenancy.repository;

import systems.cytohelix.klinikpro.tenancy.domain.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Repositorio tenant-scoped. Los resultados solo reflejan el tenant actual
 * si el filtro de Hibernate "tenantFilter" fue habilitado antes de consultar
 * (ver AbstractTenantScopedService). RLS en Postgres es la segunda capa de
 * defensa por si algun llamado se salta ese paso.
 */
public interface BranchRepository extends JpaRepository<Branch, UUID> {
}
