using Microsoft.Extensions.DependencyInjection;
using NeMiro.Application.Auth;
using NeMiro.Application.Boards;
using NeMiro.Application.Pointers;
using NeMiro.Application.Users;

namespace NeMiro.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddSingleton<IAuthService, AuthService>();
        services.AddSingleton<IBoardsService, BoardsService>();
        services.AddSingleton<IPointerService, PointerService>();
        services.AddSingleton<IUserService, UserService>();
        return services;
    }
}
