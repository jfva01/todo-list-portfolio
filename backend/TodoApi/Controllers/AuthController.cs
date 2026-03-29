using Microsoft.AspNetCore.Mvc;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TodoDbContext _context;
        private readonly ILogger<TareasController> _logger;

        public AuthController(TodoDbContext context, ILogger<TareasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("RegistroUsuario")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            _logger.LogInformation("Creando nuevo usuario.");
            // Verificar si el correo ya está registrado
            var existingUser = _context.Usuarios
                .FirstOrDefault(u => u.Email == request.Email);

            if (existingUser != null){
                _logger.LogError("El correo ya está registrado.");
                return BadRequest("El correo ya está registrado.");
            }
            // Hash de la contraseña usando BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new Usuario
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FechaCreacion = DateTime.UtcNow
            };
            // Guardar el nuevo usuario en la base de datos
            _context.Usuarios.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Usuario registrado correctamente.");
            return Ok("Usuario registrado correctamente.");
        }
    }
}