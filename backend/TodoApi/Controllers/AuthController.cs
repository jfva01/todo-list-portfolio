using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/Auth")]
    public class AuthController : ControllerBase
    {
        private readonly TodoDbContext _context;
        private readonly ILogger<TareasController> _logger;
        private readonly JwtService _jwtService;

        public AuthController(TodoDbContext context, ILogger<TareasController> logger, JwtService jwtService)
        {
            _context = context;
            _logger = logger;
            _jwtService = jwtService;
        }

        [HttpPost("RegistroUsuario")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            _logger.LogInformation("Creando nuevo usuario.");
            // Verificar si el correo ya está registrado
            var existingUser = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null){
                _logger.LogError($"El correo ya está registrado. Email: {request.Email}");
                return BadRequest("El correo ya está registrado.");
            }
            // Creamos el Hash de la contraseña usando BCrypt
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

            _logger.LogInformation("Usuario registrado correctamente. Email: " + user.Email, user.Email);
            return Ok("Usuario registrado correctamente.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(RegisterRequestDto request)
        {
            _logger.LogInformation("Intentando iniciar sesión.");
            // Buscar el usuario por correo electrónico
            var user = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            // Verificar si el usuario existe
            if (user == null)
            {
                _logger.LogError("Credenciales no válidas.");
                return Unauthorized("Credenciales no válidas.");
            }
            // Verificar la contraseña usando BCrypt
            var isValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

            if (!isValid)
            {
                _logger.LogError("Credenciales no válidas.");
                return Unauthorized("Credenciales no válidas.");
            }
            // Generar el token JWT para el usuario autenticado
            var token = _jwtService.GenerateToken(user);

            _logger.LogInformation("Sesión iniciada correctamente. Usuario: " + user.Email, user.Email);
            // Devolver el token JWT al cliente
            return Ok(new { token });
        }
    }
}