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
<div className="flex flex-col w-full gap-space-lg">

<section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-lg shadow-sm">
<div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none"></div>
<div className="absolute right-40 -bottom-20 w-64 h-64 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="flex flex-col gap-1">
<div className="flex items-center gap-space-xs text-outline">
<span className="material-symbols-outlined text-[16px] text-primary">local_hospital</span>
<span className="font-label-md text-label-md uppercase tracking-wider text-primary">Operaciones Diarias • Cytohelix Clinical Network</span>
<span className="mx-1 text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-outline" id="current-live-date">{today}</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Panel de Control — Clínica Cytohelix <span className="font-headline-sm text-headline-sm text-outline font-normal">(Sucursal Norte #01)</span>
</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          Supervisión en tiempo real de box de atención, triaje ambulatorio, flujo de caja y sincronización clínica.
        </p>
</div>

<div className="flex flex-wrap items-center gap-space-xs">
<div className="flex items-center gap-2 px-space-md py-1.5 rounded-full bg-surface-container-low shadow-sm">
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface leading-none">Spring Boot Microservices</span>
<span className="font-label-sm text-label-sm text-tertiary leading-none mt-0.5">API :8081 en línea (9ms)</span>
</div>
</div>
<div className="flex items-center gap-2 px-space-md py-1.5 rounded-full bg-surface-container-low shadow-sm">
<span className="material-symbols-outlined text-primary text-[18px]">database</span>
<div className="flex flex-col">
<span className="font-label-sm text-label-sm text-on-surface leading-none">PostgreSQL v16 HA Cluster</span>
<span className="font-label-sm text-label-sm text-primary leading-none mt-0.5">Sincronización Activa</span>
</div>
</div>
<button className="h-9 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">refresh</span>
<span className="hidden sm:inline">Actualizar</span>
</button>
</div>
</div>
</section>

<section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">

<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Volumen de Pacientes</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Citas de Hoy</h2>
</div>
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">calendar_today</span>
</div>
</div>
<div className="mt-space-md flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">{kpis.citasPendientes}</span>
<span className="font-body-md text-body-md text-outline">programadas</span>
<span className="ml-auto inline-flex items-center text-tertiary bg-surface-container-high px-2 py-0.5 rounded-full font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px] mr-0.5">trending_up</span>+12% ayer
        </span>
</div>
<div className="mt-space-md pt-space-xs">
<div className="grid grid-cols-3 gap-1 text-center bg-surface-container-low p-1.5 rounded-lg">
<div className="flex flex-col">
<span className="font-metric-num text-headline-sm text-tertiary">14</span>
<span className="font-label-sm text-label-sm text-outline">Atendidas</span>
</div>
<div className="flex flex-col">
<span className="font-metric-num text-headline-sm text-on-secondary-fixed-variant">8</span>
<span className="font-label-sm text-label-sm text-outline">En Espera</span>
</div>
<div className="flex flex-col">
<span className="font-metric-num text-headline-sm text-primary">6</span>
<span className="font-label-sm text-label-sm text-outline">Pendientes</span>
</div>
</div>
</div>
</div>

<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Padrón Clínico</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Pacientes Activos</h2>
</div>
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">groups</span>
</div>
</div>
<div className="mt-space-md flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">1,420</span>
<span className="inline-flex items-center text-tertiary font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded-full">
          +35 nuevos este mes
        </span>
</div>
<div className="mt-space-md flex flex-col gap-1.5">
<div className="flex justify-between items-center text-outline font-label-sm text-label-sm">
<span className="">Expedientes digitalizados</span>
<span className="text-on-surface font-headline-sm text-label-md">98.2%</span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-tertiary-container rounded-full" style={{"width":"98.2%"}}></div>
</div>
</div>
</div>

<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Cierre Diario</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Ingresos en Caja</h2>
</div>
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">point_of_sale</span>
</div>
</div>
<div className="mt-space-md flex items-baseline gap-1">
<span className="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">$2,850.00</span>
<span className="font-body-sm text-body-sm text-outline ml-1">USD</span>
</div>
<div className="mt-space-md flex flex-col gap-1.5">
<div className="flex justify-between items-center font-label-sm text-label-sm">
<span className="text-outline">Meta diurna: $3,500.00</span>
<span className="text-primary font-headline-sm text-label-md">81.4%</span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
<div className="h-full bg-primary rounded-full transition-all duration-500" style={{"width":"81.4%"}}></div>
</div>
</div>
</div>

<div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Capacidad Asistencial</span>
<h2 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Ocupación Boxes</h2>
</div>
<div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[22px]">meeting_room</span>
</div>
</div>
<div className="mt-space-md flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-on-surface tracking-tight leading-none">88%</span>
<span className="font-body-md text-body-md text-outline">7 / 8 Salas en uso</span>
</div>
<div className="mt-space-md flex items-center justify-between pt-1">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">timer</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">T. Promedio: <strong className="text-on-surface font-headline-sm">42 min</strong></span>
</div>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span> 1 libre
        </span>
</div>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

<section className="lg:col-span-8 flex flex-col gap-space-md">
<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm border-b-0">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">calendar_view_day</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Agenda de Pacientes para Hoy</h3>
<p className="font-body-sm text-body-sm text-outline">Turnos programados, llamadas a consultorio y telemetría de estancia</p>
</div>
</div>

<div className="flex items-center gap-space-xs">
<div className="inline-flex p-0.5 rounded-xl bg-surface-container-low">
<button className="px-3 py-1 text-on-surface font-headline-sm text-label-md rounded-lg bg-surface-container-lowest shadow-sm" type="button">Todos (28)</button>
<button className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-headline-sm text-label-md rounded-lg" type="button">En Espera (8)</button>
<button className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-headline-sm text-label-md rounded-lg" type="button">En Box (7)</button>
</div>
</div>
</div>

<div className="overflow-x-auto -mx-space-lg">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
<th className="py-2.5 px-space-lg text-left">Hora</th>
<th className="py-2.5 px-space-md text-left">Paciente</th>
<th className="py-2.5 px-space-md text-left">Especialidad / Terapia</th>
<th className="py-2.5 px-space-md text-left">Especialista</th>
<th className="py-2.5 px-space-md text-center">Box</th>
<th className="py-2.5 px-space-md text-left">Estado</th>
<th className="py-2.5 px-space-lg text-right">Acciones</th>
</tr>
</thead>
<tbody className="divide-y-0 text-on-surface font-body-sm text-body-sm">

<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-lg font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
                  09:00 <span className="block font-label-sm text-label-sm text-outline font-normal">Hace 22 min</span>
</td>
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<img />
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-body-md text-on-surface truncate">Carlos Mendoza V.</span>
<span className="font-label-sm text-label-sm text-primary">#0048 • 46a</span>
</div>
</div>
</td>
<td className="py-3 px-space-md">
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-on-surface">Fisioterapia Lumbar</span>
<span className="font-label-sm text-label-sm text-outline">Sesión 4 / 10 • Electroterapia</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="text-on-surface">Lic. Rodrigo Alba</span>
<span className="block font-label-sm text-label-sm text-outline">Kinesiólogo</span>
</td>
<td className="py-3 px-space-md text-center">
<span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container font-headline-sm text-label-md text-on-surface">Box 03</span>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
                    En Consulta
                  </span>
</td>
<td className="py-3 px-space-lg text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" title="Llamar a Box" type="button">
<span className="material-symbols-outlined text-[15px]">campaign</span>
<span className="">Llamar</span>
</button>
<button className="h-7 px-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors shadow-sm" title="Abrir Ficha Clínica" type="button">
<span className="material-symbols-outlined text-[15px]">clinical_notes</span>
<span className="">Ficha</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-lg font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
                  09:30 <span className="block font-label-sm text-label-sm text-outline font-normal">Llegó hace 10 min</span>
</td>
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<img />
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-body-md text-on-surface truncate">Elena Rostova M.</span>
<span className="font-label-sm text-label-sm text-primary">#0102 • 62a</span>
</div>
</div>
</td>
<td className="py-3 px-space-md">
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-on-surface">Traumatología Rodilla</span>
<span className="font-label-sm text-label-sm text-outline">Evaluación post-artroscopía</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="text-on-surface">Dr. Marcos Véliz</span>
<span className="block font-label-sm text-label-sm text-outline">Cirujano Ortopedista</span>
</td>
<td className="py-3 px-space-md text-center">
<span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container-low text-outline font-headline-sm text-label-md">Box 01</span>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-secondary-fixed-variant font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
                    En Sala de Espera
                  </span>
</td>
<td className="py-3 px-space-lg text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button className="h-7 px-2.5 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">notifications_active</span>
<span className="">Llamar a Box</span>
</button>
<button className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">clinical_notes</span>
<span className="">Ficha</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors group opacity-85">
<td className="py-3 px-space-lg font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
                  08:15 <span className="block font-label-sm text-label-sm text-outline font-normal">Finalizó 08:55</span>
</td>
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<img />
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-body-md text-on-surface truncate">Mateo Benítez</span>
<span className="font-label-sm text-label-sm text-outline">#0019 • 29a</span>
</div>
</div>
</td>
<td className="py-3 px-space-md">
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-on-surface">Kinesiología Deportiva</span>
<span className="font-label-sm text-label-sm text-outline">Readaptación manguito rotador</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="text-on-surface">Lic. Rodrigo Alba</span>
<span className="block font-label-sm text-label-sm text-outline">Kinesiólogo</span>
</td>
<td className="py-3 px-space-md text-center">
<span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container-low text-outline font-headline-sm text-label-md">Box 03</span>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Completada
                  </span>
</td>
<td className="py-3 px-space-lg text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<span className="font-label-sm text-label-sm text-outline mr-1">Alta diurna</span>
<button className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">description</span>
<span className="">Informe</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-lg font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
                  10:15 <span className="block font-label-sm text-label-sm text-outline font-normal">En 35 min</span>
</td>
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-full bg-surface-container text-primary flex items-center justify-center font-headline-sm text-label-md">
                      SG
                    </div>
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-body-md text-on-surface truncate">Sofía Guzmán Ortiz</span>
<span className="font-label-sm text-label-sm text-primary">#0214 • 34a</span>
</div>
</div>
</td>
<td className="py-3 px-space-md">
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-on-surface">Reumatología Clínica</span>
<span className="font-label-sm text-label-sm text-outline">Control biológico y ecografía</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="text-on-surface">Dra. Sarah Jenkins</span>
<span className="block font-label-sm text-label-sm text-outline">Reumatóloga</span>
</td>
<td className="py-3 px-space-md text-center">
<span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container-low font-headline-sm text-label-md text-on-surface">Box 05</span>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px]">event_available</span>
                    Confirmada SMS
                  </span>
</td>
<td className="py-3 px-space-lg text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">clinical_notes</span>
<span className="">Historial</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors group">
<td className="py-3 px-space-lg font-headline-sm text-headline-sm text-on-surface whitespace-nowrap">
                  09:10 <span className="block font-label-sm text-label-sm text-outline font-normal">Hace 12 min</span>
</td>
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-container flex items-center justify-center font-headline-sm text-label-md">
                      JR
                    </div>
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-body-md text-on-surface truncate">Jorge Ramírez Prieto</span>
<span className="font-label-sm text-label-sm text-primary">#0091 • 53a</span>
</div>
</div>
</td>
<td className="py-3 px-space-md">
<div className="flex flex-col">
<span className="font-headline-sm text-body-sm text-on-surface">Terapia Ocupacional</span>
<span className="font-label-sm text-label-sm text-outline">Rehabilitación motriz fina</span>
</div>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="text-on-surface">Lic. Claudia Solís</span>
<span className="block font-label-sm text-label-sm text-outline">Terapeuta</span>
</td>
<td className="py-3 px-space-md text-center">
<span className="inline-block px-2.5 py-1 rounded-lg bg-surface-container font-headline-sm text-label-md text-on-surface">Box 06</span>
</td>
<td className="py-3 px-space-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-tertiary-container animate-ping"></span>
                    En Consulta
                  </span>
</td>
<td className="py-3 px-space-lg text-right whitespace-nowrap">
<div className="flex items-center justify-end gap-1">
<button className="h-7 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[15px]">campaign</span>
<span className="">Llamar</span>
</button>
<button className="h-7 px-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm flex items-center gap-1 transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined text-[15px]">clinical_notes</span>
<span className="">Ficha</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs text-outline font-body-sm text-body-sm">
<span className="">Mostrando 5 de 28 citas programadas para el turno matutino</span>
<div className="flex items-center gap-space-xs">
<button className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm disabled:opacity-50" disabled type="button">Anterior</button>
<span className="px-2 font-label-sm text-label-sm text-on-surface">1 / 6</span>
<button className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm" type="button">Siguiente</button>
</div>
</div>
</div>

<div className="bg-gradient-to-r from-primary via-primary-container to-secondary p-space-lg rounded-xl text-on-primary shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-surface-container-lowest/15 backdrop-blur-md flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[28px]">speed</span>
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-on-primary">Modo de Alta Velocidad para Admisión Médica</h4>
<p className="font-body-sm text-body-sm text-on-primary-container">Escanear código de barras de orden médica física o presionar F9 para registro express.</p>
</div>
</div>
<div className="flex items-center gap-space-xs">
<button className="h-9 px-space-md rounded-xl bg-surface-container-lowest text-primary font-headline-sm text-headline-sm hover:bg-surface-container transition-colors shadow-sm whitespace-nowrap" type="button">
            Escanear DNI / Ficha
          </button>
</div>
</div>
</section>

<section className="lg:col-span-4 flex flex-col gap-space-md">

<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">door_front</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Boxes y Terapia (1-8)</h3>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary">
            7 Ocupados
          </span>
</div>
<p className="font-body-sm text-body-sm text-outline">Monitor de consultorios y terapeutas activos en piso 1</p>

<div className="grid grid-cols-2 gap-space-xs mt-space-xs">

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 01</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Dr. Marcos Véliz</span>
<span className="font-body-sm text-body-sm text-outline truncate">Elena R. (#0102)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 02</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Dra. M. Carvajal</span>
<span className="font-body-sm text-body-sm text-outline truncate">Raúl Morales (#0087)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 03</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Lic. Rodrigo Alba</span>
<span className="font-body-sm text-body-sm text-outline truncate">Carlos M. (#0048)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 04</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Lic. F. Pezoa</span>
<span className="font-body-sm text-body-sm text-outline truncate">Lorena D. (#0198)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 05</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Dra. Sarah Jenkins</span>
<span className="font-body-sm text-body-sm text-outline truncate">Preparación / Exp.</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 06</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Lic. Claudia Solís</span>
<span className="font-body-sm text-body-sm text-outline truncate">Jorge R. (#0091)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-0.5 hover:bg-surface-container transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 07</span>
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<span className="font-label-sm text-label-sm text-primary truncate">Dra. Ana Bravo</span>
<span className="font-body-sm text-body-sm text-outline truncate">Felipe Toro (#0062)</span>
</div>

<div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-0.5 hover:bg-surface-container-high transition-colors">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface font-semibold">Box 08</span>
<span className="w-2 h-2 rounded-full bg-outline"></span>
</div>
<span className="font-label-sm text-label-sm text-tertiary font-semibold">DISPONIBLE</span>
<span className="font-body-sm text-body-sm text-outline truncate">Higienizado • Libre</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-error text-[20px]">warning</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Alertas &amp; Pendientes</h3>
</div>
<span className="w-5 h-5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm flex items-center justify-center font-bold">
            3
          </span>
</div>
<div className="flex flex-col gap-space-xs mt-space-xs">

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">draw</span>
</div>
<div className="flex flex-col min-w-0 flex-1">
<span className="font-headline-sm text-body-sm text-on-surface truncate">3 Expedientes sin firma digital</span>
<span className="font-label-sm text-label-sm text-outline">Turno tarde anterior • Dr. Véliz / Dra. Bravo</span>
<a className="font-label-sm text-label-sm text-primary hover:underline mt-1 font-semibold" href="#">Firmar con Token PKI →</a>
</div>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-on-secondary-fixed-variant shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">payments</span>
</div>
<div className="flex flex-col min-w-0 flex-1">
<span className="font-headline-sm text-body-sm text-on-surface truncate">2 Copagos pendientes en recepción</span>
<span className="font-label-sm text-label-sm text-outline">Paciente #0198 y #0062 por validar Isapre/Fonasa</span>
<a className="font-label-sm text-label-sm text-primary hover:underline mt-1 font-semibold" href="#">Ir a Caja y Facturación →</a>
</div>
</div>

<div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm">
<div className="w-7 h-7 rounded-md bg-surface-container flex items-center justify-center text-error shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[16px]">inventory_2</span>
</div>
<div className="flex flex-col min-w-0 flex-1">
<span className="font-headline-sm text-body-sm text-on-surface truncate">Stock crítico: Gel Conductivo &amp; Agujas</span>
<span className="font-label-sm text-label-sm text-outline">Quedan 2 unidades en Box 03 y Sala de Fisioterapia</span>
<a className="font-label-sm text-label-sm text-primary hover:underline mt-1 font-semibold" href="#">Generar Requisición →</a>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Flujo de Caja Matutino</h3>
</div>
<span className="font-label-sm text-label-sm text-tertiary bg-surface-container-high px-2 py-0.5 rounded-full">
            Turno AM
          </span>
</div>
<div className="flex flex-col gap-space-sm mt-space-xs">

<div className="space-y-space-xs">
<div className="flex items-center justify-between py-1 border-b-0">
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[18px] text-outline">credit_card</span>
<span className="">Tarjeta Crédito / Débito (POS)</span>
</div>
<span className="font-metric-num text-headline-sm text-on-surface">$1,720.00</span>
</div>
<div className="flex items-center justify-between py-1 border-b-0">
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[18px] text-outline">payments</span>
<span className="">Efectivo en Caja Fuerte</span>
</div>
<span className="font-metric-num text-headline-sm text-on-surface">$680.00</span>
</div>
<div className="flex items-center justify-between py-1">
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[18px] text-outline">sync_alt</span>
<span className="">Transferencia Bancaria Directa</span>
</div>
<span className="font-metric-num text-headline-sm text-on-surface">$450.00</span>
</div>
</div>

<div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Total Recaudado Hoy</span>
<span className="font-headline-md text-headline-md text-primary font-bold">$2,850.00 USD</span>
</div>
<button className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-label-md flex items-center gap-1 transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">receipt</span>
<span className="">Corte Parcial</span>
</button>
</div>
</div>
</div>
</section>
</div>
</div>

  );
}
