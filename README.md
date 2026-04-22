В репозитории есть:

- клиентская часть: `NoteManager.html`
- серверная часть: `server/src/*`
- база данных: `database/schema.sql`, `database/seed.sql`, `database/note-manager.sqlite`

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

## Структура проекта

```text
database/
  note-manager.sqlite
  schema.sql
  seed.sql
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
