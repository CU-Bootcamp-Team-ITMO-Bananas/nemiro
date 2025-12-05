using Microsoft.Extensions.DependencyInjection;
using NeMiro.Application.Auth;

namespace NeMiro.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }
}
