package systems.cytohelix.klinikpro.agenda.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.dto.AppointmentUpsertCommand;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.agenda.repository.PractitionerBlockRepository;
import systems.cytohelix.klinikpro.agenda.repository.PractitionerScheduleRepository;
import systems.cytohelix.klinikpro.core.exception.BusinessConflictException;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.core.exception.ValidationException;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Reglas de negocio de citas, portadas del prototipo (KlinikPro.html,
 * submitCita/setCitaEstado):
 *   1. Al crear, el estado SIEMPRE inicia en Pendiente (el prototipo ignora
 *      cualquier estado que venga del formulario de alta).
 *   2. Choque de horario: si se asigna practitioner, no puede haber otra
 *      cita del MISMO practitioner en la MISMA sucursal+fecha+hora que no
 *      este cancelada ("sameSlot" del prototipo). A diferencia del
 *      duplicado de paciente (que el prototipo solo advierte), esto SI
 *      bloquea — es un conflicto de agenda real, no una sugerencia de UI.
 *
 * upsertFromFhir es el UNICO punto de escritura usado por fhir/.
 */
@Service
public class AppointmentService extends AbstractTenantScopedService {

    private final AppointmentRepository appointmentRepository;
    private final PractitionerScheduleRepository scheduleRepository;
    private final PractitionerBlockRepository blockRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PractitionerScheduleRepository scheduleRepository,
                              PractitionerBlockRepository blockRepository) {
        this.appointmentRepository = appointmentRepository;
        this.scheduleRepository = scheduleRepository;
        this.blockRepository = blockRepository;
    }

    @Transactional(readOnly = true)
    public Appointment findByIdForCurrentTenant(UUID id) {
        initTenantSession();
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", id.toString()));
    }

    @Transactional(readOnly = true)
    public List<Appointment> findAllForCurrentBranch() {
        initTenantSession();
        UUID branchId = currentBranchId();
        return appointmentRepository.findAll().stream()
                .filter(a -> branchId.equals(a.getBranchId()))
                .toList();
    }

    /** Historial de citas de un paciente en la sucursal actual — ver FhirPatientController $everything. */
    @Transactional(readOnly = true)
    public List<Appointment> findAllForPatientInCurrentBranch(UUID patientId) {
        initTenantSession();
        UUID branchId = currentBranchId();
        return appointmentRepository.findByBranchIdAndPatientId(branchId, patientId);
    }

    @Transactional
    public Appointment upsertFromFhir(AppointmentUpsertCommand cmd) {
        initTenantSession();
        UUID tenantId = currentTenantId();
        UUID branchId = currentBranchId();

        if (cmd.id() != null) {
            Appointment existing = appointmentRepository.findById(cmd.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", cmd.id().toString()));

            boolean slotChanged = !Objects.equals(existing.getPractitionerId(), cmd.practitionerId())
                    || !Objects.equals(existing.getFecha(), cmd.fecha())
                    || !Objects.equals(existing.getHora(), cmd.hora())
                    || !Objects.equals(existing.getHoraFin(), cmd.horaFin());
            AppointmentStatus nuevoEstado = cmd.estado() != null ? cmd.estado() : existing.getEstado();
            if (slotChanged && cmd.practitionerId() != null && nuevoEstado != AppointmentStatus.Cancelada) {
                checkNoConflict(branchId, cmd.practitionerId(), cmd.fecha(), cmd.hora(), cmd.horaFin(), existing.getId());
            }

            applyCommand(existing, cmd);
            return appointmentRepository.save(existing);
        }

        // fecha/hora/patientLabel son NOT NULL en la tabla (ver V5__agenda.sql) y
        // siempre obligatorios al crear en el prototipo (submitCita)
        if (cmd.fecha() == null || cmd.hora() == null) {
            throw ValidationException.required("fecha y hora son obligatorias para crear una cita.");
        }
        if (cmd.patientLabel() == null || cmd.patientLabel().isBlank()) {
            throw ValidationException.required("patientLabel (nombre del paciente) es obligatorio para crear una cita.");
        }
        
        LocalTime newHoraFin = cmd.horaFin() != null ? cmd.horaFin() : cmd.hora().plusMinutes(30);

        if (cmd.practitionerId() != null) {
            checkNoConflict(branchId, cmd.practitionerId(), cmd.fecha(), cmd.hora(), newHoraFin, null);
        }

        Appointment appointment = Appointment.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .patientId(cmd.patientId())
                .patientLabel(cmd.patientLabel())
                .telefono(cmd.telefono())
                .serviceId(cmd.serviceId())
                .serviceLabel(cmd.serviceLabel())
                .practitionerId(cmd.practitionerId())
                .practitionerLabel(cmd.practitionerLabel())
                .fecha(cmd.fecha())
                .hora(cmd.hora())
                .horaFin(newHoraFin)
                .estado(AppointmentStatus.Programada)
                .build();

        return appointmentRepository.save(appointment);
    }

    private void checkNoConflict(UUID branchId, UUID practitionerId, LocalDate fecha,
                                  LocalTime horaInicio, LocalTime horaFin, UUID excludeAppointmentId) {
        if (horaFin == null) horaFin = horaInicio.plusMinutes(30);

        // 1. Validar que la cita esté dentro del horario laboral del médico
        // dia_semana de Java es 1=Lunes, 7=Domingo, al igual que nuestra base de datos.
        int diaSemana = fecha.getDayOfWeek().getValue();
        List<systems.cytohelix.klinikpro.agenda.domain.PractitionerSchedule> horarios = 
            scheduleRepository.findByPractitionerIdAndDiaSemana(practitionerId, diaSemana);
        
        if (!horarios.isEmpty()) {
            final LocalTime finalHoraFinForSchedule = horaFin;
            boolean dentroDeHorario = horarios.stream().anyMatch(h -> 
                (horaInicio.equals(h.getHoraInicio()) || horaInicio.isAfter(h.getHoraInicio())) &&
                (finalHoraFinForSchedule.equals(h.getHoraFin()) || finalHoraFinForSchedule.isBefore(h.getHoraFin()))
            );
            if (!dentroDeHorario) {
                throw new BusinessConflictException("El especialista no atiende en el horario solicitado para este día.");
            }
        }

        // 2. Validar que no haya bloqueos de vacaciones/recesos
        OffsetDateTime startUtc = OffsetDateTime.of(fecha, horaInicio, ZoneOffset.UTC);
        OffsetDateTime endUtc = OffsetDateTime.of(fecha, horaFin, ZoneOffset.UTC);
        List<systems.cytohelix.klinikpro.agenda.domain.PractitionerBlock> bloqueos = 
            blockRepository.findOverlappingBlocks(practitionerId, startUtc, endUtc);
        
        if (!bloqueos.isEmpty()) {
            throw new BusinessConflictException("El especialista tiene un bloqueo de agenda (vacaciones/receso) en este horario.");
        }
        
        // 3. Validar solapamientos de citas previas
        List<Appointment> dayAppointments = appointmentRepository
                .findByBranchIdAndPractitionerIdAndFechaAndEstadoNot(
                        branchId, practitionerId, fecha, AppointmentStatus.Cancelada);
                        
        final LocalTime finalHoraFin = horaFin;
        
        boolean hayConflicto = dayAppointments.stream()
                .filter(a -> excludeAppointmentId == null || !a.getId().equals(excludeAppointmentId))
                .anyMatch(a -> horaInicio.isBefore(a.getHoraFin()) && finalHoraFin.isAfter(a.getHora()));
                
        if (hayConflicto) {
            throw new BusinessConflictException(
                    "Ya existe una cita para este especialista que se solapa con el horario solicitado.");
        }
    }

    private void applyCommand(Appointment appointment, AppointmentUpsertCommand cmd) {
        if (cmd.patientId() != null) {
            appointment.setPatientId(cmd.patientId());
        }
        if (cmd.patientLabel() != null) {
            appointment.setPatientLabel(cmd.patientLabel());
        }
        if (cmd.telefono() != null) {
            appointment.setTelefono(cmd.telefono());
        }
        if (cmd.serviceId() != null) {
            appointment.setServiceId(cmd.serviceId());
        }
        if (cmd.serviceLabel() != null) {
            appointment.setServiceLabel(cmd.serviceLabel());
        }
        if (cmd.practitionerId() != null) {
            appointment.setPractitionerId(cmd.practitionerId());
        }
        if (cmd.practitionerLabel() != null) {
            appointment.setPractitionerLabel(cmd.practitionerLabel());
        }
        if (cmd.fecha() != null) {
            appointment.setFecha(cmd.fecha());
        }
        if (cmd.hora() != null) {
            appointment.setHora(cmd.hora());
        }
        if (cmd.horaFin() != null) {
            appointment.setHoraFin(cmd.horaFin());
        }
        if (cmd.estado() != null) {
            appointment.setEstado(cmd.estado());
        }
    }
}
