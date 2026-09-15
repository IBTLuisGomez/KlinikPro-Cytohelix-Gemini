# KlinikPro - SaaS Multitenant Clínico

KlinikPro es una solución de software clínica orientada a SaaS multitenant, diseñada para gestionar operaciones médicas, datos de pacientes, usuarios y procesos administrativos dentro de un ecosistema modular y extensible.

Este proyecto está compuesto por:

- Backend en Java + Spring Boot
- Frontend en React + Vite + TypeScript
- Base de datos PostgreSQL
- Administración de base de datos con pgAdmin
- Migrations con Flyway
- Soporte FHIR con HAPI FHIR

---

## 1. Descripción general

La aplicación está estructurada para soportar escenarios clínicos con separación por tenant, integración con estándares FHIR y una base tecnológica moderna para despliegue local y escalabilidad futura.

### Stack tecnológico

- Java 17
- Maven
- Spring Boot 3.2.3
- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL 16
- Flyway
- HAPI FHIR 6.10.0
- React 19
- Vite 8
- Tailwind CSS
- Docker + Docker Compose

---

## 2. Estructura del proyecto

```text
KlinikPro-Cytohelix-Gemini/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── target/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
├── docker-compose.yml
├── README.md
└── .git/
```

### Backend

La carpeta `backend` contiene la lógica empresarial, configuración del servidor, modelos, repositorios, seguridad y migraciones.

### Frontend

La carpeta `frontend` contiene la interfaz de usuario construida con React y Vite.

### Infraestructura

El archivo `docker-compose.yml` levanta:

- PostgreSQL para la base de datos principal
- pgAdmin para gestión visual de la base de datos

---

## 3. Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

- Git
- Java 17 o superior
- Maven 3.8+ o superior
- Node.js 18+ o 20+
- npm
- Docker Desktop o Docker Engine
- Docker Compose

### Verificación rápida

```bash
git --version
java -version
mvn -version
node -v
npm -v
docker --version
docker compose version
```

Si alguna de estas verificaciones falla, instala primero esa herramienta antes de continuar.

---

## 4. Configuración y variables de entorno

La aplicación backend está configurada en:

```text
backend/src/main/resources/application.yml
```

Configuración actual:

```yaml
spring:
  application:
    name: klinikpro
  datasource:
    url: jdbc:postgresql://localhost:5432/klinikpro
    username: kpro_admin
    password: password123
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    show-sql: true
  flyway:
    enabled: true
    baseline-on-migrate: true

server:
  port: 8080
```

Esto significa que el backend espera:

- Base de datos: `klinikpro`
- Usuario: `kpro_admin`
- Contraseña: `password123`
- Puerto: `5432` para PostgreSQL
- Puerto API: `8080` para Spring Boot

> Si cambias la configuración de Docker o tu entorno local, debes mantener estas variables sincronizadas con el archivo `application.yml`.

---

## 5. Inicio rápido con Docker

### 5.1 Levantar la base de datos

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levantará:

- PostgreSQL en `localhost:5432`
- pgAdmin en `http://localhost:5050`

### 5.2 Conectar con pgAdmin

Abre en tu navegador:

```text
http://localhost:5050
```

Credenciales por defecto:

- Email: `admin@cytohelix.com`
- Contraseña: `admin`

Cuando te conectes, crea un servidor con estos datos:

- Host: `db`
- Puerto: `5432`
- Base de datos: `klinikpro`
- Usuario: `kpro_admin`
- Contraseña: `password123`

---

## 6. Ejecutar el backend

Desde la carpeta `backend`:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O si prefieres compilar y ejecutar el jar:

```bash
cd backend
mvn clean package
java -jar target/klinikpro-0.0.1-SNAPSHOT.jar
```

### URL de acceso del backend

```text
http://localhost:8080
```

### Verificación

Puedes probar la app con:

```bash
curl http://localhost:8080
```

Si el backend está levantado correctamente, responderá según la configuración de la aplicación.

---

## 7. Ejecutar el frontend

Desde la carpeta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

El proyecto se levantará normalmente en:

```text
http://localhost:5173
```

### Construcción de producción

```bash
cd frontend
npm run build
```

Esto genera la carpeta `dist` con la versión compilada para despliegue.

### Vista previa de producción

```bash
cd frontend
npm run preview
```

---

## 8. Flujo recomendado de desarrollo

### Opción A: Desarrollo local completo

1. Levantar PostgreSQL con Docker
2. Ejecutar backend con Maven
3. Ejecutar frontend con Vite
4. Abrir la UI en `http://localhost:5173`
5. Revisar la API del backend en `http://localhost:8080`

### Opción B: Solo base de datos local

Si solo necesitas trabajar en backend o pruebas de persistencia, basta con levantar Docker y dejar la base en ejecución mientras desarrollas.

---

## 9. Migrations y base de datos

El proyecto usa Flyway para migraciones automáticas.

Ubicación habitual:

```text
backend/src/main/resources/db/migration/
```

Archivo actual:

```text
V1__init_schema_with_rls.sql
```

Flyway ejecuta las migraciones automáticamente al iniciar la aplicación Spring Boot, siempre que la base de datos esté disponible.

---

## 10. Comandos útiles

### Backend

```bash
cd backend
mvn test
mvn clean package
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

### Docker

```bash
docker compose up -d
docker compose down
docker compose logs -f db
docker compose ps
```

---

## 11. Solución de problemas comunes

### Error de conexión a PostgreSQL

Verifica que el contenedor esté corriendo:

```bash
docker compose ps
```

Y luego prueba la conexión en el puerto `5432`.

### Error: "Connection refused"

Esto suele pasar por:

- Base de datos no levantada
- Puertos ocupados
- Archivo `application.yml` con configuración distinta

### El backend no arranca

Revisa:

- Java 17 instalado correctamente
- Dependencias Maven descargadas
- PostgreSQL disponible en `localhost:5432`
- Permisos del archivo de configuración

### El frontend no carga

Verifica:

- `npm install` ejecutado correctamente
- Puerto 5173 libre
- Desarrollo del proyecto no interrumpido por errores TypeScript o Vite

---

## 12. Buenas prácticas de trabajo

- Mantén el backend y frontend en ramas separadas según la funcionalidad desarrollada.
- Ejecuta migraciones con cuidado y valida el esquema junto con cambios de modelo.
- Usa `mvn test` antes de entregar cambios de backend.
- Usa `npm run build` antes de preparar una versión estable del frontend.
- Documenta nuevos endpoints, modelos o archivos de configuración en este README.

---

## 13. Roadmap sugerido

Este proyecto ya tiene la base técnica para crecer con estas líneas:

- Autenticación y autorización por tenant
- Gestión de pacientes y médicos
- Agenda clínica
- Historias clínicas
- Reportes y estadísticas
- Integración con FHIR
- Panel administrativo
- Cobranza y facturación
- Seguridad avanzada y auditoría

---

## 14. Información de contacto y ownership

Proyecto desarrollado por:

- CytoHelix Systems
- KlinikPro

Este README se mantiene como documento guía principal del repositorio para onboarding, desarrollo y uso local.

---

## 15. Resumen de uso

### Instalar y levantar todo

```bash
git clone <url-del-repositorio>
cd KlinikPro-Cytohelix-Gemini
docker compose up -d
cd backend
mvn spring-boot:run
cd ../frontend
npm install
npm run dev
```

### Accesos principales

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- pgAdmin: `http://localhost:5050`
- PostgreSQL: `localhost:5432`

---

## 16. Nota final

Este README está diseñado para servir como guía de instalación, ejecución y mantenimiento del proyecto en entorno local. Si se agregan nuevos módulos, endpoints, configs o dependencias, conviene actualizar esta documentación para mantener el repositorio claro y usable por toda la organización.

Si quieres, en la siguiente etapa puedo preparar una versión aún más profesional del README para:

- incluir una sección de arquitectura con diagramas,
- añadir documentación de APIs,
- crear un README orientado a GitHub con badges y estructura premium,
- o hacerlo en inglés para proyecto empresarial.
