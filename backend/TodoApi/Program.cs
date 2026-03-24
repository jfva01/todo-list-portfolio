using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Middleware;
using TodoApi.Repositories;
using TodoApi.Services;
using Serilog; //Soporta múltiples destinos (DB, archivo, consola, etc.)
using Serilog.Sinks.MSSqlServer;
using System.Collections.ObjectModel;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();


// Usamos Inyección de Dependencias para el contexto de la base de datos
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Usamos inyección de Dependencias para los repositorios y servicios
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<ITareaService, TareaService>();

// Implementamos Serilog para el logging y configuramos el sink para SQL Server
var columnOptions = new ColumnOptions();

// Opcional: ajustar columnas
columnOptions.Store.Remove(StandardColumn.Properties);
columnOptions.Store.Add(StandardColumn.LogEvent);

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
    .WriteTo.MSSqlServer(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
        sinkOptions: new MSSqlServerSinkOptions
        {
            TableName = "Logs",
            AutoCreateSqlTable = true
        },
        columnOptions: columnOptions
    )
    .CreateLogger();

builder.Host.UseSerilog();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("CONNECTION_STRING");

builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllersWithViews();

// Habilitamos CORS para permitir que el frontend (en otro puerto) acceda a la API sin problemas de seguridad.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapDefaultControllerRoute();

app.Run();
