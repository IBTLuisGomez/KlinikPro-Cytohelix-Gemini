package systems.cytohelix.klinikpro.finances.controller;

import org.springframework.web.bind.annotation.*;
import systems.cytohelix.klinikpro.finances.domain.Invoice;
import systems.cytohelix.klinikpro.finances.dto.PayAppointmentRequest;
import systems.cytohelix.klinikpro.finances.service.FinanceService;

@RestController
@RequestMapping("/api/finances")
public class PosController {

    private final FinanceService financeService;

    public PosController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @PostMapping("/pos/pay")
    public Invoice processPayment(@RequestBody PayAppointmentRequest request) {
        return financeService.processPayment(request);
    }
}
