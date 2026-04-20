# 🧪 Testing

## 📌 Enfoque general

El proyecto implementa una estrategia de testing en múltiples niveles:

- **Tests unitarios** → validan la lógica de negocio (backend)
- **Tests End-to-End (E2E)** → validan flujos completos (frontend + backend)

El objetivo es asegurar:

- Correcto funcionamiento del sistema
- Prevención de regresiones
- Confianza en cambios futuros

---

## 📊 Estrategia de Testing aplicada

En este proyecto se implementa una estrategia híbrida:

- 🟢 **Unit Tests (Backend)**
  - Validan lógica de negocio (Services)
  - Rápidos y aislados

- 🔴 **E2E Tests (Frontend + Backend)**
  - Validan flujos reales del usuario
  - Multi-browser con Playwright

Actualmente no se implementan tests de integración, priorizando simplicidad y claridad.

---

## 🧱 Tipos de testing implementados

### 1. Tests Unitarios (Backend)

Se enfocan en la capa de **Services**, donde reside la lógica de negocio.

### 🧠 ¿Por qué Services?

- Contienen reglas del sistema
- Son independientes del framework web
- Son fácilmente testeables con mocks

---

### 🧪 Tecnologías utilizadas

- xUnit
- Moq

---

### 🔍 Ejemplo de test

```csharp id="u1v4mx"
[Fact]
public async Task CreateAsync_ShouldCreateTask_WhenDataIsValid()
{
    // Arrange
    var mockRepo = new Mock<ITareaRepository>();
    var service = new TareaService(mockRepo.Object);

    var dto = new CreateTareaDTO
    {
        Titulo = "Nueva tarea",
        Descripcion = "Descripción"
    };

    // Act
    var result = await service.CreateAsync(dto);

    // Assert
    Assert.NotNull(result);
    mockRepo.Verify(r => r.AddAsync(It.IsAny<Tarea>()), Times.Once);
}
```

### ✅ Qué se valida
- Creación de tareas válidas
- Manejo de datos inválidos
- Llamadas correctas al repositorio
- Reglas de negocio

### 💡 Beneficios
- Tests rápidos y aislados
- No dependen de base de datos real
- Permiten detectar errores temprano

---

## 🌐 Tests End-to-End (E2E)

Se implementaron utilizando Playwright para validar flujos completos desde la perspectiva del usuario.

### 🧪 Tecnologías utilizadas
- Playwright
- Testing multi-browser:
  - Chromium
  - Firefox
  - WebKit

### 🔄 Flujo testeado

El flujo principal de la aplicación:

- Login
- Crear tarea
- Marcar como completada
- Eliminar tarea

### 🧠 Ejemplo de test E2E

```csharp id="u1v4mx"
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

### 🔐 storageState (autenticación persistente)

Se utiliza para evitar login en cada test:

```csharp id="u1v4mx"
test.use({ storageState: 'auth.json' });
```

### 🎯 Selectores robustos
- getByRole
- getByTestId
- filtros por texto

Evita tests frágiles

### ⚡ Paralelización
- Tests ejecutados en múltiples navegadores
- Mejora tiempos de ejecución

---

## ⚠️ Desafíos encontrados

Durante la implementación de testing se resolvieron problemas como:

- ❌ Selectores inestables
- ❌ Dependencia del estado inicial
- ❌ Problemas de sincronización (timing)
- ❌ Manejo de autenticación en tests

---

## 💡 Decisiones técnicas
- Separar tests unitarios y E2E
- Priorizar cobertura de lógica de negocio
- Validar flujos reales del usuario
- Evitar tests acoplados a UI frágil

---

## 🚀 Posibles mejoras futuras
- Tests de integración (API + DB)
- Coverage reports (cobertura de código)
- Tests visuales (UI regression)
- CI/CD con ejecución automática de tests

---