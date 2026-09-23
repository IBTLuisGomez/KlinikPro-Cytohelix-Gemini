package systems.cytohelix.klinikpro.finances.dto;

import java.math.BigDecimal;

public record DashboardKpiResponse(
        long pacientesHoy,
        long citasPendientes,
        BigDecimal ingresosHoy,
        BigDecimal gastosHoy
) {}
