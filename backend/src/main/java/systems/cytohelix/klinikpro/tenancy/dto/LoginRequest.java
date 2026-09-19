package systems.cytohelix.klinikpro.tenancy.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * El slug del tenant viaja explicito en el login porque, a diferencia del
 * resto de la API, todavia no hay ningun JWT del que sacarlo — es el unico
 * punto donde el "tenant" lo dice el cliente en vez del token, y por eso
 * AuthService lo resuelve contra la tabla tenants antes de confiar en nada.
 */
public record LoginRequest(
        @NotBlank(message = "tenantSlug es requerido") String tenantSlug,
        @NotBlank(message = "email es requerido") String email,
        @NotBlank(message = "password es requerido") String password) {
}
