namespace TodoApi.DTOs;

public class TareaDto
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Completada { get; set; }

    public DateTime FechaCreacion { get; set; }
}