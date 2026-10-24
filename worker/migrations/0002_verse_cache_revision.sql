CREATE TABLE verse_cache_revision (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  revision TEXT NOT NULL
);
INSERT INTO verse_cache_revision (id, revision) VALUES (1, lower(hex(randomblob(16))));

CREATE TRIGGER verses_cache_insert AFTER INSERT ON verses BEGIN
  UPDATE verse_cache_revision SET revision = lower(hex(randomblob(16))) WHERE id = 1;
END;
CREATE TRIGGER verses_cache_update AFTER UPDATE ON verses BEGIN
  UPDATE verse_cache_revision SET revision = lower(hex(randomblob(16))) WHERE id = 1;
END;
CREATE TRIGGER verses_cache_delete AFTER DELETE ON verses BEGIN
  UPDATE verse_cache_revision SET revision = lower(hex(randomblob(16))) WHERE id = 1;
END;
