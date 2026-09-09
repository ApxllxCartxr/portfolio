package main

import (
	"context"
	"log"
	"net/http"
	"time"
)

// CORS is intentionally not implemented: every call to this API comes from
// the SvelteKit app's own server (load functions and form actions), never
// directly from a browser. If a client-side fetch to this API is ever
// added, CORS headers would need to be added here then.
func newMux(store *PostStore, apiKey string) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", handleHealthz)
	mux.HandleFunc("GET /posts", handleListPosts(store, apiKey))
	mux.HandleFunc("GET /posts/{slug}", handleGetPostBySlug(store, apiKey))
	mux.HandleFunc("GET /posts/id/{id}", requireAuth(apiKey, handleGetPostByID(store)))
	mux.HandleFunc("POST /posts", requireAuth(apiKey, handleCreatePost(store)))
	mux.HandleFunc("PUT /posts/{id}", requireAuth(apiKey, handleUpdatePost(store)))
	mux.HandleFunc("DELETE /posts/{id}", requireAuth(apiKey, handleDeletePost(store)))

	return mux
}

func main() {
	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	ctx := context.Background()
	db, err := openDB(ctx, cfg.databaseURL)
	if err != nil {
		log.Fatalf("db error: %v", err)
	}
	defer db.Close()

	store := NewPostStore(db)
	mux := newMux(store, cfg.apiKey)

	log.Printf("listening on :%s", cfg.port)
	srv := &http.Server{
		Addr:         ":" + cfg.port,
		Handler:      logRequests(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatal(err)
	}
}
