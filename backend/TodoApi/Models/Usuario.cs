namespace TodoApi.Models
{
    public class Usuario
    {
        public long Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public ICollection<Tarea> Tarea { get; set; } = new List<Tarea>();
    }
}