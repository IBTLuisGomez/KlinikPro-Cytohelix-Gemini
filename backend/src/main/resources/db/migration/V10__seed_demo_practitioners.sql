-- Insertar Practitioners para los tests automatizados
INSERT INTO practitioners (id, tenant_id, branch_id, nombre, especialidad)
SELECT gen_random_uuid(), t.id, b.id, 'Dr. Admin Demo', 'Medicina General'
FROM tenants t
JOIN branches b ON b.tenant_id = t.id
WHERE t.slug = 'demo';

INSERT INTO practitioners (id, tenant_id, branch_id, nombre, especialidad)
SELECT gen_random_uuid(), t.id, b.id, 'Dr. Admin Demo 2', 'Medicina General'
FROM tenants t
JOIN branches b ON b.tenant_id = t.id
WHERE t.slug = 'demo2';
