package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.fhir.common.Coding;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Period;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.dto.FhirEncounter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * Construye el {@link FhirEncounter} DERIVADO de una
 * {@link Appointment} con {@code estado = Completada} (ver
 * plan-implementacion-fhir.md §5, Parcela 3). No hay direccion inversa
 * (Encounter -&gt; Appointment) porque no existe payload de entrada para este
 * recurso: es solo-lectura (ver FhirEncounterController / CapabilityStatement,
 * READ_ONLY).
 */
@Component
public class EncounterFhirMapper {

    // Valor fijo: el prototipo no distingue tipos de encuentro, todas las
    // citas de KlinikPro son consultas ambulatorias.
    private static final Coding AMBULATORY = new Coding(
            "http://terminology.hl7.org/CodeSystem/v3-ActCode", "AMB", "ambulatory");

    public FhirEncounter toFhir(Appointment appointment) {
        Reference subject = appointment.getPatientId() == null
                ? null
                : Reference.to("Patient", appointment.getPatientId(), appointment.getPatientLabel());

        List<Reference> participant = new ArrayList<>();
        if (appointment.getPractitionerId() != null) {
            participant.add(Reference.to(
                    "Practitioner", appointment.getPractitionerId(), appointment.getPractitionerLabel()));
        }

        return new FhirEncounter(
                "Encounter",
                appointment.getId().toString(),
                Meta.of(appointment.getVersion(), appointment.getUpdatedAt()),
                "finished",
                AMBULATORY,
                subject,
                participant.isEmpty() ? null : participant,
                Reference.to("Appointment", appointment.getId()),
                new Period(toStartInstant(appointment.getFecha(), appointment.getHora()), null)
        );
    }

    private OffsetDateTime toStartInstant(LocalDate fecha, LocalTime hora) {
        if (fecha == null || hora == null) {
            return null;
        }
        // Misma simplificacion documentada en AppointmentFhirMapper: se asume
        // UTC porque el mapper no tiene acceso a Branch.timezone.
        return OffsetDateTime.of(fecha, hora, ZoneOffset.UTC);
    }
}
