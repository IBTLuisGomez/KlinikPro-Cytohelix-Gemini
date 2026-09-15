package com.cytohelix.klinikpro.domain.patient;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;

@Service
public class PatientService {
    
    private final PatientRepository repository;

    public PatientService(PatientRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Patient getByIdOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }
    
    @Transactional(readOnly = true)
    public List<Patient> findAll() {
        return repository.findAll();
    }
}
