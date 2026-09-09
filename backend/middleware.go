package main

import (
	"crypto/subtle"
	"log"
	"net/http"
	"strings"
	"time"
)

func isAuthorized(r *http.Request, apiKey string) bool {
	auth := r.Header.Get("Authorization")
	token, ok := strings.CutPrefix(auth, "Bearer ")
	if !ok {
		return false
	}
	// Constant-time compare so a wrong guess leaks nothing about the key
	// through response timing.
	return subtle.ConstantTimeCompare([]byte(token), []byte(apiKey)) == 1
}

// requireAuth rejects the request with 401 unless it carries a valid bearer token.
func requireAuth(apiKey string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !isAuthorized(r, apiKey) {
			writeError(w, http.StatusUnauthorized, "missing or invalid API key")
			return
		}
		next(w, r)
	}
}

func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %s", r.Method, r.URL.Path, time.Since(start))
	})
}
