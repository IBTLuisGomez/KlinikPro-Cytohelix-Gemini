import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Search, Edit2, Trash2, X, Phone, Mail } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  active: boolean;
  phone?: string;
  email?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/Patient');
      const entries = data.entry || [];
      const parsed = entries.map((e: any) => ({
        id: e.resource.id,
        name: e.resource.name?.[0]?.text || 'Sin nombre',
        active: e.resource.active,
        phone: e.resource.telecom?.find((t: any) => t.system === 'phone')?.value,
        email: e.resource.telecom?.find((t: any) => t.system === 'email')?.value,
      }));
      setPatients(parsed);
    } catch (err) {
      console.error('Error cargando pacientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({ name: patient.name, phone: patient.phone || '', email: patient.email || '' });
    } else {
      setEditingPatient(null);
      setFormData({ name: '', phone: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        resourceType: 'Patient',
        active: true,
        name: [{ use: 'official', text: formData.name }],
        telecom: []
      };
      
      if (editingPatient) {
        payload.id = editingPatient.id;
      }
      
      if (formData.phone) payload.telecom.push({ system: 'phone', value: formData.phone });
      if (formData.email) payload.telecom.push({ system: 'email', value: formData.email });

      await fetchApi('/Patient', {
        method: 'POST', // Usamos POST como upsert segun backend logic actual
        body: JSON.stringify(payload)
      });
      
      await loadPatients();
      handleCloseModal();
    } catch (err) {
      console.error('Error guardando paciente:', err);
      alert('Error al guardar el paciente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desactivar este paciente?')) return;
    try {
      await fetchApi(`/Patient/${id}`, { method: 'DELETE' });
      await loadPatients();
    } catch (err) {
      console.error(err);
      alert('Error eliminando paciente');
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-on-surface">Directorio de Pacientes</h1>
          <p className="font-body-sm text-outline">Gestión de expedientes clínicos FHIR y demográficos.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Nuevo Paciente
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-container-lowest p-2 rounded-xl border border-outline-variant/30 flex items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder:text-outline"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-outline">
            <span className="material-symbols-outlined animate-spin text-3xl mb-2">progress_activity</span>
            <p className="text-sm">Cargando directorio...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-outline bg-surface-container-low rounded-2xl border border-outline-variant/30 border-dashed">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
            <p className="text-sm font-medium">No se encontraron pacientes</p>
          </div>
        ) : (
          filteredPatients.map(p => (
            <div key={p.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-5 hover:border-primary/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-on-surface leading-tight">{p.name}</h3>
                    <span className="text-[10px] text-outline uppercase tracking-wider font-semibold">ID: {p.id.substring(0,8)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(p)} className="p-1.5 text-outline hover:text-primary rounded-md hover:bg-primary/5 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-outline hover:text-error rounded-md hover:bg-error/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Phone className="w-3.5 h-3.5 text-outline" />
                  {p.phone || <span className="italic text-outline-variant">Sin teléfono</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Mail className="w-3.5 h-3.5 text-outline" />
                  {p.email || <span className="italic text-outline-variant">Sin email</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant/30 bg-surface-container-low/50">
              <h2 className="font-headline-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  {editingPatient ? 'edit_document' : 'person_add'}
                </span>
                {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button onClick={handleCloseModal} className="p-1 text-outline hover:text-error rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block font-label-sm text-outline mb-1.5">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block font-label-sm text-outline mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ej. +52 123 456 7890"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-label-sm text-outline mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Ej. juan@correo.com"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/30 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-outline hover:text-on-surface transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>}
                  {saving ? 'Guardando...' : 'Guardar Expediente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
