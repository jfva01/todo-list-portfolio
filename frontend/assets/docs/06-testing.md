# 🧪 Testing

## 📌 Enfoque general

El proyecto implementa una estrategia de testing en múltiples niveles, orientada a validar tanto la lógica interna del sistema como los flujos reales de usuario.

Se combinan:

* **Tests unitarios (backend)** → validan lógica de negocio de forma aislada
* **Tests de integración (backend)** → validan comportamiento real de la API
* **Tests End-to-End (E2E)** → validan el sistema completo desde la perspectiva del usuario

---

## 🎯 Objetivos

* Detectar errores tempranamente
* Prevenir regresiones
* Asegurar consistencia entre frontend y backend
* Permitir refactorizaciones con confianza

---

## 📊 Estrategia de testing

Se adopta un enfoque en tres niveles:

### 🟢 Unit Tests (Backend)

* Enfocados en la capa de **Services**
* Validan reglas de negocio
* Aislados mediante mocks

### 🟡 Integration Tests (Backend)

* Validan endpoints reales de la API
* Incluyen acceso a base de datos
* Verifican autenticación y autorización

### 🔴 E2E Tests (Sistema completo)

* Simulan interacción real de usuario
* Ejecutados en múltiples navegadores
* Validan integración frontend ↔ backend

Este enfoque permite cubrir el sistema desde distintos niveles de confianza.

---

## 🧱 Tests unitarios (Backend)

### 🎯 Alcance

Se testea la capa de **Services**, donde se concentra la lógica de negocio:

* Creación de tareas
* Validaciones de datos
* Reglas del sistema
* Interacción con repositorios

---

### 🧠 Justificación

La capa de Services permite:

* Testear sin dependencia de HTTP
* Evitar acceso a base de datos real
* Validar lógica de forma determinística

---

### 🧪 Tecnologías

* xUnit
* Moq

---

### 🔍 Ejemplo

```csharp
[Fact]
public async Task CreateAsync_ShouldCreateTask_WhenDataIsValid()
{
    var mockRepo = new Mock<ITareaRepository>();
    var service = new TareaService(mockRepo.Object);

    var dto = new CreateTareaDTO
    {
        Titulo = "Nueva tarea",
        Descripcion = "Descripción"
    };

    var result = await service.CreateAsync(dto);

    Assert.NotNull(result);
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Tarea>()), Times.Once);
}
```

---

### ✅ Qué se valida

* Reglas de negocio
* Validación de inputs
* Correcta interacción con repositorios
* Casos exitosos y fallos controlados

---

### 💡 Beneficios

* Tests rápidos y determinísticos
* Independientes de infraestructura
* Facilitan refactorización segura

---

## 🟡 Tests de integración (Backend)

### 🎯 Alcance

Los tests de integración validan el comportamiento real de la API, incluyendo:

* Endpoints HTTP
* Serialización/deserialización
* Integración con base de datos
* Autenticación y autorización

---

### 🧠 Qué se valida

* Respuestas correctas de la API
* Persistencia de datos
* Validación de ownership (seguridad por usuario)
* Comportamiento ante errores reales

---

### ⚙️ Características

* Uso de entorno de testing aislado
* Base de datos de prueba (o en memoria)
* Ejecución a través de la API (sin mocks)

---

### 💡 Ejemplos de casos cubiertos

* Crear tarea autenticado
* Obtener solo tareas del usuario
* Intentar modificar tarea de otro usuario (rechazo)
* Eliminación de tareas

---

### 🚀 Beneficios

* Validación real del sistema
* Mayor confianza que los unit tests
* Detección de problemas de integración

---

### ⚖️ Trade-offs

**Ventajas**

* Alta fidelidad al comportamiento real
* Detecta errores que los mocks no capturan

**Desventajas**

* Más lentos que unit tests
* Mayor complejidad de configuración

---

## 🌐 Tests End-to-End (E2E)

Se utilizan para validar el sistema completo desde la perspectiva del usuario.

---

### 🧪 Tecnologías

* Playwright
* Ejecución multi-browser:

  * Chromium
  * Firefox
  * WebKit

---

### 🔄 Flujos cubiertos

* Autenticación (login)
* Creación de tareas
* Actualización de estado
* Eliminación de tareas

Estos tests validan:

* Integración frontend ↔ backend
* Persistencia de datos
* Manejo de estado en UI

---

### 🧠 Ejemplo

```ts
test('crear y eliminar tarea', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('create-tarea-button').click();
  await page.getByRole('textbox', { name: /título/i }).fill('Test tarea');

  await page.keyboard.press('Enter');

  await expect(page.getByText('Test tarea')).toBeVisible();

  await page.getByTestId('delete-todo-button').click();
});
```

---

## ⚙️ Configuraciones clave

### 🔐 Autenticación persistente

Uso de `storageState` para evitar login en cada test:

```ts
test.use({ storageState: 'auth.json' });
```

---

### 🎯 Selectores robustos

Se priorizan:

* `getByRole`
* `getByTestId`
* queries por texto

Esto reduce fragilidad ante cambios de UI.

---

### ⚡ Paralelización

* Ejecución en múltiples navegadores
* Mejora de tiempos de ejecución

---

## ⚠️ Desafíos abordados

Durante la implementación se resolvieron problemas comunes:

* Selectores inestables
* Dependencia del estado inicial
* Problemas de sincronización (timing)
* Manejo de autenticación en tests

---

## 🔐 Relación con la arquitectura

La estrategia de testing está alineada con la arquitectura del proyecto:

* La separación en capas permite testear **Services de forma aislada**
* El uso de repositorios facilita el uso de **mocks**
* Los tests de integración validan la API real y la base de datos
* La autenticación con JWT se valida en tests de integración y E2E
* La validación de ownership se cubre en múltiples niveles

---

## 🚀 Mejoras futuras

* Reportes de cobertura (coverage)
* Testing visual (UI regression)
* Integración en pipelines CI/CD
* Tests de performance

---

## 🧠 Conclusión

La estrategia de testing implementada cubre múltiples niveles:

* Lógica de negocio (unit tests)
* Integración real del backend (integration tests)
* Flujos completos del sistema (E2E)

Esto permite detectar errores en distintas capas y asegurar un alto nivel de confiabilidad del sistema.
