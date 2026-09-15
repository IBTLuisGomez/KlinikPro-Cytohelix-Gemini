package com.cytohelix.klinikpro.fhir.mapper;

import com.cytohelix.klinikpro.domain.patient.Patient;
import com.cytohelix.klinikpro.fhir.common.ContactPoint;
import com.cytohelix.klinikpro.fhir.common.HumanName;
import com.cytohelix.klinikpro.fhir.common.Identifier;
import com.cytohelix.klinikpro.fhir.common.Meta;
import com.cytohelix.klinikpro.fhir.common.Reference;
import com.cytohelix.klinikpro.fhir.config.FhirSystems;
import com.cytohelix.klinikpro.fhir.dto.FhirPatient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PatientFhirMapper {

    public FhirPatient toFhir(Patient p) {
        String idSystem = FhirSystems.patientCode(p.getTenantId(), p.getBranchId());
        
        List<Identifier> identifiers = p.getCodigo() != null ? 
                List.of(new Identifier("official", idSystem, p.getCodigo())) : null;
                
        List<ContactPoint> telecom = p.getTelefono() != null ? 
                List.of(new ContactPoint("phone", p.getTelefono(), "mobile")) : null;
                
        List<Reference> generalPractitioner = p.getTratanteId() != null ? 
                List.of(new Reference("Practitioner/" + p.getTratanteId(), null)) : null;

        return new FhirPatient(
                "Patient",
                p.getId().toString(),
                new Meta(null, null, List.of(FhirSystems.BASE + "/StructureDefinition/klinikpro-patient")),
                identifiers,
                !p.isBajaLogica(),
                List.of(new HumanName("official", p.getNombre(), null, null)),
                telecom,
                new Reference("Organization/" + p.getTenantId(), null),
                generalPractitioner
        );
    }
}
