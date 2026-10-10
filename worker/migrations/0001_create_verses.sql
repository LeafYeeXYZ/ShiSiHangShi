CREATE TABLE IF NOT EXISTS verses (
  uuid TEXT PRIMARY KEY NOT NULL,
  createdAt INTEGER NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS verses_created_at ON verses (createdAt, uuid);
