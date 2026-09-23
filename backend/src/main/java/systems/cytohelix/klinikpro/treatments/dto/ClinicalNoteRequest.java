package systems.cytohelix.klinikpro.treatments.dto;

import java.util.UUID;

public record ClinicalNoteRequest(
        UUID patientId,
        UUID appointmentId,
        UUID practitionerId,
        String subjective,
        String objective,
        String assessment,
        String plan,
        String status
) {
}
