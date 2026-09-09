CREATE TABLE IF NOT EXISTS posts (
	id          BIGSERIAL PRIMARY KEY,
	title       TEXT NOT NULL,
	slug        TEXT NOT NULL UNIQUE,
	excerpt     TEXT NOT NULL DEFAULT '',
	content     TEXT NOT NULL,
	published   BOOLEAN NOT NULL DEFAULT TRUE,
	created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published_created_at ON posts (created_at DESC) WHERE published = TRUE;
