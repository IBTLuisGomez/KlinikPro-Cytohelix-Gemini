package systems.cytohelix.klinikpro.agenda.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.agenda.domain.PractitionerSchedule;

import java.util.List;
import java.util.UUID;

public interface PractitionerScheduleRepository extends JpaRepository<PractitionerSchedule, UUID> {
    List<PractitionerSchedule> findByPractitionerId(UUID practitionerId);
    List<PractitionerSchedule> findByPractitionerIdAndDiaSemana(UUID practitionerId, Integer diaSemana);
}
