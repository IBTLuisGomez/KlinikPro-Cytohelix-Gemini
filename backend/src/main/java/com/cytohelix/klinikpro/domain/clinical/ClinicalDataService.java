package com.cytohelix.klinikpro.domain.clinical;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.DataFormatException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class ClinicalDataService {

    private final ClinicalDataRepository repository;
    private final FhirContext fhirContext;

    public ClinicalDataService(ClinicalDataRepository repository, FhirContext fhirContext) {
        this.repository = repository;
        this.fhirContext = fhirContext;
    }

    @Transactional
    public ClinicalData appendClinicalRecord(UUID tenantId, UUID patientId, UUID encounterId, String fhirPayloadJson) {
        // Validate FHIR Payload format
        try {
            // Parses string to check if it's a valid FHIR R4 resource format
            fhirContext.newJsonParser().parseResource(fhirPayloadJson);
        } catch (DataFormatException e) {
            throw new IllegalArgumentException("El payload proporcionado no es un recurso FHIR R4 válido.", e);
        }

        ClinicalData data = new ClinicalData();
        data.setId(UUID.randomUUID());
        data.setTenantId(tenantId);
        data.setPatientId(patientId);
        data.setEncounterId(encounterId);
        // The entity enforces immutability, we can only set it once.
        data.setFhirPayload(fhirPayloadJson);
        data.setCreatedAt(OffsetDateTime.now());

        return repository.save(data);
    }
}
