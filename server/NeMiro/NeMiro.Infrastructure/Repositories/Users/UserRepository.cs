using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using NeMiro.Models.Users;
using Npgsql;

namespace NeMiro.Infrastructure.Repositories.Users;

public class UserRepository(NpgsqlDataSource dataSource) : IUserRepository
{
    public async Task<User?> GetUserAsync(long userId, CancellationToken cancellationToken)
    {
        const string sql = """
                           SELECT *
                           FROM users
                           WHERE id = @Id
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        return await connection.QueryFirstOrDefaultAsync<User>(
            new CommandDefinition(
                sql,
                new
                {
                    Id = userId,
                },
                cancellationToken: cancellationToken));
    }

    public async Task Create(User user, CancellationToken cancellationToken)
    {
        const string sql = """
                           INSERT INTO users (telegram, username, created_at, avatar)
                           VALUES (@Telegram, @Username, @CreatedAt, @Avatar)
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        var parameters = new
        {
            Telegram = user.Telegram,
            Username = user.Username,
            CreatedAt = DateTimeOffset.UtcNow,
            Avatar = user.Avatar,
        };

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken));
    }
}
