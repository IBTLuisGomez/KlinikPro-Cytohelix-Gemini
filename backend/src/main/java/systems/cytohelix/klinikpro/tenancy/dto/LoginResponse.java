package systems.cytohelix.klinikpro.tenancy.dto;

public record LoginResponse(String token, String tenantSlug, String fullName, String role) {
}
