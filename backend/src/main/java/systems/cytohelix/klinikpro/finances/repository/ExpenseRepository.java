package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.Expense;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
}
