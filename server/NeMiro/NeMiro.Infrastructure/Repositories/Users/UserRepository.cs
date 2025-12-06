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
                           INSERT INTO users (id, telegram, username, created_at, avatar)
                           VALUES (@Id, @Telegram, @Name, @CreatedAt, @Avatar)
                           ON CONFLICT (id) DO NOTHING
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        var parameters = new
        {
            user.Id,
            user.Telegram,
            Name = user.Username,
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
