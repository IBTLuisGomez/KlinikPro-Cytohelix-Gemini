package systems.cytohelix.klinikpro.tenancy.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

/**
 * Emite y valida los JWT de sesion. El tenant_id SIEMPRE viaja dentro del
 * token firmado — nunca se acepta como parametro suelto del cliente (ADR 3.3).
 */
@Component
public class JwtService {

    private static final String CLAIM_TENANT_ID = "tenantId";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_BRANCH_ID = "branchId";

    private final SecretKey signingKey;
    private final long expirationMinutes;

    public JwtService(
            @Value("${klinikpro.jwt.secret}") String secret,
            @Value("${klinikpro.jwt.expiration-minutes}") long expirationMinutes) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(UUID userId, UUID tenantId, UUID branchId, String role) {
        Instant now = Instant.now();
        var builder = Jwts.builder()
                .subject(userId.toString())
                .claim(CLAIM_TENANT_ID, tenantId.toString())
                .claim(CLAIM_ROLE, role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .signWith(signingKey);

        if (branchId != null) {
            builder.claim(CLAIM_BRANCH_ID, branchId.toString());
        }
        return builder.compact();
    }

    /** Lanza JwtException (o subclases) si el token es invalido o expiro. */
    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public UUID extractUserId(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public UUID extractTenantId(Claims claims) {
        return UUID.fromString(claims.get(CLAIM_TENANT_ID, String.class));
    }

    public String extractRole(Claims claims) {
        return claims.get(CLAIM_ROLE, String.class);
    }

    /** Null si el usuario no tiene sucursal fija (ver AppUser.branchId, nullable). */
    public UUID extractBranchId(Claims claims) {
        String raw = claims.get(CLAIM_BRANCH_ID, String.class);
        return raw == null ? null : UUID.fromString(raw);
    }
}
