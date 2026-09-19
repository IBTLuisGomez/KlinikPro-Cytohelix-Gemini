package systems.cytohelix.klinikpro.fhir.bundle;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * Tipo FHIR R4 "Bundle" — lista de recursos con un tipo declarado
 * ("searchset" para resultados de busqueda, "collection" para un conjunto
 * heterogeneo como el de {@code $everything}). Ver BundleBuilder.
 *
 * Simplificacion documentada: no se incluyen {@code link} (self/next) ni
 * {@code entry.search.mode} — no hay paginacion en esta fase (ver
 * plan-implementacion-fhir.md §5, Parcela 3) y todo entry de un searchset es
 * implicitamente "match".
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirBundle(String resourceType, String type, Integer total, List<BundleEntry> entry) {
}
