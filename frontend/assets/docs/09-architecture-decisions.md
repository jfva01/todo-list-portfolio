# 🧠 Architecture Decision Records (ADR)

Este documento registra las decisiones técnicas clave tomadas durante el desarrollo del proyecto, incluyendo motivaciones, alternativas y trade-offs.

---

## 🧠 ADR 1 — Arquitectura en capas (Backend)

### 📌 Decisión

Se implementó una arquitectura en capas:

* Controllers (entrada HTTP)
* Services (lógica de negocio)
* Repositories (acceso a datos)
* Data (EF Core / DbContext)

### 🎯 Motivación

Evitar acoplamiento entre capas y permitir:

* Testeo aislado de lógica de negocio
* Evolución independiente de cada capa
* Reutilización de lógica

### 🔄 Alternativas consideradas

* Acceso directo a DbContext desde Controllers

### ⚖️ Trade-offs

**Ventajas**

* Separación clara de responsabilidades
* Mejor testabilidad (mock de repositorios)
* Código más mantenible

**Desventajas**

* Mayor complejidad inicial
* Más clases y estructura

### 🧠 Conclusión

Se priorizó mantenibilidad y testabilidad por sobre simplicidad inicial, alineándose con prácticas comunes en APIs productivas.

---

## 🧠 ADR 2 — Uso de DTOs

### 📌 Decisión

Uso de DTOs para desacoplar entidades de dominio de los contratos de API.

### 🎯 Motivación

* Evitar exponer directamente el modelo de datos
* Controlar inputs/outputs de la API
* Permitir cambios internos sin romper el cliente

### 🔄 Alternativas

* Exponer entidades directamente en Controllers

### ⚖️ Trade-offs

**Ventajas**

* Mayor seguridad
* Contratos de API explícitos
* Flexibilidad ante cambios

**Desventajas**

* Necesidad de mapeo adicional

### 🧠 Conclusión

Se priorizó control del contrato de API y desacoplamiento entre backend y frontend.

---

## 🧠 ADR 3 — Manejo de estado en frontend

### 📌 Decisión

Uso de React Hooks (`useState`, `useEffect`) sin librerías de estado global.

### 🎯 Motivación

* Reducir complejidad
* Evitar sobreingeniería
* Adecuarse al tamaño actual del proyecto

### 🔄 Alternativas

* Redux
* Zustand
* React Query (server state)

### ⚖️ Trade-offs

**Ventajas**

* Simplicidad
* Menor curva de aprendizaje
* Menos dependencias

**Desventajas**

* Escalabilidad limitada
* Manejo manual de estado asincrónico

### 🧠 Conclusión

Decisión adecuada para el alcance actual, dejando abierta la migración futura a herramientas como React Query.

---

## 🧠 ADR 4 — API Client centralizado

### 📌 Decisión

Centralizar las llamadas HTTP en un `apiClient`.

### 🎯 Motivación

* Evitar duplicación de lógica
* Inyectar automáticamente el JWT
* Centralizar manejo de errores

### 🔄 Alternativas

* Llamadas directas con `fetch` en cada componente

### ⚖️ Trade-offs

**Ventajas**

* Reutilización
* Código más limpio
* Cambios centralizados

**Desventajas**

* Capa adicional de abstracción

### 🧠 Conclusión

Mejora la mantenibilidad y permite escalar el manejo de red de forma consistente.

---

## 🧠 ADR 5 — Optimistic UI

### 📌 Decisión

Aplicar actualizaciones optimistas en operaciones CRUD.

### 🎯 Motivación

* Reducir latencia percibida
* Mejorar fluidez de la UI

### 🔄 Alternativas

* Esperar respuesta del backend antes de actualizar UI

### ⚖️ Trade-offs

**Ventajas**

* Experiencia de usuario más rápida
* Interacciones más naturales

**Desventajas**

* Necesidad de rollback en caso de error
* Mayor complejidad en el frontend

### 🧠 Conclusión

Se priorizó experiencia de usuario moderna, gestionando explícitamente los casos de error.

---

## 🧠 ADR 6 — Skeleton Loaders

### 📌 Decisión

Uso de skeleton loaders durante carga de datos.

### 🎯 Motivación

* Mejorar percepción de performance
* Evitar saltos de layout

### 🔄 Alternativas

* Spinner tradicional

### ⚖️ Trade-offs

**Ventajas**

* UX más profesional
* Transiciones visuales más suaves

**Desventajas**

* Implementación adicional en UI

### 🧠 Conclusión

Aporta significativamente a la calidad percibida de la aplicación.

---

## 🧠 ADR 7 — Deploy desacoplado en Azure

### 📌 Decisión

Separar frontend y backend:

* Frontend → Azure Static Web Apps
* Backend → Azure App Service

### 🎯 Motivación

* Escalabilidad independiente
* Despliegue desacoplado
* Arquitectura cloud moderna

### 🔄 Alternativas

* Deploy monolítico

### ⚖️ Trade-offs

**Ventajas**

* Mayor flexibilidad
* Mejor alineación con prácticas cloud

**Desventajas**

* Configuración adicional (CORS, variables de entorno)

### 🧠 Conclusión

Se priorizó una arquitectura alineada con entornos productivos reales.

---

## 🧠 ADR 8 — Estrategia de testing

### 📌 Decisión

Combinación de:

* Tests unitarios (xUnit + Moq)
* Tests end-to-end (Playwright)

### 🎯 Motivación

Cubrir tanto:

* Lógica de negocio
* Flujos completos de usuario

### 🔄 Alternativas

* Solo unit tests
* Solo E2E

### ⚖️ Trade-offs

**Ventajas**

* Mayor confianza en el sistema
* Cobertura más completa

**Desventajas**

* Mayor esfuerzo de implementación y mantenimiento

### 🧠 Conclusión

Se priorizó calidad y confiabilidad del software mediante una estrategia de testing balanceada.

---

## 🚀 Evolución del proyecto

El proyecto evolucionó desde un CRUD básico hacia una aplicación que incorpora:

* Control de acceso por usuario
* Validación de ownership a nivel de datos
* Arquitectura en capas
* Estrategia de testing completa
* Mejores prácticas de UX

---

## 🧠 ADR 9 — Validación de ownership (aislamiento de datos por usuario)

### 📌 Decisión

Implementar validación de ownership en todas las operaciones sobre recursos (tareas), asegurando que cada usuario solo pueda acceder y modificar sus propios datos.

### 🎯 Motivación

* Evitar acceso no autorizado a datos de otros usuarios
* Implementar aislamiento lógico de datos (multi-tenant)
* Asegurar consistencia entre autenticación y autorización

### 🧩 Implementación

* El `userId` se obtiene desde el JWT en cada request autenticada
* Las consultas al repositorio filtran por `userId`
* Las operaciones de actualización/eliminación validan que el recurso pertenece al usuario

Ejemplo conceptual:

* `GET /tasks` → retorna solo tareas del usuario autenticado
* `PUT /tasks/{id}` → valida ownership antes de modificar
* `DELETE /tasks/{id}` → rechaza operación si no pertenece al usuario

### 🔄 Alternativas consideradas

* No validar ownership (inseguro)
* Validar solo en frontend (insuficiente)
* Filtros parciales en base de datos sin validación en lógica de negocio

### ⚖️ Trade-offs

**Ventajas**

* Seguridad a nivel de datos
* Prevención de accesos indebidos
* Base para escalar a multi-tenant real

**Desventajas**

* Mayor complejidad en queries y lógica
* Necesidad de mantener consistencia en todos los endpoints

### 🧠 Conclusión

Se priorizó seguridad y aislamiento de datos como una preocupación central del backend, implementando validación explícita de ownership en todas las operaciones sensibles.

---

## 🔐 Nota

Esta decisión complementa la autenticación basada en JWT, agregando una capa crítica de **autorización a nivel de recurso**, lo que acerca la aplicación a estándares utilizados en sistemas productivos.
