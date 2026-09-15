package com.cytohelix.klinikpro.fhir.controller;

import com.cytohelix.klinikpro.domain.patient.PatientService;
import com.cytohelix.klinikpro.fhir.dto.FhirPatient;
import com.cytohelix.klinikpro.fhir.mapper.PatientFhirMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping(value = "/fhir/Patient", produces = "application/fhir+json")
public class FhirPatientController {

    private final PatientService service;
    private final PatientFhirMapper mapper;

    public FhirPatientController(PatientService service, PatientFhirMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public FhirPatient read(@PathVariable UUID id) {
        return mapper.toFhir(service.getByIdOrThrow(id));
    }
    
    @GetMapping
    public List<FhirPatient> search() {
        return service.findAll().stream().map(mapper::toFhir).toList();
    }
}
