package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.service.AppointmentService;
import systems.cytohelix.klinikpro.fhir.bundle.BundleBuilder;
import systems.cytohelix.klinikpro.fhir.bundle.BundleEntry;
import systems.cytohelix.klinikpro.fhir.bundle.FhirBundle;
import systems.cytohelix.klinikpro.fhir.dto.FhirPatient;
import systems.cytohelix.klinikpro.fhir.mapper.AppointmentFhirMapper;
import systems.cytohelix.klinikpro.fhir.mapper.EncounterFhirMapper;
import systems.cytohelix.klinikpro.fhir.mapper.PatientFhirMapper;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.service.PatientService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * GET = export (solo lectura). POST = import, pasa SIEMPRE por
 * PatientService.upsertFromFhir (ver invariante en docs/plan-implementacion-fhir.md §6.1).
 *
 * GET /fhir/Patient devuelve un Bundle "searchset" (ver fhir/bundle/,
 * Parcela 3). GET /fhir/Patient/{id}/$everything arma un Bundle
 * "collection" con el Patient, sus Appointments en la sucursal actual y los
 * Encounters derivados de las citas ya Completadas.
 */
@RestController
@RequestMapping("/fhir/Patient")
public class FhirPatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final PatientFhirMapper mapper;
    private final AppointmentFhirMapper appointmentMapper;
    private final EncounterFhirMapper encounterMapper;
    private final BundleBuilder bundleBuilder;

    public FhirPatientController(PatientService patientService,
                                  AppointmentService appointmentService,
                                  PatientFhirMapper mapper,
                                  AppointmentFhirMapper appointmentMapper,
                                  EncounterFhirMapper encounterMapper,
                                  BundleBuilder bundleBuilder) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.mapper = mapper;
        this.appointmentMapper = appointmentMapper;
        this.encounterMapper = encounterMapper;
        this.bundleBuilder = bundleBuilder;
    }

    @GetMapping("/{id}")
    public FhirPatient read(@PathVariable UUID id) {
        return mapper.toFhir(patientService.findByIdForCurrentTenant(id));
    }

    @GetMapping
    public FhirBundle search() {
        List<FhirPatient> patients = patientService.findAllActiveForCurrentBranch().stream()
                .map(mapper::toFhir)
                .toList();
        return bundleBuilder.searchset(patients, "Patient", FhirPatient::id);
    }

    @PostMapping
    public FhirPatient upsert(@RequestBody FhirPatient fhirPatient) {
        var command = mapper.toUpsertCommand(fhirPatient);
        return mapper.toFhir(patientService.upsertFromFhir(command));
    }

    @GetMapping("/{id}/$everything")
    public FhirBundle everything(@PathVariable UUID id) {
        Patient patient = patientService.findByIdForCurrentTenant(id);
        List<Appointment> appointments = appointmentService.findAllForPatientInCurrentBranch(id);

        List<BundleEntry> entries = new ArrayList<>();
        entries.add(new BundleEntry("Patient/" + patient.getId(), mapper.toFhir(patient)));
        for (Appointment appointment : appointments) {
            entries.add(new BundleEntry("Appointment/" + appointment.getId(), appointmentMapper.toFhir(appointment)));
            if (appointment.getEstado() == AppointmentStatus.Completada) {
                entries.add(new BundleEntry("Encounter/" + appointment.getId(), encounterMapper.toFhir(appointment)));
            }
        }
        return bundleBuilder.collection(entries);
    }
}
