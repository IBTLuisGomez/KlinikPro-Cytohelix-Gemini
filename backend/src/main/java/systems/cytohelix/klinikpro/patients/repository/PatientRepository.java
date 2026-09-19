package systems.cytohelix.klinikpro.patients.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import systems.cytohelix.klinikpro.patients.domain.Patient;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio tenant-scoped (ver Patient @Filter + RLS en V4__patients.sql).
 * El codigo de 4 digitos es unico por sucursal, no por tenant completo — de
 * ahi que las consultas de codigo/duplicados reciban branchId explicito
 * ademas del filtro de tenant.
 */
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    Optional<Patient> findByBranchIdAndCodigo(UUID branchId, String codigo);

    /**
     * Candidatos a duplicado dentro de la misma sucursal: mismo nombre
     * (case-insensitive) O mismo telefono. Replica la regla del prototipo
     * (KlinikPro.html, submitPaciente: "Duplicado si coincide NOMBRE o
     * TELEFONO"). Ver PatientService.upsertFromFhir — en vez del dialogo de
     * confirmacion del prototipo (no aplica a una API), un match aqui se
     * trata como upsert sobre el paciente existente en vez de crear otro.
     */
    @Query("""
            select p from Patient p
            where p.branchId = :branchId
              and p.active = true
              and (lower(p.nombre) = lower(:nombre)
                   or (:telefono is not null and p.telefono = :telefono))
            """)
    List<Patient> findPossibleDuplicates(
            @Param("branchId") UUID branchId,
            @Param("nombre") String nombre,
            @Param("telefono") String telefono);

    @Query("select p.codigo from Patient p where p.branchId = :branchId")
    List<String> findAllCodigosByBranchId(@Param("branchId") UUID branchId);
}
