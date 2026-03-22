using TodoApi.Models;

namespace TodoApi.Services;

public interface ITareaService
{
    Task<IEnumerable<Tarea>> GetAllTareasAsync();

    Task<Tarea?> GetTareaByIdAsync(int id);

    Task<Tarea> CreateTareaAsync(Tarea tarea);

    Task UpdateTareaAsync(Tarea tarea);

    Task DeleteTareaAsync(int id);
}