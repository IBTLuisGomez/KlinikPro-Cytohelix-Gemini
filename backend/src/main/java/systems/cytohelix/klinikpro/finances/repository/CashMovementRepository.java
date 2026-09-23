package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.CashMovement;

import java.util.UUID;

public interface CashMovementRepository extends JpaRepository<CashMovement, UUID> {
}
