using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TodoApi.Data
{
    public class TodoDbContextFactory : IDesignTimeDbContextFactory<TodoDbContext>
    {
        public TodoDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<TodoDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new TodoDbContext(optionsBuilder.Options);
        }
    }
}