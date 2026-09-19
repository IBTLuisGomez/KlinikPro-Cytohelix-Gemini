package systems.cytohelix.klinikpro.fhir.config;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement.Interaction;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement.Resource;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement.Rest;
import systems.cytohelix.klinikpro.fhir.dto.FhirCapabilityStatement.Software;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Arma el {@link FhirCapabilityStatement} que responde GET /fhir/metadata.
 * Se construye en request time (no cacheado) porque {@code date} debe
 * reflejar el momento de la consulta, tal como pide el spec FHIR; el listado
 * de recursos/interacciones si es estatico — se actualiza a mano cuando se
 * agrega una parcela nueva a fhir/ (ver plan-implementacion-fhir.md §5).
 */
@Component
public class FhirCapabilityStatementFactory {

    // Listas de interaccion reflejan EXACTAMENTE lo implementado en cada controller
    // — no declarar una interaccion aqui que el controller correspondiente no tenga.
    private static final List<Interaction> READ_ONLY = List.of(new Interaction("read"));
    private static final List<Interaction> READ_SEARCH = List.of(new Interaction("read"), new Interaction("search-type"));
    private static final List<Interaction> READ_SEARCH_CREATE = List.of(
            new Interaction("read"), new Interaction("search-type"), new Interaction("create"));

    public FhirCapabilityStatement build() {
        List<Resource> resources = List.of(
                // Organization/Location (Parcela 0): solo GET /{id}, sin listado.
                new Resource("Organization", READ_ONLY),
                new Resource("Location", READ_ONLY),
                // Patient/Practitioner (Parcela 1): GET /{id} + GET lista; Patient ademas POST (import).
                new Resource("Patient", READ_SEARCH_CREATE),
                new Resource("Practitioner", READ_SEARCH),
                // Appointment/HealthcareService (Parcela 2): igual patron que Patient/Practitioner.
                new Resource("Appointment", READ_SEARCH_CREATE),
                new Resource("HealthcareService", READ_SEARCH),
                // Encounter (Parcela 3): derivado de Appointment, solo GET /{id} — sin
                // listado ni creacion propia (ver EncounterFhirMapper).
                new Resource("Encounter", READ_ONLY)
        );

        Rest rest = new Rest("server", resources);

        return new FhirCapabilityStatement(
                "CapabilityStatement",
                "active",
                OffsetDateTime.now(),
                "instance",
                new Software("KlinikPro", "0.1.0-parcela4"),
                "4.0.1",
                List.of("json"),
                List.of(rest)
        );
    }
}
