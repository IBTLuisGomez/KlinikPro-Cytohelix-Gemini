import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { X, UserPlus, Clock } from 'lucide-react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AgendaPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [patientsList, setPatientsList] = useState<any[]>([]);
  
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date } | null>(null);
  
  // Form fields
  const [patientId, setPatientId] = useState('');
  const [status, setStatus] = useState('booked');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const loadAgenda = async () => {
    try {
      const aptData = await fetchApi('/Appointment');
      const patData = await fetchApi('/Patient');
      
      const pList = patData.entry ? patData.entry.map((e:any) => e.resource) : [];
      setPatientsList(pList);

      const parsedEvents = (aptData.entry || []).map((e: any) => {
        const apt = e.resource;
        const pRef = apt.participant?.find((p:any) => p.actor?.reference?.startsWith('Patient/'));
        const pId = pRef ? pRef.actor.reference.split('/')[1] : null;
        const p = pList.find((x:any) => x.id === pId);
        const title = p ? p.name?.[0]?.text || 'Paciente' : 'Desconocido';

        return {
          id: apt.id,
          title: `${title} (${apt.status})`,
          start: new Date(apt.start),
          end: new Date(apt.end),
          resource: apt
        };
      });
      setEvents(parsedEvents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAgenda();
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => {
    setSelectedEventId(null);
    setPatientId('');
    setStatus('booked');
    setNote('');
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    setSelectedEventId(event.id);
    setSelectedSlot({ start: event.start, end: event.end });
    
    const r = event.resource;
    setStatus(r.status);
    setNote(r.description || '');
    
    const pRef = r.participant?.find((p:any) => p.actor?.reference?.startsWith('Patient/'));
    if (pRef) {
      setPatientId(pRef.actor.reference.split('/')[1]);
    } else {
      setPatientId('');
    }
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !patientId) return;
    setSaving(true);
    
    // Buscar el nombre del paciente para enviarlo en el FHIR request
    const p = patientsList.find(x => x.id === patientId);
    const pName = p ? p.name?.[0]?.text || 'Paciente' : 'Paciente';

    try {
      const payload: any = {
        resourceType: 'Appointment',
        status: status,
        start: selectedSlot.start.toISOString(),
        end: selectedSlot.end.toISOString(),
        description: note,
        participant: [
          {
            actor: { reference: `Patient/${patientId}`, display: pName },
            status: 'accepted'
          },
          {
            actor: { reference: `Practitioner/practitioner-1`, display: 'Médico' }, // hardcoded medico for now
            status: 'accepted'
          }
        ]
      };

      if (selectedEventId) {
        payload.id = selectedEventId;
      }

      await fetchApi('/Appointment', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      await loadAgenda();
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Error: " + (err.message || 'Conflicto de agenda.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEventId) return;
    if (!confirm('¿Cancelar esta cita?')) return;
    try {
      await fetchApi(`/Appointment/${selectedEventId}`, { method: 'DELETE' });
      await loadAgenda();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Custom event styles
  const eventPropGetter = (event: any) => {
    const status = event.resource.status;
    let bg = '#0E7490'; // primary-container
    let text = '#ffffff';
    let border = '#0E7490';

    if (status === 'fulfilled') {
      bg = '#ECFDF5'; // success bg
      text = '#047857'; // success text
      border = '#A7F3D0';
    } else if (status === 'waitlist') {
      bg = '#FFFBEB'; // warning bg
      text = '#B45309'; // warning text
      border = '#FDE68A';
    } else if (status === 'cancelled') {
      bg = '#FEF2F2'; // error bg
      text = '#B91C1C';
      border = '#FECACA';
    }

    return {
      style: {
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        fontWeight: '600',
        fontSize: '11px',
      }
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-on-surface">Agenda Médica</h1>
          <p className="font-body-sm text-outline">Planificación de consultas y control de disponibilidad clínica.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-label-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Confirmada
          </span>
          <span className="px-3 py-1 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] rounded-full font-label-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#047857]"></span>
            Finalizada
          </span>
          <span className="px-3 py-1 bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] rounded-full font-label-sm flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#B45309]"></span>
            En Espera
          </span>
        </div>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-4 overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          defaultView={Views.WEEK}
          views={['month', 'week', 'day']}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: "Siguiente",
            previous: "Atrás",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
          eventPropGetter={eventPropGetter}
        />
      </div>

      {/* Modal Citas */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-surface-container-low/50">
              <h2 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {selectedEventId ? 'edit_calendar' : 'calendar_add_on'}
                </span>
                {selectedEventId ? 'Modificar Cita' : 'Programar Nueva Cita'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-outline hover:text-error rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg border border-outline-variant/30 text-sm">
                <Clock className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface capitalize">
                    {format(selectedSlot.start, "EEEE d 'de' MMMM", { locale: es })}
                  </span>
                  <span className="text-outline text-xs">
                    {format(selectedSlot.start, 'HH:mm')} - {format(selectedSlot.end, 'HH:mm')} hrs
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-outline mb-1.5">Paciente Citado</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <select 
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                  >
                    <option value="">Seleccione un paciente...</option>
                    {patientsList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name?.[0]?.text || 'Sin nombre'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-sm text-outline mb-1.5">Estado Clínico</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                >
                  <option value="booked">Confirmada (Booked)</option>
                  <option value="waitlist">En Espera / Triaje (Waitlist)</option>
                  <option value="fulfilled">Atendida / Finalizada (Fulfilled)</option>
                  <option value="cancelled">Cancelada (Cancelled)</option>
                </select>
              </div>
              
              <div>
                <label className="block font-label-sm text-outline mb-1.5">Motivo / Notas de Triaje</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Ej. Chequeo general..."
                  rows={2}
                />
              </div>

              <div className="pt-4 flex justify-between gap-3 border-t border-outline-variant/30 mt-6">
                {selectedEventId ? (
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-semibold text-error hover:bg-error/10 rounded-lg transition-colors flex items-center gap-1"
                  >
                    Cancelar Cita
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-outline hover:text-on-surface transition-colors"
                  >
                    Volver
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? 'Guardando...' : 'Confirmar Agenda'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
