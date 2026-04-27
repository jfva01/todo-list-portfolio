using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

    private long GetUserId()
    {
        // Método auxiliar para obtener el ID del usuario autenticado
        return long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();

        _logger.LogInformation("Intentando obtener todas las tareas del usuario {userId}.", userId);

        try{
            var tareas = await _service.GetAllAsync(userId);
            
            _logger.LogInformation("Tareas de usuario {userId} obtenidas exitosamente.", userId);

            return Ok(tareas);
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tareas del usuario {userId}", userId);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("Intentando obtener tarea por ID {id}.", id);
        // Obtener el ID del usuario autenticado
        var userId = GetUserId();

        var tarea = await _service.GetTareaByIdAsync(id, userId);

        if (tarea == null)
            return NotFound();

        _logger.LogInformation("Tarea obtenida exitosamente para el usuario {userId}.", userId);

        return Ok(tarea);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTareaDto dto)
    {
        _logger.LogInformation("Intentando crear nueva tarea.");

        var userId = GetUserId();

        if (string.IsNullOrWhiteSpace(dto.Titulo))
            return BadRequest("Título es obligatorio");

        var tarea = new Tarea
        {
            Titulo = dto.Titulo,
            Descripcion = dto.Descripcion,
            UsuarioId = userId
        };

        var nueva = await _service.CreateTareaAsync(tarea);

        var resultDto = new TareaDto
        {
            Id = nueva.Id,
            Titulo = nueva.Titulo,
            Descripcion = nueva.Descripcion,
            Completada = false,
            FechaCreacion = nueva.FechaCreacion,
            UsuarioId = userId
        };

        _logger.LogInformation("Nueva tarea de usuario {userId} creada con id {id}.", userId, resultDto.Id);
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateTareaDto dto)
    {
        _logger.LogInformation("Intentando actualizar tarea con id {id}.", id);
        // Obtener el ID del usuario autenticado
        var userId = GetUserId();

        var tareaExistente = await _service.GetTareaByIdAsync(id, userId);

        if (tareaExistente == null)
            return NotFound();

        if (dto.Titulo != null)
            tareaExistente.Titulo = dto.Titulo;

        if (dto.Descripcion != null)
            tareaExistente.Descripcion = dto.Descripcion;

        if (dto.Completada.HasValue)
            tareaExistente.Completada = dto.Completada.Value;

        try
        {
            await _service.UpdateTareaAsync(tareaExistente, userId);
            _logger.LogInformation("Tarea de usuario {userId} actualizada exitosamente.", userId);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        _logger.LogInformation("Intentando eliminar tarea con id {id}.", id);

        // Obtener el ID del usuario autenticado
        var userId = GetUserId();

        try
        {
            await _service.DeleteTareaAsync(id, userId);
            _logger.LogInformation("Tarea de usuario {userId} eliminada exitosamente.", userId);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }

        return NoContent();
    }
}