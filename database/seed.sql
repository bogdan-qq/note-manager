INSERT OR IGNORE INTO users (id, email, password_hash, created_at, updated_at)
VALUES
  (
    1,
    'demo@notemanager.local',
    '7ad6a623c4b7460b51cbe1971cbc64cb:9f040f0bb665b0395d5a77adc99414470b7af99a56c928542223318eb206c93f1c7eb5ccd93cbea86c8b87cff7660067bf5353b0cd1da153ab5861304bc61f79',
    '2026-04-18T10:00:00.000Z',
    '2026-04-18T10:00:00.000Z'
  );

INSERT OR IGNORE INTO notes (id, user_id, title, content, pinned, created_at, updated_at)
VALUES
  (
    1,
    1,
    'План на неделю',
    'Собрать требования, сверстать интерфейс, подключить API и проверить серверную часть.',
    1,
    '2026-04-18T10:30:00.000Z',
    '2026-04-22T12:30:00.000Z'
  ),
  (
    2,
    1,
    'Идеи для проекта',
    'Добавить поиск, сортировку, закрепление заметок и полноценную базу данных.',
    0,
    '2026-04-18T11:00:00.000Z',
    '2026-04-22T12:15:00.000Z'
  );
