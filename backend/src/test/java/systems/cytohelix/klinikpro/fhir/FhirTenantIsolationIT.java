package systems.cytohelix.klinikpro.fhir;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.fhir.bundle.FhirBundle;
import systems.cytohelix.klinikpro.patients.domain.Patient;
import systems.cytohelix.klinikpro.patients.repository.PatientRepository;
import systems.cytohelix.klinikpro.tenancy.domain.Branch;
import systems.cytohelix.klinikpro.tenancy.domain.Tenant;
import systems.cytohelix.klinikpro.tenancy.repository.BranchRepository;
import systems.cytohelix.klinikpro.tenancy.repository.TenantRepository;
import systems.cytohelix.klinikpro.tenancy.security.JwtService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Verifica el invariante central de la capa FHIR (plan-implementacion-fhir.md
 * §5, Parcela 4.1): un token de tenant A jamas debe poder leer ni buscar
 * recursos de tenant B, ni siquiera pidiendo el ID exacto.
 *
 * Usa un Postgres real via Testcontainers (no un mock) porque el aislamiento
 * depende de @Filter de Hibernate — no tiene sentido simularlo. Requiere
 * Docker disponible donde se corra {@code mvn test} (igual que ya requiere
 * docker-compose.yml para levantar el proyecto en dev).
 *
 * Los tokens se emiten directo con {@link JwtService#generateToken}, sin
 * pasar por /auth/login ni crear un AppUser: {@code JwtAuthenticationFilter}
 * no consulta la base para autenticar — el token firmado ya trae
 * tenantId/branchId/role (ver JwtAuthenticationFilter.doFilterInternal).
 *
 * <p><b>Hallazgo documentado</b> (ver tambien el comentario "NOTA DE
 * ENDURECIMIENTO" en V1__baseline_tenancy.sql): en este entorno de test —
 * igual que en dev/docker-compose hoy — la conexion usa el mismo rol que
 * corrio las migraciones Flyway, y ese rol se salta Row-Level Security por
 * defecto en Postgres (RLS no protege al dueño de las tablas). Estos tests
 * por lo tanto verifican la capa de aislamiento que SI esta activa
 * end-to-end hoy: el filtro de Hibernate (@Filter) + los checks explicitos
 * de tenant/branch en cada Service (ver AbstractTenantScopedService,
 * TenantQueryService). La proteccion adicional de RLS solo se vuelve
 * efectiva cuando exista un rol de aplicacion separado sin BYPASSRLS —
 * trabajo de endurecimiento ya señalado en la migracion, fuera de alcance de
 * esta parcela.
 */
@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FhirTenantIsolationIT {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private TenantRepository tenantRepository;
    @Autowired
    private BranchRepository branchRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;

    private Tenant tenantB;
    private Branch branchB;
    private Patient patientA;
    private Patient patientB;
    private Appointment appointmentB;
    private String tokenA;

    @BeforeAll
    void seed() {
        Tenant tenantA = tenantRepository.save(Tenant.builder()
                .slug("tenant-a-it-" + UUID.randomUUID()).name("Tenant A (IT)").build());
        tenantB = tenantRepository.save(Tenant.builder()
                .slug("tenant-b-it-" + UUID.randomUUID()).name("Tenant B (IT)").build());

        Branch branchA = branchRepository.save(Branch.builder()
                .tenantId(tenantA.getId()).name("Sucursal A").build());
        branchB = branchRepository.save(Branch.builder()
                .tenantId(tenantB.getId()).name("Sucursal B").build());

        patientA = patientRepository.save(Patient.builder()
                .tenantId(tenantA.getId()).branchId(branchA.getId())
                .codigo("0001").nombre("Paciente A").build());
        patientB = patientRepository.save(Patient.builder()
                .tenantId(tenantB.getId()).branchId(branchB.getId())
                .codigo("0001").nombre("Paciente B").build());

        appointmentRepository.save(Appointment.builder()
                .tenantId(tenantA.getId()).branchId(branchA.getId())
                .patientId(patientA.getId()).patientLabel(patientA.getNombre())
                .fecha(LocalDate.now().plusDays(1)).hora(LocalTime.of(9, 0))
                .estado(AppointmentStatus.Pendiente).build());
        appointmentB = appointmentRepository.save(Appointment.builder()
                .tenantId(tenantB.getId()).branchId(branchB.getId())
                .patientId(patientB.getId()).patientLabel(patientB.getNombre())
                .fecha(LocalDate.now().plusDays(1)).hora(LocalTime.of(9, 0))
                .estado(AppointmentStatus.Pendiente).build());

        // "ADMIN" y un userId aleatorio bastan: el filtro no valida contra app_users.
        tokenA = jwtService.generateToken(UUID.randomUUID(), tenantA.getId(), branchA.getId(), "ADMIN");
    }

    private HttpEntity<Void> asTenantA() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenA);
        return new HttpEntity<>(headers);
    }

    @Test
    void tenantANoPuedeLeerPacienteDeTenantBPorId() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Patient/" + patientB.getId(), HttpMethod.GET, asTenantA(), String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void busquedaDePacientesDeTenantANoIncluyeLosDeTenantB() {
        ResponseEntity<FhirBundle> response = restTemplate.exchange(
                "/fhir/Patient", HttpMethod.GET, asTenantA(), FhirBundle.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        boolean incluyeAPacienteDeTenantB = response.getBody().entry().stream()
                .anyMatch(entry -> entry.fullUrl().equals("Patient/" + patientB.getId()));
        assertFalse(incluyeAPacienteDeTenantB);
    }

    @Test
    void tenantANoPuedeLeerCitaDeTenantBPorId() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Appointment/" + appointmentB.getId(), HttpMethod.GET, asTenantA(), String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void tenantANoPuedeLeerOrganizationDeTenantBPorId() {
        // Organization/{id} = Tenant.id — Tenant no tiene @Filter (es la raiz del
        // aislamiento), el chequeo es manual en TenantQueryService (ver Parcela 0).
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Organization/" + tenantB.getId(), HttpMethod.GET, asTenantA(), String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void tenantANoPuedeLeerLocationDeTenantBPorId() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Location/" + branchB.getId(), HttpMethod.GET, asTenantA(), String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void everythingConIdDePacienteDeTenantBNoAccesibleDesdeTenantA() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Patient/" + patientB.getId() + "/$everything", HttpMethod.GET, asTenantA(), String.class);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void sinTokenNingunEndpointFhirProtegidoResponde2xx() {
        ResponseEntity<String> response = restTemplate.exchange(
                "/fhir/Patient/" + patientA.getId(), HttpMethod.GET, HttpEntity.EMPTY, String.class);

        // El codigo exacto (401 vs 403) depende de la configuracion por default de
        // Spring Security (sin AuthenticationEntryPoint propio) — lo que este test
        // fija es que SIN token nunca hay 2xx, no un status exacto.
        assertFalse(response.getStatusCode().is2xxSuccessful());
    }
}
