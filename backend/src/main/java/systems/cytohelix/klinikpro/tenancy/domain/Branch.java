package systems.cytohelix.klinikpro.tenancy.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Sucursal de un tenant — equivalente a "branches" en el prototipo HTML
 * (activeBranchId local). Aqui pasa a ser una entidad real con aislamiento
 * por tenant.
 *
 * Entidad tenant-scoped: filtrada por Hibernate (@Filter, capa de aplicacion)
 * y por Row-Level Security en Postgres (ver V1__baseline_tenancy.sql). Ambas
 * capas usan tenant_id — quien llame a un servicio debe garantizar que
 * TenantContext y la sesion de Postgres esten inicializados primero (ver
 * AbstractTenantScopedService).
 */
@Entity
@Table(name = "branches")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = UUID.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Branch {

    @Id
    @GeneratedValue
    private UUID id;

    /** Optimistic locking + meta.versionId en la proyeccion FHIR (fhir/). */
    @Version
    private Long version;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String timezone = "America/Mexico_City";

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
