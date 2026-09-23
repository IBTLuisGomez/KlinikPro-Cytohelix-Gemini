package systems.cytohelix.klinikpro.treatments.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.tenancy.security.TenantContext;
import systems.cytohelix.klinikpro.treatments.domain.ClinicalNote;
import systems.cytohelix.klinikpro.treatments.domain.ClinicalMeasurement;
import systems.cytohelix.klinikpro.treatments.repository.ClinicalNoteRepository;
import systems.cytohelix.klinikpro.treatments.repository.ClinicalMeasurementRepository;
import systems.cytohelix.klinikpro.treatments.dto.ClinicalNoteRequest;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.repository.PatientRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ClinicalRecordService {

    private final ClinicalNoteRepository noteRepository;
    private final ClinicalMeasurementRepository measurementRepository;
    private final PatientRepository patientRepository;

    public ClinicalRecordService(ClinicalNoteRepository noteRepository, ClinicalMeasurementRepository measurementRepository, PatientRepository patientRepository) {
        this.noteRepository = noteRepository;
        this.measurementRepository = measurementRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public ClinicalNote saveNote(ClinicalNoteRequest request) {
        Patient patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", request.patientId().toString()));

        ClinicalNote note = ClinicalNote.builder()
                .tenantId(TenantContext.getTenantId())
                .branchId(patient.getBranchId())
                .patientId(request.patientId())
                .appointmentId(request.appointmentId())
                .practitionerId(request.practitionerId())
                .subjective(request.subjective())
                .objective(request.objective())
                .assessment(request.assessment())
                .plan(request.plan())
                .status(request.status() != null ? request.status() : "SIGNED")
                .build();
        
        return noteRepository.save(note);
    }

    @Transactional(readOnly = true)
    public List<ClinicalNote> getNotesForPatient(UUID patientId) {
        return noteRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    @Transactional(readOnly = true)
    public ClinicalNote getNote(UUID id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClinicalNote", id.toString()));
    }
}
