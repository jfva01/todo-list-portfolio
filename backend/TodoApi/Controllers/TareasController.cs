using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TareasController : ControllerBase
{
    private readonly ITareaService _service;

    private readonly ILogger<TareasController> _logger;

    public TareasController(ITareaService service, ILogger<TareasController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("Obteniendo todas las tareas.");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            _logger.LogError("No se pudo obtener el ID del usuario autenticado.");
            return Unauthorized("No se pudo obtener el ID del usuario autenticado.");
        }

        var tareas = await _service.GetAllAsync(long.Parse(userId));

        return Ok(tareas);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation($"Obteniendo tarea por ID {id}.");
        // Obtener el ID del usuario autenticado
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            _logger.LogError("No se pudo obtener el ID del usuario autenticado.");
            return Unauthorized("No se pudo obtener el ID del usuario autenticado.");
        }

        var tarea = await _service.GetTareaByIdAsync(id);

        if (tarea == null){
            _logger.LogError($"No existe una tarea con id {id}.");
            return NotFound($"No existe una tarea con id {id}.");
        }
        // Verificar que la tarea pertenece al usuario autenticado
        if (tarea.UsuarioId != long.Parse(userId))
        {
            _logger.LogWarning($"El usuario {userId} intentó acceder a una tarea que no le pertenece.");
            return Forbid();
        }

        _logger.LogInformation($"Tarea con ID {id} encontrada correctamente.");

        return Ok(tarea);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTareaDto dto)
    {
        _logger.LogInformation("Creando nueva tarea.");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            _logger.LogError("No se pudo obtener el ID del usuario autenticado.");
            return Unauthorized("No se pudo obtener el ID del usuario autenticado.");
        }

        var tarea = new Tarea
        {
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            UsuarioId = long.Parse(userId)
        };

        var nueva = await _service.CreateTareaAsync(tarea);

        var resultDto = new TareaDto
        {
            Id = nueva.Id,
            Titulo = nueva.Titulo,
            Descripcion = nueva.Descripcion,
            Completada = false,
            FechaCreacion = nueva.FechaCreacion,
            UsuarioId = long.Parse(userId)
        };

        _logger.LogInformation($"Nueva tarea creada con id {resultDto.Id}.");
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTareaDto dto)
    {
        _logger.LogInformation($"Intentando actualizar tarea con id {id}.");
        // Obtener el ID del usuario autenticado
        var userId = long.Parse(
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
        );

        var tareaExistente = await _service.GetTareaByIdAsync(id);

        if (tareaExistente == null)
        {
            _logger.LogError($"No se encontró tarea con id {id} para actualizar.");
            return NotFound($"No existe una tarea con id {id}.");
        }
        // Verificar que la tarea pertenece al usuario autenticado
        if (tareaExistente.UsuarioId != userId)
        {
            _logger.LogWarning($"El usuario {userId} intentó modificar una tarea que no le pertenece.");
            return Forbid();
        }

        // Mapear DTO → entidad (solo actualizar campos proporcionados)
        if (dto.Titulo != null)
        {
            tareaExistente.Titulo = dto.Titulo;
        }
        if (dto.Descripcion != null)
        {
            tareaExistente.Descripcion = dto.Descripcion;
        }
        if (dto.Completada.HasValue)
        {
            tareaExistente.Completada = dto.Completada.Value;
        }

        await _service.UpdateTareaAsync(tareaExistente);

        _logger.LogInformation($"Tarea con id {id} actualizada correctamente.");

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation($"Intentando eliminar tarea con id {id}", id);

        // Obtener el ID del usuario autenticado
        var userId = long.Parse(
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value
        );

        var tareaExistente = await _service.GetTareaByIdAsync(id);

        if (tareaExistente == null)
        {
            _logger.LogWarning($"No se encontró tarea con id {id} para eliminar.");
            return NotFound($"No existe una tarea con id {id}.");
        }
        // Verificar que la tarea pertenece al usuario autenticado
        if (tareaExistente.UsuarioId != userId)
        {
            _logger.LogWarning($"El usuario {userId} intentó eliminar una tarea que no le pertenece.");
            return Forbid();
        }

        await _service.DeleteTareaAsync(id);

        _logger.LogInformation($"Tarea con id {id}, eliminada correctamente.");
        
        return NoContent();
    }
}