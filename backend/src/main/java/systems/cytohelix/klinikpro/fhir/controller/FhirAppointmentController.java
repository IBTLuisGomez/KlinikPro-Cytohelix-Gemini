package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.agenda.service.AppointmentService;
import systems.cytohelix.klinikpro.fhir.bundle.BundleBuilder;
import systems.cytohelix.klinikpro.fhir.bundle.FhirBundle;
import systems.cytohelix.klinikpro.fhir.dto.FhirAppointment;
import systems.cytohelix.klinikpro.fhir.mapper.AppointmentFhirMapper;

import java.util.List;
import java.util.UUID;

/**
 * GET = export (solo lectura). POST = import (crear o actualizar, incluye
 * cambios de estado), pasa SIEMPRE por AppointmentService.upsertFromFhir.
 *
 * GET /fhir/Appointment devuelve un Bundle "searchset" (ver fhir/bundle/,
 * Parcela 3).
 */
@RestController
@RequestMapping("/fhir/Appointment")
public class FhirAppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentFhirMapper mapper;
    private final BundleBuilder bundleBuilder;

    public FhirAppointmentController(AppointmentService appointmentService, AppointmentFhirMapper mapper,
                                      BundleBuilder bundleBuilder) {
        this.appointmentService = appointmentService;
        this.mapper = mapper;
        this.bundleBuilder = bundleBuilder;
    }

    @GetMapping("/{id}")
    public FhirAppointment read(@PathVariable UUID id) {
        return mapper.toFhir(appointmentService.findByIdForCurrentTenant(id));
    }

    @GetMapping
    public FhirBundle search() {
        List<FhirAppointment> appointments = appointmentService.findAllForCurrentBranch().stream()
                .map(mapper::toFhir)
                .toList();
        return bundleBuilder.searchset(appointments, "Appointment", FhirAppointment::id);
    }

    @PostMapping
    public FhirAppointment upsert(@RequestBody FhirAppointment fhirAppointment) {
        var command = mapper.toUpsertCommand(fhirAppointment);
        return mapper.toFhir(appointmentService.upsertFromFhir(command));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public FhirAppointment update(@PathVariable UUID id, @RequestBody FhirAppointment fhirAppointment) {
        // En una implementacion estricta se deberia verificar que el id del path coincida con el payload.
        var command = mapper.toUpsertCommand(fhirAppointment);
        return mapper.toFhir(appointmentService.upsertFromFhir(command));
    }
}
