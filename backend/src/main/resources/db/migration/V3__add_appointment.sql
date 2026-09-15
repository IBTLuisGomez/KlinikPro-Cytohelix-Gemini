CREATE TABLE appointment (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenant(id),
    branch_id UUID NOT NULL REFERENCES branch(id),
    patient_id UUID NOT NULL REFERENCES patient(id),
    practitioner_id UUID NOT NULL REFERENCES practitioner(id),
    status VARCHAR(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE appointment ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_appointment ON appointment 
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);
