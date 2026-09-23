package systems.cytohelix.klinikpro.finances.domain.cash;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Filter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cash_movements")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashMovement {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(name = "cash_register_id", nullable = false)
    private UUID cashRegisterId;

    @Column(name = "movement_type", nullable = false)
    private String movementType; // INCOME, EXPENSE, ADJUSTMENT

    @Column(nullable = false)
    private BigDecimal amount;

    private String description;

    @Column(name = "reference_id")
    private UUID referenceId;
    
    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private java.time.OffsetDateTime createdAt;
}
