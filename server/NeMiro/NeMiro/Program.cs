using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers();

builder.Services.AddCors(options =>
                         {
                             options.AddPolicy(
                                 "AllowFrontend",
                                 policy =>
                                 {
                                     policy.WithOrigins("https://localhost:7066", "http://localhost:5000")
                                         .AllowAnyMethod()
                                         .AllowAnyHeader();
                                 });
                         });

builder.Services.AddSpaStaticFiles(configuration => { configuration.RootPath = "Client"; });

WebApplication app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseRouting();
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.UseSpa(spa => { spa.Options.SourcePath = "client"; });

await app.RunAsync();
