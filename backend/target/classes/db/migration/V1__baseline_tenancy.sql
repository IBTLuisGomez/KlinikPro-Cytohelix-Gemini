-- =============================================================================
-- V1: Baseline multi-tenant — tenants, branches, app_users
--
-- Estrategia de aislamiento (ver ADR en Claude outputs/KlinikPro_CytoHelix_Formalizacion.md):
--   esquema unico + columna tenant_id en cada tabla de negocio, filtrada por la
--   capa de aplicacion (Hibernate) y reforzada con Row-Level Security nativo de
--   Postgres como segunda capa de defensa.
--
-- NOTA DE ENDURECIMIENTO (pendiente antes de produccion real, ver README):
--   Estas politicas RLS protegen contra fugas cuando la conexion usa un rol de
--   base de datos SIN privilegio BYPASSRLS. El rol dueno de las tablas (el que
--   corre esta migracion) SI puede saltarse RLS por defecto en Postgres. Antes
--   de ir a produccion: crear un rol de aplicacion separado (ej. klinikpro_app)
--   sin BYPASSRLS y usarlo en el datasource de runtime; el rol de migraciones
--   (Flyway) puede seguir siendo el dueno.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- tenants: cada clinica/cliente que compra KlinikPro
-- -----------------------------------------------------------------------------
CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(64)  NOT NULL UNIQUE,
    name        VARCHAR(160) NOT NULL,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE tenants IS 'Clinica/cliente de KlinikPro. Raiz del aislamiento multi-tenant.';

-- -----------------------------------------------------------------------------
-- branches: sucursales de un tenant (equivalente a "branches" del prototipo HTML)
-- -----------------------------------------------------------------------------
CREATE TABLE branches (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    name        VARCHAR(160) NOT NULL,
    timezone    VARCHAR(64)  NOT NULL DEFAULT 'America/Mexico_City',
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_branches_tenant_id ON branches (tenant_id);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY branches_tenant_isolation ON branches
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- -----------------------------------------------------------------------------
-- app_users: usuarios que inician sesion (no existia en el prototipo, que era
-- 100% local sin login). Roles iniciales: ADMIN, RECEPCION, ESPECIALISTA.
-- -----------------------------------------------------------------------------
CREATE TABLE app_users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id      UUID NOT NULL REFERENCES tenants (id) ON DELETE CASCADE,
    branch_id      UUID REFERENCES branches (id) ON DELETE SET NULL,
    email          VARCHAR(180) NOT NULL,
    password_hash  VARCHAR(100) NOT NULL,
    full_name      VARCHAR(160) NOT NULL,
    role           VARCHAR(32)  NOT NULL DEFAULT 'RECEPCION',
    active         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT chk_app_users_role CHECK (role IN ('ADMIN', 'RECEPCION', 'ESPECIALISTA')),
    -- El mismo correo puede repetirse entre tenants distintos, nunca dentro del mismo tenant.
    CONSTRAINT uq_app_users_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX idx_app_users_tenant_id ON app_users (tenant_id);
CREATE INDEX idx_app_users_branch_id ON app_users (branch_id);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY app_users_tenant_isolation ON app_users
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
