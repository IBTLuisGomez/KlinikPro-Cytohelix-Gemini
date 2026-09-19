package systems.cytohelix.klinikpro.patients.dto;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Comando de escritura para PatientService.upsertFromFhir — el UNICO punto
 * de entrada para crear/actualizar pacientes vía fhir/ (ver regla de negocio
 * en docs/plan-implementacion-fhir.md §6.1: "Import nunca escribe directo a
 * repositorios"). PatientFhirMapper.toUpsertCommand construye esto a partir
 * de un FhirPatient recibido en POST /fhir/Patient.
 *
 * {@code id} presente = actualizar ese paciente puntual. {@code id} ausente
 * = crear, salvo que se encuentre un duplicado por nombre+telefono en la
 * misma sucursal (ver PatientRepository.findPossibleDuplicates), en cuyo
 * caso se actualiza ese registro en vez de crear uno nuevo.
 */
public record PatientUpsertCommand(
        UUID id,
        String codigo,
        String nombre,
        String telefono,
        String email,
        LocalDate nacimiento,
        UUID especialistaId,
        UUID tratanteId,
        Boolean active
) {
}
