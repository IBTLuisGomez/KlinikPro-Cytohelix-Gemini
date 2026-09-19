package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirLocation;
import systems.cytohelix.klinikpro.tenancy.domain.Branch;

import java.time.OffsetDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LocationFhirMapperTest {

    private final LocationFhirMapper mapper = new LocationFhirMapper();

    @Test
    void mapeaBranchActivaALocationConManagingOrganization() {
        UUID branchId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        OffsetDateTime updatedAt = OffsetDateTime.now();

        Branch branch = Branch.builder()
                .id(branchId)
                .version(1L)
                .tenantId(tenantId)
                .name("Sucursal Centro")
                .active(true)
                .updatedAt(updatedAt)
                .build();

        FhirLocation fhirLocation = mapper.toFhir(branch);

        assertEquals("Location", fhirLocation.resourceType());
        assertEquals(branchId.toString(), fhirLocation.id());
        assertEquals("1", fhirLocation.meta().versionId());
        assertEquals("active", fhirLocation.status());
        assertEquals("Sucursal Centro", fhirLocation.name());
        assertEquals("Organization/" + tenantId, fhirLocation.managingOrganization().reference());

        assertEquals(1, fhirLocation.identifier().size());
        assertEquals(FhirSystems.branchId(tenantId), fhirLocation.identifier().get(0).system());
        assertEquals(branchId.toString(), fhirLocation.identifier().get(0).value());
    }

    @Test
    void branchInactivaSeMapeaConStatusInactive() {
        Branch branch = Branch.builder()
                .id(UUID.randomUUID())
                .version(0L)
                .tenantId(UUID.randomUUID())
                .name("Sucursal Cerrada")
                .active(false)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirLocation fhirLocation = mapper.toFhir(branch);

        assertEquals("inactive", fhirLocation.status());
    }
}
