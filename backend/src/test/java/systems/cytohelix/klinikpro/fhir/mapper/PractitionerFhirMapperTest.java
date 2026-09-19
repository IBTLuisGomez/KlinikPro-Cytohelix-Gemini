package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.fhir.dto.FhirPractitioner;
import systems.cytohelix.klinikpro.patients.domain.Practitioner;

import java.time.OffsetDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class PractitionerFhirMapperTest {

    private final PractitionerFhirMapper mapper = new PractitionerFhirMapper();

    @Test
    void mapeaPractitionerConEspecialidad() {
        UUID id = UUID.randomUUID();
        Practitioner practitioner = Practitioner.builder()
                .id(id)
                .version(2L)
                .tenantId(UUID.randomUUID())
                .branchId(UUID.randomUUID())
                .nombre("Dr. Juan Perez")
                .especialidad("Fisioterapia deportiva")
                .active(true)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirPractitioner fhir = mapper.toFhir(practitioner);

        assertEquals("Practitioner", fhir.resourceType());
        assertEquals(id.toString(), fhir.id());
        assertEquals("2", fhir.meta().versionId());
        assertEquals(Boolean.TRUE, fhir.active());
        assertEquals("Dr. Juan Perez", fhir.name().get(0).text());
        assertEquals("Fisioterapia deportiva", fhir.qualification().get(0).text());
    }

    @Test
    void especialidadNulaNoRompeElMapeo() {
        Practitioner practitioner = Practitioner.builder()
                .id(UUID.randomUUID())
                .version(0L)
                .tenantId(UUID.randomUUID())
                .branchId(UUID.randomUUID())
                .nombre("Dra. Ana Ruiz")
                .active(true)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirPractitioner fhir = mapper.toFhir(practitioner);

        assertNull(fhir.qualification());
    }
}
