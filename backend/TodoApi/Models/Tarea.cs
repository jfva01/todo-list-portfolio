namespace TodoApi.Models
{
    public class Tarea
    {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public bool Completada { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
        public long UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}