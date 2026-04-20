# ⚡ Optimistic UI

## 📌 ¿Qué es Optimistic UI?

Optimistic UI es una estrategia donde la interfaz de usuario se actualiza **antes de recibir la respuesta del servidor**, asumiendo que la operación será exitosa.

**En lugar de esperar:**

- Se actualiza la UI inmediatamente
- Se mejora la percepción de velocidad
- Se hace rollback si ocurre un error

---

## 🎯 ¿Por qué usarlo?

**Sin Optimistic UI:**

- La UI espera al backend
- Sensación de lentitud
- Peor experiencia de usuario

**Con Optimistic UI:**

- Interacción instantánea
- Experiencia fluida
- Mayor percepción de rendimiento

---

## 🧠 Flujo general

```bash
Usuario → UI
        ↓
Actualización inmediata (optimistic)
        ↓
Request al backend
        ↓
✔ Éxito → se mantiene
❌ Error → rollback
```
---

## 🧩 Implementación en el proyecto

La lógica se centraliza en el hook:

```typescript
useTareas()
```

**Se implementaron versiones optimistas para:**

- Crear tarea
- Eliminar tarea
- Editar tarea
- Marcar como completada

---

## 🗑️ Delete Optimistic

### 🧠 Idea

Eliminar la tarea inmediatamente del estado local:
```bash
setTareas(prev => prev.filter(t => t.id !== id));
```

### Flujo completo
- Guardar estado previo
- Eliminar de la UI
- Llamar API
- Si falla → rollback

```typescript
const previousTareas = tareas;

setTareas(prev => prev.filter(t => t.id !== id));

try {
  await deleteTarea(id);
} catch (error) {
  setTareas(previousTareas);
}
```

---

## ➕ Create Optimistic

### 🧠 Idea

Crear una tarea temporal antes de que exista en el backend.
```typescript
const tempId = Date.now();
```

### ⚡ Inserción inmediata

```typescript
setTareas(prev => [
  {
    id: tempId,
    titulo: data.titulo,
    descripcion: data.descripcion,
    completada: false,
    fechaCreacion: new Date().toISOString(),
    optimistic: true
  },
  ...prev
]);
```

### 🔄 Reconciliación

Cuando responde el backend:

```typescript
setTareas(prev =>
  prev.map(t => (t.id === tempId ? created : t))
);
```
---

## ✏️ Update Optimistic

### 🧠 Idea

Actualizar la tarea en UI antes del backend:

```typescript
setTareas(prev =>
  prev.map(t =>
    t.id === id
      ? { ...t, ...data, optimistic: true }
      : t
  )
);
```

### 🔁 Flujo
- Guardar estado previo
- Actualizar UI
- Llamar API
- Reemplazar con respuesta real
- Rollback si falla

---

## ✅ Toggle (checkbox) Optimistic

Caso especial de update:
```typescript
completada: !tarea.completada
```

Permite interacción instantánea al marcar tareas.

---

## 🎨 Feedback visual

Se implementaron indicadores visuales para estados optimistas:

### 1. Opacidad
```typescript
tarea.optimistic && "opacity-60"
```

### 2. Deshabilitar interacción
```typescript
pointer-events-none
```

Evita acciones duplicadas mientras se sincroniza.

---

## 🧠 Lecciones aprendidas
- El estado local puede diferir del backend temporalmente
- Es clave manejar rollback correctamente
- TypeScript ayuda a evitar inconsistencias
- Los detalles (IDs, tipos) son críticos

---

## 💡 Decisiones técnicas
- Implementación manual (sin React Query)
- Control total del flujo
- Preparación para migración futura

---

## 🚀 Posibles mejoras futuras
- Undo Delete (acción reversible)
- Indicadores de sincronización más avanzados
- Retry automático en fallos
- Migración a React Query

---

