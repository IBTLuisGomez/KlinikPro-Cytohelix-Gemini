package systems.cytohelix.klinikpro.fhir.outcome;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import systems.cytohelix.klinikpro.core.exception.BusinessConflictException;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.core.exception.ValidationException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Cada excepcion de negocio de core/exception/ debe traducirse al status +
 * OperationOutcome.issue correcto (ver plan-implementacion-fhir.md §5,
 * Parcela 4.2). No necesita contexto de Spring: FhirExceptionHandler es un
 * POJO cuyos metodos se pueden invocar directo.
 */
class FhirExceptionHandlerTest {

    private final FhirExceptionHandler handler = new FhirExceptionHandler();

    @Test
    void resourceNotFoundMapeaA404ConIssueNotFound() {
        ResponseEntity<OperationOutcome> response = handler.handleNotFound(
                new ResourceNotFoundException("Patient", "abc-123"));

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("OperationOutcome", response.getBody().resourceType());
        assertEquals(1, response.getBody().issue().size());
        assertEquals("not-found", response.getBody().issue().get(0).code());
    }

    @Test
    void businessConflictMapeaA409ConIssueDuplicate() {
        ResponseEntity<OperationOutcome> response = handler.handleConflict(
                new BusinessConflictException("codigo duplicado"));

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("duplicate", response.getBody().issue().get(0).code());
        assertEquals("codigo duplicado", response.getBody().issue().get(0).diagnostics());
    }

    @Test
    void validationRequiredMapeaA422ConIssueRequired() {
        ResponseEntity<OperationOutcome> response = handler.handleValidation(
                ValidationException.required("fecha y hora son obligatorias"));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("required", response.getBody().issue().get(0).code());
    }

    @Test
    void validationInvalidValueMapeaA422ConIssueValue() {
        ResponseEntity<OperationOutcome> response = handler.handleValidation(
                ValidationException.invalidValue("estado desconocido"));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("value", response.getBody().issue().get(0).code());
    }
}
