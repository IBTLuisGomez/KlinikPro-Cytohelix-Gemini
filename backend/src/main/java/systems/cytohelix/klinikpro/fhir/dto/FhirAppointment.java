package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Proyeccion FHIR R4 "Appointment" de
 * {@link systems.cytohelix.klinikpro.agenda.domain.Appointment}.
 *
 * <p>{@code status} usa el subconjunto booked|fulfilled|cancelled (mapeo de
 * AppointmentStatus, ver AppointmentFhirMapper y plan-implementacion-fhir.md
 * §5). {@code start} se construye combinando fecha+hora del dominio en UTC —
 * simplificacion documentada: la hora real es local a la sucursal
 * (Branch.timezone), pero el mapper no tiene acceso a Branch; ajustar esto
 * es trabajo pendiente de Parcela 4 (endurecimiento) si se vuelve relevante
 * para integraciones reales.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirAppointment(
        String resourceType,
        String id,
        Meta meta,
        String status,
        OffsetDateTime start,
        OffsetDateTime end,
        String description,
        List<Participant> participant
) {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Participant(Reference actor, String status) {
    }
}
