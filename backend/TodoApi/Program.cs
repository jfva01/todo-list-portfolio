using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Middleware;
using TodoApi.Repositories;
using TodoApi.Services;
using Serilog;
using Serilog.Sinks.MSSqlServer; //Soporta múltiples destinos (DB, archivo, consola, etc.)
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

if(string.IsNullOrWhiteSpace(connectionString)){
    throw new InvalidOperationException(
        "La cadena de conexión 'DefaultConnection' no está configurada."
    );
}

// Usamos Inyección de Dependencias para el contexto de la base de datos
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Usamos inyección de Dependencias para los repositorios y servicios
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddHostedService<DemoCleanupService>();

/*
    LogInformation → flujo normal
    LogWarning → comportamiento raro
    LogError → fallos reales
*/

try
{
    // Habilitamos el auto-logging de errores internos de Serilog para diagnosticar problemas de configuración.
    Serilog.Debugging.SelfLog.Enable(msg =>
    {
        Console.WriteLine(msg);
    });

    // Validamos que la cadena de conexión no sea nula o vacía antes de configurar el logger.
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new Exception("Connection string de Serilog es null o vacía.");
    }

    // Configuramos Serilog para registrar en consola y en una tabla de SQL Server. 
    // Ajustamos los niveles de log para evitar ruido excesivo.
    Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.MSSqlServer(
        connectionString: connectionString,
        sinkOptions: new MSSqlServerSinkOptions
        {
            TableName = "Logs",
            AutoCreateSqlTable = false
        }
    )
    .CreateLogger();
}
catch (Exception ex)
{
    // Si ocurre un error al configurar Serilog, lo registramos en la consola 
    // para no perder la información del error. 
    Console.WriteLine(ex);

    // Configuramos un logger de respaldo mínimo para que la aplicación pueda 
    // seguir funcionando aunque Serilog falle.
    Log.Logger = new LoggerConfiguration()
        .WriteTo.Console()
        .CreateLogger();

    Log.Error(ex, "Error configurando Serilog MSSqlServer");
}


builder.Host.UseSerilog();

// Habilitamos CORS para permitir que el frontend (en otro puerto) acceda a la API sin problemas de seguridad.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://ashy-desert-0d8175810.1.azurestaticapps.net"
        )
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

// Configuramos la autenticación JWT para proteger los endpoints que requieran autenticación.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(
            builder.Configuration["Jwt:Key"]!
        );

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
});
// Configuramos Swagger para que soporte autenticación JWT y podamos probar los endpoints protegidos desde la interfaz de Swagger UI.
builder.Services.AddSwaggerGen(options =>
{
    var version = builder.Configuration["Api:Version"];

    options.SwaggerDoc(version, new OpenApiInfo
    {
        Title = "Todo API",
        Version = version,
        Description = "API para gestión de tareas con autenticación JWT."
    });

    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingrese el token JWT así: Bearer {token}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();

app.UseSwaggerUI(options =>
{
    var version = builder.Configuration["Api:Version"];
    options.SwaggerEndpoint($"/swagger/{version}/swagger.json", $"Todo API {version}");
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Habilitamos la autenticación y autorización en el pipeline de la aplicación.
app.UseAuthentication();
app.UseAuthorization();
// Agregamos el middleware de manejo de excepciones personalizado para capturar errores no controlados y devolver respuestas JSON consistentes.
app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.MapGet("/", () => "Todo API online");
app.MapControllers();

app.Run();
