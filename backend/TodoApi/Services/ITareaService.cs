using TodoApi.Models;
using TodoApi.Repositories;

namespace TodoApi.Services;

public class TareaService : ITareaService
{
    private readonly ITareaRepository _repository;

    public TareaService(ITareaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Tarea>> GetAllTareasAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Tarea?> GetTareaByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Tarea> CreateTareaAsync(Tarea tarea)
    {
        return await _repository.AddAsync(tarea);
    }

    public async Task UpdateTareaAsync(Tarea tarea)
    {
        if (tarea == null)
            throw new ArgumentNullException(nameof(tarea));

        await _repository.UpdateAsync(tarea);
    }

    public async Task DeleteTareaAsync(int id)
    {
        var tarea = await _repository.GetByIdAsync(id);

        if (tarea == null)
            throw new KeyNotFoundException("Tarea no encontrada");

        await _repository.DeleteAsync(id);
    }
}