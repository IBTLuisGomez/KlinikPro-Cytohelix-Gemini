package systems.cytohelix.klinikpro.tenancy;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.tenancy.security.JwtService;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * No necesita levantar el ApplicationContext ni Postgres: JwtService es una
 * clase de logica pura (firmar/verificar), asi que se prueba instanciandola
 * directo. Las pruebas de integracion multi-tenant (verificar que un tenant
 * jamas ve datos de otro) quedan para Fase 4, cuando haya Testcontainers.
 */
class JwtServiceTest {

    private final JwtService jwtService = new JwtService(
            "test-secret-key-at-least-32-characters-long-1234567890", 60);

    @Test
    void generaYValidaUnTokenConLosClaimsEsperados() {
        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();

        String token = jwtService.generateToken(userId, tenantId, branchId, "ADMIN");
        Claims claims = jwtService.parseAndValidate(token);

        assertEquals(userId, jwtService.extractUserId(claims));
        assertEquals(tenantId, jwtService.extractTenantId(claims));
        assertEquals("ADMIN", jwtService.extractRole(claims));
    }

    @Test
    void rechazaUnTokenManipulado() {
        String token = jwtService.generateToken(
                UUID.randomUUID(), UUID.randomUUID(), null, "RECEPCION");
        String tokenManipulado = token.substring(0, token.length() - 2) + "xx";

        assertThrows(JwtException.class, () -> jwtService.parseAndValidate(tokenManipulado));
    }
}
