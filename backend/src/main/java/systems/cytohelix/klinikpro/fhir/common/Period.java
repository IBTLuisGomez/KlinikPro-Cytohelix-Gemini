package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;

/**
 * Tipo FHIR R4 "Period" — rango de tiempo con inicio y/o fin opcionales.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Period(OffsetDateTime start, OffsetDateTime end) {
}
