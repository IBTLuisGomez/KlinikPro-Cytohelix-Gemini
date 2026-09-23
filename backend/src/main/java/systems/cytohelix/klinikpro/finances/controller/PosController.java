package systems.cytohelix.klinikpro.finances.controller;

import org.springframework.web.bind.annotation.*;
import systems.cytohelix.klinikpro.finances.domain.cash.CashRegister;
import systems.cytohelix.klinikpro.finances.domain.cash.Income;
import systems.cytohelix.klinikpro.finances.service.CashRegisterService;
import systems.cytohelix.klinikpro.finances.repository.IncomeRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pos")
public class PosController {

    private final CashRegisterService cashService;
    private final IncomeRepository incomeRepository;

    public PosController(CashRegisterService cashService, IncomeRepository incomeRepository) {
        this.cashService = cashService;
        this.incomeRepository = incomeRepository;
    }

    // --- COBROS ---

    @PostMapping("/checkout")
    public Income processPayment(@RequestBody CheckoutRequest request) {
        // En un entorno real se extraería el userId del token JWT actual
        UUID dummyUserId = UUID.fromString("111e4567-e89b-12d3-a456-426614174000"); 
        return cashService.registerIncome(
            dummyUserId, 
            request.patientId(), 
            request.amount(), 
            request.paymentMethod()
        );
    }

    @GetMapping("/invoices")
    public List<Income> getInvoices() {
        // Para Stitch, devolvemos los incomes ordenados por fecha
        return incomeRepository.findAll();
    }

    // --- CAJA ---

    @PostMapping("/register/open")
    public CashRegister openRegister(@RequestBody OpenRegisterRequest req) {
        UUID dummyUserId = UUID.fromString("111e4567-e89b-12d3-a456-426614174000");
        return cashService.openRegister(dummyUserId, req.initialAmount());
    }

    @PostMapping("/register/{id}/close")
    public CashRegister closeRegister(@PathVariable UUID id, @RequestBody CloseRegisterRequest req) {
        return cashService.closeRegister(id, req.realAmount(), req.notes());
    }

    // --- GASTOS ---
    @GetMapping("/expenses/categories")
    public List<systems.cytohelix.klinikpro.finances.domain.cash.ExpenseCategory> getExpenseCategories() {
        return ((systems.cytohelix.klinikpro.finances.repository.ExpenseCategoryRepository) org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
        ).getBean(systems.cytohelix.klinikpro.finances.repository.ExpenseCategoryRepository.class)).findAll();
    }

    @GetMapping("/expenses")
    public List<systems.cytohelix.klinikpro.finances.domain.cash.Expense> getExpenses() {
        return ((systems.cytohelix.klinikpro.finances.repository.ExpenseRepository) org.springframework.web.context.support.WebApplicationContextUtils.getRequiredWebApplicationContext(
                ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder.getRequestAttributes()).getRequest().getServletContext()
        ).getBean(systems.cytohelix.klinikpro.finances.repository.ExpenseRepository.class)).findAll();
    }

    @PostMapping("/expenses")
    public systems.cytohelix.klinikpro.finances.domain.cash.Expense registerExpense(@RequestBody ExpenseRequest req) {
        UUID dummyUserId = UUID.fromString("111e4567-e89b-12d3-a456-426614174000");
        return cashService.registerExpense(dummyUserId, req.categoryId(), req.amount(), req.paymentMethod(), req.provider(), req.description());
    }
}

record CheckoutRequest(UUID patientId, BigDecimal amount, String paymentMethod, String concept) {}
record OpenRegisterRequest(BigDecimal initialAmount) {}
record CloseRegisterRequest(BigDecimal realAmount, String notes) {}
record ExpenseRequest(UUID categoryId, BigDecimal amount, String paymentMethod, String provider, String description) {}
