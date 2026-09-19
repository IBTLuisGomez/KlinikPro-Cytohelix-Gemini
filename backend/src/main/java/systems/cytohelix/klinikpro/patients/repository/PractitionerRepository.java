package systems.cytohelix.klinikpro.patients.repository;

import systems.cytohelix.klinikpro.patients.domain.Practitioner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * Repositorio tenant-scoped (ver Practitioner @Filter + RLS en V4__patients.sql).
 */
public interface PractitionerRepository extends JpaRepository<Practitioner, UUID> {
}
