# ✅ ToDo App Full Stack

Aplicación web full stack para la gestión de tareas, desarrollada con **React + TypeScript** en el frontend y **ASP.NET Core Web API + Entity Framework Core + SQL Server** en el backend.

Permite crear, listar, editar, eliminar, buscar, filtrar y marcar tareas como completadas, con una interfaz moderna, notificaciones visuales y arquitectura por capas en el backend.

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

## 🌍 Demo en vivo
Próximamente

<!-- Cuando hagas deploy puedes reemplazar esto por:
[![Live Demo](https://img.shields.io/badge/Demo-Online-success?style=for-the-badge)](AQUI_TU_URL)
-->

---

## 📷 Vista previa

<p align="center">
  <img src="frontend/src/assets/images/api-endpoints.png" width="600"/>
  <img src="frontend/src/assets/images/add-form.png" width="600"/>
  <img src="frontend/src/assets/images/task-editing.png" width="600"/>
  <img src="frontend/src/assets/images/add-task.png" width="600"/>
  <img src="frontend/src/assets/images/filters-1.png" width="600"/>
  <img src="frontend/src/assets/images/filters-2.png" width="600"/>
  <img src="frontend/src/assets/images/filters-3.png" width="600"/>
  <img src="frontend/src/assets/images/task-list-ordered.png" width="600"/>
  <img src="frontend/src/assets/images/task-list-ordered-1.png" width="600"/>
  <img src="frontend/src/assets/images/task-list-ordered-3.png" width="600"/>
  <img src="frontend/src/assets/images/completed-tasks.png" width="600"/>
  <img src="frontend/src/assets/images/popup-notification.png" width="600"/>
  <img src="frontend/src/assets/images/delete-confirmation.png" width="600"/>
</p>

---

## 🚀 Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger / OpenAPI

### Testing
- xUnit
- Moq

---

## ✨ Funcionalidades

- Crear tareas
- Listar tareas almacenadas en base de datos
- Editar título y descripción
- Eliminar tareas
- Marcar tareas como completadas
- Búsqueda por título o descripción
- Filtro por estado: todas, pendientes y completadas
- Agrupación de tareas por fecha de creación
- Notificaciones tipo toast para éxito y error
- Validaciones en backend
- Arquitectura por capas en API REST
- Pruebas unitarias de servicios

---

## 🧱 Arquitectura del proyecto

El backend fue estructurado siguiendo una separación por responsabilidades:

- **Controllers**: exponen los endpoints HTTP
- **Services**: contienen la lógica de negocio
- **Repositories**: encapsulan acceso a datos
- **Data**: contexto de Entity Framework Core
- **Models**: entidades del dominio

El frontend fue desarrollado con una estructura basada en componentes reutilizables y manejo de estado con React Hooks.

---

## 📂 Estructura del proyecto

```bash
/backend
  /TodoApi
    /Controllers
    /Data
    /Models
    /Repositories
    /Services
    Program.cs
  /ToDoApi.Tests
    /Services

/frontend
  /src
    /api
    /components
    /hooks
    /types
    App.tsx
    main.tsx
```
---

## 🔌 Endpoints principales

- GET /api/tareas → obtener todas las tareas
- GET /api/tareas/{id} → obtener tarea por id
- POST /api/tareas → crear nueva tarea
- PUT /api/tareas/{id} → actualizar tarea
- DELETE /api/tareas/{id} → eliminar tarea

---

## 🧪 Testing

Se implementaron pruebas unitarias para la capa de servicios, validando escenarios como:

- Obtención de tareas
- Creación de tareas válidas e inválidas
- Actualización de tareas
- Eliminación de tareas
- Manejo de excepciones del repositorio
- Validaciones de reglas de negocio

Esto permite asegurar el comportamiento esperado de la lógica antes de llegar al controlador o a la base de datos.

---

## ♿ Accesibilidad y UX

- Labels semánticos en formularios
- Estados de foco visibles
- Toast accesible con aria-live
- Confirmación antes de eliminar tareas
- Feedback visual para acciones exitosas o fallidas

---

## 📌 Mejoras futuras

- Autenticación de usuarios
- Persistencia de filtros por sesión
- Confirmación con modal custom en lugar de window.confirm
- Tests de integración para endpoints
- Deploy completo frontend + backend + base de datos en la nube
- Modo oscuro
- Paginación o virtualización para grandes volúmenes de tareas

---

## ☁️ Despliegue en la nube (Azure)

Este proyecto fue desplegado completamente en la nube utilizando servicios de Microsoft Azure, separando frontend y backend para una arquitectura moderna y escalable.

## 🔧 Backend
- Desarrollado con .NET 8 + ASP.NET Core
- Desplegado en Azure App Service
- API REST conectada a base de datos en la nube
- Documentación disponible vía Swagger

---

## 🗄️ Base de datos
- Azure SQL Database
- Configuración de firewall para acceso seguro
- Conexión mediante Entity Framework Core

---

## 🎨 Frontend
- Desarrollado con React + Vite
- Desplegado en Azure Static Web Apps
- Integración con backend mediante variables de entorno (VITE_API_URL)

---

## 🔐 Configuraciones clave
CORS configurado en el backend para permitir acceso desde el frontend desplegado
Uso de variables de entorno para separar configuraciones entre desarrollo y producción
Manejo de conexión segura a base de datos mediante connection strings en Azure

---

## 🚀 CI/CD
Integración continua mediante GitHub Actions
Build y despliegue automático del frontend con Azure Static Web Apps
Publicación manual controlada del backend desde VS Code

---

## 🌍 URLs del proyecto
🔗 Frontend: [(URL de Static Web Apps)](https://ashy-desert-0d8175810.1.azurestaticapps.net/api/tareas)
🔗 Backend (API): [(URL de App Service)](https://todolistapi-bzd4bbbpcrbwdah8.brazilsouth-01.azurewebsites.net)
📄 Swagger: [(URL + /swagger)](https://todolistapi-bzd4bbbpcrbwdah8.brazilsouth-01.azurewebsites.net/swagger/index.html)

---

##🧠 Desafíos y aprendizajes

- Configuración de CORS entre servicios distribuidos
- Manejo de variables de entorno en Vite (build-time)
- Resolución de errores de despliegue en Azure (500.30, CORS, connection issues)
- Separación de frontend y backend en entornos productivos

---

## 👨‍💻 Autor

Jorge Vargas
