import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    // Esto llamará a la API FHIR interna cuando el backend esté encendido
    fetchApi('/fhir/Patient')
      .then(data => {
        if(data && Array.isArray(data)) setPatients(data);
      })
      .catch(err => console.error("API Error (ignorar si el backend está apagado):", err));
  }, []);

  return (
    <div className="bg-surface-lowest rounded-xl shadow-sm border border-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Directorio de Pacientes</h2>
        <button className="bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary-container transition-colors">
          + Nuevo Paciente
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Folio</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Nombre (FHIR)</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Teléfono</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  No hay pacientes registrados o el backend no está corriendo.
                </td>
              </tr>
            ) : (
              patients.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm">{p.identifier?.[0]?.value || '-'}</td>
                  <td className="py-3 px-4 text-sm font-medium text-primary">
                    {p.name?.[0]?.text || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">{p.telecom?.[0]?.value || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
