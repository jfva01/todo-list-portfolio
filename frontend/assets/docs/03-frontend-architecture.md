# 🧱 Arquitectura Frontend

## 📌 Enfoque general

El frontend fue desarrollado utilizando **React + TypeScript + Vite**, con una arquitectura basada en separación de responsabilidades entre:

- UI (componentes)
- lógica de negocio (custom hooks)
- acceso a datos (API layer)

El objetivo es mantener el código desacoplado, reutilizable y fácil de escalar.

---

## 🏗️ Estructura del proyecto

```bash
/src
  /api        # cliente HTTP y llamadas a endpoints
  /components # componentes UI reutilizables
  /hooks      # lógica de negocio (estado y side effects)
  /types      # tipado TypeScript
```

---

## 🧠 Separación de responsabilidades

### 1. API Layer (/api)

Encapsula todas las llamadas HTTP.

**Ejemplo:**
```javascript
export const createTarea = async (data: { titulo: string; descripcion?: string }) => {
  return apiClient<Tarea>("/api/tareas", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
```

**Decisiones clave**
- Centralizar llamadas HTTP
- Evitar lógica de red en componentes
- Facilitar cambios futuros (ej: cambiar fetch por axios o React Query)

### 2. Custom Hooks (/hooks)

Aquí vive la lógica principal del sistema.

**El hook useTareas gestiona:**
- Estado global de tareas
- Fetching de datos
- Operaciones CRUD
- Optimistic updates
- Manejo de errores

**Ejemplo:**
```javascript
const { tareas, createOptimistic, deleteOptimistic, editOptimistic } = useTareas();
```

**Decisiones clave**
- Separar lógica de UI
- Reutilización de comportamiento
- Preparar el código para escalar

### 3. Componentes (/components)

Encargados únicamente de la presentación.

**Ejemplos:**
- TaskList
- TaskItem
- TareaForm
- Notification
- ConfirmModal

**Decisiones clave**
- Componentes lo más “puros” posible
- Reciben datos y callbacks por props
- No contienen lógica de negocio compleja

---

## ⚡ Manejo del estado

El estado se maneja manualmente mediante React Hooks:

- useState
- useEffect

**Ejemplo:**
```javascript
const [tareas, setTareas] = useState<Tarea[]>([]);
```

---

## 🔄 Flujo de datos
- El usuario interactúa con la UI
- El componente llama a una función del hook (useTareas)
- El hook actualiza el estado local
- Se realiza la llamada a la API
- Se sincroniza el estado final

---

## ⚡ Optimistic UI

Se implementó una estrategia de actualización optimista:

- La UI se actualiza antes de recibir respuesta del backend
- Se mejora la percepción de rendimiento
- Se implementa rollback en caso de error

**Ejemplo:**
```javascript
setTareas(prev => prev.filter(t => t.id !== id));
```
---

## 🧊 Skeleton Loaders

Se utilizan skeleton loaders para mejorar la experiencia de carga:
```javascript
{loading && !tareas.length ? (
  <TodoListSkeleton />
) : (
  <TaskList ... />
)}
```

---

## 🎯 Manejo de errores
- Manejo de errores en hooks
- Feedback al usuario mediante notificaciones
- Prevención de estados inconsistentes

---

## 🎨 UX y microinteracciones
- Animaciones suaves con Tailwind
- Highlight en tareas editadas
- Deshabilitación de interacción en estado optimista
- Feedback inmediato en acciones del usuario

---

## ⚠️ Decisión técnica clave

No se utilizó React Query en esta etapa.

**Motivo:**

Se buscó comprender e implementar manualmente:

- Manejo de estado
- Sincronización con API
- Control de loading y errores
- Optimistic updates

Esto permite una base sólida antes de abstraer con librerías.

---

## 🔔 Sistema de Notificaciones y Undo Delete

Se implementó un sistema de notificaciones personalizado (toast system) sin librerías externas.

**Características:**
- Múltiples notificaciones simultáneas (stack vertical)
- Auto-dismiss configurable (default: 3s)
- Barra de progreso visual sincronizada con el timeout
- Acciones embebidas (ej: Deshacer eliminación)

**Ejemplo de uso:**
```typescript
showNotification({
  message: `Tarea "${item.titulo}" eliminada`,
  type: "info",
  actionLabel: "Deshacer",
  onAction: () => undoDelete(...)
});
```

### 🧠 Undo Delete (custom hook)

Se encapsuló la lógica en un hook independiente:
```typescript
useUndoDelete()
```

**Responsabilidades:**
- Eliminar elemento de la UI inmediatamente (optimistic)
- Programar eliminación real con setTimeout
- Permitir cancelación (undo)
- Restaurar elemento en su posición original
- Sincronizar con sistema de notificaciones

### 💡 Decisión técnica

No se utilizó librería como:
- react-hot-toast
- sonner

**Motivo:**
Comprender manejo manual de:
- Estado
- Timers
- Sincronización UI/UX
- Acciones asincrónicas

---

## 💡 Posibles mejoras futuras
- Migración a React Query
- Normalización de estado
- Caché inteligente
- Paginación o virtualización
- Migrar a librería especializada para reducir complejidad

---

