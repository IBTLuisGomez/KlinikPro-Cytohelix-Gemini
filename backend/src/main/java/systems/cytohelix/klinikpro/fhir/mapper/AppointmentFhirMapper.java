package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.dto.AppointmentUpsertCommand;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.dto.FhirAppointment;
import systems.cytohelix.klinikpro.fhir.dto.FhirAppointment.Participant;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Entidad <-> DTO FHIR, en ambas direcciones — mismo patron que
 * PatientFhirMapper. Tabla de mapeo de estados fija por el plan
 * (docs/plan-implementacion-fhir.md §5, Parcela 2):
 *   Pendiente -&gt; booked, Completada -&gt; fulfilled, Cancelada -&gt; cancelled.
 */
@Component
public class AppointmentFhirMapper {

    private static final Map<AppointmentStatus, String> TO_FHIR_STATUS = Map.of(
            AppointmentStatus.Pendiente, "booked",
            AppointmentStatus.Completada, "fulfilled",
            AppointmentStatus.Cancelada, "cancelled"
    );

    private static final Map<String, AppointmentStatus> FROM_FHIR_STATUS = Map.of(
            "booked", AppointmentStatus.Pendiente,
            "fulfilled", AppointmentStatus.Completada,
            "cancelled", AppointmentStatus.Cancelada
    );

    public FhirAppointment toFhir(Appointment appointment) {
        List<Participant> participants = new ArrayList<>();
        if (appointment.getPatientId() != null) {
            participants.add(new Participant(
                    Reference.to("Patient", appointment.getPatientId(), appointment.getPatientLabel()), "accepted"));
        }
        if (appointment.getPractitionerId() != null) {
            participants.add(new Participant(
                    Reference.to("Practitioner", appointment.getPractitionerId(), appointment.getPractitionerLabel()), "accepted"));
        }
        if (appointment.getServiceId() != null) {
            participants.add(new Participant(
                    Reference.to("HealthcareService", appointment.getServiceId(), appointment.getServiceLabel()), "accepted"));
        }

        return new FhirAppointment(
                "Appointment",
                appointment.getId().toString(),
                Meta.of(appointment.getVersion(), appointment.getUpdatedAt()),
                TO_FHIR_STATUS.get(appointment.getEstado()),
                toStartInstant(appointment.getFecha(), appointment.getHora()),
                buildDescription(appointment),
                participants.isEmpty() ? null : participants
        );
    }

    public AppointmentUpsertCommand toUpsertCommand(FhirAppointment fhirAppointment) {
        UUID id = fhirAppointment.id() == null ? null : UUID.fromString(fhirAppointment.id());

        UUID patientId = null;
        String patientLabel = null;
        UUID practitionerId = null;
        String practitionerLabel = null;
        UUID serviceId = null;
        String serviceLabel = null;

        if (fhirAppointment.participant() != null) {
            for (Participant participant : fhirAppointment.participant()) {
                Reference actor = participant.actor();
                if (actor == null || actor.reference() == null) {
                    continue;
                }
                String reference = actor.reference();
                UUID referencedId = parseId(reference);
                if (reference.startsWith("Patient/")) {
                    patientId = referencedId;
                    patientLabel = actor.display();
                } else if (reference.startsWith("Practitioner/")) {
                    practitionerId = referencedId;
                    practitionerLabel = actor.display();
                } else if (reference.startsWith("HealthcareService/")) {
                    serviceId = referencedId;
                    serviceLabel = actor.display();
                }
            }
        }
        if (patientLabel == null) {
            // Fallback para walk-ins sin Patient/{id} referenciable — ver
            // FhirAppointment.description.
            patientLabel = fhirAppointment.description();
        }

        LocalDate fecha = fhirAppointment.start() == null ? null : fhirAppointment.start().toLocalDate();
        LocalTime hora = fhirAppointment.start() == null ? null : fhirAppointment.start().toLocalTime();
        AppointmentStatus estado = fhirAppointment.status() == null ? null : FROM_FHIR_STATUS.get(fhirAppointment.status());

        return new AppointmentUpsertCommand(
                id, patientId, patientLabel, null, serviceId, serviceLabel,
                practitionerId, practitionerLabel, fecha, hora, estado);
    }

    private OffsetDateTime toStartInstant(LocalDate fecha, LocalTime hora) {
        if (fecha == null || hora == null) {
            return null;
        }
        // Simplificacion documentada en FhirAppointment: se asume UTC porque el
        // mapper no tiene acceso a Branch.timezone.
        return OffsetDateTime.of(fecha, hora, ZoneOffset.UTC);
    }

    private String buildDescription(Appointment appointment) {
        StringBuilder sb = new StringBuilder("Paciente: ").append(appointment.getPatientLabel());
        if (appointment.getServiceLabel() != null && !appointment.getServiceLabel().isBlank()) {
            sb.append(" · Servicio: ").append(appointment.getServiceLabel());
        }
        if (appointment.getPractitionerLabel() != null && !appointment.getPractitionerLabel().isBlank()) {
            sb.append(" · Atendio: ").append(appointment.getPractitionerLabel());
        }
        return sb.toString();
    }

    private UUID parseId(String reference) {
        int slash = reference.indexOf('/');
        if (slash < 0 || slash == reference.length() - 1) {
            return null;
        }
        try {
            return UUID.fromString(reference.substring(slash + 1));
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
