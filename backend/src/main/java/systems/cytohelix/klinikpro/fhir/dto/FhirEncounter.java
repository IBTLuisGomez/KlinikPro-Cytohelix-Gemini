package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import systems.cytohelix.klinikpro.fhir.common.Coding;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Period;
import systems.cytohelix.klinikpro.fhir.common.Reference;

import java.util.List;

/**
 * Proyeccion FHIR R4 "Encounter", DERIVADA de una
 * {@link systems.cytohelix.klinikpro.agenda.domain.Appointment} con
 * {@code estado = Completada} — no existe tabla propia (ver
 * plan-implementacion-fhir.md §5, Parcela 3). El {@code id} del Encounter
 * ES el id de la Appointment que lo origino (mismo UUID) — no hay una
 * identidad separada que mantener.
 *
 * {@code status} es siempre "finished": este recurso solo se construye
 * cuando la cita ya esta Completada (ver EncounterFhirMapper / controller —
 * si no lo esta, GET /fhir/Encounter/{id} responde 404, el Encounter
 * "todavia no existe").
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirEncounter(
        String resourceType,
        String id,
        Meta meta,
        String status,
        @JsonProperty("class") Coding encounterClass,
        Reference subject,
        List<Reference> participant,
        Reference appointment,
        Period period
) {
}
