using Microsoft.Extensions.DependencyInjection;
using NeMiro.Application.Auth;
using NeMiro.Application.Boards;
using NeMiro.Application.Pointers;
using NeMiro.Application.S3;

namespace NeMiro.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddSingleton<IAuthService, AuthService>();
        services.AddSingleton<IBoardsService, BoardsService>();
        services.AddSingleton<IPointerService, PointerService>();
        services.AddSingleton<IS3Service, S3Service>();
        return services;
    }
}
