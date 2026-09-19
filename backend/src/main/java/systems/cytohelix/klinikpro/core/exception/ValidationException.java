package systems.cytohelix.klinikpro.core.exception;

/**
 * Dato de entrada invalido para una operacion de escritura (campo obligatorio
 * ausente, valor fuera de rango, etc.) — mapea a 422. Vive en core/, mismo
 * criterio que {@link BusinessConflictException} y {@link ResourceNotFoundException}:
 * la lanzan servicios de dominio (patients/, agenda/...) que no pueden
 * depender de fhir/, y cada manejador de excepcion (FhirExceptionHandler hoy,
 * un futuro GlobalExceptionHandler de API interna) la traduce a su propio
 * formato de error.
 *
 * <p>{@code issueType} usa el subconjunto del ValueSet FHIR "issue-type" que
 * esta capa necesita: {@code required} (campo obligatorio ausente) o
 * {@code value} (valor presente pero invalido). Un servicio que no es FHIR
 * puede simplemente ignorar este campo.
 */
public class ValidationException extends RuntimeException {

    private final String issueType;

    private ValidationException(String issueType, String message) {
        super(message);
        this.issueType = issueType;
    }

    /** Campo obligatorio ausente o en blanco (ej. fecha/hora/patientLabel de una cita). */
    public static ValidationException required(String message) {
        return new ValidationException("required", message);
    }

    /** Campo presente pero con un valor invalido (fuera de rango, formato incorrecto, etc.). */
    public static ValidationException invalidValue(String message) {
        return new ValidationException("value", message);
    }

    public String issueType() {
        return issueType;
    }
}
