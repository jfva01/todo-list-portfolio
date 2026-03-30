using TodoApi.Models;

// Definimos qué operaciones existen

namespace TodoApi.Repositories;

public interface ITareaRepository
{
    Task<IEnumerable<Tarea>> GetAllAsync(long UsuarioId);

    Task<Tarea?> GetByIdAsync(int id);

    Task<Tarea> AddAsync(Tarea tarea);

    Task UpdateAsync(Tarea tarea);

    Task DeleteAsync(int id);
}