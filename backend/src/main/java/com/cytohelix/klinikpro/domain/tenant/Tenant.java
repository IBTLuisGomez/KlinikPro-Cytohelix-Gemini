package com.cytohelix.klinikpro.domain.tenant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenant")
@Getter
@Setter
public class Tenant {
    @Id
    private UUID id;
    private String name;
    private OffsetDateTime createdAt;
}
