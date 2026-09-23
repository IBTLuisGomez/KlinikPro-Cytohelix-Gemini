package systems.cytohelix.klinikpro.agenda.domain;

/**
 * Mismo enum de 3 valores del prototipo (KlinikPro.html: 'Pendiente',
 * 'Completada', 'Cancelada' — ver setCitaEstado). Se guarda como VARCHAR en
 * BD (ver V5__agenda.sql, chk_appointments_estado) igual que Role en
 * AppUser, no como tipo enum nativo de Postgres, para no acoplar el schema a
 * enums de Postgres y poder agregar estados nuevos con una migracion simple.
 */
public enum AppointmentStatus {
    Programada,
    Confirmada,
    EnEspera,
    EnAtencion,
    Finalizada,
    Cancelada,
    NoAsistio,
    Reprogramada
}
