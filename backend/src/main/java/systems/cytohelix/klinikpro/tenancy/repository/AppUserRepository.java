package systems.cytohelix.klinikpro.tenancy.repository;

import systems.cytohelix.klinikpro.tenancy.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    /**
     * Usado SOLO en el login (JwtAuthenticationFilter / AuthController), antes
     * de que exista un TenantContext resuelto. Por eso filtra tenant_id
     * explicitamente en la consulta en vez de depender del filtro de Hibernate
     * (que a esa altura del flujo todavia no esta habilitado).
     */
    @Query("select u from AppUser u where u.tenantId = :tenantId and u.email = :email and u.active = true")
    Optional<AppUser> findActiveByTenantIdAndEmail(@Param("tenantId") UUID tenantId, @Param("email") String email);
}
