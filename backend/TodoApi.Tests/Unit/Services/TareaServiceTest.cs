using Moq;
using TodoApi.Models;
using TodoApi.Repositories;
using TodoApi.Services;

namespace TodoApi.Tests.Services;

public class TareaServiceTests
{
    private readonly Mock<ITareaRepository> _mockRepo;
    private readonly TareaService _service;

    public TareaServiceTests()
    {
        _mockRepo = new Mock<ITareaRepository>();
        _service = new TareaService(_mockRepo.Object);
    }

/*
    Arrange → preparar datos
    Act     → ejecutar método
    Assert  → verificar resultado
*/
#region Get Tests
    [Fact]
    public async Task GetAllAsync_ReturnsListOfTareas()
    {
        // El servicio devuelve la lista de tareas que el repositorio le proporciona, sin modificaciones

        // Arrange
        var usuarioId = 1L;

        var tareas = new List<Tarea>
        {
            new Tarea { Id = 1, Titulo = "Test 1", UsuarioId = usuarioId },
            new Tarea { Id = 2, Titulo = "Test 2", UsuarioId = usuarioId }
        };

        _mockRepo.Setup(r => r.GetAllAsync(usuarioId))
                .ReturnsAsync(tareas);

        // Act
        var result = await _service.GetAllAsync(usuarioId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetTareaByIdAsync_WhenNotFound_ReturnsNull()
    {
        //El repositorio devuelve null para un ID que no existe, el servicio también debería devolver null

        // Arrange
        var usuarioId = 1L;
        var tareaId = 99;

        _mockRepo.Setup(r => r.GetByIdAsync(tareaId, usuarioId))
        .ReturnsAsync((Tarea?)null);

        // Act
        var result = await _service.GetTareaByIdAsync(tareaId, usuarioId);

        // Assert
        Assert.Null(result);
    }

#endregion
#region Create Tests
    [Fact]
    public async Task CreateTareaAsync_ShouldReturnCreatedTarea()
    {
        //Simula DB asignando ID a la tarea creada

        // Arrange
        var tarea = new Tarea { Titulo = "Nueva tarea" };

        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Tarea>()))
                .ReturnsAsync((Tarea t) =>
                {
                    t.Id = 1;
                    return t;
                });

        // Act
        var result = await _service.CreateTareaAsync(tarea);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Nueva tarea", result.Titulo);
    }

#endregion
#region Update Tests
    [Fact]
    public async Task UpdateTareaAsync_ShouldCallRepository_WhenUserIsOwner()
    {
        // El servicio llama al repo para actualizar solo si el usuario es el dueño de la tarea

        // Arrange
        var usuarioId = 1L;
        var tarea = new Tarea { Id = 1, UsuarioId = usuarioId };

        _mockRepo.Setup(r => r.GetByIdAsync(1, usuarioId))
        .ReturnsAsync(tarea);

        // Act
        await _service.UpdateTareaAsync(tarea, usuarioId);

        // Assert
        _mockRepo.Verify(r => r.UpdateAsync(tarea), Times.Once);
    }

    [Fact]
    public async Task UpdateTareaAsync_ShouldNotCallRepository_WhenTareaIsNull()
    {
        // El servicio lanza excepción si la tarea es null, y no llama al repo para actualizar

        // Act
        await Assert.ThrowsAsync<ArgumentNullException>(() =>
            _service.UpdateTareaAsync(null!, 1)
        );

        // Assert
        _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Tarea>()), Times.Never);
    }

#endregion
#region Delete Tests
    [Fact]
    public async Task DeleteTareaAsync_ShouldCallRepository_WhenUserIsOwner()
    {
        // El servicio llama al repo para eliminar solo si el usuario es el dueño de la tarea

        // Arrange
        var usuarioId = 1L;
        var tarea = new Tarea { Id = 1, UsuarioId = usuarioId };

        _mockRepo.Setup(r => r.GetByIdAsync(1, usuarioId))
            .ReturnsAsync(tarea);

        // Act
        await _service.DeleteTareaAsync(1, usuarioId);

        // Assert
        _mockRepo.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task DeleteTareaAsync_WhenTareaDoesNotExist_ShouldThrowException()
    {
        // El servicio lanza excepción si la tarea no existe, y no llama al repo para eliminar

        // Arrange
        var usuarioId = 1L;
        var tareaId = 999;

        _mockRepo.Setup(r => r.GetByIdAsync(tareaId, usuarioId))
            .ReturnsAsync((Tarea?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.DeleteTareaAsync(tareaId, usuarioId)
        );

        // Assert adicional
        _mockRepo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
    }
#endregion
#region Additional Tests
    [Fact]
    public async Task GetAllAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        //La DB falla y el repo también debería lanzar la excepción para que el controlador pueda manejarla

        // Arrange
        var usuarioId = 1L;

        _mockRepo.Setup(r => r.GetAllAsync(usuarioId))
            .ThrowsAsync(new Exception("DB error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => 
            _service.GetAllAsync(usuarioId));
    }
#endregion
}

