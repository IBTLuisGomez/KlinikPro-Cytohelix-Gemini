import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { Search, Edit2, X, Phone, Mail } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  active: boolean;
  phone?: string;
  email?: string;
  birthDate?: string;
  codigo?: string;
  especialistaId?: string;
  tratanteId?: string;
  aseguradora?: boolean;
  derivacion?: boolean;
  notas?: string;
}

interface Practitioner {
  id: string;
  name: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apPaterno: '',
    apMaterno: '',
    codigo: '',
    phone: '',
    email: '',
    birthDate: '',
    especialistaId: '',
    tratanteId: '',
    aseguradora: false,
    derivacion: false,
    notas: ''
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patData, pracData] = await Promise.all([
        fetchApi('/Patient'),
        fetchApi('/Practitioner')
      ]);
      
      const pEntries = patData.entry || [];
      const parsedPat = pEntries.map((e: any) => {
        const res = e.resource;
        const codeId = res.identifier?.find((i: any) => i.system?.includes('patient-code'))?.value || '';
        
        const ext = res.extension || [];
        const getExtBool = (urlFragment: string) => ext.find((x:any) => x.url?.includes(urlFragment))?.valueBoolean || false;
        const getExtStr = (urlFragment: string) => ext.find((x:any) => x.url?.includes(urlFragment))?.valueString || '';

        return {
          id: res.id,
          name: res.name?.[0]?.text || 'Sin nombre',
          active: res.active,
          codigo: codeId,
          phone: res.telecom?.find((t: any) => t.system === 'phone')?.value,
          email: res.telecom?.find((t: any) => t.system === 'email')?.value,
          birthDate: res.birthDate,
          especialistaId: res.generalPractitioner?.[0]?.reference?.split('/')[1] || '',
          tratanteId: res.generalPractitioner?.[1]?.reference?.split('/')[1] || '',
          aseguradora: getExtBool('aseguradora'),
          derivacion: getExtBool('derivacion'),
          notas: getExtStr('notas')
        };
      });
      setPatients(parsedPat);

      const prEntries = pracData.entry || [];
      setPractitioners(prEntries.map((e: any) => ({
        id: e.resource.id,
        name: e.resource.name?.[0]?.text || 'Sin nombre'
      })));

    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (patient?: Patient) => {
    if (patient) {
      setEditingPatient(patient);
      // Intentar separar el nombre
      const parts = patient.name.split(' ');
      const nombres = parts.length > 2 ? parts.slice(0, parts.length - 2).join(' ') : parts[0] || '';
      const apPaterno = parts.length > 1 ? parts[parts.length - (parts.length > 2 ? 2 : 1)] : '';
      const apMaterno = parts.length > 2 ? parts[parts.length - 1] : '';

      setFormData({ 
        nombres, apPaterno, apMaterno,
        codigo: patient.codigo || '',
        phone: patient.phone || '', 
        email: patient.email || '',
        birthDate: patient.birthDate || '',
        especialistaId: patient.especialistaId || '',
        tratanteId: patient.tratanteId || '',
        aseguradora: patient.aseguradora || false,
        derivacion: patient.derivacion || false,
        notas: patient.notas || ''
      });
    } else {
      setEditingPatient(null);
      setFormData({ 
        nombres: '', apPaterno: '', apMaterno: '', codigo: '', phone: '', email: '', 
        birthDate: '', especialistaId: '', tratanteId: '', aseguradora: false, derivacion: false, notas: '' 
      });
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
      const telecom = [];
      if (formData.phone) telecom.push({ system: 'phone', value: formData.phone });
      if (formData.email) telecom.push({ system: 'email', value: formData.email });

      const generalPractitioner = [];
      if (formData.especialistaId) generalPractitioner.push({ reference: 'Practitioner/' + formData.especialistaId });
      if (formData.tratanteId) {
        // Asegurar que si hay tratante pero no especialista, mantengamos el index 1
        if (!formData.especialistaId) generalPractitioner.push({ reference: 'Practitioner/00000000-0000-0000-0000-000000000000' });
        generalPractitioner.push({ reference: 'Practitioner/' + formData.tratanteId });
      }

      const extensions = [
        { url: 'http://cytohelix.systems/fhir/StructureDefinition/patient-aseguradora', valueBoolean: formData.aseguradora },
        { url: 'http://cytohelix.systems/fhir/StructureDefinition/patient-derivacion', valueBoolean: formData.derivacion }
      ];
      if (formData.notas) {
        extensions.push({ url: 'http://cytohelix.systems/fhir/StructureDefinition/patient-notas', valueString: formData.notas } as any);
      }

      const fullName = [formData.nombres, formData.apPaterno, formData.apMaterno].filter(Boolean).join(' ');

      const payload: any = {
        resourceType: 'Patient',
        id: editingPatient ? editingPatient.id : undefined,
        active: true,
        name: [{ use: 'official', text: fullName }],
        telecom,
        birthDate: formData.birthDate || undefined,
        generalPractitioner: generalPractitioner.length ? generalPractitioner : undefined,
        extension: extensions,
        identifier: formData.codigo ? [{ system: 'http://cytohelix.systems/fhir/patient-code', value: formData.codigo }] : undefined
      };
      
      await fetchApi('/Patient', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error('Error guardando paciente:', err);
      alert('Hubo un error al guardar el paciente.');
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone && p.phone.includes(searchTerm)) ||
    (p.codigo && p.codigo.includes(searchTerm))
  );

  return (
    <div className="flex flex-col gap-space-lg w-full">
      {/* Header */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Directorio de Pacientes</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Gestión centralizada de expedientes y datos de contacto.
            </p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-10 px-space-md rounded-xl bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary-container font-label-md flex items-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Nuevo Paciente
          </button>
        </div>
      </section>

      {/* Lista */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col border border-outline-variant/30">
        <div className="p-space-md border-b border-outline-variant/30 flex items-center gap-4 bg-surface-container-lowest/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input 
              type="text" 
              placeholder="Buscar por ID, nombre o teléfono..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container border border-outline-variant/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-outline-variant/30">
                <th className="py-3 px-4 font-label-sm text-outline font-medium">ID / CÓDIGO</th>
                <th className="py-3 px-4 font-label-sm text-outline font-medium">PACIENTE</th>
                <th className="py-3 px-4 font-label-sm text-outline font-medium">CONTACTO</th>
                <th className="py-3 px-4 font-label-sm text-outline font-medium text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-outline">
                    <span className="material-symbols-outlined animate-spin text-3xl">sync</span>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-outline">No se encontraron pacientes.</td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-metric-num text-sm text-on-surface-variant bg-surface-container py-1 px-2 rounded-md">
                        {p.codigo || '----'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-headline-sm text-on-surface">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {p.phone ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant">
                            <Phone className="w-3.5 h-3.5 text-outline" /> {p.phone}
                          </span>
                        ) : null}
                        {p.email ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant">
                            <Mail className="w-3.5 h-3.5 text-outline" /> {p.email}
                          </span>
                        ) : null}
                        {!p.phone && !p.email && <span className="text-sm text-outline italic">Sin contacto</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenModal(p)}
                          className="p-2 rounded-lg text-outline hover:text-primary hover:bg-primary-container/30 transition-colors"
                          title="Editar Paciente"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal / Panel Lateral de Edición */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-lowest/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">person</span>
                <h2 className="font-headline-md text-on-surface">{editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
              </div>
              <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-surface-container transition-colors text-outline">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="formPaciente" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Nombre(s) *</label>
                    <input type="text" required value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="Ej. María" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Apellido paterno</label>
                    <input type="text" value={formData.apPaterno} onChange={e => setFormData({...formData, apPaterno: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="Ej. López" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Apellido materno</label>
                    <input type="text" value={formData.apMaterno} onChange={e => setFormData({...formData, apMaterno: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="Ej. García" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Código / ID (4 dígitos)</label>
                    <input type="text" maxLength={4} value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="0001" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Teléfono (WhatsApp)</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="33 1234 5678" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Correo</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Fecha de nacimiento</label>
                    <input type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Especialista</label>
                    <select value={formData.especialistaId} onChange={e => setFormData({...formData, especialistaId: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent text-sm">
                      <option value="">— Sin asignar —</option>
                      {practitioners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-on-surface-variant">Tratante</label>
                    <select value={formData.tratanteId} onChange={e => setFormData({...formData, tratanteId: e.target.value})} className="h-10 px-3 rounded-xl border border-outline-variant bg-transparent text-sm">
                      <option value="">— Sin asignar —</option>
                      {practitioners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-3 flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.aseguradora} onChange={e => setFormData({...formData, aseguradora: e.target.checked})} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                      <span className="font-body-sm text-on-surface">Viene de aseguradora</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.derivacion} onChange={e => setFormData({...formData, derivacion: e.target.checked})} className="w-4 h-4 rounded text-primary focus:ring-primary" />
                      <span className="font-body-sm text-on-surface">Viene por derivación</span>
                    </label>
                  </div>

                  <div className="md:col-span-3 flex flex-col gap-1.5 mt-2">
                    <label className="font-label-sm text-on-surface-variant">Notas clínicas</label>
                    <textarea value={formData.notas} onChange={e => setFormData({...formData, notas: e.target.value})} className="p-3 rounded-xl border border-outline-variant bg-transparent min-h-[80px] text-sm" placeholder="Diagnóstico, alergias, observaciones..."></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-lowest/50">
              <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-sm font-semibold text-outline hover:bg-surface-container transition-colors">
                Cancelar
              </button>
              <button form="formPaciente" type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50 flex items-center gap-2">
                {saving ? <span className="material-symbols-outlined animate-spin text-[16px]">sync</span> : 'Guardar paciente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
