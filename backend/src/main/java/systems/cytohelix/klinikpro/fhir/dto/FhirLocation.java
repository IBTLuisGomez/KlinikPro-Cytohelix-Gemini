package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;

import java.util.List;

/**
 * Proyeccion FHIR R4 "Location" de {@link systems.cytohelix.klinikpro.tenancy.domain.Branch}.
 * Solo lectura — ver LocationFhirMapper. {@code status} usa el subconjunto
 * FHIR active|inactive (Branch no tiene un tercer estado hoy).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirLocation(
        String resourceType,
        String id,
        Meta meta,
        List<Identifier> identifier,
        String status,
        String name,
        Reference managingOrganization
) {
}
