import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, CreditCard, Banknote, Search } from 'lucide-react';
import { fetchApi, fetchRestApi } from '../api/client';

export default function PosPage() {
  const [activeTab, setActiveTab] = useState('ingresos');
  
  // States for form
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  
  // States for feedback
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchApi('/Patient')
      .then((data: any) => {
        if (data.entry) {
          setPatients(data.entry.map((e: any) => e.resource));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handlePayment = async () => {
    if (!selectedPatientId || !amount) {
      alert("Selecciona paciente e ingresa un monto.");
      return;
    }
    
    setLoading(true);
    setSuccessMsg('');
    try {
      await fetchRestApi('/finances/pos/pay', {
        method: 'POST',
        body: JSON.stringify({
          patientId: selectedPatientId,
          amount: parseFloat(amount),
          paymentMethod: paymentMethod
        })
      });
      setSuccessMsg('¡Pago registrado con éxito y factura generada!');
      setAmount('');
    } catch (e) {
      alert("Error procesando pago.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="font-headline-lg text-on-surface">Caja y Facturación</h1>
          <p className="font-body-sm text-on-surface-variant">Gestión de ingresos, métodos de pago y comprobantes clínicos.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
          <button 
            onClick={() => setActiveTab('ingresos')}
            className={`px-4 py-1.5 rounded-md font-label-sm uppercase transition-colors ${
              activeTab === 'ingresos' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-outline hover:text-on-surface'
            }`}
          >
            Registrar Cobro
          </button>
          <button 
            onClick={() => setActiveTab('gastos')}
            className={`px-4 py-1.5 rounded-md font-label-sm uppercase transition-colors ${
              activeTab === 'gastos' ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-outline hover:text-on-surface'
            }`}
          >
            Gastos Operativos
          </button>
        </div>
      </div>

      {activeTab === 'ingresos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Payment Form */}
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
                {/* Patient Selection */}
                <div>
                  <label className="block font-label-sm text-outline mb-1.5">Paciente (FHIR Record)</label>
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
                  {/* Amount */}
                  <div>
                    <label className="block font-label-sm text-outline mb-1.5">Monto (MXN)</label>
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

                  {/* Payment Method */}
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

          {/* Quick Summary Sidebar */}
          <div className="col-span-1 lg:col-span-5 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-6">
              <h3 className="font-label-md text-outline uppercase tracking-wider mb-4">Módulo Financiero</h3>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-3xl text-outline">account_balance_wallet</span>
                </div>
                <p className="font-headline-sm text-on-surface mb-1">Caja Abierta</p>
                <p className="text-xs text-on-surface-variant max-w-xs">
                  Los cobros se registran inmediatamente en la base de datos centralizada de PostgreSQL.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-10 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-outline mb-3">construction</span>
          <h2 className="font-headline-sm text-on-surface mb-1">Módulo en Construcción</h2>
          <p className="text-sm text-outline">El registro de gastos operativos estará disponible en la Fase 4.</p>
        </div>
      )}
    </div>
  );
}
