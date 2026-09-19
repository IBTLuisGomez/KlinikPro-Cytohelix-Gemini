package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.dto.AppointmentUpsertCommand;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.dto.FhirAppointment;
import systems.cytohelix.klinikpro.fhir.dto.FhirAppointment.Participant;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AppointmentFhirMapperTest {

    private final AppointmentFhirMapper mapper = new AppointmentFhirMapper();

    @Test
    void mapeaEstadosDeDominioAEstadosFhir() {
        UUID patientId = UUID.randomUUID();
        UUID practitionerId = UUID.randomUUID();

        Appointment appointment = Appointment.builder()
                .id(UUID.randomUUID())
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

        FhirAppointment fhir = mapper.toFhir(appointment);

        assertEquals("fulfilled", fhir.status());
        assertEquals("Appointment", fhir.resourceType());
        assertEquals(LocalDate.of(2026, 9, 20), fhir.start().toLocalDate());
        assertEquals(LocalTime.of(10, 30), fhir.start().toLocalTime());
        assertTrue(fhir.description().contains("Ana Torres"));
        assertEquals(2, fhir.participant().size());
        assertEquals("Patient/" + patientId, fhir.participant().get(0).actor().reference());
        assertEquals("Practitioner/" + practitionerId, fhir.participant().get(1).actor().reference());
    }

    @Test
    void walkInSinPatientIdNoGeneraParticipantDePaciente() {
        Appointment appointment = Appointment.builder()
                .id(UUID.randomUUID())
                .version(0L)
                .tenantId(UUID.randomUUID())
                .branchId(UUID.randomUUID())
                .patientLabel("Walk-in sin registrar")
                .fecha(LocalDate.of(2026, 9, 20))
                .hora(LocalTime.of(9, 0))
                .estado(AppointmentStatus.Pendiente)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirAppointment fhir = mapper.toFhir(appointment);

        assertEquals("booked", fhir.status());
        assertNull(fhir.participant());
        assertTrue(fhir.description().contains("Walk-in sin registrar"));
    }

    @Test
    void toUpsertCommandExtraeParticipantesYEstado() {
        UUID id = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();
        UUID practitionerId = UUID.randomUUID();

        FhirAppointment fhirAppointment = new FhirAppointment(
                "Appointment",
                id.toString(),
                null,
                "booked",
                OffsetDateTime.of(2026, 9, 20, 14, 0, 0, 0, java.time.ZoneOffset.UTC),
                "Paciente: Carlos Diaz",
                List.of(
                        new Participant(Reference.to("Patient", patientId, "Carlos Diaz"), "accepted"),
                        new Participant(Reference.to("Practitioner", practitionerId, "Dra. Ruiz"), "accepted")
                )
        );

        AppointmentUpsertCommand cmd = mapper.toUpsertCommand(fhirAppointment);

        assertEquals(id, cmd.id());
        assertEquals(patientId, cmd.patientId());
        assertEquals("Carlos Diaz", cmd.patientLabel());
        assertEquals(practitionerId, cmd.practitionerId());
        assertEquals(LocalDate.of(2026, 9, 20), cmd.fecha());
        assertEquals(LocalTime.of(14, 0), cmd.hora());
        assertEquals(AppointmentStatus.Pendiente, cmd.estado());
    }
}
