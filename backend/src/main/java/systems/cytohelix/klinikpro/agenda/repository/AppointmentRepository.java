package systems.cytohelix.klinikpro.agenda.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

/**
 * Repositorio tenant-scoped (ver Appointment @Filter + RLS en V5__agenda.sql).
 */
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    /**
     * Choque de horario: buscamos todas las citas del practitioner ese día
     * para verificar solapamiento de duraciones (hora a hora_fin).
     */
    List<Appointment> findByBranchIdAndPractitionerIdAndFechaAndEstadoNot(
            UUID branchId, UUID practitionerId, LocalDate fecha, AppointmentStatus estadoDistintoDe);

    /** Historial de citas de un paciente en la sucursal actual — usado por GET /fhir/Patient/{id}/$everything. */
    List<Appointment> findByBranchIdAndPatientId(UUID branchId, UUID patientId);

    long countByBranchIdAndFecha(UUID branchId, LocalDate fecha);
    
    long countByBranchIdAndFechaAndEstado(UUID branchId, LocalDate fecha, AppointmentStatus estado);
}
