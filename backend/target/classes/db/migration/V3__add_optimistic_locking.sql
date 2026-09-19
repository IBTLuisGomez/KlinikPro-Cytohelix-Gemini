-- =============================================================================
-- V3: columna de optimistic locking en las tablas de tenancy ya existentes.
--
-- Sirve para dos cosas:
--   1. Optimistic locking real con @Version (hoy no existia: dos escrituras
--      concurrentes sobre el mismo registro se pisaban sin avisar).
--   2. Alimentar meta.versionId en la capa de proyeccion FHIR (fhir/), que
--      arranca en esta misma entrega (Parcela 0 del plan de implementacion:
--      docs/plan-implementacion-fhir.md).
-- =============================================================================

ALTER TABLE tenants   ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE branches  ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE app_users ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
