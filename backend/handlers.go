package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"
)

// Cap admin write bodies: posts are text, and an unbounded decode lets a
// single request balloon memory. Over-limit bodies fail the decode below
// into the existing 400 path.
const maxBodyBytes = 1 << 20 // 1 MiB

// Bound every DB round-trip well under the server's 15s WriteTimeout so a
// stalled Postgres can't pin handlers and exhaust the 5-conn pool.
const queryTimeout = 5 * time.Second

func queryContext(r *http.Request) (context.Context, context.CancelFunc) {
	return context.WithTimeout(r.Context(), queryTimeout)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if v != nil {
		_ = json.NewEncoder(w).Encode(v)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func handleHealthz(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func handleListPosts(store *PostStore, apiKey string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := queryContext(r)
		defer cancel()
		includeDrafts := isAuthorized(r, apiKey)
		posts, err := store.List(ctx, includeDrafts)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to list posts")
			return
		}
		writeJSON(w, http.StatusOK, posts)
	}
}

func handleGetPostBySlug(store *PostStore, apiKey string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := queryContext(r)
		defer cancel()
		includeDrafts := isAuthorized(r, apiKey)
		post, err := store.GetBySlug(ctx, r.PathValue("slug"), includeDrafts)
		if errors.Is(err, errNotFound) {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}
		writeJSON(w, http.StatusOK, post)
	}
}

func handleGetPostByID(store *PostStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := parseID(r)
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}
		ctx, cancel := queryContext(r)
		defer cancel()
		post, err := store.GetByID(ctx, id)
		if errors.Is(err, errNotFound) {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}
		writeJSON(w, http.StatusOK, post)
	}
}

func handleCreatePost(store *PostStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
		var in PostInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if in.Title == "" || in.Content == "" {
			writeError(w, http.StatusBadRequest, "title and content are required")
			return
		}

		ctx, cancel := queryContext(r)
		defer cancel()
		post, err := store.Create(ctx, in)
		if errors.Is(err, errSlugConflict) {
			writeError(w, http.StatusConflict, "a post with that slug already exists")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create post")
			return
		}
		writeJSON(w, http.StatusCreated, post)
	}
}

func handleUpdatePost(store *PostStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := parseID(r)
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)
		var in PostInput
		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if in.Title == "" || in.Slug == "" || in.Content == "" {
			writeError(w, http.StatusBadRequest, "title, slug, and content are required")
			return
		}

		ctx, cancel := queryContext(r)
		defer cancel()
		post, err := store.Update(ctx, id, in)
		if errors.Is(err, errNotFound) {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if errors.Is(err, errSlugConflict) {
			writeError(w, http.StatusConflict, "a post with that slug already exists")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to update post")
			return
		}
		writeJSON(w, http.StatusOK, post)
	}
}

func handleDeletePost(store *PostStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := parseID(r)
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		ctx, cancel := queryContext(r)
		defer cancel()
		if err := store.Delete(ctx, id); errors.Is(err, errNotFound) {
			writeError(w, http.StatusNotFound, "post not found")
			return
		} else if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to delete post")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

func parseID(r *http.Request) (int64, error) {
	return strconv.ParseInt(r.PathValue("id"), 10, 64)
}
