# 🧠 ADR 1 — Arquitectura en capas (Backend)

## 📌 Decisión

Se implementó una arquitectura en capas:

- Controllers
- Services
- Repositories
- Data (EF Core)

## 🎯 Motivación

Separar responsabilidades para lograr:

- Mantenibilidad
- Testabilidad
- Desacoplamiento

## 🔄 Alternativas consideradas
Arquitectura monolítica simple (Controller + DbContext directo)

## ⚖️ Trade-offs

### ✅ Ventajas
- Código más limpio
- Fácil testing (mock de repositorios)
- Escalable

### ❌ Desventajas
- Mayor complejidad inicial
- Más archivos/clases

## 🧠 Conclusión

Se priorizó escalabilidad y buenas prácticas sobre simplicidad inicial.

---

# 🧠 ADR 2 — Uso de DTOs

## 📌 Decisión

Separar modelos de dominio de los contratos de API mediante DTOs.

## 🎯 Motivación
- Evitar exponer entidades directamente
- Controlar qué datos entran/salen
- Permitir evolución del backend sin romper frontend

## 🔄 Alternativas
Usar entidades directamente en Controllers

## ⚖️ Trade-offs

### ✅ Ventajas
- Seguridad
- Flexibilidad
- API más estable

### ❌ Desventajas
- Más código (mapeos)

## 🧠 Conclusión

Se priorizó desacoplamiento y control del contrato de API.

---

# 🧠 ADR 3 — React con Hooks vs estado global

## 📌 Decisión

Uso de React Hooks (useState, useEffect) sin librerías de estado global.

## 🎯 Motivación
- Simplicidad
- Evitar sobreingeniería
- Tamaño del proyecto manejable

## 🔄 Alternativas
- Redux
- Zustand
- React Query (para server state)

## ⚖️ Trade-offs

### ✅ Ventajas
- Menos complejidad
- Curva de aprendizaje baja

### ❌ Desventajas
- Escalabilidad limitada
- Manejo manual de estado async

## 🧠 Conclusión

Adecuado para el tamaño actual, con posibilidad de migrar a React Query.

---

# 🧠 ADR 4 — API Client centralizado

## 📌 Decisión

Centralizar llamadas HTTP en un apiClient.

## 🎯 Motivación
- Evitar duplicación
- Manejar headers (JWT)
- Centralizar errores

## 🔄 Alternativas
Fetch directo en cada componente

## ⚖️ Trade-offs

### ✅ Ventajas
- Reutilización
- Mantenimiento más simple

### ❌ Desventajas
- Abstracción adicional

## 🧠 Conclusión

Mejora la organización y facilita cambios futuros.

---

# 🧠 ADR 5 — Optimistic UI

## 📌 Decisión

Actualizar la UI antes de recibir respuesta del backend.

## 🎯 Motivación
- Mejorar percepción de rendimiento
- UX más fluida

## 🔄 Alternativas
Esperar respuesta del backend (modelo tradicional)

## ⚖️ Trade-offs

### ✅ Ventajas
- App se siente rápida
- Mejor experiencia de usuario

### ❌ Desventajas
- Mayor complejidad
- Necesidad de rollback

## 🧠 Conclusión

Se priorizó UX moderna, asumiendo complejidad adicional controlada.

---

# 🧠 ADR 6 — Skeleton Loaders

## 📌 Decisión

Mostrar skeletons durante carga de datos.

## 🎯 Motivación
- Reducir sensación de espera
- Evitar layout shifts

## 🔄 Alternativas
- Spinner simple

## ⚖️ Trade-offs

### ✅ Ventajas
- UX más profesional
- Mejor percepción de performance

### ❌ Desventajas
- Más trabajo visual

## 🧠 Conclusión

Mejora notable en experiencia del usuario.

---

# 🧠 ADR 7 — Deploy desacoplado (Azure)

## 📌 Decisión

Separar frontend y backend:

- Frontend → Azure Static Web Apps
- Backend → Azure App Service

## 🎯 Motivación
- Escalabilidad independiente
- Arquitectura moderna

## 🔄 Alternativas
- Deploy monolítico

## ⚖️ Trade-offs

### ✅ Ventajas
- Flexibilidad
- Mejor distribución de responsabilidades

### ❌ Desventajas
- Configuración más compleja (CORS, env vars)

## 🧠 Conclusión

Se priorizó arquitectura cloud moderna.

---

# 🧠 ADR 8 — Testing strategy

## 📌 Decisión

Combinar:

- Tests unitarios (xUnit + Moq)
- Tests E2E (Playwright)

## 🎯 Motivación

Cubrir:

- Lógica de negocio
- Flujos reales de usuario

## 🔄 Alternativas
- Solo unit tests
- Solo E2E

## ⚖️ Trade-offs

### ✅ Ventajas
- Alta confianza en el sistema
- Cobertura completa

### ❌ Desventajas
- Mayor tiempo de implementación

## 🧠 Conclusión

Se priorizó calidad y confiabilidad del software.

---

Este conjunto de decisiones refleja un enfoque progresivo en la construcción del proyecto,
evolucionando desde un CRUD básico hacia una aplicación con prácticas modernas de
arquitectura, testing, UX y despliegue en la nube.