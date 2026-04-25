using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Repositories;
using TodoApi.Services;

namespace TodoApi.Tests.Integration;

public class TareaServiceIntegrationTests
{
    private TodoDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<TodoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // DB única por test
            .Options;

        return new TodoDbContext(options);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnOnlyUserTasks()
    {
        // Valida que el sistema (repo + service) solo retorna tareas del usuario

        // Arrange
        using var context = GetDbContext();

        context.Tareas.AddRange(
            new Tarea { Id = 1, UsuarioId = 1, Titulo = "Mía" },
            new Tarea { Id = 2, UsuarioId = 2, Titulo = "No mía" }
        );

        await context.SaveChangesAsync();

        var repo = new TareaRepository(context);
        var service = new TareaService(repo);

        // Act
        var result = await service.GetAllAsync(1);

        // Assert
        Assert.Single(result);
        Assert.All(result, t => Assert.Equal(1, t.UsuarioId));
    }

    [Fact]
    public async Task GetTareaByIdAsync_ShouldNotReturnTaskFromAnotherUser()
    {
        // Integration test para validar que GetById también respeta el filtro de UsuarioId

        // Arrange
        using var context = GetDbContext();

        context.Tareas.AddRange(
            new Tarea { Id = 1, UsuarioId = 1, Titulo = "Mía" },
            new Tarea { Id = 2, UsuarioId = 2, Titulo = "No mía" }
        );

        await context.SaveChangesAsync();

        var repo = new TareaRepository(context);
        var service = new TareaService(repo);

        // Act
        var result = await service.GetTareaByIdAsync(2, 1); // tarea de otro usuario

        // Assert
        Assert.Null(result); // La tarea existe pero no pertenece al usuario
    }

    [Fact]
    public async Task GetTareaByIdAsync_ShouldReturnTask_WhenUserIsOwner()
    {
        // Valida que GetById devuelve la tarea si el usuario es el dueño

        // Arrange
        using var context = GetDbContext();

        context.Tareas.Add(
            new Tarea { Id = 1, UsuarioId = 1, Titulo = "Mía" }
        );

        await context.SaveChangesAsync();

        var repo = new TareaRepository(context);
        var service = new TareaService(repo);

        var result = await service.GetTareaByIdAsync(1, 1);

        Assert.NotNull(result);
        Assert.Equal(1, result!.UsuarioId);
    }
}