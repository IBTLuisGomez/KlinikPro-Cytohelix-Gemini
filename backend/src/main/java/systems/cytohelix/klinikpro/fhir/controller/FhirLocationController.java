package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.fhir.dto.FhirLocation;
import systems.cytohelix.klinikpro.fhir.mapper.LocationFhirMapper;
import systems.cytohelix.klinikpro.fhir.service.BranchQueryService;

import java.util.UUID;

/**
 * Endpoint FHIR de solo lectura para Location (proyeccion de Branch).
 */
@RestController
@RequestMapping("/fhir/Location")
public class FhirLocationController {

    private final BranchQueryService branchQueryService;
    private final LocationFhirMapper mapper;

    public FhirLocationController(BranchQueryService branchQueryService, LocationFhirMapper mapper) {
        this.branchQueryService = branchQueryService;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public FhirLocation read(@PathVariable UUID id) {
        return mapper.toFhir(branchQueryService.findByIdForCurrentTenant(id));
    }
}
