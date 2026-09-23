package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.ExpenseCategory;

import java.util.List;
import java.util.UUID;

public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, UUID> {
    List<ExpenseCategory> findByTenantId(UUID tenantId);
}
