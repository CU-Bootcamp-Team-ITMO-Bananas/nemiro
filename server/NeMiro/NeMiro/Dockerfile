FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Directory.Build.props", "."]
COPY ["NeMiro/NeMiro.csproj", "NeMiro/"]
COPY ["NeMiro.Application/NeMiro.Application.csproj", "NeMiro.Application/"]
COPY ["NeMiro.Models/NeMiro.Models.csproj", "NeMiro.Models/"]
COPY ["NeMiro.Infrastructure/NeMiro.Infrastructure.csproj", "NeMiro.Infrastructure/"]
COPY ["NeMiro.Presentation/NeMiro.Presentation.csproj", "NeMiro.Presentation/"]
RUN dotnet restore "NeMiro/NeMiro.csproj"
COPY . .
WORKDIR "/src/NeMiro"
RUN dotnet build "./NeMiro.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NeMiro.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NeMiro.dll"]
