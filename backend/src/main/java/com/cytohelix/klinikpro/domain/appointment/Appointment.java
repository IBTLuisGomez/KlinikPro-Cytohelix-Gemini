package com.cytohelix.klinikpro.domain.appointment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "appointment")
@Getter
@Setter
public class Appointment {
    @Id
    private UUID id;
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @Column(name = "branch_id", nullable = false)
    private UUID branchId;
    
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;
    
    @Column(name = "practitioner_id", nullable = false)
    private UUID practitionerId;
    
    private String status; // AGENDADA, CONFIRMADA, CANCELADA
    
    @Column(name = "start_time", nullable = false)
    private OffsetDateTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private OffsetDateTime endTime;
}
