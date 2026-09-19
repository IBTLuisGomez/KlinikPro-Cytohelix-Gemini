package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.agenda.domain.ServiceCatalog;
import systems.cytohelix.klinikpro.fhir.dto.FhirHealthcareService;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class HealthcareServiceFhirMapperTest {

    private final HealthcareServiceFhirMapper mapper = new HealthcareServiceFhirMapper();

    @Test
    void mapeaServiceCatalogAHealthcareServiceConDuracionYPrecioEnComment() {
        UUID id = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();

        ServiceCatalog serviceCatalog = ServiceCatalog.builder()
                .id(id)
                .version(0L)
                .tenantId(tenantId)
                .branchId(UUID.randomUUID())
                .nombre("Terapia manual")
                .tiempoMinutos(45)
                .precio(new BigDecimal("350.00"))
                .active(true)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirHealthcareService fhir = mapper.toFhir(serviceCatalog);

        assertEquals("HealthcareService", fhir.resourceType());
        assertEquals(id.toString(), fhir.id());
        assertEquals("Terapia manual", fhir.name());
        assertEquals("Organization/" + tenantId, fhir.providedBy().reference());
        assertTrue(fhir.comment().contains("45"));
        assertTrue(fhir.comment().contains("350.00"));
    }
}
