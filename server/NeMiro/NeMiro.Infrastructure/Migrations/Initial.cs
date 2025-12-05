using FluentMigrator;

namespace NeMiro.Infrastructure.Migrations;

[Migration(1731949849, "initial")]
public class Initial : Migration
{
    public override void Up()
    {
        Execute.Sql(
            """
            -- Пользователи
            CREATE TABLE users
            (
                id                  BIGINT               PRIMARY KEY,
                telegram               BIGINT                  UNIQUE NOT NULL,
                username            VARCHAR(100)            NOT NULL,
                profile_picture_url VARCHAR(255),
                created_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW()
            );

            -- Доски (boards)
            CREATE TABLE boards
            (
                id          VARCHAR(255)            PRIMARY KEY,
                owner_id    BIGINT                  REFERENCES users(id) ON DELETE SET NULL,
                created_at  TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
                updated_at  TIMESTAMPTZ             NOT NULL DEFAULT NOW()
            );

            -- Стикеры (stickers)
            CREATE TABLE stickers
            (
                id          BIGINT               PRIMARY KEY,
                board_id    VARCHAR(255)            NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
                content     JSONB,
                created_at  TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
                updated_at  TIMESTAMPTZ             NOT NULL DEFAULT NOW()
            );

            -- Индексы
            CREATE INDEX idx_users_tg_id ON users(telegram);
            CREATE INDEX idx_boards_owner_id ON boards(owner_id) WHERE owner_id IS NOT NULL;
            CREATE INDEX idx_stickers_board_id ON stickers(board_id);
            CREATE INDEX idx_stickers_created_at ON stickers(created_at DESC);
            """);
    }

    public override void Down()
    {
    }
}
