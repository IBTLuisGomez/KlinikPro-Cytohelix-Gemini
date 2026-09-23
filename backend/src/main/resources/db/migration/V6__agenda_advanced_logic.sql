-- Actualización de la Agenda para reglas avanzadas (LogicaAgenda.pdf)

-- 1. Ampliar estados de la cita
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS chk_appointments_estado;

ALTER TABLE appointments ADD CONSTRAINT chk_appointments_estado CHECK (
    estado IN ('Programada', 'Confirmada', 'EnEspera', 'EnAtencion', 'Finalizada', 'Cancelada', 'NoAsistio', 'Reprogramada')
);

-- Actualizar citas existentes (Pendiente -> Programada, Completada -> Finalizada)
UPDATE appointments SET estado = 'Programada' WHERE estado = 'Pendiente';
UPDATE appointments SET estado = 'Finalizada' WHERE estado = 'Completada';

-- 2. Agregar hora_fin para control de solapamiento por duración
ALTER TABLE appointments ADD COLUMN hora_fin TIME;
-- Por defecto para datos legacy, le sumamos 30 mins
UPDATE appointments SET hora_fin = (hora + interval '30 minutes')::time WHERE hora_fin IS NULL;
ALTER TABLE appointments ALTER COLUMN hora_fin SET NOT NULL;

-- 3. Crear tablas para Horarios de Médicos (HorarioMedico y Bloqueo)
CREATE TABLE practitioner_schedules (
    id UUID PRIMARY KEY,
    practitioner_id UUID NOT NULL,
    dia_semana INT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7), -- 1=Lunes, 7=Domingo
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    consultorio_id UUID, -- Opcional, si está amarrado a un consultorio
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_schedules_practitioner ON practitioner_schedules(practitioner_id);

CREATE TABLE practitioner_blocks (
    id UUID PRIMARY KEY,
    practitioner_id UUID NOT NULL,
    fecha_hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_hora_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX idx_blocks_practitioner ON practitioner_blocks(practitioner_id);
