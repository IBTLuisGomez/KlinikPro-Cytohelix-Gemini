package systems.cytohelix.klinikpro.agenda.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Catalogo de servicios de una sucursal — store "services" del prototipo
 * (KlinikPro.html). Nombrado ServiceCatalog (no "Service") para no chocar
 * con el estereotipo @Service de Spring en el resto del codigo.
 *
 * Entidad tenant-scoped: mismo patron @Filter + RLS que Branch/AppUser.
 */
@Entity
@Table(name = "service_catalog")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCatalog {

    @Id
    @GeneratedValue
    private UUID id;

    /** Optimistic locking + meta.versionId en la proyeccion FHIR (fhir/). */
    @Version
    private Long version;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    @Column(nullable = false, length = 160)
    private String nombre;

    /** Duracion en minutos (campo "tiempo" del prototipo). */
    @Column(name = "tiempo_minutos", nullable = false)
    private Integer tiempoMinutos;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
