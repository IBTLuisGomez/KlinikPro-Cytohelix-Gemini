package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirOrganization;
import systems.cytohelix.klinikpro.tenancy.domain.Tenant;

import java.time.OffsetDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Mapper de logica pura (entidad -> DTO), sin Spring context — mismo criterio
 * que JwtServiceTest.
 */
class OrganizationFhirMapperTest {

    private final OrganizationFhirMapper mapper = new OrganizationFhirMapper();

    @Test
    void mapeaTenantAOrganizationConIdentifiersNamespaceados() {
        UUID tenantId = UUID.randomUUID();
        OffsetDateTime updatedAt = OffsetDateTime.now();

        Tenant tenant = Tenant.builder()
                .id(tenantId)
                .version(3L)
                .slug("recuperat")
                .name("Recuperat Fisioterapia")
                .active(true)
                .updatedAt(updatedAt)
                .build();

        FhirOrganization fhirOrganization = mapper.toFhir(tenant);

        assertEquals("Organization", fhirOrganization.resourceType());
        assertEquals(tenantId.toString(), fhirOrganization.id());
        assertEquals("3", fhirOrganization.meta().versionId());
        assertEquals(updatedAt, fhirOrganization.meta().lastUpdated());
        assertEquals(Boolean.TRUE, fhirOrganization.active());
        assertEquals("Recuperat Fisioterapia", fhirOrganization.name());

        assertEquals(2, fhirOrganization.identifier().size());
        assertTrue(fhirOrganization.identifier().stream()
                .anyMatch(id -> id.system().equals(FhirSystems.tenantId(tenantId))
                        && id.value().equals(tenantId.toString())));
        assertTrue(fhirOrganization.identifier().stream()
                .anyMatch(id -> id.system().equals(FhirSystems.TENANT_SLUG_SYSTEM)
                        && id.value().equals("recuperat")));
    }
}
