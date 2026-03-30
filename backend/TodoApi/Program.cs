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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();

// Usamos Inyección de Dependencias para el contexto de la base de datos
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection") ??
    Environment.GetEnvironmentVariable("SQLCONNSTR_DefaultConnection");

// Usamos inyección de Dependencias para los repositorios y servicios
builder.Services.AddScoped<ITareaRepository, TareaRepository>();
builder.Services.AddScoped<ITareaService, TareaService>();
builder.Services.AddScoped<JwtService>();

/*
    LogInformation → flujo normal
    LogWarning → comportamiento raro
    LogError → fallos reales
*/

try
{
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
    // fallback: solo consola
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

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Habilitamos la autenticación y autorización en el pipeline de la aplicación.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Todo API online");
app.MapControllers();

app.Run();
