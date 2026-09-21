import { useState } from 'react';
import { DollarSign, FileText, Upload } from 'lucide-react';

export default function PosPage() {
  const [activeTab, setActiveTab] = useState('ingresos');

  return (
    <section className="panel active">
      <div className="page-head">
        <div>
          <div className="page-title">Caja y Finanzas</div>
          <div className="page-desc">Cobros, gastos y arqueo diario</div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button 
          className={`pb-2 px-1 font-medium text-sm transition-colors ${activeTab === 'ingresos' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('ingresos')}
        >
          Ingresos
        </button>
        <button 
          className={`pb-2 px-1 font-medium text-sm transition-colors ${activeTab === 'gastos' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('gastos')}
        >
          Gastos
        </button>
        <button 
          className={`pb-2 px-1 font-medium text-sm transition-colors ${activeTab === 'arqueo' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-800'}`}
          onClick={() => setActiveTab('arqueo')}
        >
          Arqueo
        </button>
      </div>

      {activeTab === 'ingresos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <DollarSign className="ic text-secondary" /> Registrar Cobro
              </div>
            </div>
            <form>
              <div className="form-grid">
                <div className="form-group span2">
                  <label>ID Paciente</label>
                  <input type="text" placeholder="UUID del Paciente" />
                </div>
                <div className="form-group span2">
                  <label>Servicio / Concepto</label>
                  <input type="text" placeholder="Ej. Consulta General" />
                </div>
                <div className="form-group">
                  <label>Forma de Pago</label>
                  <select>
                    <option>Efectivo</option>
                    <option>Tarjeta (Terminal)</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Monto</label>
                  <input type="number" placeholder="$ 0.00" />
                </div>
              </div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary">Procesar Pago</button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <FileText className="ic" /> Resumen del Día
              </div>
            </div>
            <div className="p-8 text-center text-slate-500 flex flex-col items-center">
              <Upload className="mb-4 opacity-50" size={32} />
              <p>Módulo Financiero (Pendiente desarrollo Backend)</p>
              <span className="text-xs mt-2">La lógica de pagos mixtos, cajas chicas y facturación se implementará en Java.</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="card">
          <div className="p-8 text-center text-slate-500">Módulo de Gastos en construcción.</div>
        </div>
      )}

      {activeTab === 'arqueo' && (
        <div className="card">
          <div className="p-8 text-center text-slate-500">Módulo de Arqueo y Cierre de Caja en construcción.</div>
        </div>
      )}
    </section>
  );
}
