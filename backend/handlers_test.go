package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequireAuth(t *testing.T) {
	called := false
	handler := requireAuth("secret", func(w http.ResponseWriter, r *http.Request) {
		called = true
		w.WriteHeader(http.StatusOK)
	})

	t.Run("missing token", func(t *testing.T) {
		called = false
		req := httptest.NewRequest(http.MethodPost, "/posts", nil)
		rec := httptest.NewRecorder()
		handler(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
		}
		if called {
			t.Error("next handler should not have been called")
		}
	})

	t.Run("wrong token", func(t *testing.T) {
		called = false
		req := httptest.NewRequest(http.MethodPost, "/posts", nil)
		req.Header.Set("Authorization", "Bearer wrong")
		rec := httptest.NewRecorder()
		handler(rec, req)

		if rec.Code != http.StatusUnauthorized {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusUnauthorized)
		}
		if called {
			t.Error("next handler should not have been called")
		}
	})

	t.Run("valid token", func(t *testing.T) {
		called = false
		req := httptest.NewRequest(http.MethodPost, "/posts", nil)
		req.Header.Set("Authorization", "Bearer secret")
		rec := httptest.NewRecorder()
		handler(rec, req)

		if rec.Code != http.StatusOK {
			t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
		}
		if !called {
			t.Error("next handler should have been called")
		}
	})
}

func TestHandleHealthz(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()
	handleHealthz(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
	}
	if got := rec.Body.String(); got != "{\"status\":\"ok\"}\n" {
		t.Errorf("body = %q", got)
	}
}

func TestParseID(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/posts/id/42", nil)
	req.SetPathValue("id", "42")
	id, err := parseID(req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if id != 42 {
		t.Errorf("id = %d, want 42", id)
	}

	req.SetPathValue("id", "not-a-number")
	if _, err := parseID(req); err == nil {
		t.Error("expected error for non-numeric id")
	}
}
