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

    public async Task<IEnumerable<Tarea>> GetAllAsync(long usuarioId)
    {   
        return await _repository.GetAllAsync(usuarioId);
    }

    public async Task<Tarea?> GetTareaByIdAsync(int id, long usuarioId)
    {
        return await _repository.GetByIdAsync(id, usuarioId);
    }

    public async Task<Tarea> CreateTareaAsync(Tarea tarea)
    {
        return await _repository.AddAsync(tarea);
    }

    public async Task UpdateTareaAsync(Tarea tarea, long usuarioId)
    {
        if (tarea == null)
            throw new ArgumentNullException(nameof(tarea));

        var existing = await _repository.GetByIdAsync(tarea.Id, usuarioId);

        if (existing == null)
            throw new KeyNotFoundException();

        await _repository.UpdateAsync(tarea);
    }

    public async Task DeleteTareaAsync(int id, long usuarioId)
    {
        var tarea = await _repository.GetByIdAsync(id, usuarioId);

        if (tarea == null)
            throw new KeyNotFoundException("Tarea no encontrada");

        await _repository.DeleteAsync(id);
    }
}