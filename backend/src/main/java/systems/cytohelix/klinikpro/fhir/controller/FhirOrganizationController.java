package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.fhir.dto.FhirOrganization;
import systems.cytohelix.klinikpro.fhir.mapper.OrganizationFhirMapper;
import systems.cytohelix.klinikpro.fhir.service.TenantQueryService;

import java.util.UUID;

/**
 * Endpoint FHIR de solo lectura para Organization (proyeccion de Tenant).
 * Requiere JWT valido (SecurityConfig: "anyRequest().authenticated()" cubre
 * /fhir/** salvo /fhir/metadata, ver FhirCapabilityStatementController).
 */
@RestController
@RequestMapping("/fhir/Organization")
public class FhirOrganizationController {

    private final TenantQueryService tenantQueryService;
    private final OrganizationFhirMapper mapper;

    public FhirOrganizationController(TenantQueryService tenantQueryService, OrganizationFhirMapper mapper) {
        this.tenantQueryService = tenantQueryService;
        this.mapper = mapper;
    }

    @GetMapping("/{id}")
    public FhirOrganization read(@PathVariable UUID id) {
        return mapper.toFhir(tenantQueryService.findByIdForCurrentTenant(id));
    }
}
