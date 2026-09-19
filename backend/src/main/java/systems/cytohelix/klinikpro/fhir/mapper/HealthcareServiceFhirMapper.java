package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.agenda.domain.ServiceCatalog;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.dto.FhirHealthcareService;

import java.util.Locale;

/**
 * Entidad -> DTO FHIR. Solo lectura (export) en esta fase — no hay import
 * FHIR de HealthcareService (el catalogo se sigue gestionando como en el
 * prototipo, fuera de fhir/).
 */
@Component
public class HealthcareServiceFhirMapper {

    public FhirHealthcareService toFhir(ServiceCatalog serviceCatalog) {
        String comment = String.format(
                Locale.ROOT, "Duracion: %d min · Precio: %s",
                serviceCatalog.getTiempoMinutos(), serviceCatalog.getPrecio());

        return new FhirHealthcareService(
                "HealthcareService",
                serviceCatalog.getId().toString(),
                Meta.of(serviceCatalog.getVersion(), serviceCatalog.getUpdatedAt()),
                serviceCatalog.isActive(),
                serviceCatalog.getNombre(),
                comment,
                Reference.to("Organization", serviceCatalog.getTenantId())
        );
    }
}
