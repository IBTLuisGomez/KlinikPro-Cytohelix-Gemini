package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirOrganization;
import systems.cytohelix.klinikpro.tenancy.domain.Tenant;

import java.util.List;

/**
 * Entidad -> DTO FHIR. Solo lectura (export). Import de Organization no
 * aplica en esta fase (un tenant no se crea via FHIR).
 */
@Component
public class OrganizationFhirMapper {

    public FhirOrganization toFhir(Tenant tenant) {
        List<Identifier> identifiers = List.of(
                Identifier.of(FhirSystems.tenantId(tenant.getId()), tenant.getId().toString()),
                Identifier.of(FhirSystems.TENANT_SLUG_SYSTEM, tenant.getSlug())
        );

        return new FhirOrganization(
                "Organization",
                tenant.getId().toString(),
                Meta.of(tenant.getVersion(), tenant.getUpdatedAt()),
                identifiers,
                tenant.isActive(),
                tenant.getName()
        );
    }
}
