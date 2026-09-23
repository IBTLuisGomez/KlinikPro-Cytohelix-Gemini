import { useState } from 'react';

export default function ClinicalRecordPage() {
  const [note, setNote] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [statusMsg, setStatusMsg] = useState('');

  const handleSaveNote = async () => {
    setStatusMsg('Guardando...');
    try {
      const token = localStorage.getItem('token');
      // En un entorno real se obtendría el ID del paciente activo o de la URL.
      // Usamos dummy uuids para validacion
      const payload = {
        patientId: '333e4567-e89b-12d3-a456-426614174000',
        practitionerId: '333e4567-e89b-12d3-a456-426614174000',
        subjective: note.subjective,
        objective: note.objective,
        assessment: note.assessment,
        plan: note.plan,
        status: 'SIGNED'
      };

      const res = await fetch('http://localhost:8080/api/clinical/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error al guardar');
      setStatusMsg('Nota Firmada Correctamente ✅');
      setNote({ subjective: '', objective: '', assessment: '', plan: '' });
    } catch (e) {
      console.error(e);
      setStatusMsg('Error al guardar nota ❌');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-bold tracking-wide">
                Consulta en Curso
             </span>
             <span className="text-label-sm text-outline">#ENC-HOY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Ficha Clínica y Evolución</h1>
          <p className="font-body-sm text-body-sm text-outline">Paciente: Registro Abierto</p>
        </div>
        {statusMsg && (
          <span className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md">
            {statusMsg}
          </span>
        )}
      </div>

      {/* Grid Principal (2 Columnas: SOAP y Metricas) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
         <div className="xl:col-span-8 flex flex-col gap-4">
             {/* Formulario SOAP */}
             <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
                <form className="flex flex-col gap-4">
                   
                   {/* SUBJETIVO */}
                   <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-surface-container-low transition-colors focus-within:bg-surface-container">
                      <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 font-headline-sm text-on-surface">
                            <span className="w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">S</span>
                            <span>Subjetivo (Motivo de Consulta)</span>
                         </label>
                      </div>
                      <textarea
                         value={note.subjective}
                         onChange={(e) => setNote({...note, subjective: e.target.value})}
                         className="w-full bg-transparent text-on-surface text-body-md focus:outline-none resize-none placeholder-outline leading-relaxed"
                         placeholder="El paciente refiere dolor o malestar en..."
                         rows={3}
                      />
                   </div>

                   {/* OBJETIVO */}
                   <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-surface-container-low transition-colors focus-within:bg-surface-container">
                      <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 font-headline-sm text-on-surface">
                            <span className="w-6 h-6 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm">O</span>
                            <span>Objetivo (Exploración Física)</span>
                         </label>
                      </div>
                      <textarea
                         value={note.objective}
                         onChange={(e) => setNote({...note, objective: e.target.value})}
                         className="w-full bg-transparent text-on-surface text-body-md focus:outline-none resize-none placeholder-outline leading-relaxed"
                         placeholder="Signos vitales, hallazgos de exploración física..."
                         rows={3}
                      />
                   </div>

                   {/* ANALISIS */}
                   <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-surface-container-low transition-colors focus-within:bg-surface-container">
                      <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 font-headline-sm text-on-surface">
                            <span className="w-6 h-6 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-sm">A</span>
                            <span>Análisis / Evaluación</span>
                         </label>
                      </div>
                      <textarea
                         value={note.assessment}
                         onChange={(e) => setNote({...note, assessment: e.target.value})}
                         className="w-full bg-transparent text-on-surface text-body-md focus:outline-none resize-none placeholder-outline leading-relaxed"
                         placeholder="Diagnóstico clínico presuntivo o definitivo..."
                         rows={3}
                      />
                   </div>

                   {/* PLAN */}
                   <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-surface-container-low transition-colors focus-within:bg-surface-container">
                      <div className="flex items-center justify-between">
                         <label className="flex items-center gap-2 font-headline-sm text-on-surface">
                            <span className="w-6 h-6 rounded-lg bg-inverse-primary text-on-primary-fixed flex items-center justify-center font-bold text-sm">P</span>
                            <span>Plan de Tratamiento</span>
                         </label>
                      </div>
                      <textarea
                         value={note.plan}
                         onChange={(e) => setNote({...note, plan: e.target.value})}
                         className="w-full bg-transparent text-on-surface text-body-md focus:outline-none resize-none placeholder-outline leading-relaxed"
                         placeholder="Prescripciones médicas, próximos estudios, indicaciones domiciliarias..."
                         rows={3}
                      />
                   </div>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                   <div className="flex gap-2">
                       <button className="h-10 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm flex items-center gap-2 transition-colors">
                          <span className="material-symbols-outlined text-[20px] text-primary">attach_file</span>
                          Adjuntar Estudio
                       </button>
                   </div>
                   <button onClick={handleSaveNote} className="h-10 px-6 rounded-xl bg-tertiary text-on-tertiary font-headline-sm flex items-center gap-2 hover:opacity-95 shadow-md transition-all">
                      <span className="material-symbols-outlined text-[20px]">draw</span>
                      Firmar y Guardar Nota Clínica
                   </button>
                </div>
             </div>
         </div>

         {/* Barra Lateral: Mediciones Biométricas */}
         <div className="xl:col-span-4 flex flex-col gap-6">
             <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm flex flex-col gap-4 border border-outline-variant/30">
                 <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-2xl">straighten</span>
                     <h3 className="font-headline-sm text-on-surface">Mediciones Biométricas</h3>
                 </div>
                 
                 {/* Widget Flexión */}
                 <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                     <div className="flex flex-col">
                         <span className="font-label-sm text-outline uppercase tracking-wider">Flexión Rodilla</span>
                         <div className="flex items-baseline gap-2 mt-1">
                             <span className="text-3xl font-bold text-on-surface">115°</span>
                             <span className="text-sm font-bold text-tertiary flex items-center">
                                 <span className="material-symbols-outlined text-sm">arrow_upward</span>+10°
                             </span>
                         </div>
                     </div>
                 </div>

                 {/* Widget Fuerza */}
                 <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                     <div className="flex flex-col">
                         <span className="font-label-sm text-outline uppercase tracking-wider">Fuerza Muscular</span>
                         <div className="flex items-baseline gap-2 mt-1">
                             <span className="text-3xl font-bold text-on-surface">4</span>
                             <span className="text-sm text-outline font-bold">/ 5 Escala Daniels</span>
                         </div>
                     </div>
                     <div className="flex gap-1">
                        <span className="w-2.5 h-6 rounded bg-primary"></span>
                        <span className="w-2.5 h-6 rounded bg-primary"></span>
                        <span className="w-2.5 h-6 rounded bg-primary"></span>
                        <span className="w-2.5 h-6 rounded bg-primary"></span>
                        <span className="w-2.5 h-6 rounded bg-surface-container-high"></span>
                     </div>
                 </div>
                 
             </div>
         </div>
      </div>
    </div>
  );
}
