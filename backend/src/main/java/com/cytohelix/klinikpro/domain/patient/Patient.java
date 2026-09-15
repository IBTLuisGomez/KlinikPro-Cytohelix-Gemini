package com.cytohelix.klinikpro.domain.patient;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "patient")
@Getter
@Setter
public class Patient {
    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @Column(name = "branch_id", nullable = false)
    private UUID branchId;

    private String codigo; // Folio de negocio
    private String nombre;
    private String telefono;
    private LocalDate fechaNacimiento;
    
    @Column(name = "tratante_id")
    private UUID tratanteId; // Referencia al Practitioner principal
    
    @Column(name = "baja_logica")
    private boolean bajaLogica;
}
