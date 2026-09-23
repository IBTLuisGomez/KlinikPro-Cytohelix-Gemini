package systems.cytohelix.klinikpro.fhir.common;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Extension(
        String url,
        Boolean valueBoolean,
        String valueString
) {
    public static Extension ofBoolean(String url, Boolean value) {
        return new Extension(url, value, null);
    }
    
    public static Extension ofString(String url, String value) {
        return new Extension(url, null, value);
    }
}
