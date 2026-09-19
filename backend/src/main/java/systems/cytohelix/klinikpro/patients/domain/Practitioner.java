package systems.cytohelix.klinikpro.patients.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Especialista/tratante de una sucursal — store "specialists" del prototipo
 * (KlinikPro.html). Se asigna a pacientes (Patient.especialistaId/tratanteId)
 * y, desde Parcela 2, a citas (Appointment.practitionerId).
 *
 * Entidad tenant-scoped: mismo patron @Filter + RLS que Branch/AppUser (ver
 * V4__patients.sql).
 */
@Entity
@Table(name = "practitioners")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Practitioner {

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

    @Column(length = 160)
    private String especialidad;

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
