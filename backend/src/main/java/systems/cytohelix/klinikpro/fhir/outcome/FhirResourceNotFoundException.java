package systems.cytohelix.klinikpro.fhir.outcome;

/**
 * Lanzada por los servicios de consulta de fhir/ cuando el recurso no existe
 * O no pertenece al tenant activo. Deliberadamente no se distingue entre
 * ambos casos en la respuesta (mismo 404 + mismo mensaje generico): decir
 * "existe pero es de otro tenant" filtraria informacion entre tenants.
 */
public class FhirResourceNotFoundException extends RuntimeException {

    private final String resourceType;
    private final String id;

    public FhirResourceNotFoundException(String resourceType, String id) {
        super(resourceType + "/" + id + " no encontrado");
        this.resourceType = resourceType;
        this.id = id;
    }

    public String resourceType() {
        return resourceType;
    }

    public String id() {
        return id;
    }
}
