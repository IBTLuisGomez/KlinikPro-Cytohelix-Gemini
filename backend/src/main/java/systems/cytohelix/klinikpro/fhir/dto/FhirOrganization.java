package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;

import java.util.List;

/**
 * Proyeccion FHIR R4 "Organization" de {@link systems.cytohelix.klinikpro.tenancy.domain.Tenant}.
 * Solo lectura — ver OrganizationFhirMapper.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirOrganization(
        String resourceType,
        String id,
        Meta meta,
        List<Identifier> identifier,
        Boolean active,
        String name
) {
}
