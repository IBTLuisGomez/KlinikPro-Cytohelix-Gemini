package systems.cytohelix.klinikpro.patients.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.patients.domain.Practitioner;
import systems.cytohelix.klinikpro.patients.repository.PractitionerRepository;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.util.List;
import java.util.UUID;

/**
 * Consulta de especialistas/tratantes. Solo lectura por ahora — el
 * catalogo de practitioners se sigue administrando como en el prototipo
 * (no hay import FHIR de Practitioner en esta fase, solo export).
 */
@Service
public class PractitionerService extends AbstractTenantScopedService {

    private final PractitionerRepository practitionerRepository;

    public PractitionerService(PractitionerRepository practitionerRepository) {
        this.practitionerRepository = practitionerRepository;
    }

    @Transactional(readOnly = true)
    public Practitioner findByIdForCurrentTenant(UUID id) {
        initTenantSession();
        return practitionerRepository.findById(id)
                .filter(Practitioner::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Practitioner", id.toString()));
    }

    /**
     * Filtrado por sucursal (no solo por tenant) — mismo criterio que
     * PatientService/ServiceCatalogService/AppointmentService. Corregido en
     * Parcela 4.3: hasta entonces devolvia practitioners de TODAS las
     * sucursales del tenant, inconsistente con el resto de los listados
     * de fhir/, que si estan acotados a la sucursal del token.
     */
    @Transactional(readOnly = true)
    public List<Practitioner> findAllActiveForCurrentBranch() {
        initTenantSession();
        UUID branchId = currentBranchId();
        return practitionerRepository.findAll().stream()
                .filter(Practitioner::isActive)
                .filter(p -> branchId.equals(p.getBranchId()))
                .toList();
    }
}
