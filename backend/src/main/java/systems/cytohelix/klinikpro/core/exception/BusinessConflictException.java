package systems.cytohelix.klinikpro.core.exception;

/**
 * Conflicto de una regla de negocio que SI bloquea la escritura (a diferencia
 * de un duplicado "blando" que solo se advierte) — ej. codigo de paciente ya
 * asignado en la misma sucursal, choque de horario en agenda/. Mapea a 409.
 *
 * Vive en core/ (no en fhir/ ni en un paquete de dominio especifico) porque
 * varios paquetes de dominio la lanzan y varios manejadores de excepcion
 * (GlobalExceptionHandler para la API interna futura, FhirExceptionHandler
 * para fhir/) la traducen cada uno a su propio formato de error.
 */
public class BusinessConflictException extends RuntimeException {

    public BusinessConflictException(String message) {
        super(message);
    }
}
