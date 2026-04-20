# 🧱 Arquitectura Backend

## 📌 Enfoque general

El backend fue desarrollado utilizando **ASP.NET Core Web API (.NET 8)** siguiendo una arquitectura en capas, incorporando separación entre modelo de dominio y contratos de API mediante el uso de DTOs.

**El objetivo principal es lograr un sistema:**

- Mantenible
- Testeable
- Desacoplado
- Preparado para escalar

---

## 🏗️ Estructura del proyecto

El backend está organizado en las siguientes capas:

- **Controllers**
- **Services**
- **Repositories**
- **Data**
- **Models**
- **DTOs**
- **Middleware**

Cada capa cumple una responsabilidad específica dentro del flujo de la aplicación.

---

## 🔄 Flujo de una solicitud (Request Lifecycle)

El procesamiento de una solicitud en la API sigue una arquitectura en capas bien definida, donde cada componente cumple una responsabilidad específica.

### 📡 Flujo general
```bash
Cliente
  ↓
Controller (DTO entrada)
  ↓
Service (lógica + mapping)
  ↓
Repository (EF Core)
  ↓
Database
  ↑
Repository
  ↑
Service (DTO salida)
  ↑
Controller
  ↑
Cliente
```

### 🔍 Paso a paso detallado

#### 1. Cliente (Frontend)
- Envía una solicitud HTTP (GET, POST, PUT, DELETE)
- Incluye datos en formato JSON (DTO de entrada)
- Puede incluir token JWT en headers para autenticación

#### 2. Controller (Capa de entrada)
- Recibe la solicitud HTTP
- Valida el modelo de entrada (DTO)
- No contiene lógica de negocio (solo orquestación)
- Llama al servicio correspondiente

**Ejemplo:**
```csharp
[HttpPost]
public async Task<IActionResult> Create(CreateTareaDTO dto)
{
    var tarea = await _tareaService.CreateAsync(dto);
    return Ok(tarea);
}
```

#### 3. DTO (Data Transfer Object)
- Define el contrato de entrada y salida de la API
- Evita exponer directamente las entidades del dominio
- Permite validar y transformar datos

**Ejemplo:**
- CreateTareaDTO → entrada
- TareaDTO → salida

#### 4. Service (Lógica de negocio)
- Contiene las reglas del sistema
- Orquesta operaciones
- Maneja validaciones complejas
- Transforma DTO → Model

**Ejemplo:**
```csharp
public async Task<TareaDTO> CreateAsync(CreateTareaDTO dto)
{
    var tarea = new Tarea
    {
        Titulo = dto.Titulo,
        Descripcion = dto.Descripcion,
        FechaCreacion = DateTime.UtcNow
    };

    await _repository.AddAsync(tarea);

    return MapToDTO(tarea);
}
```

#### 5. Repository (Acceso a datos)
- Encapsula la interacción con la base de datos
- Usa Entity Framework Core
- Evita que el Service dependa de EF directamente

**Ejemplo:**
```csharp
public async Task AddAsync(Tarea tarea)
{
    _context.Tareas.Add(tarea);
    await _context.SaveChangesAsync();
}
```

#### 6. Database (Persistencia)
- SQL Server (Azure SQL en producción)
- Manejado mediante EF Core (DbContext)

#### 7. Respuesta (Response)
- Fluye en sentido inverso:
```bash
Database → Repository → Service → Controller → Cliente
```
- Se devuelve un DTO (no la entidad directa)

---

## 🔄 Mapeo entre DTO y Modelo

Actualmente el mapeo se realiza manualmente dentro de los Services.

**Ventajas:**
- Control total sobre los datos transformados
- Mayor claridad en lógica de negocio

**Desventajas:**
- Código repetitivo
- Escala peor con muchos DTOs

En proyectos más grandes, se puede utilizar herramientas como AutoMapper.

---

## ⚙️ Inyección de dependencias

Se utiliza el contenedor de dependencias de .NET para registrar servicios:

**Ejemplo:**

```csharp
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
```
---

## ⚠️ Manejo de errores
**Centralizado mediante:**
ExceptionMiddleware

**Permite:**
- Respuestas consistentes
- Logging
- Evitar try/catch repetitivos en controllers

---

## 🧩 Cross-Cutting Concerns

Son funcionalidades transversales que afectan a toda la aplicación:

- Manejo de errores global → ExceptionMiddleware
- Autenticación y autorización → JWT
- Logging
- Configuración (appsettings)

Esto permite mantener las capas limpias sin mezclar responsabilidades.

---

## 🔐 Autenticación
**Implementada con:** JWT

**Flujo:**
- Usuario se autentica (AuthController)
- Se genera token (JwtService)
- Cliente lo envía en headers:
```bash
Authorization: Bearer <token>
```
- Middleware valida acceso

---

## 💡 Beneficios de este enfoque
- Separación clara de responsabilidades
- Código mantenible y escalable
- Fácil testeo (Services mockeables)
- API desacoplada del modelo de datos
- Mayor seguridad (uso de DTOs)

---

## 🧪 Testabilidad

La arquitectura permite testing aislado:
- Tests unitarios sobre Services con xUnit
- Dependencias mockeadas con Moq para simular repositorios
- Sin necesidad de acceder a la base de datos real (tests aislados)

---

## ⚠️ Trade-offs
- Mayor complejidad inicial
- Más capas que mantener
- Overhead en proyectos pequeños

---

## 💡 Posibles mejoras futuras
- Uso de AutoMapper para reducir mapeo manual
- Incorporar validación con FluentValidation
- Implementar patrón Unit of Work (si escala el proyecto)
- Paginación en endpoints
- Cacheo de consultas frecuentes