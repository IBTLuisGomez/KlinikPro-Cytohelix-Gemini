package com.cytohelix.klinikpro.fhir.dto;

import com.cytohelix.klinikpro.fhir.common.ContactPoint;
import com.cytohelix.klinikpro.fhir.common.HumanName;
import com.cytohelix.klinikpro.fhir.common.Identifier;
import com.cytohelix.klinikpro.fhir.common.Meta;
import com.cytohelix.klinikpro.fhir.common.Reference;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FhirPatient(
    String resourceType,          
    String id,                    
    Meta meta,
    List<Identifier> identifier,  
    Boolean active,               
    List<HumanName> name,
    List<ContactPoint> telecom,   
    Reference managingOrganization, 
    List<Reference> generalPractitioner 
) {
}
