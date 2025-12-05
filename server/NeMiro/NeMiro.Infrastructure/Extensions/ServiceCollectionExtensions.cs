using System;
using FluentMigrator.Runner;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace NeMiro.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection serviceCollection,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Postgres");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'Postgres' not found in configuration.");
        }

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        var dataSource = dataSourceBuilder.Build();
        serviceCollection.AddSingleton(dataSource);

        serviceCollection
            .AddFluentMigratorCore()
            .ConfigureRunner(rb => rb
                                 .AddPostgres()
                                 .WithGlobalConnectionString(connectionString)
                                 .ScanIn(typeof(ServiceCollectionExtensions).Assembly)
                                 .For.Migrations())
            .AddLogging(lb => lb.AddFluentMigratorConsole());

        return serviceCollection;
    }
}
