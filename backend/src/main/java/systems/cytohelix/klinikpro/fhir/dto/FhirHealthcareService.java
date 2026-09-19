package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;

/**
 * Proyeccion FHIR R4 "HealthcareService" de
 * {@link systems.cytohelix.klinikpro.agenda.domain.ServiceCatalog}.
 *
 * <p>Simplificacion deliberada: FHIR R4 HealthcareService no tiene campos
 * nativos para duracion/precio (eso vive en Slot/Appointment.minutesDuration
 * y no existe en absoluto un campo de precio estandar). En vez de inventar
 * una extension FHIR (fuera del alcance de la arquitectura ligera sin HAPI),
 * se resumen en {@code comment} (campo real de HealthcareService, texto libre).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirHealthcareService(
        String resourceType,
        String id,
        Meta meta,
        Boolean active,
        String name,
        String comment,
        Reference providedBy
) {
}
