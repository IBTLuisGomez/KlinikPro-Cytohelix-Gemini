CREATE TABLE practitioner (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    baja_logica BOOLEAN DEFAULT FALSE
);

CREATE TABLE patient (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    branch_id UUID NOT NULL REFERENCES branch(id),
    codigo VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    fecha_nacimiento DATE,
    tratante_id UUID REFERENCES practitioner(id),
    baja_logica BOOLEAN DEFAULT FALSE
);

ALTER TABLE practitioner ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_practitioner ON practitioner 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

CREATE POLICY tenant_isolation_patient ON patient 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);
