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

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Expediente de paciente — store "patients" del prototipo (KlinikPro.html).
 * Campos fieles al formulario real (formPaciente): codigo (4 digitos, unico
 * por sucursal — ver V4__patients.sql), especialista/tratante (dos roles de
 * Practitioner distintos), aseguradora/derivacion (checkboxes del prototipo),
 * autoCreado (alta automatica al cobrar, todavia sin conectar hasta que
 * pos/ deje de ser placeholder).
 *
 * Entidad tenant-scoped: mismo patron @Filter + RLS que Branch/AppUser.
 */
@Entity
@Table(name = "patients")
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

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

    /** Codigo de 4 digitos, unico por sucursal (no global). Ver FhirSystems.patientCode(). */
    @Column(nullable = false, length = 4)
    private String codigo;

    @Column(nullable = false, length = 160)
    private String nombre;

    @Column(length = 20)
    private String telefono;

    @Column(length = 180)
    private String email;

    private LocalDate nacimiento;

    @Column(name = "especialista_id")
    private UUID especialistaId;

    @Column(name = "tratante_id")
    private UUID tratanteId;

    @Column(nullable = false)
    @Builder.Default
    private boolean aseguradora = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean derivacion = false;

    @Column(columnDefinition = "text")
    private String notas;

    /** Alta automatica al cobrar en POS (ver comentario en V4__patients.sql). */
    @Column(name = "auto_creado", nullable = false)
    @Builder.Default
    private boolean autoCreado = false;

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
