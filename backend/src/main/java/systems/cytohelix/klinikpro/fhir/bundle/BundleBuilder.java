package systems.cytohelix.klinikpro.fhir.bundle;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Function;

/**
 * Arma {@link FhirBundle} a partir de una lista de DTOs FHIR ya mapeados.
 * Un solo componente reutilizado por todos los controllers de busqueda
 * (Patient, Appointment, Practitioner, HealthcareService) y por el
 * {@code $everything} de Patient — ver plan-implementacion-fhir.md §5,
 * Parcela 3.
 */
@Component
public class BundleBuilder {

    /** Bundle "searchset": resultado de un GET de busqueda sobre un solo tipo de recurso. */
    public <T> FhirBundle searchset(List<T> resources, String resourceType, Function<T, String> idFn) {
        return build("searchset", resources, resourceType, idFn);
    }

    /** Bundle "collection": conjunto heterogeneo, usado por Patient/{id}/$everything. */
    public FhirBundle collection(List<BundleEntry> entries) {
        return new FhirBundle("Bundle", "collection", entries.size(), entries);
    }

    private <T> FhirBundle build(String type, List<T> resources, String resourceType, Function<T, String> idFn) {
        List<BundleEntry> entries = resources.stream()
                .map(r -> new BundleEntry(resourceType + "/" + idFn.apply(r), r))
                .toList();
        return new FhirBundle("Bundle", type, entries.size(), entries);
    }
}
