import React from 'react';

export default function AgendaPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface-lowest rounded-xl shadow-sm border border-slate-100 p-6 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-slate-800 mb-2">Calendario Médico</h2>
          <p className="text-slate-500 text-sm">El motor anti-colisiones validará los cruces de horario al guardar.</p>
        </div>
      </div>
      
      <div className="bg-surface-lowest rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Próximas Citas (Hoy)</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-surface-dim border-l-4 border-secondary">
            <p className="text-sm font-medium text-slate-800">10:00 AM - Consulta General</p>
            <p className="text-xs text-slate-500">Dr. Martínez</p>
          </div>
          <div className="p-4 rounded-lg bg-surface-dim border-l-4 border-primary">
            <p className="text-sm font-medium text-slate-800">11:30 AM - Revisión Quirúrgica</p>
            <p className="text-xs text-slate-500">Dra. Gómez</p>
          </div>
        </div>
      </div>
    </div>
  );
}
