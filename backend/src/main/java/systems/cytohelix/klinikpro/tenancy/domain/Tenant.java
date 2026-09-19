package systems.cytohelix.klinikpro.tenancy.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Una clinica/cliente de KlinikPro. Raiz del aislamiento multi-tenant: toda
 * tabla de negocio cuelga de un tenant_id que apunta aqui.
 */
@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue
    private UUID id;

    /** Optimistic locking + meta.versionId en la proyeccion FHIR (fhir/). */
    @Version
    private Long version;

    /** Identificador corto y unico usado en login/URLs (ej. "recuperat"). */
    @Column(nullable = false, unique = true, length = 64)
    private String slug;

    @Column(nullable = false, length = 160)
    private String name;

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
