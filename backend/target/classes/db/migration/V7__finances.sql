-- V7__finances.sql
-- Tablas para el módulo de Caja y Finanzas (POS)

CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    appointment_id UUID,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL, -- DRAFT, PAID, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Habilitar RLS en facturas
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_invoices ON invoices
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- CASH, CARD, TRANSFER
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Habilitar RLS en pagos
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy_payments ON payments
    USING (tenant_id = current_setting('app.current_tenant')::uuid);

-- Índices para búsquedas rápidas en el dashboard (KPIs)
CREATE INDEX idx_invoices_tenant_branch ON invoices(tenant_id, branch_id);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);
CREATE INDEX idx_payments_tenant_invoice ON payments(tenant_id, invoice_id);
