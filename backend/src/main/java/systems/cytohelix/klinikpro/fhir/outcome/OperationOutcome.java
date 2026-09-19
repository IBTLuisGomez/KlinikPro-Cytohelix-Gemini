package systems.cytohelix.klinikpro.fhir.outcome;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Recurso FHIR R4 "OperationOutcome" — formato de error de la capa fhir/.
 * Distinto a {@link systems.cytohelix.klinikpro.core.web.ApiError} (usado
 * por el resto de la API, que no es FHIR) a proposito: un cliente FHIR
 * espera este shape especifico.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record OperationOutcome(String resourceType, List<OperationOutcomeIssue> issue) {

    public static OperationOutcome of(OperationOutcomeIssue... issues) {
        return new OperationOutcome("OperationOutcome", List.of(issues));
    }

    public static OperationOutcome notFound(String resourceType, String id) {
        return of(OperationOutcomeIssue.error("not-found",
                resourceType + "/" + id + " no existe (o no pertenece al tenant activo)"));
    }
}
