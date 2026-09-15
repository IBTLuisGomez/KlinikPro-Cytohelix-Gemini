package com.cytohelix.klinikpro.domain.clinical;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicalDataRepository extends JpaRepository<ClinicalData, UUID> {
    List<ClinicalData> findByPatientId(UUID patientId);
}
