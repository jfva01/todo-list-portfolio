using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

// Implementamos la interfaz.

namespace TodoApi.Repositories;

public class TareaRepository : ITareaRepository
{
    private readonly TodoDbContext _context;

    public TareaRepository(TodoDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Tarea>> GetAllAsync(long UsuarioId)
    {
        return await _context.Tareas
            .Where(t => t.UsuarioId == UsuarioId)
            .ToListAsync();
    }

    public async Task<Tarea?> GetByIdAsync(int id)
    {
        var tarea = await _context.Tareas.FindAsync(id);
        return tarea!;
    }

    public async Task<Tarea> AddAsync(Tarea tarea)
    {
        _context.Tareas.Add(tarea);
        await _context.SaveChangesAsync();
        return tarea;
    }

    public async Task UpdateAsync(Tarea tarea)
    {
        _context.Tareas.Update(tarea);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var tarea = await _context.Tareas.FindAsync(id);

        _context.Tareas.Remove(tarea!);
        await _context.SaveChangesAsync();
    }
}