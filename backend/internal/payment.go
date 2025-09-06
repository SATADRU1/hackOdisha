package main

import (
	"time"

	"gorm.io/gorm"
)

// Payment represents a payment made by a user
type Payment struct {
	gorm.Model
	UserID    uint      `json:"user_id"`
	Amount    float64   `json:"amount"`
	Timestamp time.Time `json:"timestamp"`
}