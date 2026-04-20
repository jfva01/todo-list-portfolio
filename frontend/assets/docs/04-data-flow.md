# 🔄 Flujo de Datos (Frontend ↔ Backend)

## 📌 Enfoque general

La aplicación sigue un flujo de datos basado en cliente-servidor, donde:

- El frontend (React) gestiona la interacción del usuario
- El backend (ASP.NET Core API) gestiona la lógica de negocio y persistencia
- La comunicación se realiza mediante HTTP (REST API)

---

## 🧭 Flujo general

```bash
Usuario → UI (React)
        ↓
Custom Hook (useTareas)
        ↓
API Layer (apiClient)
        ↓
HTTP Request
        ↓
Backend (Controller → Service → Repository → DB)
        ↓
HTTP Response
        ↓
Hook actualiza estado
        ↓
UI se re-renderiza
```
---

## 🧠 Flujo detallado paso a paso

### 1. Interacción del usuario

El usuario realiza una acción:

- Crear tarea
- Editar tarea
- Eliminar tarea
- Marcar como completada

---

### 2. Componente UI

Ejemplo (TareaForm, TaskItem):
```typescript
onClick={() => handleDelete(tarea.id)}
```
El componente no llama directamente a la API, sino que delega en el hook.

---

### 3. Custom Hook (useTareas)

El hook centraliza la lógica:
```typescript
await deleteOptimistic(id);
```

**Responsabilidades:**
- Manejo de estado (useState)
- Manejo de loading
- Lógica de negocio frontend
- Optimistic updates
- Manejo de errores

---

### 4. API Layer (apiClient)

Encapsula la comunicación HTTP:
```typescript
return fetch(`${BASE_URL}/api/tareas`, config);
```
**Beneficios:**
- Centralización de requests
- Manejo uniforme de headers (JWT)
- Manejo de errores HTTP

---

### 5. Backend

**Flujo interno:**
```bash
Controller → Service → Repository → Database
```
- Controller recibe DTO
- Service aplica lógica
- Repository accede a datos
- Se retorna un DTO como respuesta

---

### 6. Respuesta y actualización de estado

El hook recibe la respuesta:
```typescript
setTareas(updatedTareas);
```
Esto provoca: Re-render automático de la UI

---

## ⚡ Optimistic UI (flujo especial)

En operaciones críticas (create, update, delete): La UI se actualiza ANTES de la respuesta del servidor

**Ejemplo: eliminación**
```typescript
setTareas(prev => prev.filter(t => t.id !== id));
```
Luego:

- ✔ éxito → se mantiene
- ❌ error → rollback
```typescript
setTareas(previousTareas);
```
---

## 🧊 Skeleton Loaders

Durante la carga inicial:
```typescript
{loading && !tareas.length ? (
  <TodoListSkeleton />
) : (
  <TaskList />
)}
```
Mejora la percepción de rendimiento

---

## 🔁 Sincronización de estado

Se manejan dos tipos de estado:

**1. Estado remoto (backend)**
- Fuente de verdad real

**2. Estado local (frontend)**
- Representación temporal
- Puede adelantarse (optimistic)

---

## ⚠️ Problemas resueltos

Durante el desarrollo se abordaron desafíos como:

- ❌ Estados inconsistentes en updates optimistas
- ❌ Errores por diferencias entre DTO y modelo
- ❌ UI bloqueada esperando respuesta del backend
- ❌ Manejo de errores en cascada

---

## 💡 Decisiones técnicas clave
- Uso de custom hooks en lugar de librerías externas
- Implementación manual de optimistic UI
- Separación clara entre UI, lógica y acceso a datos
- Centralización de llamadas HTTP

---

## 🚀 Posibles mejoras futuras
- Migración a React Query (manejo automático de cache)
- Retry automático de requests fallidos
- Cache de datos
- Sincronización en tiempo real (WebSockets)

---