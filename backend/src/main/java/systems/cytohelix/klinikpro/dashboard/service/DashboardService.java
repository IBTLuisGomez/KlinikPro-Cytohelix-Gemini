package systems.cytohelix.klinikpro.dashboard.service;

import org.springframework.stereotype.Service;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.finances.domain.Invoice;
import systems.cytohelix.klinikpro.finances.domain.InvoiceStatus;
import systems.cytohelix.klinikpro.finances.dto.DashboardKpiResponse;
import systems.cytohelix.klinikpro.finances.repository.InvoiceRepository;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService extends AbstractTenantScopedService {

    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(AppointmentRepository appointmentRepository, InvoiceRepository invoiceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public DashboardKpiResponse getKpisForToday() {
        initTenantSession();
        UUID branchId = currentBranchId();
        UUID tenantId = currentTenantId();
        LocalDate today = LocalDate.now();

        // 1. Pacientes Hoy = Número de citas hoy
        long pacientesHoy = appointmentRepository.countByBranchIdAndFecha(branchId, today);

        // 2. Citas Pendientes (Programada, Confirmada, EnEspera)
        long citasProgramadas = appointmentRepository.countByBranchIdAndFechaAndEstado(branchId, today, AppointmentStatus.Programada);
        long citasConfirmadas = appointmentRepository.countByBranchIdAndFechaAndEstado(branchId, today, AppointmentStatus.Confirmada);
        long citasEnEspera = appointmentRepository.countByBranchIdAndFechaAndEstado(branchId, today, AppointmentStatus.EnEspera);
        long citasPendientes = citasProgramadas + citasConfirmadas + citasEnEspera;

        // 3. Ingresos Hoy
        List<Invoice> facturas = invoiceRepository.findByTenantIdAndBranchId(tenantId, branchId);
        
        BigDecimal ingresosHoy = BigDecimal.ZERO;
        
        // Sumar facturas pagadas hoy
        for (Invoice inv : facturas) {
            if (inv.getStatus() == InvoiceStatus.PAID && inv.getCreatedAt() != null) {
                LocalDate invDate = inv.getCreatedAt().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
                if (invDate.equals(today)) {
                    ingresosHoy = ingresosHoy.add(inv.getTotalAmount());
                }
            }
        }

        // 4. Gastos Hoy (Hardcoded a 0 por ahora hasta implementar módulo de gastos)
        BigDecimal gastosHoy = BigDecimal.ZERO;

        return new DashboardKpiResponse(pacientesHoy, citasPendientes, ingresosHoy, gastosHoy);
    }
}
