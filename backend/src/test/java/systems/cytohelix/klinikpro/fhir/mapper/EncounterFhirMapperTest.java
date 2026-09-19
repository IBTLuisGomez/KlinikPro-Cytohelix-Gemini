package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.fhir.dto.FhirEncounter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class EncounterFhirMapperTest {

    private final EncounterFhirMapper mapper = new EncounterFhirMapper();

    @Test
    void mapeaCitaCompletadaAEncounterFinished() {
        UUID appointmentId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        UUID practitionerId = UUID.randomUUID();

        Appointment appointment = Appointment.builder()
                .id(appointmentId)
                .version(0L)
                .tenantId(UUID.randomUUID())
                .branchId(UUID.randomUUID())
                .patientId(patientId)
                .patientLabel("Ana Torres")
                .practitionerId(practitionerId)
                .practitionerLabel("Dr. Juan Perez")
                .fecha(LocalDate.of(2026, 9, 20))
                .hora(LocalTime.of(10, 30))
                .estado(AppointmentStatus.Completada)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirEncounter fhir = mapper.toFhir(appointment);

        assertEquals("Encounter", fhir.resourceType());
        assertEquals(appointmentId.toString(), fhir.id());
        assertEquals("finished", fhir.status());
        assertEquals("AMB", fhir.encounterClass().code());
        assertEquals("Patient/" + patientId, fhir.subject().reference());
        assertEquals(1, fhir.participant().size());
        assertEquals("Practitioner/" + practitionerId, fhir.participant().get(0).reference());
        assertEquals("Appointment/" + appointmentId, fhir.appointment().reference());
        assertEquals(LocalDate.of(2026, 9, 20), fhir.period().start().toLocalDate());
        assertEquals(LocalTime.of(10, 30), fhir.period().start().toLocalTime());
        assertNull(fhir.period().end());
    }

    @Test
    void walkInSinPatientIdNoGeneraSubject() {
        Appointment appointment = Appointment.builder()
                .id(UUID.randomUUID())
                .version(0L)
                .tenantId(UUID.randomUUID())
                .branchId(UUID.randomUUID())
                .patientLabel("Walk-in sin registrar")
                .fecha(LocalDate.of(2026, 9, 20))
                .hora(LocalTime.of(9, 0))
                .estado(AppointmentStatus.Completada)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirEncounter fhir = mapper.toFhir(appointment);

        assertNull(fhir.subject());
        assertNull(fhir.participant());
    }
}
