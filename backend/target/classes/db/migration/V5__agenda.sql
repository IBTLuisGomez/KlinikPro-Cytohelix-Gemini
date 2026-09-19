-- =============================================================================
-- V5: dominio de agenda (agenda/) — Parcela 2 del plan de implementacion FHIR
-- (docs/plan-implementacion-fhir.md). Migra el modelo real del prototipo
-- (KlinikPro.html: stores 'services' y 'appointments').
--
-- Orden: service_catalog antes que appointments (appointments la referencia).
-- practitioners y patients ya existen desde V4.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- service_catalog: catalogo de servicios de una sucursal (store "services"
-- del prototipo: nombre, tiempo en minutos, precio). Renombrado de "services"
-- a "service_catalog" para no chocar con el estereotipo @Service de Spring
-- (ver plan-implementacion-fhir.md §5, Parcela 2).
-- -----------------------------------------------------------------------------
CREATE TABLE service_catalog (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id        UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id        UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    version          BIGINT        NOT NULL DEFAULT 0,
    nombre           VARCHAR(160)  NOT NULL,
    tiempo_minutos   INTEGER       NOT NULL,
    precio           NUMERIC(10,2) NOT NULL,
    active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT chk_service_catalog_tiempo CHECK (tiempo_minutos > 0),
    CONSTRAINT chk_service_catalog_precio CHECK (precio >= 0)
);

CREATE INDEX idx_service_catalog_tenant_id ON service_catalog (tenant_id);
CREATE INDEX idx_service_catalog_branch_id ON service_catalog (branch_id);

ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY service_catalog_tenant_isolation ON service_catalog
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- -----------------------------------------------------------------------------
-- appointments: citas (store "appointments" del prototipo). patient_id /
-- service_id / practitioner_id son NULLABLE a proposito — el prototipo
-- permite walk-ins / pacientes no registrados (ver comentario "etiqueta de
-- respaldo" en submitCita, KlinikPro.html); por eso cada FK va acompanada de
-- su "*_label" de respaldo con el texto libre que el usuario capturo.
--
-- estado: mismo enum de 3 valores del prototipo (Pendiente/Completada/
-- Cancelada). Mapeo a Appointment.status de FHIR en AppointmentFhirMapper
-- (booked/fulfilled/cancelled — ver plan-implementacion-fhir.md §5).
-- -----------------------------------------------------------------------------
CREATE TABLE appointments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id           UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    version             BIGINT       NOT NULL DEFAULT 0,
    patient_id          UUID REFERENCES patients (id) ON DELETE SET NULL,
    patient_label       VARCHAR(160) NOT NULL,
    telefono            VARCHAR(20),
    service_id          UUID REFERENCES service_catalog (id) ON DELETE SET NULL,
    service_label       VARCHAR(160),
    practitioner_id     UUID REFERENCES practitioners (id) ON DELETE SET NULL,
    practitioner_label  VARCHAR(160),
    fecha               DATE NOT NULL,
    hora                TIME NOT NULL,
    estado              VARCHAR(16) NOT NULL DEFAULT 'Pendiente',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_appointments_estado CHECK (estado IN ('Pendiente', 'Completada', 'Cancelada'))
);

CREATE INDEX idx_appointments_tenant_id ON appointments (tenant_id);
CREATE INDEX idx_appointments_branch_id ON appointments (branch_id);
CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);
-- Soporta el chequeo de choque de horario en AppointmentService (mismo
-- practitioner + fecha + hora + estado != Cancelada).
CREATE INDEX idx_appointments_practitioner_slot ON appointments (branch_id, practitioner_id, fecha, hora);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointments_tenant_isolation ON appointments
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
