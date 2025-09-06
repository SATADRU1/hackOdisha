package main

import (
	"time"

	"gorm.io/gorm"
)

// Session represents a focus session by a user
type Session struct {
	gorm.Model
	UserID    uint      `json:"user_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Success   bool      `json:"success"`
	Stake     float64   `json:"stake"`
}