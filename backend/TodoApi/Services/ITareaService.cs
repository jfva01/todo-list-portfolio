using TodoApi.Models;

namespace TodoApi.Services;
public interface ITareaService
{
    Task<IEnumerable<Tarea>> GetAllAsync(long usuarioId);
    Task<Tarea?> GetTareaByIdAsync(int id, long usuarioId);
    Task<Tarea> CreateTareaAsync(Tarea tarea);
    Task UpdateTareaAsync(Tarea tarea, long usuarioId);
    Task DeleteTareaAsync(int id, long usuarioId);
}