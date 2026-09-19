import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { UserPlus, Search, UserCircle } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form state
  const [nombres, setNombres] = useState('');
  const [apPaterno, setApPaterno] = useState('');
  const [apMaterno, setApMaterno] = useState('');
  const [codigo, setCodigo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [nacimiento, setNacimiento] = useState('');

  const loadPatients = async () => {
    try {
      const data = await fetchApi('/fhir/Patient');
      if (data && Array.isArray(data)) {
        setPatients(data);
      } else if (data && data.entry) { // Handle FHIR Bundle
        setPatients(data.entry.map((e: any) => e.resource));
      }
    } catch (err) {
      console.error("Error cargando pacientes:", err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // FHIR Patient Payload
    const payload = {
      resourceType: "Patient",
      active: true,
      name: [
        {
          use: "official",
          text: `${nombres} ${apPaterno} ${apMaterno}`.trim(),
          family: apPaterno,
          given: [nombres, apMaterno].filter(Boolean)
        }
      ],
      identifier: codigo ? [{ use: "official", value: codigo }] : [],
      telecom: [
        ...(telefono ? [{ system: "phone", value: telefono, use: "mobile" }] : []),
        ...(email ? [{ system: "email", value: email, use: "home" }] : [])
      ],
      birthDate: nacimiento || null
    };

    try {
      await fetchApi('/fhir/Patient', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setShowForm(false);
      setNombres(''); setApPaterno(''); setApMaterno('');
      setCodigo(''); setTelefono(''); setEmail(''); setNacimiento('');
      loadPatients();
    } catch (err) {
      console.error("Error guardando paciente:", err);
      alert("Error al guardar el paciente. Revisa la consola.");
    }
  };

  const filteredPatients = patients.filter(p => {
    const name = p.name?.[0]?.text?.toLowerCase() || '';
    const phone = p.telecom?.find((t:any) => t.system === 'phone')?.value || '';
    const searchLower = search.toLowerCase();
    return name.includes(searchLower) || phone.includes(searchLower);
  });

  return (
    <section className="panel active">
      <div className="page-head">
        <div>
          <div className="page-title">Pacientes</div>
          <div className="page-desc">Expediente básico y contacto</div>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <UserPlus className="ic" /> Nuevo paciente
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre(s) *</label>
                <input type="text" required placeholder="Ej. María" value={nombres} onChange={e => setNombres(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Apellido paterno</label>
                <input type="text" placeholder="Ej. López" value={apPaterno} onChange={e => setApPaterno(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Apellido materno</label>
                <input type="text" placeholder="Ej. García" value={apMaterno} onChange={e => setApMaterno(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Código / ID (4 dígitos)</label>
                <input type="text" maxLength={4} placeholder="0001" value={codigo} onChange={e => setCodigo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Teléfono (WhatsApp)</label>
                <input type="tel" placeholder="33 1234 5678" value={telefono} onChange={e => setTelefono(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Fecha de nacimiento</label>
                <input type="date" value={nacimiento} onChange={e => setNacimiento(e.target.value)} />
              </div>
            </div>
            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button type="submit" className="btn btn-secondary">Guardar paciente</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <UserCircle className="ic" /> Lista de pacientes
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Buscar por nombre o teléfono..." 
              style={{ maxWidth: '220px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {!showForm && (
              <button className="btn btn-secondary" onClick={() => setShowForm(true)}>
                + Nuevo Paciente
              </button>
            )}
          </div>
        </div>
        
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Folio</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <Search className="ic mx-auto" />
                      <p>No se encontraron pacientes.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id}>
                    <td>{p.identifier?.[0]?.value || '-'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.name?.[0]?.text || '-'}</td>
                    <td>{p.telecom?.find((t:any) => t.system === 'phone')?.value || '-'}</td>
                    <td>
                      <span className={`chip ${p.active ? 'chip-success' : 'chip-neutral'}`}>
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
    </section>
  );
}
