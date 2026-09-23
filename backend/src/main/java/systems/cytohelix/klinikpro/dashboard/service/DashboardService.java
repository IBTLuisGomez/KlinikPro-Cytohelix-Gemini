package systems.cytohelix.klinikpro.dashboard.service;

import org.springframework.stereotype.Service;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.finances.domain.cash.Income;
import systems.cytohelix.klinikpro.finances.dto.DashboardKpiResponse;
import systems.cytohelix.klinikpro.finances.repository.IncomeRepository;
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
    private final IncomeRepository incomeRepository;

    public DashboardService(AppointmentRepository appointmentRepository, IncomeRepository incomeRepository) {
        this.appointmentRepository = appointmentRepository;
        this.incomeRepository = incomeRepository;
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
        List<Income> facturas = incomeRepository.findByTenantId(tenantId);
        
        BigDecimal ingresosHoy = BigDecimal.ZERO;
        
        // Sumar facturas pagadas hoy
        for (Income inv : facturas) {
            if ("COMPLETED".equals(inv.getStatus()) && inv.getCreatedAt() != null) {
                LocalDate invDate = inv.getCreatedAt().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
                if (invDate.equals(today)) {
                    ingresosHoy = ingresosHoy.add(inv.getNetAmount());
                }
            }
        }

        // 4. Gastos Hoy (Hardcoded a 0 por ahora hasta implementar módulo de gastos)
        // 4. Gastos Hoy
        systems.cytohelix.klinikpro.finances.repository.ExpenseRepository expenseRepo = org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
        ).getBean(systems.cytohelix.klinikpro.finances.repository.ExpenseRepository.class);
        
        List<systems.cytohelix.klinikpro.finances.domain.cash.Expense> allExpenses = expenseRepo.findAll();
        BigDecimal gastosHoy = BigDecimal.ZERO;
        
        for (systems.cytohelix.klinikpro.finances.domain.cash.Expense exp : allExpenses) {
            if ("PAID".equals(exp.getStatus()) && exp.getCreatedAt() != null && exp.getTenantId().equals(tenantId)) {
                LocalDate expDate = exp.getCreatedAt().atZoneSameInstant(ZoneId.systemDefault()).toLocalDate();
                if (expDate.equals(today)) {
                    gastosHoy = gastosHoy.add(exp.getAmount());
                }
            }
        }

        return new DashboardKpiResponse(pacientesHoy, citasPendientes, ingresosHoy, gastosHoy);
    }
}
