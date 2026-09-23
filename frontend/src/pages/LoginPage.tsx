import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building, Lock } from 'lucide-react';

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
      localStorage.setItem('klinikpro_jwt', data.token);
      
      // Simulate load for UX
      setTimeout(() => navigate('/dashboard'), 400);
      
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased flex items-center justify-center min-h-screen">
      <main className="w-full flex items-center justify-center p-4">
        <div className="flex flex-col w-full max-w-5xl mx-auto my-auto p-2 sm:p-4">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl shadow-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/30">
            
            {/* Left Panel: Branding & Infra */}
            <div className="lg:col-span-5 bg-primary text-on-primary p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-secondary-container opacity-10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-56 h-56 bg-tertiary opacity-10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-surface-container-lowest rounded-xl p-2 flex items-center justify-center shadow-sm">
                    <img src="/KlinikaproLogo.svg" alt="KlinikPro Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="font-label-sm uppercase tracking-wider text-inverse-primary opacity-80">Plataforma Médica</span>
                    <h1 className="font-headline-md font-bold">KlinikPro</h1>
                  </div>
                </div>
                
                <div className="space-y-2 mb-12">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-container font-label-sm border border-secondary-container/30">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    Enterprise Core Ready
                  </span>
                  <h2 className="font-headline-lg text-white mt-4">Sistema de Gestión Clínica Integral</h2>
                  <p className="text-sm text-inverse-primary opacity-90 mt-2 leading-relaxed">
                    Orquestación de diagnósticos, flujo de pacientes y telemetría multi-sede bajo estándares hospitalarios HL7/FHIR.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="font-label-sm uppercase tracking-wider text-inverse-primary opacity-75">Arquitectura Activa</p>
                  
                  <div className="flex items-start gap-3 bg-primary-container/40 p-3 rounded-xl backdrop-blur-sm border border-primary-container/50">
                    <Shield className="w-5 h-5 text-secondary-container shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Seguridad JWT Stateless</p>
                      <p className="text-xs text-inverse-primary opacity-80 mt-0.5">Sesiones criptográficas sin estado con rotación automática.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-primary-container/40 p-3 rounded-xl backdrop-blur-sm border border-primary-container/50">
                    <Building className="w-5 h-5 text-secondary-container shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Multi-tenant & Multi-sucursal</p>
                      <p className="text-xs text-inverse-primary opacity-80 mt-0.5">Aislamiento lógico de datos por organización médica.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="lg:col-span-7 bg-surface-container-lowest p-8 lg:p-14 flex flex-col justify-center relative">
              <div className="w-full max-w-sm mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-2">Acceso a Sucursal</h2>
                  <p className="text-sm text-on-surface-variant">Introduce tus credenciales institucionales para acceder a la base de datos de pacientes.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 animate-fade-in">
                    <span className="material-symbols-outlined text-error text-xl shrink-0 mt-0.5">error</span>
                    <p className="text-sm text-error font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-outline tracking-wider uppercase mb-1.5">Tenant / Código Clínica</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="text"
                        value={tenantSlug}
                        onChange={e => setTenantSlug(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-outline tracking-wider uppercase mb-1.5">Email Especialista</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">mail</span>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-outline tracking-wider uppercase mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-primary hover:bg-primary-container text-white rounded-xl text-sm font-semibold shadow-sm shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-[20px]">login</span>
                      )}
                      {loading ? 'Verificando...' : 'Autenticar y Entrar'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 text-center border-t border-outline-variant/30 pt-6">
                  <p className="text-xs text-outline font-medium">CytoHelix Identity Provider v2.1.0</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
