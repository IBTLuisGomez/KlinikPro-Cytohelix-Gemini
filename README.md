# KlinikPro SaaS - Profesional

KlinikPro es una plataforma SaaS Multi-tenant orientada a la gestión clínica. Esta versión profesional consolida la interfaz de usuario prototipada (React) con un backend empresarial robusto basado en **Arquitectura Hexagonal (DDD)**, **Spring Boot**, y estándares médicos internacionales (**HL7 FHIR R4**).

## Stack Tecnológico
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Lucide React.
- **Backend:** Java 17, Spring Boot 3.3.4, Hibernate, HAPI FHIR (Validación y Estructuras), AOP.
- **Base de Datos:** PostgreSQL 16 (con extensiones JSONB y Row-Level Security).
- **Infraestructura:** Docker y Docker Compose (Multi-stage builds).

## Arquitectura y Seguridad
1. **Multi-tenant con Row-Level Security (RLS):** 
   En lugar de separar por esquemas (Schema-per-tenant), KlinikPro utiliza una única base de datos compartida pero impone aislamiento nativo a nivel de filas de PostgreSQL. El backend inyecta automáticamente el ID del Tenant en el contexto de la base de datos para garantizar que los clientes no crucen información.
2. **Modelo de Datos Híbrido (Relacional + JSONB):**
   Las finanzas operan de forma relacional. Sin embargo, los datos clínicos (Expedientes) se manejan mediante el estándar FHIR guardados en columnas JSONB.
3. **Motor Anti-colisiones y Reglas de Agenda (LogicaAgenda):**
   Valida solapamientos cruzando la duración real de cada servicio (`hora` a `hora_fin`). Implementa los 8 estados del ciclo de vida de una cita (Programada, Confirmada, EnEspera, EnAtencion, Finalizada, Cancelada, NoAsistio, Reprogramada) e integra soporte para Horarios Médicos y Bloqueos de Vacaciones.
4. **Testing Automatizado (Jest):**
   Suite completa de pruebas funcionales (E2E) preparada para validarse a través de la extensión de pruebas de VS Code.

## Despliegue Local (Entorno de Desarrollo)

### Requisitos previos
- Docker y Docker Desktop (o Docker Engine + Compose plugin).
- Puertos disponibles: `80` (Frontend), `8080` (Backend), `5050` (pgAdmin), `5432` (PostgreSQL).

### Iniciar el proyecto
En la terminal, ubicado en la raíz del proyecto, ejecuta:
```bash
docker-compose up --build -d
```
Este comando descargará las dependencias de Java (Maven) y Node (npm) internamente en Docker, compilará ambos proyectos, y levantará el stack completo.

- **Aplicación Web:** [http://localhost](http://localhost)
- **API Backend:** [http://localhost:8080](http://localhost:8080)
- **Gestor DB (pgAdmin):** [http://localhost:5050](http://localhost:5050)
  - Usuario: `admin@cytohelix.com`
  - Contraseña: `admin`

## Siguientes pasos (Roadmap)
- [ ] Módulo de Autenticación Avanzado (JWT + Roles).
- [ ] Panel Completo de POS y Finanzas.
- [ ] Flujo de Emisión de Reportes en PDF (Membretes).
- [ ] Subida a Google Cloud Run o similar.
