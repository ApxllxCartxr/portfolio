package main

import "testing"

func TestSlugify(t *testing.T) {
	cases := map[string]string{
		"Hello, World!":       "hello-world",
		"  leading spaces":    "leading-spaces",
		"trailing spaces  ":   "trailing-spaces",
		"multiple   spaces":   "multiple-spaces",
		"Already-Hyphenated":  "already-hyphenated",
		"Go 1.22 Routing":     "go-1-22-routing",
		"":                    "",
		"日本語 Title":           "日本語-title",
	}

	for input, want := range cases {
		if got := slugify(input); got != want {
			t.Errorf("slugify(%q) = %q, want %q", input, got, want)
		}
	}
}
