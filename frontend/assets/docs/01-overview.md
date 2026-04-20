# 🧩 Overview del proyecto

## 📌 Descripción general

ToDo App es una aplicación web full stack para la gestión de tareas, diseñada para explorar e implementar buenas prácticas en desarrollo moderno, tanto en frontend como en backend.

Permite a los usuarios crear, editar, eliminar, filtrar y marcar tareas como completadas, con una experiencia de usuario optimizada mediante técnicas avanzadas como optimistic UI y skeleton loaders.

---

## 🎯 Objetivo del proyecto

El objetivo principal no fue solo construir un CRUD funcional, sino:

- Aplicar una arquitectura limpia y escalable en backend
- Separar responsabilidades correctamente en frontend
- Implementar mejoras reales de experiencia de usuario (UX)
- Simular un entorno de desarrollo profesional (testing, CI/CD, deploy en la nube)

---

## 🧱 Stack tecnológico

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS

### Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server

### Testing
- xUnit + Moq (backend)
- Playwright (E2E frontend)

### Infraestructura
- Azure App Service (backend)
- Azure Static Web Apps (frontend)
- Azure SQL Database

---

## 🧠 Enfoque técnico

Este proyecto fue desarrollado con un enfoque intencional en:

### 1. Separación de responsabilidades
- Backend desacoplado en capas
- Frontend dividido en UI, lógica y acceso a datos

### 2. Manejo manual del estado
Se implementó manualmente:
- Fetching de datos
- Manejo de loading y errores
- Sincronización con API

Esto permitió entender en profundidad el flujo de datos antes de introducir librerías como React Query.

---

### 3. Experiencia de usuario (UX)

Se priorizó una interfaz fluida y reactiva mediante:

- Skeleton loaders durante carga de datos
- Optimistic UI en operaciones CRUD
- Feedback visual inmediato
- Animaciones y microinteracciones

---

## 🔄 Flujo general de la aplicación

1. El usuario interactúa con la UI (crear, editar, eliminar tareas)
2. El frontend actualiza el estado local (optimistic update)
3. Se envía la solicitud a la API REST
4. El backend procesa la lógica y persiste en la base de datos
5. Se sincroniza el estado final con la respuesta del servidor

---

## 🚀 Alcance del proyecto

El proyecto incluye:

- CRUD completo de tareas
- Autenticación con JWT
- Filtros y búsqueda
- Agrupación por fecha
- Testing unitario y E2E
- Deploy en la nube (Azure)
- CI/CD con GitHub Actions

---

## 📈 Evolución

El desarrollo del proyecto siguió una evolución progresiva:

1. Implementación básica del CRUD
2. Integración frontend-backend
3. Mejora de arquitectura
4. Testing
5. Optimización de UX (optimistic UI, skeletons)
6. Deploy y automatización

---

## 💡 Resultado

El resultado es una aplicación que no solo cumple funcionalmente, sino que refleja:

- Buenas prácticas de desarrollo full stack
- Enfoque en escalabilidad
- Atención a la experiencia de usuario
- Preparación para entornos reales de producción