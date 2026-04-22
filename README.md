# NoteManager

В репозитории есть:

- клиентская часть: `NoteManager.html`
- серверная часть: `server/src/*`
- база данных: `database/schema.sql`, `database/seed.sql`, `database/note-manager.sqlite`
- отдельные SQL-файлы таблиц: `database/tables/users.sql`, `database/tables/notes.sql`

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Инициализировать базу данных:

```bash
npm run db:init
```

3. Запустить сервер:

```bash
npm start
```

4. Открыть приложение:

```text
http://localhost:3000/
```

## Демо-пользователь

- email: `demo@notemanager.local`
- password: `demo12345`

## Таблицы базы данных

В проекте используются 2 основные таблицы базы данных. Связь между ними:

```text
users (1) ---- (N) notes
```

Таблица `users`

| Поле | Тип | Назначение | Ограничения |
| --- | --- | --- | --- |
| id | INTEGER / SERIAL | Уникальный идентификатор пользователя | PK, NOT NULL |
| email | VARCHAR(255) | Электронная почта пользователя | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | Хэш пароля | NOT NULL |
| created_at | TIMESTAMP | Дата создания записи | DEFAULT NOW() |
| updated_at | TIMESTAMP | Дата последнего изменения | DEFAULT NOW() |

Таблица `notes`

| Поле | Тип | Назначение | Ограничения |
| --- | --- | --- | --- |
| id | INTEGER / SERIAL | Уникальный идентификатор заметки | PK, NOT NULL |
| user_id | INTEGER | Пользователь, которому принадлежит заметка | FK, NOT NULL |
| title | VARCHAR(255) | Название заметки | NOT NULL |
| content | TEXT | Основное содержимое заметки | Допускается пустой текст |
| pinned | BOOLEAN | Признак закрепления заметки | DEFAULT FALSE |
| created_at | TIMESTAMP | Дата создания заметки | DEFAULT NOW() |
| updated_at | TIMESTAMP | Дата последнего изменения | DEFAULT NOW() |

Фактическая реализация таблиц лежит в отдельных SQL-файлах:

- `database/tables/users.sql`
- `database/tables/notes.sql`
- `database/schema.sql`

## Структура проекта

```text
database/
  README.md
  note-manager.sqlite
  schema.sql
  seed.sql
  tables/
    notes.sql
    users.sql
server/
  scripts/
    initDatabase.js
  src/
    app.js
    server.js
    config/
      env.js
    controllers/
      authController.js
      noteController.js
    database/
      client.js
    middleware/
      authMiddleware.js
      errorMiddleware.js
    routes/
      authRoutes.js
      noteRoutes.js
    utils/
      hash.js
      token.js
NoteManager.html
package.json
```
