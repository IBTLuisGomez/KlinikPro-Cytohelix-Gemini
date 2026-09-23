package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.Income;

import java.util.List;
import java.util.UUID;

public interface IncomeRepository extends JpaRepository<Income, UUID> {
    List<Income> findByTenantIdAndBranchId(UUID tenantId, UUID branchId);
    List<Income> findByTenantId(UUID tenantId);
}
