package systems.cytohelix.klinikpro.finances.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.core.exception.ValidationException;
import systems.cytohelix.klinikpro.finances.domain.cash.*;
import systems.cytohelix.klinikpro.finances.repository.*;
import systems.cytohelix.klinikpro.tenancy.security.TenantContext;
import systems.cytohelix.klinikpro.patients.repository.PatientRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final CashMovementRepository movementRepository;
    private final IncomeRepository incomeRepository;
    private final CommissionSettingRepository commissionSettingRepository;
    private final PatientRepository patientRepository;

    public CashRegisterService(
            CashRegisterRepository cashRegisterRepository,
            CashMovementRepository movementRepository,
            IncomeRepository incomeRepository,
            CommissionSettingRepository commissionSettingRepository,
            PatientRepository patientRepository) {
        this.cashRegisterRepository = cashRegisterRepository;
        this.movementRepository = movementRepository;
        this.incomeRepository = incomeRepository;
        this.commissionSettingRepository = commissionSettingRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public CashRegister openRegister(UUID userId, BigDecimal initialAmount) {
        Optional<CashRegister> existing = cashRegisterRepository.findByUserIdAndStatus(userId, "OPEN");
        if (existing.isPresent()) {
            throw ValidationException.invalidValue("Ya existe una caja abierta para este usuario.");
        }

        // Para simplificar, usaremos el mismo tenant_id. 
        // Para branchId, lo setearemos igual al tenantId en este prototipo, o dummy
        UUID currentTenant = TenantContext.getTenantId();

        CashRegister register = CashRegister.builder()
                .tenantId(currentTenant)
                .branchId(currentTenant)
                .userId(userId)
                .initialAmount(initialAmount)
                .theoreticalAmount(initialAmount)
                .status("OPEN")
                .build();

        return cashRegisterRepository.save(register);
    }

    @Transactional
    public Income registerIncome(UUID userId, UUID patientId, BigDecimal amount, String method) {
        // En base devengado, el ingreso siempre se genera.
        // Pero si es en EFECTIVO, requiere caja abierta.
        Optional<CashRegister> registerOpt = cashRegisterRepository.findByUserIdAndStatus(userId, "OPEN");
        if (method.equals("CASH") && registerOpt.isEmpty()) {
            throw ValidationException.invalidValue("Debe abrir la caja antes de registrar cobros en efectivo.");
        }

        BigDecimal commission = BigDecimal.ZERO;
        
        // Calcular comisión si no es efectivo
        if (!method.equals("CASH")) {
            Optional<CommissionSetting> setting = commissionSettingRepository.findByPaymentMethodAndActiveTrue(method);
            if (setting.isPresent()) {
                CommissionSetting conf = setting.get();
                commission = amount.multiply(conf.getPercentage()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP)
                        .add(conf.getFixedFee());
            }
        }

        BigDecimal netAmount = amount.subtract(commission);

        UUID currentTenant = TenantContext.getTenantId();
        
        // Fetch branchId from patient
        systems.cytohelix.klinikpro.patients.domain.Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> ValidationException.invalidValue("Paciente no encontrado"));
        UUID branchId = patient.getBranchId();
        
        Income income = Income.builder()
                .tenantId(currentTenant)
                .branchId(branchId)
                .patientId(patientId)
                .cashRegisterId(registerOpt.map(CashRegister::getId).orElse(null))
                .grossAmount(amount)
                .commissionAmount(commission)
                .netAmount(netAmount)
                .paymentMethod(method)
                .status("COMPLETED")
                .build();
        
        income = incomeRepository.save(income);

        // Si es efectivo, impactar la caja
        if (method.equals("CASH") && registerOpt.isPresent()) {
            CashRegister register = registerOpt.get();
            CashMovement movement = CashMovement.builder()
                    .tenantId(currentTenant)
                    .branchId(branchId)
                    .cashRegisterId(register.getId())
                    .movementType("INCOME")
                    .amount(amount)
                    .description("Cobro paciente " + patientId)
                    .referenceId(income.getId())
                    .build();
            movementRepository.save(movement);

            register.setTheoreticalAmount(register.getTheoreticalAmount().add(amount));
            cashRegisterRepository.save(register);
        }

        return income;
    }

    @Transactional
    public CashRegister closeRegister(UUID registerId, BigDecimal realAmount, String notes) {
        CashRegister register = cashRegisterRepository.findById(registerId)
                .orElseThrow(() -> ValidationException.invalidValue("Caja no encontrada"));

        if (!"OPEN".equals(register.getStatus())) {
            throw ValidationException.invalidValue("La caja ya está cerrada");
        }

        BigDecimal diff = realAmount.subtract(register.getTheoreticalAmount());

        register.setRealAmount(realAmount);
        register.setDifference(diff);
        register.setStatus("CLOSED");
        register.setClosedAt(OffsetDateTime.now());
        register.setClosingNotes(notes);

        return cashRegisterRepository.save(register);
    }

    @Transactional
    public Expense registerExpense(UUID userId, UUID categoryId, BigDecimal amount, String method, String provider, String description) {
        Optional<CashRegister> registerOpt = cashRegisterRepository.findByUserIdAndStatus(userId, "OPEN");
        if (method.equals("CASH") && registerOpt.isEmpty()) {
            throw ValidationException.invalidValue("Debe abrir la caja antes de registrar gastos en efectivo.");
        }

        UUID currentTenant = TenantContext.getTenantId();
        UUID branchId = currentTenant; 

        Expense expense = Expense.builder()
                .tenantId(currentTenant)
                .branchId(branchId)
                .cashRegisterId(registerOpt.map(CashRegister::getId).orElse(null))
                .categoryId(categoryId)
                .amount(amount)
                .paymentMethod(method)
                .provider(provider)
                .description(description)
                .status("PAID")
                .build();
        
        ExpenseRepository expenseRepo = org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
        ).getBean(ExpenseRepository.class);
        
        expense = expenseRepo.save(expense);

        if (method.equals("CASH") && registerOpt.isPresent()) {
            CashRegister register = registerOpt.get();
            CashMovement movement = CashMovement.builder()
                    .tenantId(currentTenant)
                    .branchId(branchId)
                    .cashRegisterId(register.getId())
                    .movementType("EXPENSE")
                    .amount(amount)
                    .description("Egreso: " + description)
                    .referenceId(expense.getId())
                    .build();
            movementRepository.save(movement);

            register.setTheoreticalAmount(register.getTheoreticalAmount().subtract(amount));
            cashRegisterRepository.save(register);
        }

        return expense;
    }
}
