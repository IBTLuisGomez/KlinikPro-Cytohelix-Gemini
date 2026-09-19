package systems.cytohelix.klinikpro.tenancy.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Extrae el Bearer token, lo valida, y puebla:
 *   - el SecurityContext de Spring (autenticacion + rol como authority),
 *   - TenantContext (tenant_id resuelto del token, NUNCA del cliente), y
 *   - BranchContext (branch_id resuelto del token — puede ser null).
 *
 * TenantContext/BranchContext.clear() van en el finally: el hilo se reutiliza
 * entre peticiones (thread pool del servlet container), asi que si no se
 * limpian, una peticion podria heredar el tenant/sucursal de la peticion
 * anterior.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring("Bearer ".length());
            var claims = jwtService.parseAndValidate(token);

            UUID userId = jwtService.extractUserId(claims);
            UUID tenantId = jwtService.extractTenantId(claims);
            UUID branchId = jwtService.extractBranchId(claims);
            String role = jwtService.extractRole(claims);

            TenantContext.setTenantId(tenantId);
            BranchContext.setBranchId(branchId);

            var authentication = new UsernamePasswordAuthenticationToken(
                    userId, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);
        } catch (JwtException | IllegalArgumentException ex) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Token invalido o expirado\"}");
        } finally {
            TenantContext.clear();
            BranchContext.clear();
        }
    }
}
