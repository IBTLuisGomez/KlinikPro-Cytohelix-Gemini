package systems.cytohelix.klinikpro.fhir.outcome;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import systems.cytohelix.klinikpro.core.exception.BusinessConflictException;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.core.exception.ValidationException;

/**
 * Manejador de errores propio de fhir/ (separado del
 * {@link systems.cytohelix.klinikpro.core.web.GlobalExceptionHandler} del
 * resto de la API) — un cliente FHIR espera {@link OperationOutcome}, no
 * {@link systems.cytohelix.klinikpro.core.web.ApiError}.
 *
 * <p>Acotado a fhir/ via basePackages: el resto de la API sigue usando
 * GlobalExceptionHandler sin cambios.
 *
 * <p>{@code @Order(HIGHEST_PRECEDENCE)} es necesario, no cosmetico:
 * GlobalExceptionHandler no tiene basePackages (aplica a TODOS los
 * controllers, incluidos los de fhir/) y tiene un handler generico para
 * {@code Exception.class}. Sin esta prioridad explicita, la resolucion de
 * Spring entre @RestControllerAdvice beans es por el primero que matchee
 * — no por el mas especifico — asi que sin @Order, ResourceNotFoundException
 * podria terminar cayendo en el catch-all 500 de GlobalExceptionHandler en
 * vez del 404 + OperationOutcome que corresponde.
 */
@RestControllerAdvice(basePackages = "systems.cytohelix.klinikpro.fhir")
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FhirExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<OperationOutcome> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(OperationOutcome.notFound(ex.resourceType(), ex.id()));
    }

    /**
     * Conflictos de negocio que bloquean la escritura (codigo de paciente
     * duplicado, choque de horario en agenda/, etc — ver BusinessConflictException).
     * "duplicate" es un issue-type valido del ValueSet FHIR issue-type.
     */
    @ExceptionHandler(BusinessConflictException.class)
    public ResponseEntity<OperationOutcome> handleConflict(BusinessConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(OperationOutcome.of(OperationOutcomeIssue.error("duplicate", ex.getMessage())));
    }

    /**
     * Datos de entrada invalidos en un import (POST /fhir/Patient,
     * /fhir/Appointment) — campo obligatorio ausente o valor invalido. 422 es
     * el codigo convencional para "entendible sintacticamente, invalido
     * semanticamente" (no forma parte oficial del spec HTTP pero es el
     * estandar de facto para APIs REST, incluidas las guias FHIR).
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<OperationOutcome> handleValidation(ValidationException ex) {
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(OperationOutcome.of(OperationOutcomeIssue.error(ex.issueType(), ex.getMessage())));
    }
}
