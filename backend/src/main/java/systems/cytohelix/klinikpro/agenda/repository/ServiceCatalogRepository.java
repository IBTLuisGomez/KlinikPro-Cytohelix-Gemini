package systems.cytohelix.klinikpro.agenda.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.agenda.domain.ServiceCatalog;

import java.util.UUID;

/**
 * Repositorio tenant-scoped (ver ServiceCatalog @Filter + RLS en V5__agenda.sql).
 */
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, UUID> {
}
