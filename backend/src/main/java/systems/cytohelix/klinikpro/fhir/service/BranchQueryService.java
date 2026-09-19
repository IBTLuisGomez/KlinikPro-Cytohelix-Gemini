package systems.cytohelix.klinikpro.fhir.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.tenancy.domain.Branch;
import systems.cytohelix.klinikpro.tenancy.repository.BranchRepository;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.util.UUID;

/**
 * Consulta de Branch para la proyeccion FHIR Location. A diferencia de
 * TenantQueryService, Branch SI es tenant-scoped (RLS + filtro Hibernate ya
 * cubren el aislamiento — ver AbstractTenantScopedService), asi que no hace
 * falta un chequeo manual de tenant_id aqui: si el id pedido es de otro
 * tenant, el filtro/RLS simplemente no lo devuelve y cae en el 404 normal.
 */
@Service
public class BranchQueryService extends AbstractTenantScopedService {

    private final BranchRepository branchRepository;

    public BranchQueryService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Transactional(readOnly = true)
    public Branch findByIdForCurrentTenant(UUID id) {
        initTenantSession();

        return branchRepository.findById(id)
                .filter(Branch::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Location", id.toString()));
    }
}
