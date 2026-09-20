const http = require('http');

const TENANT_A = 'aaaaa111-1111-1111-1111-111111111111';
const TENANT_B = 'aaaaa222-2222-2222-2222-222222222222';

async function fetchApi(path, method = 'GET', body = null, tenantId = TENANT_A) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-ID': tenantId
      }
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } else {
          resolve({ status: res.statusCode, error: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("=== INICIANDO PRUEBAS AUTOMATIZADAS KLINIKPRO API ===\n");

  try {
    console.log("Test 1: Creando paciente en Tenant A...");
    const p1 = await fetchApi('/fhir/Patient', 'POST', {
      resourceType: 'Patient',
      active: true,
      name: [{ use: 'official', text: 'Automated Patient A' }]
    }, TENANT_A);
    console.log(p1.status === 200 ? "✅ Éxito" : `❌ Fallo: ${p1.error}`);

    console.log("\nTest 2: Verificando aislamiento RLS en Tenant B...");
    const p2 = await fetchApi('/fhir/Patient', 'GET', null, TENANT_B);
    let isIsolated = false;
    if (p2.status === 200) {
       // Searchset bundle or array
       let items = p2.data.entry || p2.data || [];
       if (items.length === 0) isIsolated = true;
    }
    console.log(isIsolated ? "✅ Éxito: Tenant B no ve pacientes de Tenant A" : "❌ Fallo: Fuga de datos detectada o error de API");

    console.log("\nTest 3: Motor Anti-colisiones (Agendando Cita 1)...");
    const d1 = await fetchApi('/fhir/Appointment', 'POST', {
      resourceType: 'Appointment',
      status: 'booked',
      start: '2026-11-15T10:00:00Z',
      description: 'Test Cita',
      participant: [{ actor: { reference: 'Patient/123e4567-e89b-12d3-a456-426614174000' }, status: 'accepted' }]
    }, TENANT_A);
    console.log(d1.status === 200 ? "✅ Éxito" : `❌ Fallo: ${d1.error}`);

    console.log("\nTest 4: Motor Anti-colisiones (Intentando Colisionar Cita 1)...");
    const d2 = await fetchApi('/fhir/Appointment', 'POST', {
      resourceType: 'Appointment',
      status: 'booked',
      start: '2026-11-15T10:00:00Z', // Same time
      description: 'Test Cita Colision',
      participant: [{ actor: { reference: 'Patient/123e4567-e89b-12d3-a456-426614174000' }, status: 'accepted' }]
    }, TENANT_A);
    console.log(d2.status >= 400 ? "✅ Éxito: El backend bloqueó la colisión correctamente." : "❌ Fallo: El backend permitió la colisión.");

  } catch (err) {
    console.error("Error crítico durante las pruebas:", err.message);
    console.log("¿Está el contenedor backend (localhost:8080) corriendo?");
  }
}

runTests();
