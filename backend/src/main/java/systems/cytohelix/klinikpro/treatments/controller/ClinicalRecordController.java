package systems.cytohelix.klinikpro.treatments.controller;

import org.springframework.web.bind.annotation.*;
import systems.cytohelix.klinikpro.treatments.domain.ClinicalNote;
import systems.cytohelix.klinikpro.treatments.dto.ClinicalNoteRequest;
import systems.cytohelix.klinikpro.treatments.service.ClinicalRecordService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clinical")
public class ClinicalRecordController {

    private final ClinicalRecordService service;

    public ClinicalRecordController(ClinicalRecordService service) {
        this.service = service;
    }

    @PostMapping("/notes")
    public ClinicalNote saveNote(@RequestBody ClinicalNoteRequest request) {
        return service.saveNote(request);
    }

    @GetMapping("/patients/{patientId}/notes")
    public List<ClinicalNote> getPatientNotes(@PathVariable UUID patientId) {
        return service.getNotesForPatient(patientId);
    }
}
