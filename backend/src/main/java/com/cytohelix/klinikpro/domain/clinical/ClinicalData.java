package com.cytohelix.klinikpro.domain.clinical;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "clinical_data")
@Getter
@Setter
public class ClinicalData {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "encounter_id")
    private UUID encounterId;

    @Type(JsonType.class)
    @Column(name = "fhir_payload", columnDefinition = "jsonb", nullable = false)
    private String fhirPayload;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    // Enforcing Immutability: once clinical data is created, it should not be updated.
    public void setFhirPayload(String fhirPayload) {
        if (this.fhirPayload != null) {
            throw new IllegalStateException("Clinical data records are immutable and cannot be modified once set.");
        }
        this.fhirPayload = fhirPayload;
    }
}
