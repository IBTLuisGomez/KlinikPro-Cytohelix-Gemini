-- V9__cash_register_and_expenses.sql
-- Lógica Avanzada de Caja y Cobros (Fase 6)

-- 1. Configuracion de Comisiones
CREATE TABLE commission_settings (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 0.0,
    fixed_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_commission_settings_tenant ON commission_settings(tenant_id);

-- 2. Turnos de Caja
CREATE TABLE cash_registers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    user_id UUID NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    initial_amount DECIMAL(12, 2) NOT NULL,
    theoretical_amount DECIMAL(12, 2) NOT NULL,
    real_amount DECIMAL(12, 2),
    difference DECIMAL(12, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, CLOSED
    closing_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cash_registers_tenant ON cash_registers(tenant_id);
CREATE INDEX idx_cash_registers_branch ON cash_registers(branch_id);

-- 3. Movimientos de Caja (Solo Efectivo)
CREATE TABLE cash_movements (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    cash_register_id UUID NOT NULL REFERENCES cash_registers(id),
    movement_type VARCHAR(20) NOT NULL, -- INCOME, EXPENSE, WITHDRAWAL, ADJUSTMENT
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    reference_id UUID, -- Puede ser un income_id o expense_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cash_movements_register ON cash_movements(cash_register_id);

-- 4. Ingresos (Reemplaza conceptualmente a Invoice/Payment, pero conviviremos para no romper V3)
CREATE TABLE incomes (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    cash_register_id UUID, -- NULL si fue un pago fuera de caja
    appointment_id UUID,
    patient_id UUID,
    gross_amount DECIMAL(12, 2) NOT NULL,
    commission_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.0,
    net_amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_incomes_tenant ON incomes(tenant_id);

-- 5. Categorías de Gasto
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    category_type VARCHAR(50) NOT NULL, -- FIXED, VARIABLE, INVESTMENT, WITHDRAWAL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Egresos Operativos
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    branch_id UUID NOT NULL,
    cash_register_id UUID, -- NULL si se pagó desde banco
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(100),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PAID', -- PENDING, PAID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Multi-tenant)
ALTER TABLE commission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Politicas RLS
CREATE POLICY tenant_isolation_commissions ON commission_settings USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY tenant_isolation_registers ON cash_registers USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY tenant_isolation_movements ON cash_movements USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY tenant_isolation_incomes ON incomes USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY tenant_isolation_categories ON expense_categories USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
CREATE POLICY tenant_isolation_expenses ON expenses USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- Seed básico de configuraciones de comisión para el tenant demo (T1) y demo2 (T2)
INSERT INTO commission_settings (id, tenant_id, branch_id, payment_method, percentage, fixed_fee)
VALUES 
(gen_random_uuid(), '111e4567-e89b-12d3-a456-426614174000', '222e4567-e89b-12d3-a456-426614174000', 'CARD', 2.50, 0.0),
(gen_random_uuid(), '999e4567-e89b-12d3-a456-426614174999', '888e4567-e89b-12d3-a456-426614174888', 'CARD', 2.50, 0.0);

-- Categorías por defecto
INSERT INTO expense_categories (id, tenant_id, name, category_type)
VALUES
(gen_random_uuid(), '111e4567-e89b-12d3-a456-426614174000', 'Insumos Médicos', 'VARIABLE'),
(gen_random_uuid(), '111e4567-e89b-12d3-a456-426614174000', 'Arriendo', 'FIXED'),
(gen_random_uuid(), '111e4567-e89b-12d3-a456-426614174000', 'Retiro de Socios', 'WITHDRAWAL');
