package systems.cytohelix.klinikpro.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import systems.cytohelix.klinikpro.dashboard.service.DashboardService;
import systems.cytohelix.klinikpro.finances.dto.DashboardKpiResponse;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/kpis")
    public DashboardKpiResponse getKpis() {
        return dashboardService.getKpisForToday();
    }
}
