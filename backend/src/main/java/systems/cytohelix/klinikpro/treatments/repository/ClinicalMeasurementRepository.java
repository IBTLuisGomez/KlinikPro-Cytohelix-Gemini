package systems.cytohelix.klinikpro.treatments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.treatments.domain.ClinicalMeasurement;

import java.util.List;
import java.util.UUID;

public interface ClinicalMeasurementRepository extends JpaRepository<ClinicalMeasurement, UUID> {
    List<ClinicalMeasurement> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    List<ClinicalMeasurement> findByNoteId(UUID noteId);
}
