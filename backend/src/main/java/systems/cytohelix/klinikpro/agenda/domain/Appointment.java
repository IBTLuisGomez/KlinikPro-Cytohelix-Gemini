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

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Cita — store "appointments" del prototipo (KlinikPro.html). patientId,
 * serviceId y practitionerId son nullable a proposito: el prototipo permite
 * walk-ins/pacientes no registrados (ver comentario en submitCita), de ahi
 * el *Label de respaldo junto a cada FK (ver V5__agenda.sql).
 *
 * Entidad tenant-scoped: mismo patron @Filter + RLS que Branch/AppUser.
 */
@Entity
@Table(name = "appointments")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

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

    @Column(name = "patient_id")
    private UUID patientId;

    /** Etiqueta de respaldo para walk-ins / pacientes no registrados. */
    @Column(name = "patient_label", nullable = false, length = 160)
    private String patientLabel;

    @Column(length = 20)
    private String telefono;

    @Column(name = "service_id")
    private UUID serviceId;

    @Column(name = "service_label", length = 160)
    private String serviceLabel;

    @Column(name = "practitioner_id")
    private UUID practitionerId;

    @Column(name = "practitioner_label", length = 160)
    private String practitionerLabel;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    @Builder.Default
    private AppointmentStatus estado = AppointmentStatus.Programada;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
