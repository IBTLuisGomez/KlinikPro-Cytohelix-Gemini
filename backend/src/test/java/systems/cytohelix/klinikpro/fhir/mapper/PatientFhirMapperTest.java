package systems.cytohelix.klinikpro.fhir.mapper;

import org.junit.jupiter.api.Test;
import systems.cytohelix.klinikpro.fhir.common.ContactPoint;
import systems.cytohelix.klinikpro.fhir.common.HumanName;
import systems.cytohelix.klinikpro.fhir.common.Identifier;
import systems.cytohelix.klinikpro.fhir.common.Reference;
import systems.cytohelix.klinikpro.fhir.config.FhirSystems;
import systems.cytohelix.klinikpro.fhir.dto.FhirPatient;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.dto.PatientUpsertCommand;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class PatientFhirMapperTest {

    private final PatientFhirMapper mapper = new PatientFhirMapper();

    @Test
    void mapeaPatientATenantConIdentifierCodigoYReferencias() {
        UUID patientId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID branchId = UUID.randomUUID();
        UUID especialistaId = UUID.randomUUID();
        UUID tratanteId = UUID.randomUUID();

        Patient patient = Patient.builder()
                .id(patientId)
                .version(1L)
                .tenantId(tenantId)
                .branchId(branchId)
                .codigo("0007")
                .nombre("Maria Lopez")
                .telefono("3312345678")
                .email("maria@example.com")
                .nacimiento(LocalDate.of(1990, 5, 20))
                .especialistaId(especialistaId)
                .tratanteId(tratanteId)
                .active(true)
                .updatedAt(OffsetDateTime.now())
                .build();

        FhirPatient fhir = mapper.toFhir(patient);

        assertEquals("Patient", fhir.resourceType());
        assertEquals(patientId.toString(), fhir.id());
        assertEquals(FhirSystems.patientCode(tenantId, branchId), fhir.identifier().get(0).system());
        assertEquals("0007", fhir.identifier().get(0).value());
        assertEquals("Maria Lopez", fhir.name().get(0).text());
        assertEquals(LocalDate.of(1990, 5, 20), fhir.birthDate());
        assertEquals("Organization/" + tenantId, fhir.managingOrganization().reference());
        assertEquals("Practitioner/" + especialistaId, fhir.generalPractitioner().get(0).reference());
        assertEquals("Practitioner/" + tratanteId, fhir.generalPractitioner().get(1).reference());

        List<String> telecomSystems = fhir.telecom().stream().map(ContactPoint::system).toList();
        assertEquals(List.of("phone", "email"), telecomSystems);
    }

    @Test
    void toUpsertCommandExtraeCamposDelFhirPatient() {
        UUID id = UUID.randomUUID();
        UUID especialistaId = UUID.randomUUID();

        FhirPatient fhirPatient = new FhirPatient(
                "Patient",
                id.toString(),
                null,
                List.of(Identifier.of("urn:cytohelix:klinikpro:...:patient-code", "0042")),
                true,
                List.of(HumanName.ofText("Carlos Diaz")),
                List.of(ContactPoint.phone("3300000000"), ContactPoint.email("carlos@example.com")),
                LocalDate.of(1985, 1, 1),
                List.of(Reference.to("Practitioner", especialistaId)),
                null
        );

        PatientUpsertCommand cmd = mapper.toUpsertCommand(fhirPatient);

        assertEquals(id, cmd.id());
        assertEquals("0042", cmd.codigo());
        assertEquals("Carlos Diaz", cmd.nombre());
        assertEquals("3300000000", cmd.telefono());
        assertEquals("carlos@example.com", cmd.email());
        assertEquals(LocalDate.of(1985, 1, 1), cmd.nacimiento());
        assertEquals(especialistaId, cmd.especialistaId());
        assertNull(cmd.tratanteId());
        assertEquals(Boolean.TRUE, cmd.active());
    }

    @Test
    void toUpsertCommandSinIdEsCreacion() {
        FhirPatient fhirPatient = new FhirPatient(
                "Patient", null, null, null, null,
                List.of(HumanName.ofText("Paciente Nuevo")),
                null, null, null, null);

        PatientUpsertCommand cmd = mapper.toUpsertCommand(fhirPatient);

        assertNull(cmd.id());
        assertNull(cmd.codigo());
        assertEquals("Paciente Nuevo", cmd.nombre());
    }
}
