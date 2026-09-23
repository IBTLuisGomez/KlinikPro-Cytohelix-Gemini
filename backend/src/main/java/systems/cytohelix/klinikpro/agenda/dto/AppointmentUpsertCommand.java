package systems.cytohelix.klinikpro.agenda.dto;

import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * Comando de escritura para AppointmentService.upsertFromFhir — el UNICO
 * punto de entrada para crear/actualizar citas via fhir/ (mismo patron que
 * PatientUpsertCommand). {@code id} presente = actualizar esa cita puntual
 * (incluye cambios de estado, ej. marcar Completada/Cancelada — equivalente
 * a setCitaEstado del prototipo). {@code id} ausente = crear; el estado
 * inicial siempre es Pendiente (igual que el prototipo, que ignora
 * cualquier estado que venga en el formulario de alta).
 */
public record AppointmentUpsertCommand(
        UUID id,
        UUID patientId,
        String patientLabel,
        String telefono,
        UUID serviceId,
        String serviceLabel,
        UUID practitionerId,
        String practitionerLabel,
        LocalDate fecha,
        LocalTime hora,
        LocalTime horaFin,
        AppointmentStatus estado
) {
}
