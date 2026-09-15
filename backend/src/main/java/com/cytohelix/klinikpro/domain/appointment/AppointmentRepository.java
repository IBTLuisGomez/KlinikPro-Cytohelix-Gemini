package com.cytohelix.klinikpro.domain.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    
    @Query("SELECT a FROM Appointment a WHERE a.practitionerId = :practitionerId " +
           "AND a.status != 'CANCELADA' " +
           "AND ((a.startTime >= :start AND a.startTime < :end) " +
           "OR (a.endTime > :start AND a.endTime <= :end) " +
           "OR (a.startTime <= :start AND a.endTime >= :end))")
    List<Appointment> findOverlapping(
            @Param("practitionerId") UUID practitionerId,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end);
}
