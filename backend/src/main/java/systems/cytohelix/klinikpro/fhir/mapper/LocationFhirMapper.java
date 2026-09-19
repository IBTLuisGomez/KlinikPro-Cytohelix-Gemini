package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirLocation;
import systems.cytohelix.klinikpro.tenancy.domain.Branch;

import java.util.List;

/**
 * Entidad -> DTO FHIR. Solo lectura (export). Import de Location no aplica
 * en esta fase (una sucursal no se crea via FHIR).
 */
@Component
public class LocationFhirMapper {

    public FhirLocation toFhir(Branch branch) {
        List<Identifier> identifiers = List.of(
                Identifier.of(FhirSystems.branchId(branch.getTenantId()), branch.getId().toString())
        );

        return new FhirLocation(
                "Location",
                branch.getId().toString(),
                Meta.of(branch.getVersion(), branch.getUpdatedAt()),
                identifiers,
                branch.isActive() ? "active" : "inactive",
                branch.getName(),
                Reference.to("Organization", branch.getTenantId())
        );
    }
}
