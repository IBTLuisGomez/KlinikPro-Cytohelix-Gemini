package systems.cytohelix.klinikpro.finances.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PayAppointmentRequest(
        UUID appointmentId,
        UUID patientId,
        BigDecimal amount,
        String paymentMethod
) {}
