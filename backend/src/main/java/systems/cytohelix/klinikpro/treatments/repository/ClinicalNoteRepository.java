package systems.cytohelix.klinikpro.treatments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.treatments.domain.ClinicalNote;

import java.util.List;
import java.util.UUID;

public interface ClinicalNoteRepository extends JpaRepository<ClinicalNote, UUID> {
    List<ClinicalNote> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    List<ClinicalNote> findByAppointmentId(UUID appointmentId);
}
