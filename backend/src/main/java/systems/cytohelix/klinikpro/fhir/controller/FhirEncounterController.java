package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.service.AppointmentService;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.fhir.dto.FhirEncounter;
import systems.cytohelix.klinikpro.fhir.mapper.EncounterFhirMapper;

import java.util.UUID;

/**
 * Solo lectura — Encounter no tiene tabla propia, se deriva de Appointment
 * cuando {@code estado = Completada} (ver EncounterFhirMapper). El {@code id}
 * usado en la URL es el mismo id de la Appointment que lo origino.
 *
 * Si la cita todavia no esta Completada, el Encounter "no existe" desde el
 * punto de vista FHIR — se responde 404 (no 409/400), igual que cualquier
 * otro recurso ausente.
 */
@RestController
@RequestMapping("/fhir/Encounter")
public class FhirEncounterController {

    private final AppointmentService appointmentService;
    private final EncounterFhirMapper mapper;

    public FhirEncounterController(AppointmentService appointmentService, EncounterFhirMapper mapper) {
        this.appointmentService = appointmentService;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public FhirEncounter read(@PathVariable UUID id) {
        Appointment appointment = appointmentService.findByIdForCurrentTenant(id);
        if (appointment.getEstado() != AppointmentStatus.Completada) {
            throw new ResourceNotFoundException("Encounter", id.toString());
        }
        return mapper.toFhir(appointment);
    }
}
