package systems.cytohelix.klinikpro.tenancy.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.tenancy.domain.AppUser;
import systems.cytohelix.klinikpro.tenancy.domain.Tenant;
import systems.cytohelix.klinikpro.tenancy.dto.LoginRequest;
import systems.cytohelix.klinikpro.tenancy.dto.LoginResponse;
import systems.cytohelix.klinikpro.tenancy.repository.AppUserRepository;
import systems.cytohelix.klinikpro.tenancy.repository.TenantRepository;
import systems.cytohelix.klinikpro.tenancy.security.JwtService;

/**
 * El login es el UNICO flujo que no extiende AbstractTenantScopedService: en
 * este punto todavia no existe un tenant_id de confianza (viene de un slug
 * que manda el cliente, ver LoginRequest), asi que no hay TenantContext que
 * usar. En vez de eso, fija la sesion de Postgres a mano apenas resuelve el
 * tenant por slug.
 */
@Service
public class AuthService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TenantRepository tenantRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            TenantRepository tenantRepository,
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.tenantRepository = tenantRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Tenant tenant = tenantRepository.findBySlugAndActiveTrue(request.tenantSlug())
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        // IMPORTANTE: fijar app.current_tenant ANTES de tocar app_users.
        // app_users tiene RLS (V1__baseline_tenancy.sql); sin esta linea,
        // current_setting('app.current_tenant') es NULL y la policy descarta
        // TODAS las filas, incluso las que ya filtramos por tenant_id en la
        // consulta de abajo.
        entityManager.createNativeQuery("SELECT set_config('app.current_tenant', :tenantId, true)")
                .setParameter("tenantId", tenant.getId().toString())
                .getSingleResult();

        AppUser user = appUserRepository.findActiveByTenantIdAndEmail(tenant.getId(), request.email())
                .orElseThrow(() -> new BadCredentialsException("Credenciales invalidas"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Credenciales invalidas");
        }

        String token = jwtService.generateToken(
                user.getId(), tenant.getId(), user.getBranchId(), user.getRole().name());

        return new LoginResponse(token, tenant.getSlug(), user.getFullName(), user.getRole().name());
    }
}
