-- Init Script: Setup tables and RLS (Row-Level Security) for multitenancy

-- Create core tables
CREATE TABLE tenant (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branch (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_user (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Example for Clinical Data using JSONB
CREATE TABLE clinical_data (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    patient_id UUID NOT NULL, -- Will reference a patient table
    encounter_id UUID,
    fhir_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on multitenant tables
ALTER TABLE branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_user ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_data ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Note: current_setting('app.current_tenant') will be set by the application context
CREATE POLICY tenant_isolation_branch ON branch 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

CREATE POLICY tenant_isolation_app_user ON app_user 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);

CREATE POLICY tenant_isolation_clinical_data ON clinical_data 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);
