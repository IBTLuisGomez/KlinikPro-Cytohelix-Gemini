
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, DollarSign, TrendingUp, Settings } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isSaving = false; // Simulate saving state for future Redux hook

  return (
    <>
      <header className="appbar">
        <div className="brand">
          <div className="brand-logo-icon bg-primary rounded-full flex items-center justify-center">
            {/* Minimal SVG placeholder for brand */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">KlinikPro</span>
            <span className="brand-sub">por CytoHelix Systems</span>
          </div>
        </div>
        <div className="save-indicator">
          <span className={`save-dot ${isSaving ? 'saving' : ''}`}></span>
          {isSaving ? 'Guardando...' : 'Guardado local'}
        </div>
      </header>

      <main id="mainContent">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${currentPath === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
          <Home className="ic w-6 h-6" />
          <span className="lb">Inicio</span>
        </button>
        <button className={`nav-btn ${currentPath === '/dashboard/patients' ? 'active' : ''}`} onClick={() => navigate('/dashboard/patients')}>
          <Users className="ic w-6 h-6" />
          <span className="lb">Pacientes</span>
        </button>
        <button className={`nav-btn ${currentPath === '/dashboard/agenda' ? 'active' : ''}`} onClick={() => navigate('/dashboard/agenda')}>
          <Calendar className="ic w-6 h-6" />
          <span className="lb">Agenda</span>
        </button>
        <button className={`nav-btn ${currentPath === '/dashboard/pos' ? 'active' : ''}`} onClick={() => navigate('/dashboard/pos')}>
          <DollarSign className="ic w-6 h-6" />
          <span className="lb">Caja</span>
        </button>
        <button className={`nav-btn ${currentPath === '/dashboard/finances' ? 'active' : ''}`} onClick={() => navigate('/dashboard/finances')}>
          <TrendingUp className="ic w-6 h-6" />
          <span className="lb">Finanzas</span>
        </button>
        <button className={`nav-btn ${currentPath === '/dashboard/settings' ? 'active' : ''}`} onClick={() => navigate('/dashboard/settings')}>
          <Settings className="ic w-6 h-6" />
          <span className="lb">Ajustes</span>
        </button>
      </nav>
    </>
  );
}
