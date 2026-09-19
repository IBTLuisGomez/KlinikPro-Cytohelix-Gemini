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
     * Choque de horario: mismo practitioner + fecha + hora, ignorando citas
     * canceladas — replica "sameSlot" del prototipo (KlinikPro.html,
     * submitCita). Ver AppointmentService.
     */
    List<Appointment> findByBranchIdAndPractitionerIdAndFechaAndHoraAndEstadoNot(
            UUID branchId, UUID practitionerId, LocalDate fecha, LocalTime hora, AppointmentStatus estadoDistintoDe);

    /** Historial de citas de un paciente en la sucursal actual — usado por GET /fhir/Patient/{id}/$everything. */
    List<Appointment> findByBranchIdAndPatientId(UUID branchId, UUID patientId);
}
