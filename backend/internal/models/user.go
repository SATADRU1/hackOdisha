package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email          string    `json:"email" gorm:"unique;not null"`
	PasswordHash   string    `json:"-" gorm:"not null"`
	WalletAddress  string    `json:"wallet_address" gorm:"unique"`
	TotalSessions  int       `json:"total_sessions" gorm:"default:0"`
	CompletedSessions int    `json:"completed_sessions" gorm:"default:0"`
	TotalStaked    float64   `json:"total_staked" gorm:"default:0"`
	TotalEarned    float64   `json:"total_earned" gorm:"default:0"`
	Streak         int       `json:"streak" gorm:"default:0"`
	LastActive     time.Time `json:"last_active"`
}
