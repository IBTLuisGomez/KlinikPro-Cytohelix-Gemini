package systems.cytohelix.klinikpro.tenancy.domain;

/**
 * Roles disponibles dentro de un tenant. Ver ADR (seccion 3.3) en el plan de
 * formalizacion: el tenant_id siempre se resuelve del token, nunca del cliente.
 */
public enum Role {
    ADMIN,
    RECEPCION,
    ESPECIALISTA
}
