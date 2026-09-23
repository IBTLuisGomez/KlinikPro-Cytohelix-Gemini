package systems.cytohelix.klinikpro.finances.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.CommissionSetting;

import java.util.Optional;
import java.util.UUID;

public interface CommissionSettingRepository extends JpaRepository<CommissionSetting, UUID> {
    Optional<CommissionSetting> findByPaymentMethodAndActiveTrue(String paymentMethod);
}
