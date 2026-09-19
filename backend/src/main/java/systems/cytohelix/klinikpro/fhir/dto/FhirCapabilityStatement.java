package systems.cytohelix.klinikpro.fhir.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Recurso FHIR R4 "CapabilityStatement" — describe que recursos e
 * interacciones soporta este servidor. Minimo por diseno: solo declara lo
 * que YA esta implementado (hoy: Organization/Location de solo lectura), se
 * amplia parcela a parcela junto con el resto de fhir/ para no anunciar
 * capacidades que todavia no existen.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirCapabilityStatement(
        String resourceType,
        String status,
        OffsetDateTime date,
        String kind,
        Software software,
        String fhirVersion,
        List<String> format,
        List<Rest> rest
) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Software(String name, String version) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Rest(String mode, List<Resource> resource) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Resource(String type, List<Interaction> interaction) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record Interaction(String code) {
    }
}
