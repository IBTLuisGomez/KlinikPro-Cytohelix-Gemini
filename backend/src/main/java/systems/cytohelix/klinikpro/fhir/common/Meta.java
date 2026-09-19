package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;

/**
 * Tipo FHIR R4 "Meta" — metadatos del recurso. {@code versionId} viene de la
 * columna {@code version} (optimistic locking, ver V3__add_optimistic_locking.sql)
 * y {@code lastUpdated} de {@code updatedAt}, ambos ya presentes en las
 * entidades de dominio.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Meta(String versionId, OffsetDateTime lastUpdated) {

    public static Meta of(Long version, OffsetDateTime lastUpdated) {
        return new Meta(version == null ? null : String.valueOf(version), lastUpdated);
    }
}
