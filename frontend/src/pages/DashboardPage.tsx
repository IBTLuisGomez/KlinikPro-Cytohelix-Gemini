import { useState, useEffect } from 'react';
import { fetchRestApi } from '../api/client';

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    pacientesHoy: 0,
    citasPendientes: 0,
    ingresosHoy: 0,
    gastosHoy: 0
  });

  useEffect(() => {
    fetchRestApi('/dashboard/kpis')
      .then(data => setKpis(data))
      .catch(err => console.error(err));
  }, []);

  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 lg:gap-8 animate-fade-in">
      
      {/* Header / Operational Masthead */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-sm border border-outline-variant/20">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-20 w-64 h-64 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-outline">
              <span className="material-symbols-outlined text-[18px] text-primary">local_hospital</span>
              <span className="font-label-sm uppercase tracking-wider text-primary">Operaciones Diarias</span>
              <span className="mx-1 text-outline-variant">•</span>
              <span className="font-label-sm text-outline capitalize">{today}</span>
            </div>
            <h1 className="font-headline-lg text-on-surface">
              Panel de Control <span className="font-headline-sm text-outline font-normal">KlinikPro</span>
            </h1>
            <p className="font-body-sm text-on-surface-variant max-w-xl">
              Supervisión en tiempo real de citas, atención a pacientes, flujo de caja y estado del sistema.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-on-surface leading-none mb-0.5">Microservicios Java</span>
                <span className="text-[10px] text-tertiary font-bold uppercase leading-none">API En línea</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Bento Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        
        {/* Pacientes Hoy */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">groups</span>
            </div>
          </div>
          <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Pacientes Atendidos Hoy</p>
          <div className="flex items-baseline gap-2">
            <span className="font-metric-num text-3xl text-on-surface">{kpis.pacientesHoy}</span>
          </div>
        </div>

        {/* Citas Pendientes */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">event_upcoming</span>
            </div>
            <span className="font-label-sm px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Agenda</span>
          </div>
          <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Citas Pendientes</p>
          <div className="flex items-baseline gap-2">
            <span className="font-metric-num text-3xl text-on-surface">{kpis.citasPendientes}</span>
          </div>
        </div>

        {/* Ingresos Hoy */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="font-label-sm px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary">Ingresos</span>
          </div>
          <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Flujo de Caja (Hoy)</p>
          <div className="flex items-baseline gap-2">
            <span className="font-metric-num text-3xl text-tertiary">
              ${kpis.ingresosHoy.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="font-label-sm text-outline">MXN</span>
          </div>
        </div>

        {/* Gastos Hoy */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
          </div>
          <p className="font-label-sm text-outline uppercase tracking-wider mb-1">Gastos / Egresos (Hoy)</p>
          <div className="flex items-baseline gap-2">
            <span className="font-metric-num text-3xl text-on-surface">
              ${kpis.gastosHoy.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="font-label-sm text-outline">MXN</span>
          </div>
        </div>

      </section>
    </div>
  );
}
