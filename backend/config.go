package main

import (
	"fmt"
	"os"
)

type config struct {
	port        string
	databaseURL string
	apiKey      string
}

func loadConfig() (config, error) {
	cfg := config{
		port:        os.Getenv("PORT"),
		databaseURL: os.Getenv("DATABASE_URL"),
		apiKey:      os.Getenv("API_KEY"),
	}

	if cfg.port == "" {
		cfg.port = "8080"
	}
	if cfg.databaseURL == "" {
		return config{}, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.apiKey == "" {
		return config{}, fmt.Errorf("API_KEY is required")
	}

	return cfg, nil
}
