using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Middleware;
using TodoApi.Repositories;
using TodoApi.Services;
using Serilog; //Soporta múltiples destinos (DB, archivo, consola, etc.)

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Usamos Inyección de Dependencias para el contexto de la base de datos
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Usamos inyección de Dependencias para los repositorios y servicios
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<ITareaService, TareaService>();

/*
    LogInformation → flujo normal
    LogWarning → comportamiento raro
    LogError → fallos reales
*/

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    
    // Agregamos filtros para reducir el ruido de logs de Microsoft y System
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)

    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Habilitamos CORS para permitir que el frontend (en otro puerto) acceda a la API sin problemas de seguridad.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "https://ashy-desert-0d8175810.1.azurestaticapps.net"
            )
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapGet("/", () => "Todo API online");
app.MapControllers();

app.Run();
