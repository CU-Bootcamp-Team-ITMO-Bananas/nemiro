using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using NeMiro.Models.Elements;
using Npgsql;

namespace NeMiro.Infrastructure.Repositories.Elements;

public class ElementRepository : IElementRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public ElementRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public async Task Create(Element element, CancellationToken cancellationToken)
    {
        const string sql = """
                           INSERT INTO elements (id, board_id, content, created_at)
                           VALUES (@Id, @BoardId, @Content::jsonb, @CreatedAt)
                           ON CONFLICT (id) DO NOTHING
                           """;

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);

        var parameters = new
        {
            element.Id,
            element.BoardId,
            Content = JsonSerializer.Serialize(element.Content),
            element.CreatedAt,
        };

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken));
    }

    public async Task Delete(string id, CancellationToken cancellationToken = default)
    {
        const string sql = "DELETE FROM elements WHERE id = @Id";

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    Id = id,
                },
                cancellationToken: cancellationToken));
    }

    public async Task UpdateBatch(
        IReadOnlyCollection<Element> elements,
        CancellationToken cancellationToken = default)
    {
        if (elements.Count == 0)
            return;

        const string sqlTemplate = """
                                   UPDATE elements AS e
                                   SET
                                       content = u.content::jsonb,
                                       updated_at = u.updated_at
                                   FROM (VALUES {0}) AS u(id, content, updated_at)
                                   WHERE e.id = u.id
                                   """;

        await using var connection = await _dataSource.OpenConnectionAsync(cancellationToken);

        var valueClauses = new List<string>();
        var parameters = new DynamicParameters();

        var i = 0;
        foreach (var element in elements)
        {
            var paramId = $"id{i}";
            var paramContent = $"content{i}";
            var paramUpdatedAt = $"updated_at{i}";

            valueClauses.Add($"(@{paramId}, @{paramContent}::jsonb)");

            parameters.Add(paramId, element.Id);
            parameters.Add(paramContent, JsonSerializer.Serialize(element.Content));
            parameters.Add(paramUpdatedAt, element.UpdatedAt ?? DateTimeOffset.UtcNow);

            i++;
        }

        var values = string.Join(", ", valueClauses);
        var sql = string.Format(sqlTemplate, values);

        await connection.ExecuteAsync(
            new CommandDefinition(
                sql,
                parameters,
                cancellationToken: cancellationToken));
    }
}
