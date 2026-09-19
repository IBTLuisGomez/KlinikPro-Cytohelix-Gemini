package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.fhir.bundle.BundleBuilder;
import systems.cytohelix.klinikpro.fhir.bundle.FhirBundle;
import systems.cytohelix.klinikpro.fhir.dto.FhirPractitioner;
import systems.cytohelix.klinikpro.fhir.mapper.PractitionerFhirMapper;
import systems.cytohelix.klinikpro.patients.service.PractitionerService;

import java.util.List;
import java.util.UUID;

/**
 * Endpoint FHIR de solo lectura para Practitioner (proyeccion de
 * Practitioner de dominio). Sin import en esta fase. GET /fhir/Practitioner
 * devuelve un Bundle "searchset" (ver fhir/bundle/, Parcela 3).
 */
@RestController
@RequestMapping("/fhir/Practitioner")
public class FhirPractitionerController {

    private final PractitionerService practitionerService;
    private final PractitionerFhirMapper mapper;
    private final BundleBuilder bundleBuilder;

    public FhirPractitionerController(PractitionerService practitionerService, PractitionerFhirMapper mapper,
                                       BundleBuilder bundleBuilder) {
        this.practitionerService = practitionerService;
        this.mapper = mapper;
        this.bundleBuilder = bundleBuilder;
    }

    @GetMapping("/{id}")
    public FhirPractitioner read(@PathVariable UUID id) {
        return mapper.toFhir(practitionerService.findByIdForCurrentTenant(id));
    }

    @GetMapping
    public FhirBundle search() {
        List<FhirPractitioner> practitioners = practitionerService.findAllActiveForCurrentBranch().stream()
                .map(mapper::toFhir)
                .toList();
        return bundleBuilder.searchset(practitioners, "Practitioner", FhirPractitioner::id);
    }
}
