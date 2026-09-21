import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [tenantSlug, setTenantSlug] = useState('demo');
  const [email, setEmail] = useState('admin@demo.klinikpro');
  const [password, setPassword] = useState('klinikpro123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantSlug, email, password })
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o clínica no encontrada');
      }

      const data = await response.json();
      
      // Guardar el JWT en local storage para que api/client.ts lo utilice
      localStorage.setItem('klinikpro_jwt', data.token);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--surface-container-low)' }}>
      <div className="card w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="brand-logo-icon bg-primary rounded-full flex items-center justify-center mx-auto mb-4" style={{ width: 56, height: 56 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-1">KlinikPro SaaS</h1>
          <p className="text-sm text-slate-500">Acceso Seguro para Profesionales</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-md text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label>ID de Clínica (Tenant Slug)</label>
            <input 
              type="text" 
              required
              value={tenantSlug} 
              onChange={e => setTenantSlug(e.target.value)}
              placeholder="Ej. demo"
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@clinica.com"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-secondary w-full mt-4" 
            disabled={loading}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión Segura'}
          </button>
        </form>
      </div>
    </div>
  );
}
