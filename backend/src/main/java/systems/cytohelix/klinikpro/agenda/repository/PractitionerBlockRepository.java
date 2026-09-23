package systems.cytohelix.klinikpro.agenda.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import systems.cytohelix.klinikpro.agenda.domain.PractitionerBlock;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface PractitionerBlockRepository extends JpaRepository<PractitionerBlock, UUID> {
    
    @Query("SELECT b FROM PractitionerBlock b WHERE b.practitionerId = :practitionerId " +
           "AND b.fechaHoraInicio < :end AND b.fechaHoraFin > :start")
    List<PractitionerBlock> findOverlappingBlocks(
            @Param("practitionerId") UUID practitionerId,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end);
}
