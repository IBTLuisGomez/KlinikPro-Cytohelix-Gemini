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
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cash_registers")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashRegister {

    @Id
    @Builder.Default
    private UUID id = UUID.randomUUID();

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @org.hibernate.annotations.CreationTimestamp
    @Column(name = "opened_at", updatable = false)
    private OffsetDateTime openedAt;

    @Column(name = "closed_at")
    private OffsetDateTime closedAt;

    @Column(name = "initial_amount", nullable = false)
    private BigDecimal initialAmount;

    @Column(name = "theoretical_amount", nullable = false)
    private BigDecimal theoreticalAmount;

    @Column(name = "real_amount")
    private BigDecimal realAmount;

    @Column(name = "difference")
    private BigDecimal difference;

    @Column(nullable = false)
    @Builder.Default
    private String status = "OPEN";

    @Column(name = "closing_notes")
    private String closingNotes;
}
