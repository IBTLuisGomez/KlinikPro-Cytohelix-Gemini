package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.agenda.service.ServiceCatalogService;
import systems.cytohelix.klinikpro.fhir.bundle.BundleBuilder;
import systems.cytohelix.klinikpro.fhir.bundle.FhirBundle;
import systems.cytohelix.klinikpro.fhir.dto.FhirHealthcareService;
import systems.cytohelix.klinikpro.fhir.mapper.HealthcareServiceFhirMapper;

import java.util.List;
import java.util.UUID;

/**
 * Endpoint FHIR de solo lectura para HealthcareService (proyeccion de
 * ServiceCatalog). Sin import en esta fase. GET /fhir/HealthcareService
 * devuelve un Bundle "searchset" (ver fhir/bundle/, Parcela 3).
 */
@RestController
@RequestMapping("/fhir/HealthcareService")
public class FhirHealthcareServiceController {

    private final ServiceCatalogService serviceCatalogService;
    private final HealthcareServiceFhirMapper mapper;
    private final BundleBuilder bundleBuilder;

    public FhirHealthcareServiceController(ServiceCatalogService serviceCatalogService,
                                            HealthcareServiceFhirMapper mapper,
                                            BundleBuilder bundleBuilder) {
        this.serviceCatalogService = serviceCatalogService;
        this.mapper = mapper;
        this.bundleBuilder = bundleBuilder;
    }

    @GetMapping("/{id}")
    public FhirHealthcareService read(@PathVariable UUID id) {
        return mapper.toFhir(serviceCatalogService.findByIdForCurrentTenant(id));
    }

    @GetMapping
    public FhirBundle search() {
        List<FhirHealthcareService> services = serviceCatalogService.findAllActiveForCurrentBranch().stream()
                .map(mapper::toFhir)
                .toList();
        return bundleBuilder.searchset(services, "HealthcareService", FhirHealthcareService::id);
    }
}
