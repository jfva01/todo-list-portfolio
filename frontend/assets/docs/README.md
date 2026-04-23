# 📚 Documentación técnica

Esta sección describe en detalle el diseño, decisiones técnicas y funcionamiento interno de la aplicación.

## 🚀 Contenido

1. Overview del proyecto
2. Arquitectura backend
3. Arquitectura frontend
4. Flujo de datos
5. Optimistic UI y UX avanzada
6. Testing
7. Deploy en Azure
8. Lecciones aprendidas
9. Decisiones de arquitectura

---

## 🏗️ Arquitectura del sistema

```mermaid
flowchart TD
    A[Usuario accede a la app] --> B{¿Está autenticado?}

    B -- No --> C[Formulario Login / Registro]
    C --> D[Enviar credenciales a API]
    D --> E{¿Credenciales válidas?}

    E -- No --> C
    E -- Sí --> F[Recibir JWT]
    F --> G[Guardar token en frontend]

    B -- Sí --> H[Mostrar Dashboard]

    G --> H

    H --> I[Obtener tareas desde API]
    I --> J[Mostrar lista de tareas]

    J --> K[Crear nueva tarea]
    J --> L[Editar tarea]
    J --> M[Eliminar tarea]

    K --> N[POST /tasks]
    L --> O[PUT /tasks/:id]
    M --> P[DELETE /tasks/:id]

    N --> Q[Actualizar lista]
    O --> Q
    P --> Q

    Q --> J
```