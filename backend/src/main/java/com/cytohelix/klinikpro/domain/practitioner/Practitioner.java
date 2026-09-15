package com.cytohelix.klinikpro.domain.practitioner;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "practitioner")
@Getter
@Setter
public class Practitioner {
    @Id
    private UUID id;
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    private String name;
    private String specialization;
    
    @Column(name = "baja_logica")
    private boolean bajaLogica;
}
