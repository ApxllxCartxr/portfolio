package main

import (
	"strings"
	"unicode"
)

// slugify lowercases title, replaces runs of non-alphanumeric characters
// with a single hyphen, and trims leading/trailing hyphens.
func slugify(title string) string {
	var b strings.Builder
	prevHyphen := false

	for _, r := range strings.ToLower(title) {
		switch {
		case unicode.IsLetter(r) || unicode.IsDigit(r):
			b.WriteRune(r)
			prevHyphen = false
		default:
			if !prevHyphen && b.Len() > 0 {
				b.WriteRune('-')
				prevHyphen = true
			}
		}
	}

	return strings.TrimRight(b.String(), "-")
}
