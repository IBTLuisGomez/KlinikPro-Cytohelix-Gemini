import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, LogOut, Stethoscope, DollarSign } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const tenantId = localStorage.getItem('tenant_id');

  const handleLogout = () => {
    localStorage.removeItem('tenant_id');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-container flex">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-secondary" />
          <h2 className="text-xl font-bold">KlinikPro</h2>
        </div>
        
        <div className="px-6 py-2 text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
          Tenant: {tenantId?.substring(0,8)}...
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Calendar className="w-5 h-5" />
            Agenda
          </Link>
          <Link to="/dashboard/patients" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <Users className="w-5 h-5" />
            Pacientes
          </Link>
          <Link to="/dashboard/finances" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            <DollarSign className="w-5 h-5" />
            Finanzas
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/20 text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Salir
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-surface-lowest shadow-sm h-16 flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">Panel Principal</h1>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
