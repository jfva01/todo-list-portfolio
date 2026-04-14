using Microsoft.Extensions.Hosting;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

public class DemoCleanupService : BackgroundService
{
    private readonly IConfiguration _config;

    public DemoCleanupService(IConfiguration config)
    {
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await CleanDemoData();

            // Ejecuta cada 24 horas
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task CleanDemoData()
    {
        var connectionString = _config.GetConnectionString("DefaultConnection");

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        var command = connection.CreateCommand();
        command.CommandText = @"
            DELETE FROM tareas
            WHERE usuarioId = (
                SELECT id FROM usuarios WHERE email = 'demo@todoapp.com'
            );
        ";

        await command.ExecuteNonQueryAsync();
    }
}