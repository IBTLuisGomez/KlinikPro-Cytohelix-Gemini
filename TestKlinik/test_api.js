const http = require('http');

// Helper to make HTTP requests
function httpRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
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

async function login(tenantSlug, email, password) {
  const res = await httpRequest('/auth/login', 'POST', { tenantSlug, email, password });
  if (res.status !== 200) throw new Error(`Login fallo: ${res.error}`);
  return res.data.token;
}

async function runTests() {
  console.log("=== INICIANDO PRUEBAS AUTOMATIZADAS KLINIKPRO API (JWT) ===\n");

  let tokenA, tokenB;
  try {
    tokenA = await login('t1', 'user@t1.com', 'klinikpro123');
    tokenB = await login('t2', 'user@t2.com', 'klinikpro123');
    console.log("✅ Login exitoso en ambos tenants.");
  } catch (e) {
    console.error("❌ Fallo en login previo a los tests:", e.message);
    return;
  }

  const authA = { 'Authorization': `Bearer ${tokenA}` };
  const authB = { 'Authorization': `Bearer ${tokenB}` };

  try {
    console.log("\nTest 1: Creando paciente en Tenant A...");
    const p1 = await httpRequest('/fhir/Patient', 'POST', {
      resourceType: 'Patient',
      active: true,
      name: [{ use: 'official', text: 'Automated Patient A' }]
    }, authA);
    console.log(p1.status === 200 || p1.status === 201 ? "✅ Éxito" : `❌ Fallo: ${p1.error}`);
    
    // Obtener ID del paciente recién creado para evitar error 23503 (FK)
    const patientId = p1.data && p1.data.id ? p1.data.id : '123e4567-e89b-12d3-a456-426614174000';

    // Usamos el ID del especialista que acabamos de inyectar en la base de datos
    const practitionerId = '333e4567-e89b-12d3-a456-426614174000';

    console.log("\nTest 2: Verificando aislamiento RLS en Tenant B...");
    const p2 = await httpRequest('/fhir/Patient', 'GET', null, authB);
    let isIsolated = false;
    if (p2.status === 200) {
       let items = p2.data.entry || p2.data || [];
       if (items.length === 0) isIsolated = true;
    }
    console.log(isIsolated ? "✅ Éxito: Tenant B no ve pacientes de Tenant A" : "❌ Fallo: Fuga de datos detectada o error de API");

    console.log("\nTest 3: Motor Anti-colisiones (Agendando Cita 1)...");
    const d1 = await httpRequest('/fhir/Appointment', 'POST', {
      resourceType: 'Appointment',
      status: 'booked',
      start: '2026-11-15T10:00:00Z',
      description: 'Test Cita',
      participant: [
        { actor: { reference: `Patient/${patientId}` }, status: 'accepted' },
        { actor: { reference: `Practitioner/${practitionerId}` }, status: 'accepted' }
      ]
    }, authA);
    console.log(d1.status === 200 || d1.status === 201 ? "✅ Éxito" : `❌ Fallo: ${d1.error}`);

    console.log("\nTest 4: Motor Anti-colisiones (Intentando Colisionar Cita 1)...");
    const d2 = await httpRequest('/fhir/Appointment', 'POST', {
      resourceType: 'Appointment',
      status: 'booked',
      start: '2026-11-15T10:00:00Z',
      description: 'Test Cita Colision',
      participant: [
        { actor: { reference: `Patient/${patientId}` }, status: 'accepted' },
        { actor: { reference: `Practitioner/${practitionerId}` }, status: 'accepted' }
      ]
    }, authA);
    console.log(d2.status >= 400 ? "✅ Éxito: El backend bloqueó la colisión correctamente." : "❌ Fallo: El backend permitió la colisión.");

  } catch (err) {
    console.error("Error crítico durante las pruebas:", err.message);
  }
}

runTests();
