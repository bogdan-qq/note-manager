# Database Structure

В проекте используются 2 основные таблицы базы данных:

- `users` — хранит пользователей
- `notes` — хранит заметки пользователей

Связь:

```text
users (1) ---- (N) notes
```

Где смотреть структуру:

- общая схема: `schema.sql`
- таблица пользователей: `tables/users.sql`
- таблица заметок: `tables/notes.sql`
- тестовые данные: `seed.sql`
- готовая учебная база: `note-manager.sqlite`

Демо-пользователь:

- `demo@notemanager.local`
- пароль: `demo12345`
