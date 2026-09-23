package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.CashRegister;

import java.util.Optional;
import java.util.UUID;

public interface CashRegisterRepository extends JpaRepository<CashRegister, UUID> {
    Optional<CashRegister> findByUserIdAndStatus(UUID userId, String status);
}
