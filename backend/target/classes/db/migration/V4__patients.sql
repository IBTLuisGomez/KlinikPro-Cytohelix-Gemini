-- =============================================================================
-- V4: dominio de pacientes (patients/) — Parcela 1 del plan de implementacion FHIR
-- (docs/plan-implementacion-fhir.md). Migra el modelo real del prototipo
-- (KlinikPro.html: stores 'specialists' y 'patients') a tablas tenant-scoped,
-- mismo patron RLS + version que V1/V3.
--
-- Orden: practitioners antes que patients porque patients referencia
-- practitioners (especialista_id, tratante_id).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- practitioners: especialistas/tratantes de una sucursal (store "specialists"
-- del prototipo). Se asignan a pacientes y a citas (agenda/, Parcela 2).
-- -----------------------------------------------------------------------------
CREATE TABLE practitioners (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id     UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    version       BIGINT       NOT NULL DEFAULT 0,
    nombre        VARCHAR(160) NOT NULL,
    especialidad  VARCHAR(160),
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_practitioners_tenant_id ON practitioners (tenant_id);
CREATE INDEX idx_practitioners_branch_id ON practitioners (branch_id);

ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

CREATE POLICY practitioners_tenant_isolation ON practitioners
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- -----------------------------------------------------------------------------
-- patients: expediente de paciente (store "patients" del prototipo). El campo
-- "codigo" es el codigo de 4 digitos que el prototipo asigna secuencialmente
-- (ver nextPacienteCodigo() en KlinikPro.html) y que es unico SOLO por
-- sucursal, no global — de ahi el UNIQUE(tenant_id, branch_id, codigo) en vez
-- de UNIQUE(codigo). Mismo razonamiento documentado en FhirSystems.patientCode().
--
-- especialista_id / tratante_id: dos roles distintos de practitioner que el
-- prototipo permite asignar al mismo paciente (ver formPaciente en
-- KlinikPro.html) — no son la misma columna.
--
-- auto_creado: refleja el flag "autoCreado" del prototipo (alta automatica de
-- paciente al cobrar en POS, ver stamp/altaAutomatica en KlinikPro.html). El
-- modulo pos/ todavia es placeholder (Fase 2 sin FHIR); esta columna deja el
-- terreno preparado para cuando se conecte.
-- -----------------------------------------------------------------------------
CREATE TABLE patients (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id        UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id        UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    version          BIGINT       NOT NULL DEFAULT 0,
    codigo           VARCHAR(4)   NOT NULL,
    nombre           VARCHAR(160) NOT NULL,
    telefono         VARCHAR(20),
    email            VARCHAR(180),
    nacimiento       DATE,
    especialista_id  UUID REFERENCES practitioners (id) ON DELETE SET NULL,
    tratante_id      UUID REFERENCES practitioners (id) ON DELETE SET NULL,
    aseguradora      BOOLEAN      NOT NULL DEFAULT FALSE,
    derivacion       BOOLEAN      NOT NULL DEFAULT FALSE,
    notas            TEXT,
    auto_creado      BOOLEAN      NOT NULL DEFAULT FALSE,
    active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_patients_tenant_branch_codigo UNIQUE (tenant_id, branch_id, codigo)
);

CREATE INDEX idx_patients_tenant_id ON patients (tenant_id);
CREATE INDEX idx_patients_branch_id ON patients (branch_id);
-- Soporta el chequeo de dedup por nombre+telefono en PatientService (ver
-- upsertFromFhir): sin este indice esa consulta haria table scan.
CREATE INDEX idx_patients_branch_nombre ON patients (branch_id, nombre);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY patients_tenant_isolation ON patients
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
