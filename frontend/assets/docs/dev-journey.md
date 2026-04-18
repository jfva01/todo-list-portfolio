🛠️ Cómo se desarrolló el proyecto

1. Planificación
    - Definición del alcance: CRUD de tareas con autenticación
    - Elección de stack:
      - React + Vite → rapidez de desarrollo
      - .NET 8 → backend robusto y tipado fuerte
      - SQL Server → integración natural con EF Core

2. Diseño de arquitectura
    - Backend en capas (Controller → Service → Repository)
    - Frontend separado en:
      - UI (components)
      - lógica (hooks)
      - acceso a datos (api)

    Se evita acoplar lógica de negocio en componentes

3. Implementación inicial
    - CRUD básico
    - Conexión frontend-backend
    - Persistencia en base de datos

4. Problemas encontrados
    - Latencia en UI al interactuar con API
    - Re-renderizados innecesarios
    - Estados inconsistentes

5. Evolución a UX avanzada
    - Implementación de Skeleton Loaders
    - Introducción de Optimistic UI
    - Manejo de rollback en errores

    Resultado: UI inmediata sin depender de la API

6. Testing
    - Unit testing en servicios (xUnit + Moq)
    - E2E con Playwright
    - Optimización con storageState

7. Deploy
    - Separación frontend/backend en Azure
    - Configuración de CORS
    - Variables de entorno