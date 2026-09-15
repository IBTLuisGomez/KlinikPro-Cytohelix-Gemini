package com.cytohelix.klinikpro.config.security;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.UUID;

@Aspect
@Component
public class RlsAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @Before("execution(* com.cytohelix.klinikpro..*Repository.*(..))")
    public void setTenantId() {
        UUID tenantId = TenantContext.getTenantId();
        if (tenantId != null) {
            entityManager.createNativeQuery("SET LOCAL app.current_tenant = '" + tenantId.toString() + "'")
                         .executeUpdate();
        } else {
            entityManager.createNativeQuery("SET LOCAL app.current_tenant = ''")
                         .executeUpdate();
        }
    }
}
