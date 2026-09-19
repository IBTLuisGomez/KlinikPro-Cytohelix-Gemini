package systems.cytohelix.klinikpro.fhir.bundle;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Tipo FHIR R4 "Bundle.entry". {@code fullUrl} es una referencia relativa
 * "{Tipo}/{id}" (mismo formato que {@link systems.cytohelix.klinikpro.fhir.common.Reference}) —
 * no una URL absoluta, porque el proyecto no tiene todavia una base-url
 * configurada (ver BundleBuilder). {@code resource} es el DTO FHIR ya
 * mapeado (FhirPatient, FhirAppointment, FhirEncounter, etc.).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record BundleEntry(String fullUrl, Object resource) {
}
