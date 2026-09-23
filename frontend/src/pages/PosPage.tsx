import { useState, useEffect } from 'react';
import { Search, DollarSign, Banknote, CreditCard, CheckCircle } from 'lucide-react';
import { fetchApi, fetchRestApi } from '../api/client';

export default function PosPage() {
  const [activeTab, setActiveTab] = useState('registro'); // 'registro', 'historial', 'gastos'
  const [patients, setPatients] = useState<any[]>([]);
  
  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // History State
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/Patient').then((data: any) => {
      setPatients(data.entry ? data.entry.map((e: any) => e.resource) : []);
    });
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await fetchRestApi('/pos/invoices');
      setInvoices(data || []);
    } catch (e) {
      console.error('Error fetching invoices:', e);
    }
  };

  const handlePayment = async () => {
    if (!selectedPatientId || !amount) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await fetchRestApi('/pos/checkout', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          amount: parseFloat(amount),
          paymentMethod: paymentMethod,
          concept: 'Consulta Clínica'
        })
      });
      if (res.id) {
        setSuccessMsg(`¡Cobro registrado! Folio #${res.id}`);
        setAmount('');
        setSelectedPatientId('');
        loadInvoices();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      {/* Header (Mismo estilo que Stitch) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-bold tracking-wide">
                Turno Abierto
             </span>
             <span className="text-label-sm text-outline">Caja Principal • 08:00 - 18:00</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Caja y Facturación Diaria</h1>
          <p className="font-body-sm text-body-sm text-outline">Gestión de cobros, emisión de comprobantes y cuadre de caja.</p>
        </div>
        
        {/* Métricas Rápidas (Stitch UI) */}
        <div className="flex gap-4">
           <div className="flex flex-col items-end">
              <span className="text-label-sm text-outline uppercase tracking-wider">Ingresos Hoy</span>
              <span className="font-headline-md text-primary">$ {(invoices.reduce((acc, inv) => acc + inv.totalAmount, 0)).toFixed(2)}</span>
           </div>
           <div className="w-px bg-outline-variant/30 hidden sm:block"></div>
           <div className="flex flex-col items-end">
              <span className="text-label-sm text-outline uppercase tracking-wider">Transacciones</span>
              <span className="font-headline-md text-on-surface">{invoices.length}</span>
           </div>
        </div>
      </div>

      {/* Navegación por Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant/30 pb-2">
        <button 
           className={`pb-2 px-1 font-headline-sm transition-colors ${activeTab === 'registro' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}
           onClick={() => setActiveTab('registro')}
        >
           Registro de Pagos
        </button>
        <button 
           className={`pb-2 px-1 font-headline-sm transition-colors ${activeTab === 'historial' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}
           onClick={() => setActiveTab('historial')}
        >
           Recibos e Historial (Stitch)
        </button>
        <button 
           className={`pb-2 px-1 font-headline-sm transition-colors ${activeTab === 'gastos' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}
           onClick={() => setActiveTab('gastos')}
        >
           Gastos Operativos
        </button>
      </div>

      {/* TAB 1: Registro de Cobro */}
      {activeTab === 'registro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <div className="col-span-1 lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">point_of_sale</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-on-surface">Procesar Nuevo Pago</h2>
                <p className="font-body-sm text-outline">Seleccione el paciente y el monto a cobrar.</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {successMsg && (
                <div className="p-4 bg-tertiary-container/20 border border-tertiary/30 rounded-xl flex items-center gap-3 text-tertiary">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-label-md">{successMsg}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-outline mb-1.5">Paciente (Búsqueda FHIR)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <select 
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                    >
                      <option value="">Buscar o seleccionar paciente...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name?.[0]?.text || 'Paciente Sin Nombre'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-outline mb-1.5">Monto (Local)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-sm text-outline mb-1.5">Método de Pago</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('CASH')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 border rounded-lg transition-all ${
                          paymentMethod === 'CASH' 
                            ? 'bg-primary/5 border-primary text-primary' 
                            : 'border-outline-variant/50 text-outline hover:bg-surface-container-low'
                        }`}
                      >
                        <Banknote className="w-5 h-5 mb-1" />
                        <span className="text-[10px] uppercase font-bold">Efectivo</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('CARD')}
                        className={`flex-1 flex flex-col items-center justify-center py-2 border rounded-lg transition-all ${
                          paymentMethod === 'CARD' 
                            ? 'bg-primary/5 border-primary text-primary' 
                            : 'border-outline-variant/50 text-outline hover:bg-surface-container-low'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 mb-1" />
                        <span className="text-[10px] uppercase font-bold">Tarjeta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
                <button 
                  type="button" 
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  )}
                  {loading ? 'Procesando...' : 'Emitir Factura y Cobrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Historial Visual (Stitch) */}
      {activeTab === 'historial' && (
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-2.5 px-4 rounded-tl-lg">Folio / Hora</th>
                  <th className="py-2.5 px-4">Paciente (ID)</th>
                  <th className="py-2.5 px-4">Concepto</th>
                  <th className="py-2.5 px-4">Método</th>
                  <th className="py-2.5 px-4 text-right">Monto Bruto</th>
                  <th className="py-2.5 px-4 text-center">Estado</th>
                  <th className="py-2.5 px-4 text-right rounded-tr-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-outline font-body-sm">
                      No hay transacciones registradas hoy.
                    </td>
                  </tr>
                ) : invoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-headline-sm text-headline-sm text-primary">#REC-{inv.id}</span>
                      <span className="block font-label-sm text-label-sm text-outline">10:45 AM</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                         {patients.find(p => p.id === inv.patientId)?.name?.[0]?.text || 'Paciente Eliminado'}
                      </span>
                      <span className="block font-label-sm text-label-sm text-outline">#{inv.patientId.split('-')[0]}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-on-surface">Consulta Clínica</span>
                      <span className="block font-label-sm text-label-sm text-primary">Atención general</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">
                           {inv.payments?.[0]?.paymentMethod === 'CARD' ? 'credit_card' : 'payments'}
                        </span>
                        {inv.payments?.[0]?.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-headline-sm text-headline-sm text-on-surface">
                      ${inv.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface">
                          <span className="material-symbols-outlined text-[16px]">print</span>
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-surface-container hover:bg-error-container/40 flex items-center justify-center text-error">
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

            {/* TAB 3: Gastos */}
      {activeTab === 'gastos' && (
        <div className="animate-fade-in">
          <h2 className="font-headline-sm mb-4">Registrar Gasto Operativo</h2>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm mb-6">
            <form id="formGasto" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-on-surface-variant">Categoría</label>
                <select id="gastoCategoria" className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent">
                  <option value="111e4567-e89b-12d3-a456-426614174000">Insumos Médicos</option>
                  <option value="111e4567-e89b-12d3-a456-426614174000">Arriendo</option>
                  <option value="111e4567-e89b-12d3-a456-426614174000">Retiro de Socios</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-on-surface-variant">Monto</label>
                <input id="gastoMonto" type="number" step="0.01" className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="0.00" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-on-surface-variant">Método de Pago</label>
                <select id="gastoMetodoPago" className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent">
                  <option value="CASH">Efectivo (Caja Fuerte)</option>
                  <option value="CARD">Tarjeta / Débito</option>
                  <option value="TRANSFER">Transferencia Bancaria</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-on-surface-variant">Proveedor (Opcional)</label>
                <input id="gastoProveedor" type="text" className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="Ej: Distribuidora Med" />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="font-label-sm text-on-surface-variant">Descripción</label>
                <input id="gastoDescripcion" type="text" className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="Motivo del gasto" required />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="button" onClick={() => {
                    const btn = document.getElementById('btnRegistrarGasto');
                    if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">sync</span> Registrando...';
                    
                    const formData = {
                      categoryId: (document.getElementById('gastoCategoria') as HTMLSelectElement).value,
                      amount: parseFloat((document.getElementById('gastoMonto') as HTMLInputElement).value),
                      paymentMethod: (document.getElementById('gastoMetodoPago') as HTMLSelectElement).value,
                      provider: (document.getElementById('gastoProveedor') as HTMLInputElement).value,
                      description: (document.getElementById('gastoDescripcion') as HTMLInputElement).value
                    };
                    
                    fetch('http://localhost:8080/api/pos/expenses', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
                      },
                      body: JSON.stringify(formData)
                    }).then(res => {
                      if (res.ok) {
                        alert('Gasto registrado con éxito');
                        (document.getElementById('formGasto') as HTMLFormElement).reset();
                      } else {
                        res.json().then(e => alert('Error al registrar gasto: ' + e.message)).catch(() => alert('Error'));
                      }
                      if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">receipt_long</span> Registrar Gasto';
                    });
                }} id="btnRegistrarGasto" className="h-10 px-6 rounded-xl bg-error hover:bg-error/90 text-on-error font-label-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Registrar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}