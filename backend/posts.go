package main

import (
	"context"
	"database/sql"
	"errors"
	"time"
)

var errSlugConflict = errors.New("slug already exists")
var errNotFound = errors.New("post not found")

type PostSummary struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Slug      string    `json:"slug"`
	Excerpt   string    `json:"excerpt"`
	Published bool      `json:"published"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Post struct {
	PostSummary
	Content string `json:"content"`
}

type PostInput struct {
	Title     string `json:"title"`
	Slug      string `json:"slug"`
	Excerpt   string `json:"excerpt"`
	Content   string `json:"content"`
	Published *bool  `json:"published"`
}

type PostStore struct {
	db *sql.DB
}

func NewPostStore(db *sql.DB) *PostStore {
	return &PostStore{db: db}
}

func (s *PostStore) List(ctx context.Context, includeDrafts bool) ([]PostSummary, error) {
	query := `SELECT id, title, slug, excerpt, published, created_at, updated_at
	          FROM posts`
	if !includeDrafts {
		query += ` WHERE published = TRUE`
	}
	// Bound the scan: the blog index and homepage only ever need the head of
	// the list, and an unbounded SELECT gets slower with every post.
	query += ` ORDER BY created_at DESC LIMIT 100`

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := []PostSummary{}
	for rows.Next() {
		var p PostSummary
		if err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Excerpt, &p.Published, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (s *PostStore) GetBySlug(ctx context.Context, slug string, includeDrafts bool) (*Post, error) {
	query := `SELECT id, title, slug, excerpt, content, published, created_at, updated_at
	          FROM posts WHERE slug = $1`
	if !includeDrafts {
		query += ` AND published = TRUE`
	}

	return s.scanOne(s.db.QueryRowContext(ctx, query, slug))
}

func (s *PostStore) GetByID(ctx context.Context, id int64) (*Post, error) {
	query := `SELECT id, title, slug, excerpt, content, published, created_at, updated_at
	          FROM posts WHERE id = $1`

	return s.scanOne(s.db.QueryRowContext(ctx, query, id))
}

func (s *PostStore) scanOne(row *sql.Row) (*Post, error) {
	var p Post
	err := row.Scan(&p.ID, &p.Title, &p.Slug, &p.Excerpt, &p.Content, &p.Published, &p.CreatedAt, &p.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, errNotFound
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (s *PostStore) Create(ctx context.Context, in PostInput) (*Post, error) {
	slug := in.Slug
	if slug == "" {
		slug = slugify(in.Title)
	}
	published := true
	if in.Published != nil {
		published = *in.Published
	}

	query := `INSERT INTO posts (title, slug, excerpt, content, published)
	          VALUES ($1, $2, $3, $4, $5)
	          RETURNING id, title, slug, excerpt, content, published, created_at, updated_at`

	p, err := s.scanOne(s.db.QueryRowContext(ctx, query, in.Title, slug, in.Excerpt, in.Content, published))
	if isUniqueViolation(err) {
		return nil, errSlugConflict
	}
	return p, err
}

func (s *PostStore) Update(ctx context.Context, id int64, in PostInput) (*Post, error) {
	published := true
	if in.Published != nil {
		published = *in.Published
	}

	query := `UPDATE posts
	          SET title = $1, slug = $2, excerpt = $3, content = $4, published = $5, updated_at = now()
	          WHERE id = $6
	          RETURNING id, title, slug, excerpt, content, published, created_at, updated_at`

	p, err := s.scanOne(s.db.QueryRowContext(ctx, query, in.Title, in.Slug, in.Excerpt, in.Content, published, id))
	if isUniqueViolation(err) {
		return nil, errSlugConflict
	}
	return p, err
}

func (s *PostStore) Delete(ctx context.Context, id int64) error {
	res, err := s.db.ExecContext(ctx, `DELETE FROM posts WHERE id = $1`, id)
	if err != nil {
		return err
	}
	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return errNotFound
	}
	return nil
}
