using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using NeMiro.Models.Users;
using Npgsql;

namespace NeMiro.Infrastructure.Repositories.Users;

public class UserRepository(NpgsqlDataSource dataSource) : IUserRepository
{
    public async Task Create(User user, CancellationToken cancellationToken)
    {
        const string sql = """
                           INSERT INTO users (telegram, username, created_at, avatar)
                           VALUES (@Telegram, @Name, @CreatedAt, @Avatar)
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        var parameters = new
        {
            user.Telegram,
            user.Username,
            DateTimeOffset.UtcNow,
            user.Avatar,
        };

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken));
    }
}
