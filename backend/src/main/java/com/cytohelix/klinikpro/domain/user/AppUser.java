package com.cytohelix.klinikpro.domain.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "app_user")
@Getter
@Setter
public class AppUser {
    @Id
    private UUID id;
    
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    
    @Column(nullable = false)
    private String role;
}
