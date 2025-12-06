using System;
using FluentMigrator.Runner;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using NeMiro.Application.Extensions;
using NeMiro.Application.Options;
using NeMiro.Infrastructure.Extensions;
using NeMiro.Presentation.Hubs;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true")
{
    builder.Configuration.AddJsonFile("appsettings.Docker.json", optional: false, reloadOnChange: false);
}

var configuration = builder.Configuration;

builder.Services.Configure<S3Settings>(builder.Configuration.GetSection("S3Settings"));

builder.Services.AddInfrastructure(configuration);

builder.Services
    .AddServices()
    .AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
                               {
                                   c.SwaggerDoc(
                                       "v1",
                                       new OpenApiInfo
                                       {
                                           Title = "NeMiro API",
                                           Version = "v1",
                                           Description = "API для NeMiro приложения",
                                       });
                               });

builder.Services.AddSignalR();

WebApplication app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var migrator = scope.ServiceProvider.GetRequiredService<IMigrationRunner>();

    migrator.MigrateUp();
}

app.UseSwagger();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI(c =>
                     {
                         c.SwaggerEndpoint("/swagger/v1/swagger.json", "NeMiro API v1");
                         c.RoutePrefix = "swagger";
                     });
}

app.UseRouting();
app.UseCors(b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.MapControllers();
app.MapHub<BoardHub>("/api/v1/board");

await app.RunAsync();
