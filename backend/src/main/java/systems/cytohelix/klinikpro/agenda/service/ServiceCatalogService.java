package systems.cytohelix.klinikpro.agenda.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.agenda.domain.ServiceCatalog;
import systems.cytohelix.klinikpro.agenda.repository.ServiceCatalogRepository;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.util.List;
import java.util.UUID;

/**
 * Consulta del catalogo de servicios. Solo lectura por ahora — igual que
 * Practitioner, no hay import FHIR de HealthcareService en esta fase.
 */
@Service
public class ServiceCatalogService extends AbstractTenantScopedService {

    private final ServiceCatalogRepository serviceCatalogRepository;

    public ServiceCatalogService(ServiceCatalogRepository serviceCatalogRepository) {
        this.serviceCatalogRepository = serviceCatalogRepository;
    }

    @Transactional(readOnly = true)
    public ServiceCatalog findByIdForCurrentTenant(UUID id) {
        initTenantSession();
        return serviceCatalogRepository.findById(id)
                .filter(ServiceCatalog::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("HealthcareService", id.toString()));
    }

    @Transactional(readOnly = true)
    public List<ServiceCatalog> findAllActiveForCurrentBranch() {
        initTenantSession();
        UUID branchId = currentBranchId();
        return serviceCatalogRepository.findAll().stream()
                .filter(ServiceCatalog::isActive)
                .filter(s -> branchId.equals(s.getBranchId()))
                .toList();
    }
}
