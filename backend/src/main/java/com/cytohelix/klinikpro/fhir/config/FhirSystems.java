package com.cytohelix.klinikpro.fhir.config;

import java.util.UUID;

public final class FhirSystems {
    public static final String BASE = "urn:cytohelix:klinikpro";

    public static String patientCode(UUID tenantId, UUID branchId) {
        return BASE + ":" + tenantId + ":" + branchId + ":patient-code";
    }
    
    public static String folio(UUID tenantId, UUID branchId) {
        return BASE + ":" + tenantId + ":" + branchId + ":folio";
    }
}
