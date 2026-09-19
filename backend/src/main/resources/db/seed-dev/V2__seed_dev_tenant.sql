-- Datos de arranque SOLO para desarrollo local. Esta carpeta (db/seed-dev)
-- unicamente se agrega a spring.flyway.locations en application-dev.yml — el
-- perfil por defecto (application.yml, el que se usaria en produccion) jamas
-- la incluye, asi que este INSERT nunca corre fuera de tu maquina.
--
-- Credenciales de prueba:
--   tenantSlug: demo
--   email:      admin@demo.klinikpro
--   password:   klinikpro123   (hash bcrypt precalculado abajo)

INSERT INTO tenants (slug, name)
VALUES ('demo', 'Clinica Demo (KlinikPro Dev)');

INSERT INTO branches (tenant_id, name)
SELECT id, 'Sucursal Centro' FROM tenants WHERE slug = 'demo';

INSERT INTO app_users (tenant_id, branch_id, email, password_hash, full_name, role)
SELECT t.id, b.id,
       'admin@demo.klinikpro',
       '$2b$10$53V/jZQStB7X52b8MYcYAOjSnWwRYf7UwhLZybKzOvn4NQwGrDjWi',
       'Admin Demo',
       'ADMIN'
FROM tenants t
JOIN branches b ON b.tenant_id = t.id
WHERE t.slug = 'demo';
