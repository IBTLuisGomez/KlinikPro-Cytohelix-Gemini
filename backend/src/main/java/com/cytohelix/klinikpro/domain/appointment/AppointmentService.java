package com.cytohelix.klinikpro.domain.appointment;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AppointmentService {
    
    private final AppointmentRepository repository;

    public AppointmentService(AppointmentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Appointment create(Appointment appointment) {
        // Motor Anti-colisiones
        List<Appointment> overlaps = repository.findOverlapping(
            appointment.getPractitionerId(), 
            appointment.getStartTime(), 
            appointment.getEndTime()
        );
        
        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("El horario colisiona con otra cita del especialista.");
        }
        
        return repository.save(appointment);
    }
}
