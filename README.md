# ✅ ToDo App Full Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core_Web_API-5C2D91?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/EF_Core-6DB33F?style=for-the-badge&logo=.net&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![xUnit](https://img.shields.io/badge/xUnit-Testing-5A2D81?style=for-the-badge)
![Moq](https://img.shields.io/badge/Moq-Mocking-7A52C7?style=for-the-badge)

Aplicación full stack orientada a demostrar prácticas modernas de desarrollo, incluyendo:

- Autenticación con JWT y control de acceso por usuario
- Arquitectura en capas (Controller / Service / Repository)
- Testing en múltiples niveles (Unit, Integration, E2E)
- Experiencia de usuario avanzada (Optimistic UI + Skeleton Loaders)
- Despliegue cloud desacoplado en Azure

**Este proyecto evoluciona un CRUD tradicional hacia una aplicación con prácticas cercanas a entornos productivos reales.**

---

## 🌍 URLs del proyecto

🔗 Frontend: [(URL de Static Web Apps)](https://ashy-desert-0d8175810.1.azurestaticapps.net)
🔗 Backend (API): [(URL de App Service)](https://todolistapi-bzd4bbbpcrbwdah8.brazilsouth-01.azurewebsites.net)
📄 Swagger: [(URL + /swagger)](https://todolistapi-bzd4bbbpcrbwdah8.brazilsouth-01.azurewebsites.net/swagger/index.html)

---

## 🔑 Demo de la aplicación

Puedes probar la aplicación utilizando la siguiente cuenta demo:

Email: demo@todoapp.com
Password: Demo123!

⚠️ Nota: La cuenta demo se reinicia periódicamente, por lo que los datos pueden eliminarse automáticamente.

---

## 🧠 Qué hace diferente a este proyecto

A diferencia de un CRUD básico, este proyecto implementa:

- Aislamiento de datos por usuario (multi-tenant lógico)
- Validación de ownership en backend
- Separación clara de responsabilidades
- Testing real de API + flujos de usuario
- UX optimizada con actualizaciones optimistas

---

## 📷 Vista previa

### Login
<img src="frontend/assets/images/Login.png" width="500"/>

### Header / Create Task Form
<img src="frontend/assets/images/Header-CreateForm.png" width="500"/>

### Task List
<img src="frontend/assets/images/TaskList.png" width="500"/>
<img src="frontend/assets/images/TaskEdition.png" width="500"/>
<img src="frontend/assets/images/InfoToast.png" width="500"/>
<img src="frontend/assets/images/DeleteConfirm.png" width="500"/>

### Filters
<img src="frontend/assets/images/Filters.png" width="500"/>
<img src="frontend/assets/images/TaskFilteredPending.png" width="500"/>
<img src="frontend/assets/images/TaskFilteredCompleted.png" width="500"/>

### Dark Mode
<img src="frontend/assets/images/DarkMode.png" width="500"/>

### API Endpoints
<img src="frontend/assets/images/API-Endpoints.png" width="500"/>

---

## 🧱 Arquitectura

**Backend (Clean Architecture simplificada)**
- **Controllers** → Exponen endpoints HTTP
- **Services** → Lógica de negocio y reglas
 - **Repositories** → Acceso a datos desacoplado
- **Data** → DbContext (Entity Framework Core)
- **Models** → Entidades del dominio

✔ Bajo acoplamiento  
✔ Alta testabilidad  
✔ Validación de seguridad a nivel de datos

**Frontend (Arquitectura por capas + hooks)**
- **api/** → Cliente HTTP centralizado (apiClient)
- **hooks/** → Lógica reutilizable (useTareas, estado y side effects)
- **components/** → Componentes UI desacoplados
- **types/** → Tipado fuerte con TypeScript

✔ Separación de responsabilidades  
✔ Manejo explícito de estado  
✔ Integración controlada con backend

---

## ⚡ Experiencia de Usuario (UX avanzada)

- Skeleton loaders durante la carga de datos (mejora de perceived performance)
- Actualizaciones optimistas (Optimistic UI) en todas las operaciones:
  - Creación instantánea de tareas
  - Edición inline con sincronización automática
  - Eliminación inmediata con rollback en caso de error
  - Toggle de estado (completado) sin latencia visible
- Manejo de rollback ante fallos de API
- Feedback visual de estado optimista (opacidad + bloqueo de interacción)
- Highlight automático al editar tareas (efecto tipo Notion)
- Transiciones suaves y microinteracciones para mejorar la experiencia
- Labels semánticos en formularios
- Estados de foco visibles
- Toast accesible con aria-live
- Feedback visual para acciones exitosas o fallidas

---

## ☁️ Despliegue en la nube (Azure)

Este proyecto fue desplegado completamente en la nube utilizando servicios de Microsoft Azure, separando frontend y backend para una arquitectura moderna y escalable.

**Arquitectura desacoplada:**

- Frontend → Azure Static Web Apps
- Backend → Azure App Service
- DB → Azure SQL Database

✔ CI/CD con GitHub Actions  
✔ Variables de entorno por ambiente

---

## 🧪 Testing

El proyecto implementa testing en tres niveles:

### 🟢 Unit Tests
- Lógica de negocio (Services)
- Uso de mocks (Moq)

### 🟡 Integration Tests
- Validación real de endpoints
- Base de datos + autenticación
- Validación de ownership

### 🔴 E2E Tests (Playwright)
- Flujos completos de usuario
- Multi-browser
- Uso de storageState

✔ Alta confianza en el sistema
✔ Cobertura de múltiples capas

Esto permite asegurar el comportamiento esperado de la lógica antes de llegar al controlador o a la base de datos.

---

## 🚀 Tecnologías

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- ASP.NET Core (.NET 8) Web API
- Entity Framework Core (EF Core)
- SQL Server

### Testing
- xUnit
- Moq
- E2E Playwright

---


## 📂 Estructura del proyecto

```bash
/backend
  /TodoApi
    /Controllers
    /Data
    /DTOs
    / Middleware
    /Repositories
    /Services

  /TodoApi.Tests
    /Unit
    /Integration

/frontend
  /src
    /api
    /components
    /hooks
    /pages
    /types

  /Tests
    /e2e
```
---

## 🔐 Seguridad

- Autenticación con JWT
- Validación de ownership en cada operación
- Protección de rutas en frontend
- Manejo seguro de variables de entorno

---

## ✨ Funcionalidades
- Autenticación con JWT
- Crear tareas
- Listar tareas
- Editar tareas
- Eliminar tareas
- Marcar tareas como completadas
- Búsqueda por título o descripción
- Filtro por estado: todas, pendientes y completadas
- Agrupación de tareas por fecha de creación
- Notificaciones tipo toast para éxito y error
- Protección de rutas
- Logout automático por inactividad
- Interfaz moderna con Tailwind CSS
- Modo oscuro (Dark Mode)
- Validaciones en backend
- Arquitectura por capas en API REST
- Pruebas unitarias de servicios
- Tests E2E (Playwright)

---

## 🔌 Endpoints principales

- POST /api/auth/login
- GET /api/info/version
- GET /api/tareas → obtener todas las tareas
- GET /api/tareas/{id} → obtener tarea por id
- POST /api/tareas → crear nueva tarea
- PUT /api/tareas/{id} → actualizar tarea
- DELETE /api/tareas/{id} → eliminar tarea

---

## ⚙️ Decisiones técnicas
- Implementación de Optimistic UI sin librerías externas (manejo manual de estado y rollback)
- Separación de responsabilidades en frontend mediante custom hooks
- Manejo de errores y estados inconsistentes (prevención de null en render)
- Uso de Skeleton loaders en lugar de spinners para mejorar UX
- Estrategia de sincronización entre frontend y backend sin refetch innecesario
- Uso de storageState en Playwright para optimizar tests E2E
- Arquitectura desacoplada que permite migración futura a herramientas como React Query

---

## ⚠️ Problemas reales abordados

- CORS entre dominios
- Configuración de entornos (dev vs prod)
- Errores de despliegue en Azure
- Sincronización frontend-backend
- Manejo de estado optimista

---

## 📌 Mejoras futuras

- Migración a React Query para manejo de estado server-side
- Undo delete con acción en toast
- Virtualización de listas (react-window / react-virtual)
- Tests de integración backend
- Refresh tokens para autenticación
- WebSockets para actualización en tiempo real
- Observabilidad (Application Insights)

---

## 👨‍💻 Autor

Jorge Vargas
