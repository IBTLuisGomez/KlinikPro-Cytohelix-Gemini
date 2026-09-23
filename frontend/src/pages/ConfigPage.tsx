import { useState, useEffect } from 'react';
import { fetchApi, fetchRestApi } from '../api/client';

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('rbac');
  
  // RBAC State
  
  
  
  // Schedule State
  const [practitioners, setPractitioners] = useState<any[]>([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<string>('');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [newSchedule, setNewSchedule] = useState({ diaSemana: 1, horaInicio: '08:00', horaFin: '17:00' });

  useEffect(() => {
    // Cargar Doctores
    fetchApi('/Practitioner')
      .then((data: any) => {
        const entries = data.entry || [];
        const practs = entries.map((e: any) => e.resource);
        setPractitioners(practs);
        if (practs.length > 0) {
          setSelectedPractitioner(practs[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedPractitioner) {
      loadSchedules(selectedPractitioner);
    }
  }, [selectedPractitioner]);

  const loadSchedules = async (practitionerId: string) => {
    try {
      const data = await fetchRestApi(`/practitioners/${practitionerId}/schedules`);
      setSchedules(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 rounded-full bg-error/10 text-error text-label-sm font-bold tracking-wide">
                Zona Restringida
             </span>
             <span className="text-label-sm text-outline">Nivel Director / Admin</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Configuración y Seguridad</h1>
          <p className="font-body-sm text-body-sm text-outline">Gestión de usuarios (RBAC), sucursales y horarios de especialistas.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30">
        <button 
           className={`pb-2 px-1 font-headline-sm transition-colors ${activeTab === 'rbac' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}
           onClick={() => setActiveTab('rbac')}
        >
           Roles y Accesos (RBAC)
        </button>
        <button 
           className={`pb-2 px-1 font-headline-sm transition-colors ${activeTab === 'schedules' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface'}`}
           onClick={() => setActiveTab('schedules')}
        >
           Horarios Médicos
        </button>
      </div>

      {activeTab === 'rbac' && (
<div className="flex flex-col w-full">

<div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-space-lg mb-space-xl">
<div>
<div className="flex items-center gap-space-sm mb-1.5">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px]">shield</span>
          Flyway V3__auth.sql • Spring Security 6.2
        </span>
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-tertiary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
          RBAC Policy Engine Activo
        </span>
</div>
<h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">Administración de Roles y Control de Acceso (RBAC)</h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-0.5">
        Gestión centralizada de credenciales criptográficas Bcrypt, asignación multisede por Branch ID y privilegios granulares para la plataforma KlinikPro desarrollada por CytoHelix.
      </p>
</div>

<div className="flex flex-wrap items-center gap-space-sm self-start xl:self-auto">
<button className="h-10 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-sm" id="btn-export-matrix" type="button">
<span className="material-symbols-outlined text-[19px]">download</span>
<span>Exportar Auditoría</span>
</button>
<button className="h-10 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-sm" id="btn-open-role-modal" type="button">
<span className="material-symbols-outlined text-[19px]">security</span>
<span>+ Crear Rol Personalizado</span>
</button>
<button className="h-10 px-space-lg rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-md" id="btn-open-user-modal" type="button">
<span className="material-symbols-outlined text-[20px]">person_add</span>
<span>+ Nuevo Usuario / Especialista</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg mb-space-xl">

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="flex items-start justify-between mb-space-md">
<div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">ROLE_ADMIN</span>
</div>
<div className="flex items-baseline justify-between mb-1">
<span className="font-headline-md text-headline-md text-on-surface">Administrador</span>
<span className="font-metric-num text-metric-num text-primary">2 <span className="font-label-sm text-label-sm text-outline font-normal">activos</span></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
        Control total de tenant, configuración global de sucursales, auditoría contable y revocación de JWTs.
      </p>
<div className="pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span> 2FA Forzoso</span>
<span className="text-primary font-semibold cursor-pointer hover:underline">Ver permisos →</span>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="flex items-start justify-between mb-space-md">
<div className="w-10 h-10 rounded-xl bg-secondary-fixed/30 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">supervised_user_circle</span>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed font-bold">ROLE_COORD</span>
</div>
<div className="flex items-baseline justify-between mb-1">
<span className="font-headline-md text-headline-md text-on-surface">Coordinador</span>
<span className="font-metric-num text-metric-num text-secondary">4 <span className="font-label-sm text-label-sm text-outline font-normal">activos</span></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
        Supervisión de agendas clínicas, gestión de boxes, aprobación de altas médicas y cierre diario de caja.
      </p>
<div className="pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-tertiary">domain</span> Multi-Box Sede</span>
<span className="text-secondary font-semibold cursor-pointer hover:underline">Ver permisos →</span>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/20 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="flex items-start justify-between mb-space-md">
<div className="w-10 h-10 rounded-xl bg-surface-container-high text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">medical_services</span>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">ROLE_FISIO</span>
</div>
<div className="flex items-baseline justify-between mb-1">
<span className="font-headline-md text-headline-md text-on-surface">Fisioterapeuta</span>
<span className="font-metric-num text-metric-num text-tertiary">14 <span className="font-label-sm text-label-sm text-outline font-normal">activos</span></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
        Acceso clínico a notas SOAP, historial kinésico, registro biométrico, y emisión de pautas terapéuticas.
      </p>
<div className="pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-tertiary">lock</span> Aislado por Paciente</span>
<span className="text-tertiary font-semibold cursor-pointer hover:underline">Ver permisos →</span>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-surface-dim/40 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
<div className="flex items-start justify-between mb-space-md">
<div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">point_of_sale</span>
</div>
<span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-bold">ROLE_RECEPCION</span>
</div>
<div className="flex items-baseline justify-between mb-1">
<span className="font-headline-md text-headline-md text-on-surface">Recepción / Caja</span>
<span className="font-metric-num text-metric-num text-primary-container">6 <span className="font-label-sm text-label-sm text-outline font-normal">activos</span></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md line-clamp-2">
        Recepción de pacientes, cobro de copagos y bonos Fonasa/Isapre, gestión de citas e impresión de comprobantes.
      </p>
<div className="pt-space-sm flex items-center justify-between font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span> 2FA Forzoso</span>
<span className="text-primary-container font-semibold cursor-pointer hover:underline">Ver permisos →</span>
</div>
</div>
</div>

<div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm mb-space-xl">
<div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-lg mb-space-lg">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[22px]">badge</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Provisionamiento &amp; Matriz Granular de Privilegios</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">
            Configuración de credenciales de acceso Spring Security y persistencia relacional con PostgreSQL.
          </p>
</div>
</div>
<div className="flex items-center gap-space-sm mt-space-md lg:mt-0">
<span className="font-label-sm text-label-sm px-2 py-1 rounded bg-surface-container-low text-outline font-mono">schema: cytohelix_iam_v3</span>
<button className="h-9 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
          Cargar Template por Rol
        </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-md mb-space-xl">
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Nombre y Apellidos</label>
<input className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all" placeholder="Ej: Dr. Fernando Ruiz" type="text" value="Dra. Sarah Jenkins"/>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Correo Institucional (Username)</label>
<div className="relative">
<input className="w-full h-9 pl-space-md pr-8 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all" placeholder="usuario@klinikpro.com" type="email" value="s.jenkins@cytohelix.med"/>
<span className="material-symbols-outlined absolute right-2.5 top-2 text-[16px] text-tertiary">verified_user</span>
</div>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Bcrypt Hash / Credencial</label>
<div className="relative">
<input className="w-full h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all" placeholder="Generar password" type="password" value="••••••••••••••••"/>
<button className="absolute right-2 top-2 text-outline hover:text-primary transition-colors" title="Regenerar temporal" type="button">
<span className="material-symbols-outlined text-[16px]">sync_lock</span>
</button>
</div>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Rol Asignado (Spring Role)</label>
<select className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all">
<option>ROLE_ADMIN (Director)</option>
<option>ROLE_COORD (Coordinación)</option>
<option>ROLE_FISIO (Especialista)</option>
<option>ROLE_RECEPCION (Frontdesk)</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Sucursal (Branch Tenant ID)</label>
<select className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all">
<option>Sucursal Norte #01 (Principal)</option>
<option>Sucursal Sur #02 (Rehabilitación)</option>
<option>Corporativo CytoHelix Global</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Especialidad Clínica</label>
<input className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary transition-all" placeholder="Ej: Traumatología, Suelo Pélvico" type="text" value="Dirección Médica &amp; Fisiatría"/>
</div>
</div>

<div className="bg-surface-container-low rounded-xl p-space-md mb-space-lg">
<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm mb-space-md">
<div>
<span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-primary">rule</span>
            Matriz de Permisos Granulares por Entidad
          </span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Control fino de operaciones CRUD y auditoría para este perfil</span>
</div>
<div className="flex items-center gap-space-xs mt-2 sm:mt-0">
<button className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface text-on-surface font-label-sm text-label-sm transition-colors" id="btn-select-all" type="button">Marcar Todos</button>
<button className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface text-on-surface font-label-sm text-label-sm transition-colors" id="btn-clear-all" type="button">Limpiar</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="text-outline font-label-sm text-label-sm uppercase tracking-wider bg-surface-container/60">
<th className="py-2.5 px-space-md rounded-l-lg">Módulo Funcional</th>
<th className="py-2.5 px-space-sm text-center">Ver / Lectura</th>
<th className="py-2.5 px-space-sm text-center">Crear / Alta</th>
<th className="py-2.5 px-space-sm text-center">Modificar / Editar</th>
<th className="py-2.5 px-space-sm text-center">Eliminar / Revocar</th>
<th className="py-2.5 px-space-sm text-center rounded-r-lg">Exportar / Print</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container font-body-sm text-body-sm text-on-surface">

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-primary">people</span>
<div>
<span className="font-headline-sm text-headline-sm block">Directorio de Pacientes</span>
<span className="font-label-sm text-label-sm text-outline">Padrón de afiliados, datos sociodemográficos y contactos de urgencia</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-secondary">calendar_clock</span>
<div>
<span className="font-headline-sm text-headline-sm block">Agenda y Asignación de Boxes</span>
<span className="font-label-sm text-label-sm text-outline">Calendarios por box kinésico, sobrecupos y bloqueos de agenda</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-tertiary">history_edu</span>
<div>
<span className="font-headline-sm text-headline-sm block">Ficha Clínica &amp; Notas SOAP</span>
<span className="font-label-sm text-label-sm text-outline">Evoluciones fisioterapéuticas, biometría articular y recetas</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-primary-container">receipt_long</span>
<div>
<span className="font-headline-sm text-headline-sm block">Caja, POS &amp; Boletas Electrónicas</span>
<span className="font-label-sm text-label-sm text-outline">Recaudación, bonos de previsión, anulación de pagos y DTE SII</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-secondary">analytics</span>
<div>
<span className="font-headline-sm text-headline-sm block">Analítica de Rendimiento &amp; BI</span>
<span className="font-label-sm text-label-sm text-outline">Tasas de deserción kinésica, productividad por profesional y EBITDA</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>

<tr className="hover:bg-surface-container/40 transition-colors">
<td className="py-3 px-space-md">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-[18px] text-error">tune</span>
<div>
<span className="font-headline-sm text-headline-sm block">Configuración Maestra &amp; Seguridad</span>
<span className="font-label-sm text-label-sm text-outline">Parámetros Spring Security, sucursales, endpoints API e integraciones</span>
</div>
</div>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
<td className="py-3 px-space-sm text-center">
<input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0 accent-primary cursor-pointer" type="checkbox"/>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
<div className="flex items-center gap-2 text-outline font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-tertiary">lock_reset</span>
<span>Requiere firma de auditoría por el usuario autenticado (ID: 001-SARAH)</span>
</div>
<div className="flex items-center gap-space-sm w-full sm:w-auto justify-end">
<button className="h-9 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm transition-colors" type="button">
          Descartar Cambios
        </button>
<button className="h-9 px-space-lg rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center gap-1.5 shadow-sm transition-colors" id="btn-save-user-profile" type="button">
<span className="material-symbols-outlined text-[18px]">save</span>
<span>Guardar &amp; Aplicar Permisos</span>
</button>
</div>
</div>
</div>

<div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm mb-space-xl">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-lg mb-space-md">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Directorio de Usuarios y Especialistas Clínicos</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">
          26 usuarios activos registrados en el clúster multi-tenant CytoHelix KlinikPro.
        </p>
</div>

<div className="flex flex-wrap items-center gap-space-sm">
<div className="relative min-w-[220px]">
<span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[18px]">search</span>
<input className="w-full h-9 pl-9 pr-space-md rounded-xl bg-surface-container-low text-on-surface placeholder-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-all" id="filter-user-search" placeholder="Filtrar por nombre, ID o email..." type="text"/>
</div>
<select className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-all" id="filter-role-select">
<option value="ALL">Todos los Roles</option>
<option value="ADMIN">ADMIN</option>
<option value="COORDINADOR">COORDINADOR</option>
<option value="FISIO">FISIO</option>
<option value="RECEPCION">RECEPCION</option>
</select>
<select className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container transition-all" id="filter-branch-select">
<option value="ALL">Todas las Sucursales</option>
<option value="NORTE">Sucursal Norte #01</option>
<option value="SUR">Sucursal Sur #02</option>
<option value="CORP">Corporativo CytoHelix</option>
</select>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead>
<tr className="text-outline font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-low">
<th className="py-3 px-space-md rounded-l-lg">Usuario / Especialista</th>
<th className="py-3 px-space-md">Rol RBAC</th>
<th className="py-3 px-space-md">Sucursal Asignada</th>
<th className="py-3 px-space-md">Último Acceso (IP &amp; Timestamp)</th>
<th className="py-3 px-space-md">Estado</th>
<th className="py-3 px-space-md text-right rounded-r-lg">Acciones</th>
</tr>
</thead>
<tbody className="divide-y divide-surface-container">

<tr className="hover:bg-surface-container-low/60 transition-colors user-row" data-branch="NORTE" data-role="ADMIN">
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-space-md">
<img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Portrait photography of a female medical director in laboratory coat with stethoscope, clinical clinic environment, soft lighting, professional and focused." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn5Fy-RYwXVnmyfvELbpbzrmkTIPEvjZRbRepHgqFVbr2GV9_EcU9_HasCJhIt2drKLW8R8A0hlNhmu_LDzuCFT6FV_1HPm7nO9ouecyrTa53dUs9UyF9_ezIKfn2OxYOAzgDX_MkPL8rLMidTd5T1ezw-mDz77sLX-pWy4_5nUuKChDBnHmw3UeVQp_DVHHhegAHe4Eo6yBtB0LzEEWFAccKx-2wzlmlfYaIiarMkyUpKU20BJbC_"/>
<div>
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-on-surface">Dra. Sarah Jenkins</span>
<span className="material-symbols-outlined text-primary text-[16px]" title="Verificada por CytoHelix IAM">verified</span>
</div>
<span className="font-label-sm text-label-sm text-outline">s.jenkins@cytohelix.med • Reg: MED-9942</span>
</div>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
                ROLE_ADMIN
              </span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
<span>Sucursal Norte #01</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Tenant: cytohelix-norte</span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Hace 12 min (Activa)</span>
<span className="font-label-sm text-label-sm text-outline font-mono">190.22.45.101 • Santiago, CL</span>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Activo
              </span>
</td>
<td className="py-3.5 px-space-md text-right">
<div className="flex items-center justify-end gap-1">
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Editar permisos" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors" title="Revocar token JWT" type="button">
<span className="material-symbols-outlined text-[18px]">key_off</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Opciones avanzadas" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors user-row" data-branch="NORTE" data-role="COORDINADOR">
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-space-md">
<img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Portrait photography of an experienced male medical coordinator in a modern clinical rehabilitation office with clipboard and tablet, clean cyan accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuABiLPL8pXSx0FhEY7k20Jm1R8_yJD8DmFOj2Sh-KzEXrzsAlnzM2aCQ1xuufdRbbuSDJYtAws1c98nVIiZDmxJeapg68Mbqe41CbQfIG30B_1FOgAGAgsILjpMZ2HoN6OT1fmanACxns4hgBYqHjCDXVpWfMARH7TCmisAYwGAN-RgfeZXey0LnrTA9LRwYqWqTvtohH1UxStqYyNmuG_JdVCgtCpwEYLDvxJql7FlVBGbSNGPc-AZ"/>
<div>
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-on-surface">Dr. Carlos Mendoza</span>
</div>
<span className="font-label-sm text-label-sm text-outline">c.mendoza@klinikpro.com • Reg: KIN-5521</span>
</div>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-fixed/40 text-on-secondary-fixed font-semibold">
                ROLE_COORD
              </span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
<span>Sucursal Norte #01</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Boxes Asignados: 01 al 06</span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Hoy 08:30 AM</span>
<span className="font-label-sm text-label-sm text-outline font-mono">190.22.45.105 • LAN Box Coord</span>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Activo
              </span>
</td>
<td className="py-3.5 px-space-md text-right">
<div className="flex items-center justify-end gap-1">
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Editar permisos" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors" title="Revocar token JWT" type="button">
<span className="material-symbols-outlined text-[18px]">key_off</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Opciones avanzadas" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors user-row" data-branch="SUR" data-role="FISIO">
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-space-md">
<img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Portrait photography of a smiling young male sports physiotherapist wearing dark teal uniform in a modern kinetic gymnasium setting with rehab equipment in background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXXHeQDBXCbColJzkVt1jk0_sMhbJHGqoVPCkmXDiCg5i6rOkSngODz4GL8OLMzVSOeGR7gsIGDZPyca8uHpbO72DlOZJX9FnwBfVxupwesJvk186qlrC8ZRDcFU7MyYne4C6f9MbvqImqyLHGAx1rjs0Y8ee1w-mQt41cBUMZ1r2XDm9IVa1BS6a11nf68lZoOgBebFvrl-buX4GsnJnnl6yAv2esLu8zARM6dIRNHdGMKrIwLLJr"/>
<div>
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-on-surface">Dr. Manuel Ceballos</span>
</div>
<span className="font-label-sm text-label-sm text-outline">m.ceballos@klinikpro.com • Especialista Deportivo</span>
</div>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                ROLE_FISIO
              </span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
<span>Sucursal Sur #02</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Box de Kinesiología B-04</span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Ayer 19:40 PM</span>
<span className="font-label-sm text-label-sm text-outline font-mono">186.104.22.18 • Móvil Tablet</span>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Activo
              </span>
</td>
<td className="py-3.5 px-space-md text-right">
<div className="flex items-center justify-end gap-1">
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Editar permisos" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors" title="Revocar token JWT" type="button">
<span className="material-symbols-outlined text-[18px]">key_off</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Opciones avanzadas" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors user-row" data-branch="NORTE" data-role="RECEPCION">
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-space-md">
<img className="w-10 h-10 rounded-full object-cover shadow-sm" data-alt="Portrait photography of a friendly female receptionist at modern medical clinic counter with computer monitor and clean minimalist front desk background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBasuwHFjFv9MSP5JKQOMAXkM6V56tR1f21n6q2V0Lb2iG9l_0FgxCO4BJUT3HQKk9y3LRSWPeSEpgKdevh9t9G5sWzqk6pBNIxVmCHKuVcLc6web3VLNSr0e8PA8rhI2pophHHii8nInV7fOf7KoVewxji2TzhiF_X0HvtEvVDt-avKpHO4PBps5j93NbCPDOz4gdWTwU1bvPfHzHmJjQ43eXgBOdwdUsq2oeGGiE7WUVom5O3oOkL"/>
<div>
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-on-surface">Laura Gómez</span>
</div>
<span className="font-label-sm text-label-sm text-outline">l.gomez@klinikpro.com • Admisión &amp; Caja</span>
</div>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-semibold">
                ROLE_RECEPCION
              </span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
<span>Sucursal Norte #01</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Caja Terminal 01</span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">Hoy 07:55 AM</span>
<span className="font-label-sm text-label-sm text-outline font-mono">190.22.45.110 • LAN POS</span>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-tertiary font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Activo
              </span>
</td>
<td className="py-3.5 px-space-md text-right">
<div className="flex items-center justify-end gap-1">
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Editar permisos" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-error flex items-center justify-center transition-colors" title="Revocar token JWT" type="button">
<span className="material-symbols-outlined text-[18px]">key_off</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Opciones avanzadas" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/60 transition-colors user-row" data-branch="CORP" data-role="FISIO">
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-space-md">
<div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold">
                  RV
                </div>
<div>
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-on-surface">Dr. Rodrigo Valenzuela</span>
</div>
<span className="font-label-sm text-label-sm text-outline">r.valenzuela@cytohelix.med • Kinesiología Avanzada</span>
</div>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
                ROLE_FISIO
              </span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex items-center gap-1.5 text-on-surface">
<span className="material-symbols-outlined text-[16px] text-outline">domain</span>
<span>Corporativo CytoHelix</span>
</div>
<span className="font-label-sm text-label-sm text-outline">Investigación Clínica</span>
</td>
<td className="py-3.5 px-space-md">
<div className="flex flex-col">
<span className="font-body-sm text-body-sm text-on-surface">14 Nov 2024</span>
<span className="font-label-sm text-label-sm text-outline font-mono">200.72.19.45 • Sesión Expirada</span>
</div>
</td>
<td className="py-3.5 px-space-md">
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-outline font-label-sm text-label-sm">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span> En Vacaciones
              </span>
</td>
<td className="py-3.5 px-space-md text-right">
<div className="flex items-center justify-end gap-1">
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Editar permisos" type="button">
<span className="material-symbols-outlined text-[18px]">edit_note</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Restablecer credenciales" type="button">
<span className="material-symbols-outlined text-[18px]">lock_reset</span>
</button>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors" title="Opciones avanzadas" type="button">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="flex items-center justify-between pt-space-lg mt-space-md text-outline font-label-sm text-label-sm">
<span>Mostrando 5 de 26 especialistas registrados</span>
<div className="flex items-center gap-1">
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center transition-colors disabled:opacity-40" disabled>
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center">1</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors">2</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors">3</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-xl">

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center gap-space-sm mb-space-md">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">token</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Configuración JWT &amp; Expiración</h3>
<span className="font-label-sm text-label-sm text-outline">Firma HMAC-SHA512 con clave rotativa</span>
</div>
</div>
<div className="space-y-space-sm mb-space-md">
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<span className="font-body-sm text-body-sm text-on-surface">Vida de Access Token</span>
<span className="font-label-sm text-label-sm font-mono px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">8 Horas (28800s)</span>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<span className="font-body-sm text-body-sm text-on-surface">Rotación Refresh Token</span>
<span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold">
<span className="material-symbols-outlined text-[15px]">autorenew</span> Automática (Sliding)
            </span>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<span className="font-body-sm text-body-sm text-on-surface">Algoritmo Criptográfico</span>
<span className="font-label-sm text-label-sm font-mono text-outline">Bcrypt (Cost Factor 12)</span>
</div>
</div>
</div>
<div className="pt-space-sm flex items-center justify-between text-outline font-label-sm text-label-sm">
<span>Última rotación de Secret: 01 Nov</span>
<button className="text-primary font-semibold hover:underline">Configurar Parámetros</button>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center gap-space-sm mb-space-md">
<div className="w-9 h-9 rounded-xl bg-surface-container text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">phonelink_lock</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Políticas de 2FA &amp; Multi-Factor</h3>
<span className="font-label-sm text-label-sm text-outline">Obligatoriedad basada en criticidad</span>
</div>
</div>
<div className="space-y-space-sm mb-space-md">
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<div>
<span className="font-body-sm text-body-sm text-on-surface block">Módulo Financiero / Caja</span>
<span className="font-label-sm text-label-sm text-outline">Roles: ADMIN y RECEPCION</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">FORZOSO</span>
</div>
<div className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-low">
<div>
<span className="font-body-sm text-body-sm text-on-surface block">Especialistas Kinésicos</span>
<span className="font-label-sm text-label-sm text-outline">Rol: FISIO (Acceso a Ficha)</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">OPCIONAL (TOTP)</span>
</div>
</div>
</div>
<div className="pt-space-sm flex items-center justify-between text-outline font-label-sm text-label-sm">
<span>Cumplimiento Ley Datos Médicos 20.584</span>
<span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
</div>
</div>

<div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center gap-space-sm mb-space-md">
<div className="w-9 h-9 rounded-xl bg-surface-container text-error flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">security_update_warning</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Revocación y Blacklist Redis</h3>
<span className="font-label-sm text-label-sm text-outline">Invalidación inmediata de sesiones</span>
</div>
</div>
<div className="p-space-md rounded-xl bg-surface-container-low mb-space-md">
<div className="flex items-center justify-between mb-2">
<span className="font-body-sm text-body-sm text-on-surface">Sesiones activas en clúster</span>
<span className="font-metric-num text-metric-num text-primary">28</span>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-2">
<div className="bg-primary h-full rounded-full" style={{width: '32%'}}></div>
</div>
<span className="font-label-sm text-label-sm text-outline">Capacidad segura: hasta 250 sesiones concurrentes</span>
</div>
</div>
<div className="flex items-center justify-between">
<button className="h-9 px-space-md rounded-xl bg-error-container text-on-error-container font-headline-sm text-headline-sm hover:opacity-90 transition-opacity flex items-center gap-1.5 w-full justify-center" id="btn-purge-sessions" type="button">
<span className="material-symbols-outlined text-[17px]">power_settings_new</span>
<span>Forzar Cierre de Sesiones Inactivas</span>
</button>
</div>
</div>
</div>

<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm hidden items-center justify-center p-space-md" id="role-modal">
<div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-xl p-space-xl overflow-hidden transform transition-all">
<div className="flex items-center justify-between pb-space-md mb-space-md">
<div className="flex items-center gap-space-sm">
<div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">add_moderator</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Crear Rol Personalizado</h3>
<span className="font-label-sm text-label-sm text-outline">Nuevo perfil en la tabla auth_roles</span>
</div>
</div>
<button className="w-8 h-8 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface flex items-center justify-center transition-colors" id="btn-close-role-modal" type="button">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div className="space-y-space-md mb-space-lg">
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Identificador Técnico (Spring Authority)</label>
<input className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm uppercase focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary" placeholder="Ej: ROLE_KINESIOLOGO_JEFE" type="text"/>
<span className="font-label-sm text-label-sm text-outline">Debe comenzar con el prefijo ROLE_</span>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Nombre Visible / Etiqueta</label>
<input className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary" placeholder="Ej: Kinesiólogo Jefe de Sucursal" type="text"/>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Heredar Permisos Base de</label>
<select className="h-9 px-space-md rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary">
<option>ROLE_FISIO (Especialista Clínico)</option>
<option>ROLE_COORD (Coordinador)</option>
<option>ROLE_RECEPCION (Frontdesk)</option>
<option>Sin herencia (Plantilla vacía)</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-label-sm text-label-sm text-on-surface-variant">Descripción Operativa</label>
<textarea className="p-space-sm rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary resize-none" placeholder="Define el alcance clínico y administrativo de este rol..." rows={2}></textarea>
</div>
</div>
<div className="flex items-center justify-end gap-space-sm">
<button className="h-9 px-space-md rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-headline-sm text-headline-sm transition-colors" id="btn-cancel-role-modal" type="button">
          Cancelar
        </button>
<button className="h-9 px-space-lg rounded-xl bg-primary hover:bg-primary-container text-on-primary font-headline-sm text-headline-sm flex items-center gap-1 transition-colors" id="btn-confirm-create-role" type="button">
<span className="material-symbols-outlined text-[18px]">check</span>
<span>Guardar Rol</span>
</button>
</div>
</div>
</div>

<div className="fixed bottom-6 right-6 z-50 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-on-surface text-on-primary shadow-xl" id="toast-rbac">
<span className="material-symbols-outlined text-tertiary-fixed text-[20px]">verified</span>
<span className="font-body-sm text-body-sm" id="toast-rbac-message">Cambios aplicados exitosamente.</span>
</div>
</div>



      )}

      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full">
           <div className="xl:col-span-8 flex flex-col gap-4">
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
                 <div className="flex items-center gap-2 mb-6">
                     <span className="material-symbols-outlined text-primary text-2xl">calendar_clock</span>
                     <h2 className="font-headline-md text-on-surface">Disponibilidad del Médico</h2>
                 </div>

                 <div className="mb-6">
                   <label className="font-label-sm text-on-surface-variant block mb-1">Seleccionar Médico</label>
                   <select 
                     className="h-10 px-4 rounded-xl bg-surface-container-low w-full md:w-1/2 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                     value={selectedPractitioner}
                     onChange={e => setSelectedPractitioner(e.target.value)}
                   >
                     {practitioners.map(p => (
                       <option key={p.id} value={p.id}>
                         {p.name?.[0]?.text || 'Médico ' + p.id}
                       </option>
                     ))}
                   </select>
                 </div>

                 <div className="bg-surface-container-low p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end border border-outline-variant/30">
                    <div>
                       <label className="block text-label-sm text-on-surface-variant mb-1">Día</label>
                       <select 
                          className="h-10 px-4 rounded-xl bg-surface-container-lowest focus:outline-none"
                          value={newSchedule.diaSemana}
                          onChange={e => setNewSchedule({...newSchedule, diaSemana: parseInt(e.target.value)})}
                       >
                          {dias.map((d, i) => <option key={i} value={i+1}>{d}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-label-sm text-on-surface-variant mb-1">Hora Inicio</label>
                       <input 
                          type="time" 
                          className="h-10 px-4 rounded-xl bg-surface-container-lowest focus:outline-none"
                          value={newSchedule.horaInicio}
                          onChange={e => setNewSchedule({...newSchedule, horaInicio: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-label-sm text-on-surface-variant mb-1">Hora Fin</label>
                       <input 
                          type="time" 
                          className="h-10 px-4 rounded-xl bg-surface-container-lowest focus:outline-none"
                          value={newSchedule.horaFin}
                          onChange={e => setNewSchedule({...newSchedule, horaFin: e.target.value})}
                       />
                    </div>
                    <button className="h-10 px-6 rounded-xl bg-primary text-on-primary font-headline-sm flex items-center gap-2 hover:bg-opacity-90">
                       <span className="material-symbols-outlined text-[18px]">add</span>
                       Agregar Turno
                    </button>
                 </div>

                 <div className="flex flex-col gap-2">
                    {schedules.length === 0 ? (
                       <p className="text-body-md text-outline italic">El médico no tiene horarios. Se rechazarán todas sus citas en el motor anti-colisión.</p>
                    ) : (
                       schedules.map(sch => (
                          <div key={sch.id} className="flex items-center justify-between bg-surface-container-lowest p-4 border border-outline-variant/30 rounded-xl">
                             <div className="flex items-center gap-4">
                                <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-label-sm font-bold">
                                   {dias[sch.diaSemana - 1]}
                                </span>
                                <span className="text-body-md text-on-surface font-bold">
                                   {sch.horaInicio.substring(0,5)} - {sch.horaFin.substring(0,5)}
                                </span>
                             </div>
                             <button className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors">
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                             </button>
                          </div>
                       ))
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
