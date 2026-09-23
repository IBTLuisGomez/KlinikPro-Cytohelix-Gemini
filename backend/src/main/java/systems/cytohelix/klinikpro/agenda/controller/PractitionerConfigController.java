package systems.cytohelix.klinikpro.agenda.controller;

import org.springframework.web.bind.annotation.*;
import systems.cytohelix.klinikpro.agenda.domain.PractitionerSchedule;
import systems.cytohelix.klinikpro.agenda.repository.PractitionerScheduleRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/practitioners")
public class PractitionerConfigController {

    private final PractitionerScheduleRepository scheduleRepository;

    public PractitionerConfigController(PractitionerScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @GetMapping("/{practitionerId}/schedules")
    public List<PractitionerSchedule> getSchedules(@PathVariable UUID practitionerId) {
        return scheduleRepository.findByPractitionerId(practitionerId);
    }

    @PostMapping("/{practitionerId}/schedules")
    public PractitionerSchedule addSchedule(@PathVariable UUID practitionerId, @RequestBody PractitionerSchedule schedule) {
        schedule.setPractitionerId(practitionerId);
        if (schedule.getId() == null) {
            schedule.setId(UUID.randomUUID());
        }
        return scheduleRepository.save(schedule);
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public void deleteSchedule(@PathVariable UUID scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
}
