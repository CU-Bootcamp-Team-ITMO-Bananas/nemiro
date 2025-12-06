using System.Threading;
using System.Threading.Tasks;
using Dapper;
using NeMiro.Models.Boards;
using Npgsql;

namespace NeMiro.Infrastructure.Repositories.Boards;

public class BoardRepository(NpgsqlDataSource dataSource) : IBoardRepository
{
    public async Task Create(Board board, CancellationToken cancellationToken)
    {
        const string sql = """
                           INSERT INTO boards (id, owner_id, created_at, updated_at)
                           VALUES (@Id, @OwnerId, @CreatedAt, @UpdatedAt)
                           ON CONFLICT (id) DO NOTHING
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        var parameters = new
        {
            board.Id,
            board.OwnerId,
            board.CreatedAt,
            board.UpdatedAt,
        };

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken));
    }

    public async Task<Board?> GetById(string id, CancellationToken cancellationToken)
    {
        const string sql = """
                           SELECT
                               id AS Id,
                               owner_id AS OwnerId,
                               created_at AS CreatedAt,
                               updated_at AS UpdatedAt
                           FROM boards
                           WHERE id = @Id
                           """;

        await using var connection = await dataSource.OpenConnectionAsync(cancellationToken);

        return await connection.QueryFirstOrDefaultAsync<Board>(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id,
                },
                cancellationToken: cancellationToken));
    }
}
