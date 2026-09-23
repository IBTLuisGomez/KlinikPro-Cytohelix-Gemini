import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Settings } from 'lucide-react';
import { fetchApi, fetchRestApi } from '../api/client';

export default function ConfigPage() {
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<string>('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [newSchedule, setNewSchedule] = useState({ diaSemana: 1, horaInicio: '08:00', horaFin: '17:00' });

  useEffect(() => {
    fetchApi('/Practitioner')
      .then((data: any) => {
        const entries = data.entry || [];
        const practs = entries.map((e: any) => e.resource);
        setPractitioners(practs);
        if (practs.length > 0) {
          setSelectedPractitioner(practs[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedPractitioner) {
      loadSchedules(selectedPractitioner);
    }
  }, [selectedPractitioner]);

  const loadSchedules = async (practitionerId: string) => {
    try {
      const data = await fetchRestApi(`/practitioners/${practitionerId}/schedules`);
      setSchedules(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addSchedule = async () => {
    if (!selectedPractitioner) return;
    try {
      await fetchRestApi(`/practitioners/${selectedPractitioner}/schedules`, {
        method: 'POST',
        body: JSON.stringify({
          diaSemana: newSchedule.diaSemana,
          horaInicio: newSchedule.horaInicio + ':00',
          horaFin: newSchedule.horaFin + ':00'
        })
      });
      loadSchedules(selectedPractitioner);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      await fetchRestApi(`/practitioners/schedules/${scheduleId}`, { method: 'DELETE' });
      loadSchedules(selectedPractitioner);
    } catch (e) {
      console.error(e);
    }
  };

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--primary)]" />
          Ajustes Médicos
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Médico</label>
          <select 
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            value={selectedPractitioner}
            onChange={e => setSelectedPractitioner(e.target.value)}
          >
            {practitioners.map(p => (
              <option key={p.id} value={p.id}>
                {p.name?.[0]?.text || 'Médico ' + p.id}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-500" />
          Horario Laboral
        </h3>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Día de la semana</label>
            <select 
              className="p-2 border border-gray-300 rounded-md bg-white"
              value={newSchedule.diaSemana}
              onChange={e => setNewSchedule({...newSchedule, diaSemana: parseInt(e.target.value)})}
            >
              {dias.map((d, i) => <option key={i} value={i+1}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hora Inicio</label>
            <input 
              type="time" 
              className="p-2 border border-gray-300 rounded-md bg-white"
              value={newSchedule.horaInicio}
              onChange={e => setNewSchedule({...newSchedule, horaInicio: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Hora Fin</label>
            <input 
              type="time" 
              className="p-2 border border-gray-300 rounded-md bg-white"
              value={newSchedule.horaFin}
              onChange={e => setNewSchedule({...newSchedule, horaFin: e.target.value})}
            />
          </div>
          <button 
            onClick={addSchedule}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>

        <div className="space-y-3">
          {schedules.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay horarios configurados para este médico. Rechazará todas las citas por defecto.</p>
          ) : (
            schedules.map(sch => (
              <div key={sch.id} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-md shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full text-sm font-medium">
                    {dias[sch.diaSemana - 1]}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {sch.horaInicio.substring(0,5)} - {sch.horaFin.substring(0,5)}
                  </div>
                </div>
                <button 
                  onClick={() => deleteSchedule(sch.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
