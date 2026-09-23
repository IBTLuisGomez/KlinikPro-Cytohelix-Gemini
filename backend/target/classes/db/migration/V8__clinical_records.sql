-- =============================================================================
-- V8: Clinical Records (Ficha Clinica)
--
-- Tabla para Notas Clinicas Evolutivas (SOAP)
-- Tabla para Mediciones Biometricas
-- =============================================================================

CREATE TABLE clinical_notes (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id      UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    patient_id     UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments (id) ON DELETE SET NULL,
    practitioner_id UUID REFERENCES app_users (id) ON DELETE SET NULL,
    
    subjective     TEXT,
    objective      TEXT,
    assessment     TEXT,
    plan_text      TEXT,
    
    status         VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SIGNED
    
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clinical_notes_tenant_id ON clinical_notes (tenant_id);
CREATE INDEX idx_clinical_notes_patient_id ON clinical_notes (patient_id);

ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY clinical_notes_tenant_isolation ON clinical_notes
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);


CREATE TABLE clinical_measurements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id      UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    patient_id     UUID NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    note_id        UUID REFERENCES clinical_notes (id) ON DELETE CASCADE,
    
    metric_type    VARCHAR(64) NOT NULL, -- ej. KNEE_FLEXION, KNEE_EXTENSION, QUAD_STRENGTH
    metric_value   NUMERIC(10,2) NOT NULL,
    metric_unit    VARCHAR(32) NOT NULL, -- ej. grados, scale
    
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clinical_measurements_tenant_id ON clinical_measurements (tenant_id);
CREATE INDEX idx_clinical_measurements_patient_id ON clinical_measurements (patient_id);

ALTER TABLE clinical_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY clinical_measurements_tenant_isolation ON clinical_measurements
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
