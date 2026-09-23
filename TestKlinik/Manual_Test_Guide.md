# Guía de Pruebas Manuales (E2E) - KlinikPro SaaS

Esta guía detalla paso a paso cómo validar las funcionalidades críticas del sistema unificado, garantizando que el aislamiento Multi-tenant y el motor de Agenda funcionen correctamente.

## Pre-requisitos
1. Tener Docker Desktop corriendo.
2. Levantar el stack completo: `docker-compose up --build -d` en la carpeta raíz.
3. El frontend estará en `http://localhost:80` (o solo `http://localhost`)
4. El backend en `http://localhost:8080`
5. PgAdmin en `http://localhost:5050` (Usuario: `admin@cytohelix.com`, Pass: `admin`)

---

## Prueba 1: Setup Inicial de Clínicas (Tenants) en la Base de Datos
Para simular el SaaS, crearemos dos clínicas distintas para probar que los datos no se mezclan.

1. Entra a pgAdmin (`http://localhost:5050`).
2. Registra el servidor Docker: Host: `db`, Port: `5432`, Username: `kpro_admin`, Password: `password123`.
3. Abre el Query Tool en la base de datos `klinikpro` y ejecuta:

```sql
-- Crear Tenant A (Clínica San José)
INSERT INTO tenant (id, name) VALUES ('aaaaa111-1111-1111-1111-111111111111', 'Clínica San José');
INSERT INTO branch (id, tenant_id, name) VALUES ('bbbbb111-1111-1111-1111-111111111111', 'aaaaa111-1111-1111-1111-111111111111', 'Matriz San José');

-- Crear Tenant B (Consultorios Médicos del Norte)
INSERT INTO tenant (id, name) VALUES ('aaaaa222-2222-2222-2222-222222222222', 'Consultorios Médicos del Norte');
INSERT INTO branch (id, tenant_id, name) VALUES ('bbbbb222-2222-2222-2222-222222222222', 'aaaaa222-2222-2222-2222-222222222222', 'Sucursal Norte');
```

---

## Prueba 2: Aislamiento Multi-tenant (Row-Level Security)
1. Abre el navegador en `http://localhost`.
2. En el campo "Clínica (Tenant ID)", ingresa el ID del Tenant A: `aaaaa111-1111-1111-1111-111111111111`. Ingresa cualquier usuario/contraseña y haz clic en Iniciar Sesión.
3. Ve a la pestaña **Pacientes** y haz clic en **+ Nuevo Paciente**.
4. Llena los datos (Ej. "Juan Pérez") y haz clic en Guardar.
5. Verás a Juan Pérez en la lista de pacientes.
6. Ahora, presiona **Salir** en la barra lateral (o borra el localStorage).
7. Inicia sesión de nuevo, pero ahora con el Tenant B: `aaaaa222-2222-2222-2222-222222222222`.
8. Ve a la pestaña **Pacientes**.
**Resultado Esperado (Éxito):** La lista debe estar *vacía*. Juan Pérez pertenece a la Clínica San José, y la base de datos PostgreSQL, mediante sus políticas RLS, impidió que el Tenant B lo viera.

---

## Prueba 3: Motor Anti-colisiones de la Agenda
1. Estando logueado (con cualquier Tenant), ve a la pestaña **Agenda**.
2. Dale clic a **+ Nueva** cita.
3. Llena el ID del Paciente (puedes inventar un UUID como `123e4567-e89b-12d3-a456-426614174000`), pon la hora a las `10:00 AM` y en descripción "Consulta General".
4. Haz clic en **Agendar**.
5. La cita aparecerá en el panel central en color verde/azul.
6. Intenta **crear otra cita** exactamente a la misma hora (`10:00 AM`) para otro paciente (usa otro UUID falso).
**Resultado Esperado (Éxito):** El sistema debe lanzar un *Alert* rojo en la pantalla indicando "Error al guardar cita. Revisa posibles colisiones de horario", bloqueando la cita gracias a la validación del backend `AppointmentService`.

---

### Opción 1: Tests Automatizados (Jest)
1. Abre tu terminal en `TestKlinik`
2. Instala dependencias con `npm install` (solo la primera vez).
3. Corre el comando:
   ```bash
   npm run test
   ```
4. O si usas VSCode, usa la extensión de Testing o el panel "Run & Debug" para ejecutar los tests de `api.test.js` visualmente.
5. El script se autenticará como Tenant A y B, y probará la creación de pacientes, el aislamiento de la base de datos (RLS) y la prevención de colisiones del motor de agenda (anti-collision).

---

## Prueba 4: Flujo POS Básico
1. Ve a la pestaña **Caja**.
2. Verifica que las sub-pestañas "Ingresos", "Gastos" y "Arqueo" cambian correctamente las vistas del panel (probando el enrutamiento y estado de React).
3. Prueba rellenar un cobro y verifica que los inputs funcionan (aunque el botón de enviar estará simulado hasta que se construya el servicio en Java).
