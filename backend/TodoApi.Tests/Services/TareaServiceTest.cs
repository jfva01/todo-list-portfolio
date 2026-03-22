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

    [Fact]
    public async Task GetAllTareasAsync_ReturnsListOfTareas()
    {
        //Simula datos y valida resultado esperado

        // Arrange
        var tareas = new List<Tarea>
        {
            new Tarea { Id = 1, Titulo = "Test 1" },
            new Tarea { Id = 2, Titulo = "Test 2" }
        };

        _mockRepo.Setup(r => r.GetAllAsync())
                 .ReturnsAsync(tareas);

        // Act
        var result = await _service.GetAllTareasAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
    }

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

    [Fact]
    public async Task UpdateTareaAsync_ShouldCallRepository()
    {
        //Valida que se llamó al repo para actualizar la tarea

        // Arrange
        var tarea = new Tarea { Id = 1, Titulo = "Tarea 1" };

        // Act
        await _service.UpdateTareaAsync(tarea);

        // Assert
        _mockRepo.Verify(r => r.UpdateAsync(tarea), Times.Once);
    }    

    [Fact]
    public async Task DeleteTareaAsync_ShouldCallRepository()
    {
        //Valida que se llamó al repo para eliminar la tarea

        // Arrange
        var tarea = new Tarea { Id = 1, Titulo = "Test" };

        _mockRepo.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(tarea);

        // Act
        await _service.DeleteTareaAsync(1);

        // Assert
        _mockRepo.Verify(r => r.DeleteAsync(1), Times.Once);
    }

    [Fact]
    public async Task GetTareaByIdAsync_WhenNotFound_ReturnsNull()
    {
        //El repositorio devuelve null para un ID que no existe, el servicio también debería devolver null

        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(99))
                .ReturnsAsync((Tarea?)null);

        // Act
        var result = await _service.GetTareaByIdAsync(99);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task DeleteTareaAsync_WhenTareaDoesNotExist_ShouldThrowException()
    {
        // Arrange
        _mockRepo.Setup(r => r.GetByIdAsync(999))
                .ReturnsAsync((Tarea?)null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.DeleteTareaAsync(999)
        );

        // Assert adicional 🔥
        _mockRepo.Verify(r => r.DeleteAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task GetAllTareasAsync_WhenRepositoryThrowsException_ShouldThrow()
    {
        //La DB falla y el repo también debería lanzar la excepción para que el controlador pueda manejarla

        // Arrange
        _mockRepo.Setup(r => r.GetAllAsync())
                .ThrowsAsync(new Exception("DB error"));

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() => _service.GetAllTareasAsync());
    }

    [Fact]
    public async Task CreateTareaAsync_WithEmptyTitle_ShouldStillCallRepository()
    {
        //Simular Create con datos no válidos (título vacío) y verificar que el servicio aún intente crear la tarea, dejando la validación al controlador

        // Arrange
        var tarea = new Tarea { Titulo = "" };

        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Tarea>()))
                .ReturnsAsync(tarea);

        // Act
        var result = await _service.CreateTareaAsync(tarea);

        // Assert
        _mockRepo.Verify(r => r.AddAsync(tarea), Times.Once);
    }

    [Fact]
    public async Task UpdateTareaAsync_ShouldNotCallRepository_WhenTareaIsNull()
    {
        // Act
        await Assert.ThrowsAsync<ArgumentNullException>(() =>
            _service.UpdateTareaAsync(null!)
        );

        // Assert
        _mockRepo.Verify(r => r.UpdateAsync(It.IsAny<Tarea>()), Times.Never);
    }

    [Fact]
    public async Task CreateTareaAsync_ShouldPassCorrectDataToRepository()
    {
        // Verificar parámetros enviados al repositorio al crear una tarea, los datos que salen del service son correctos

        // Arrange
        Tarea? captured = null;

        _mockRepo.Setup(r => r.AddAsync(It.IsAny<Tarea>()))
                .Callback<Tarea>(t => captured = t)
                .ReturnsAsync((Tarea t) => t);

        var tarea = new Tarea { Titulo = "Test avanzado" };

        // Act
        await _service.CreateTareaAsync(tarea);

        // Assert
        Assert.NotNull(captured);
        Assert.Equal("Test avanzado", captured.Titulo);
    }
}

