using Microsoft.Extensions.DependencyInjection;
using NeMiro.Application.Auth;
using NeMiro.Application.Boards;
using NeMiro.Application.S3;

namespace NeMiro.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IBoardsService, BoardsService>();
        services.AddSingleton<IS3Service, S3Service>();
        return services;
    }
}
