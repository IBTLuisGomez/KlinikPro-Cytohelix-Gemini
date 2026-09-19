package systems.cytohelix.klinikpro.fhir.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.fhir.config.FhirCapabilityStatementFactory;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement;

/**
 * GET /fhir/metadata — publico a proposito (ver SecurityConfig): un cliente
 * FHIR necesita poder descubrir las capacidades del servidor ANTES de tener
 * un token, igual que /auth/login.
 */
@RestController
public class FhirCapabilityStatementController {

    private final FhirCapabilityStatementFactory factory;

    public FhirCapabilityStatementController(FhirCapabilityStatementFactory factory) {
        this.factory = factory;
    }

    @GetMapping("/fhir/metadata")
    public FhirCapabilityStatement metadata() {
        return factory.build();
    }
}
