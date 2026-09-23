const BASE_URL = 'http://localhost:8080';

// Helper to make HTTP requests usando fetch nativo
async function httpRequest(path, method = 'GET', body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(`${BASE_URL}${path}`, options);
  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch(e) { data = text; }
  }
  return { status: res.status, data, error: !res.ok ? data : null };
}

async function login(tenantSlug, email, password) {
  const res = await httpRequest('/auth/login', 'POST', { tenantSlug, email, password });
  if (res.status !== 200) throw new Error(`Login falló: ${JSON.stringify(res.error)}`);
  return res.data.token;
}

describe('KlinikPro API E2E (JWT)', () => {
  let authA = {};
  let authB = {};
  let patientIdA = '';
  // Practitioner insertado en bd por defecto en nuestro entorno dev
  let practitionerIdA;

  beforeAll(async () => {
    try {
      const tokenA = await login('demo', 'admin@demo.klinikpro', 'klinikpro123');
      const tokenB = await login('demo2', 'admin@demo2.klinikpro', 'klinikpro123');
      authA = { 'Authorization': `Bearer ${tokenA}` };
      authB = { 'Authorization': `Bearer ${tokenB}` };
    } catch (e) {
      console.error('Error al iniciar sesión:', e.message);
      throw e;
    }
  });

  test('Test 1: Creando paciente en Tenant A', async () => {
    const res = await httpRequest('/fhir/Patient', 'POST', {
      resourceType: 'Patient',
      name: [{ use: 'official', text: 'Automated Patient A' }]
    }, authA);
    expect([200, 201]).toContain(res.status);
    patientIdA = res.data.id;
    expect(patientIdA).toBeDefined();

    const resPrac = await httpRequest('/fhir/Practitioner', 'GET', null, authA);
    practitionerIdA = resPrac.data.entry[0].resource.id;
  });

  test('Test 2: Verificando aislamiento RLS en Tenant B', async () => {
    const res = await httpRequest('/fhir/Patient', 'GET', null, authB);
    expect(res.status).toBe(200);
    const items = res.data.entry || res.data || [];
    // Tenant B no debe ver al paciente de Tenant A
    const found = items.find(i => i.id === patientIdA);
    expect(found).toBeUndefined();
  });

  let citaId1 = null;

  describe('Citas (FHIR Appointment)', () => {
    const startSlot = `2026-10-15T${String(10 + Math.floor(Math.random()*5)).padStart(2, '0')}:00:00.000Z`;
    const endSlot = new Date(new Date(startSlot).getTime() + 45 * 60000).toISOString(); // 45 minutos después
    const overlappingStartSlot = new Date(new Date(startSlot).getTime() + 15 * 60000).toISOString(); // 15 mins después (solapa)

    test('Test 3: Motor Anti-colisiones (Agendando Cita 1 con duración)', async () => {
      const res = await httpRequest('/fhir/Appointment', 'POST', {
        resourceType: 'Appointment',
        status: 'booked',
        start: startSlot,
        end: endSlot,
        description: 'Consulta Larga',
        participant: [
          { actor: { reference: `Patient/${patientIdA}`, display: 'Automated Patient A' }, status: 'accepted' },
          { actor: { reference: `Practitioner/${practitionerIdA}` }, status: 'accepted' }
        ]
      }, authA);
      if(res.status >= 400) console.log("Test 3 Error:", res.error);
      expect([200, 201]).toContain(res.status);
      citaId1 = res.data.id;
    });

    test('Test 4: Motor Anti-colisiones (Bloqueo por solapamiento de duración)', async () => {
      const res = await httpRequest('/fhir/Appointment', 'POST', {
        resourceType: 'Appointment',
        status: 'booked',
        start: overlappingStartSlot, // Cita a los 15 mins, pero la anterior dura 45 mins
        description: 'Test Cita Solapada',
        participant: [
          { actor: { reference: `Patient/${patientIdA}`, display: 'Automated Patient A' }, status: 'accepted' },
          { actor: { reference: `Practitioner/${practitionerIdA}` }, status: 'accepted' }
        ]
      }, authA);
      // Debe ser un error (409 Conflict)
      expect(res.status).toBeGreaterThanOrEqual(400);
    });

    test('Test 5: Cambio de Estado de la Cita (Transiciones de LogicaAgenda)', async () => {
      // Pasamos de Programada (booked) a En Espera (arrived)
      const res = await httpRequest(`/fhir/Appointment/${citaId1}`, 'PUT', {
        resourceType: 'Appointment',
        id: citaId1,
        status: 'arrived', // EnEspera
        start: startSlot,
        end: endSlot,
        description: 'Consulta Larga',
        participant: [
          { actor: { reference: `Patient/${patientIdA}`, display: 'Automated Patient A' }, status: 'accepted' },
          { actor: { reference: `Practitioner/${practitionerIdA}` }, status: 'accepted' }
        ]
      }, authA);
      if(res.status >= 400) console.log("Test 5 Error:", res.error);
      expect([200, 201]).toContain(res.status);
      expect(res.data.status).toBe('arrived');
    });
  });

  describe('Caja y Finanzas (Fase 6)', () => {
    test('Test 6: Realizar un Cobro en Caja (Income)', async () => {
      // Primero, abrir la caja
      await httpRequest('/api/pos/register/open', 'POST', {
        initialAmount: 50000.00
      }, authA);

      // Luego realizar el cobro
      const res = await httpRequest('/api/pos/checkout', 'POST', {
        patientId: patientIdA,
        amount: 1500.50,
        paymentMethod: 'CASH',
        concept: 'Consulta General'
      }, authA);
      
      if(res.status >= 400) console.log("Test 6 Error:", res.error);
      expect([200, 201]).toContain(res.status);
      expect(res.data.netAmount).toBe(1500.50);
      expect(res.data.id).toBeDefined();
    });

    test('Test 7: Métricas del Dashboard Actualizadas', async () => {
      const res = await httpRequest('/api/dashboard/kpis', 'GET', null, authA);
      
      expect(res.status).toBe(200);
      expect(res.data.ingresosHoy).toBeGreaterThanOrEqual(1500.50); // Mínimo lo que acabamos de cobrar
      expect(res.data.pacientesHoy).toBeDefined();
      expect(res.data.citasPendientes).toBeDefined();
    });
    test('Test 8: Guardar Nota Clinica', async () => {
      const res = await httpRequest('/api/clinical/notes', 'POST', {
        patientId: patientIdA,
        practitionerId: practitionerIdA,
        subjective: 'Dolor de cabeza severo',
        objective: 'Presion arterial 140/90',
        assessment: 'Hipertension leve',
        plan: 'Reposo y medicacion',
        status: 'SIGNED'
      }, authA);
      
      if(res.status >= 400) console.log("Test 8 Error:", res.error);
      expect([200, 201]).toContain(res.status);
      expect(res.data.id).toBeDefined();
      expect(res.data.status).toBe('SIGNED');
      expect(res.data.subjective).toBe('Dolor de cabeza severo');
    });
  });
});
