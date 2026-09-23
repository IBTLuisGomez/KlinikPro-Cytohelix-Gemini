
export default function ClinicalRecordPage() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="font-headline-lg text-on-surface">Ficha Clínica y Consulta</h1>
          <p className="font-body-sm text-outline">Gestión de diagnósticos, notas de evolución y recetas médicas.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-10 flex flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined text-4xl text-outline mb-3">monitor_heart</span>
        <h2 className="font-headline-sm text-on-surface mb-1">Módulo en Construcción</h2>
        <p className="text-sm text-outline">El expediente clínico electrónico estará disponible en la Fase 5.</p>
      </div>
    </div>
  );
}
