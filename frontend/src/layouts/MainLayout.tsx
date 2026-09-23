import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, DollarSign, Settings, LogOut, Menu, X, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', path: '/dashboard', icon: Home },
    { name: 'Directorio', path: '/patients', icon: Users },
    { name: 'Ficha Clínica', path: '/records', icon: ClipboardList },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Caja y Pagos', path: '/pos', icon: DollarSign },
    { name: 'Ajustes', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-surface overflow-hidden text-on-surface font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container-lowest border-r border-outline-variant/30 shadow-sm z-20">
        <div className="h-16 flex items-center px-6 border-b border-outline-variant/30">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/KlinikaproLogo.svg" alt="KlinikPro Logo" className="w-full h-full object-contain" />
          </div>
          <div className="ml-3 flex flex-col">
            <span className="font-bold text-sm text-on-surface tracking-tight leading-tight">KlinikPro</span>
            <span className="text-[10px] uppercase font-semibold text-primary tracking-wider">CytoHelix</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-2 mb-2">
            <span className="text-[10px] uppercase font-bold text-outline tracking-wider">Módulos</span>
          </div>
          
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-outline'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs border border-white">
              DR
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-semibold truncate text-on-surface">Dr. Admin</span>
              <span className="text-[11px] text-outline truncate">admin@cytohelix.com</span>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('klinikpro_jwt');
              window.location.href = '/login';
            }}
            className="w-full mt-3 flex items-center gap-2 justify-center px-3 py-2 text-xs font-semibold text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-4 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center">
              <img src="/KlinikaproLogo.svg" alt="KlinikPro Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-sm text-on-surface">KlinikPro</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-on-surface-variant">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-14 inset-x-0 bg-surface-container-lowest border-b border-outline-variant/30 z-30 shadow-lg shadow-black/5 animate-fade-in">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold ${
                    currentPath === item.path ? 'bg-primary/10 text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
              <div className="pt-2 mt-2 border-t border-outline-variant/30">
                <button 
                  onClick={() => {
                    localStorage.removeItem('klinikpro_jwt');
                    window.location.href = '/login';
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-error/80 hover:bg-error/10"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto bg-surface relative">
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
