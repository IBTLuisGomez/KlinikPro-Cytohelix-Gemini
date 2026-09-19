package systems.cytohelix.klinikpro.fhir.mapper;

import org.springframework.stereotype.Component;
import systems.cytohelix.klinikpro.fhir.common.CodeableConcept;
import systems.cytohelix.klinikpro.fhir.common.HumanName;
import systems.cytohelix.klinikpro.fhir.common.Meta;
import systems.cytohelix.klinikpro.fhir.dto.FhirPractitioner;
import systems.cytohelix.klinikpro.patients.domain.Practitioner;

import java.util.List;

/**
 * Entidad -> DTO FHIR. Solo lectura (export) en esta fase — no hay import
 * FHIR de Practitioner (el catalogo de especialistas se sigue gestionando
 * como en el prototipo, fuera de fhir/).
 */
@Component
public class PractitionerFhirMapper {

    public FhirPractitioner toFhir(Practitioner practitioner) {
        List<CodeableConcept> qualification = practitioner.getEspecialidad() == null
                ? null
                : List.of(CodeableConcept.ofText(practitioner.getEspecialidad()));

        return new FhirPractitioner(
                "Practitioner",
                practitioner.getId().toString(),
                Meta.of(practitioner.getVersion(), practitioner.getUpdatedAt()),
                practitioner.isActive(),
                List.of(HumanName.ofText(practitioner.getNombre())),
                qualification
        );
    }
}
