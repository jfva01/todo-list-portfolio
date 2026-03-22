using System.ComponentModel.DataAnnotations; // Para validaciones automáticas

namespace TodoApi.DTOs;

public class UpdateTareaDto
{
    //Retorna 400 con detalles del error si no se cumplen las validaciones
    [Required(ErrorMessage = "El título es obligatorio")]
    [MaxLength(100, ErrorMessage = "Máximo 100 caracteres")]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Máximo 500 caracteres")]
    public string? Descripcion { get; set; }

    public bool Completada { get; set; }
}