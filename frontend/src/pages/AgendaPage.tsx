import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Calendar as CalendarIcon, Clock, User, Plus } from 'lucide-react';

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State
  const [patientId, setPatientId] = useState('');
  const [time, setTime] = useState('10:00');
  const [description, setDescription] = useState('Consulta General');

  const loadAppointments = async () => {
    try {
      const data = await fetchApi('/fhir/Appointment');
      if (data && data.entry) {
        setAppointments(data.entry.map((e: any) => e.resource));
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create start datetime (UTC offset handling simplified for prototype)
    const startDateTime = new Date(`${selectedDate}T${time}:00`).toISOString();

    const payload = {
      resourceType: "Appointment",
      status: "booked",
      start: startDateTime,
      description: description,
      participant: [
        {
          actor: { reference: `Patient/${patientId}` },
          status: "accepted"
        }
      ]
    };

    try {
      await fetchApi('/fhir/Appointment', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setShowForm(false);
      loadAppointments();
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Error al guardar cita. Revisa posibles colisiones de horario.");
    }
  };

  // Filter appointments for selected date
  const dayAppointments = appointments.filter(app => {
    if (!app.start) return false;
    const appDate = new Date(app.start).toISOString().split('T')[0];
    return appDate === selectedDate;
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <section className="panel active">
      <div className="page-head">
        <div>
          <div className="page-title">Agenda</div>
          <div className="page-desc">Citas y validación anti-colisiones</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Calendar Date Selection & List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CalendarIcon className="ic" /> Disponibilidad
              </div>
            </div>
            <div className="form-group">
              <label>Seleccionar Día</label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                style={{ width: '100%', maxWidth: '100%' }}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                Citas del día
              </div>
              <button className="btn btn-secondary btn-sm flex items-center gap-1" onClick={() => setShowForm(!showForm)}>
                <Plus size={16} /> Nueva
              </button>
            </div>
            
            <div className="space-y-4">
              {dayAppointments.length === 0 ? (
                <div className="empty-state">
                  <p>No hay citas agendadas para este día.</p>
                </div>
              ) : (
                dayAppointments.map(app => {
                  const timeStr = new Date(app.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const patientRef = app.participant?.find((p:any) => p.actor?.reference?.startsWith('Patient/'));
                  const patientId = patientRef?.actor?.reference?.split('/')[1] || 'Desconocido';
                  
                  return (
                    <div key={app.id} className="p-4 rounded-lg bg-surface-dim border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-primary" />
                        <span className="text-sm font-bold text-slate-800">{timeStr}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 mb-1">{app.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User size={12} /> Paciente ID: {patientId.substring(0,8)}...
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          {showForm ? (
            <div className="card">
              <div className="card-header">
                <div className="card-title">Agendar Nueva Cita</div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group span2">
                    <label>ID del Paciente (UUID)*</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. f47ac10b-58cc-..." 
                      value={patientId}
                      onChange={e => setPatientId(e.target.value)}
                    />
                    <span className="hint">En la versión final esto será un autocompletado por nombre.</span>
                  </div>
                  <div className="form-group">
                    <label>Hora*</label>
                    <input 
                      type="time" 
                      required 
                      value={time}
                      onChange={e => setTime(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Servicio / Descripción*</label>
                    <input 
                      type="text" 
                      required 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-actions" style={{ marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">Agendar (Validar Colisiones)</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <CalendarIcon size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">Motor Anti-colisiones Activo</h3>
              <p className="text-sm max-w-md mx-auto">
                Selecciona "Nueva" para agendar una cita. El backend validará automáticamente que el horario no se traslape con otras citas confirmadas del mismo especialista.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
