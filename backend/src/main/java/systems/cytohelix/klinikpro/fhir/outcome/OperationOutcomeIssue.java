package systems.cytohelix.klinikpro.fhir.outcome;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Un "issue" dentro de {@link OperationOutcome}. {@code severity} y
 * {@code code} usan los valores FHIR R4 estandar (ValueSets
 * issue-severity / issue-type) — solo se usa el subconjunto que necesita
 * esta capa.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record OperationOutcomeIssue(String severity, String code, String diagnostics) {

    public static OperationOutcomeIssue error(String code, String diagnostics) {
        return new OperationOutcomeIssue("error", code, diagnostics);
    }
}
