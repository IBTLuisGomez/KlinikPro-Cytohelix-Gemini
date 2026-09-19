package systems.cytohelix.klinikpro.core.exception;

/**
 * "No existe (o no pertenece al tenant activo)" — usada por CUALQUIER
 * servicio de dominio (tenancy/, patients/, agenda/...), nunca solo por
 * fhir/. Vive en core/ y no en fhir/outcome/ a proposito: un servicio de
 * dominio (ej. PatientService) no puede depender de fhir/ sin romper el
 * invariante de arquitectura "fhir/ depende de los paquetes de dominio,
 * nunca al reves — se puede borrar fhir/ completo sin tocar el resto del
 * sistema" (ver docs/plan-implementacion-fhir.md §1). FhirExceptionHandler
 * (en fhir/outcome/) es quien la traduce a OperationOutcome/404; un futuro
 * GlobalExceptionHandler para una API interna no-FHIR podria traducirla a
 * ApiError/404 igual de bien.
 *
 * Deliberadamente no distingue "no existe" de "existe pero es de otro
 * tenant": mismo 404 para ambos casos en todo el sistema, para no filtrar
 * informacion entre tenants en ningun endpoint.
 */
public class ResourceNotFoundException extends RuntimeException {

    private final String resourceType;
    private final String id;

    public ResourceNotFoundException(String resourceType, String id) {
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
