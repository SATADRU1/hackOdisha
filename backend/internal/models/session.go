package models

import (
	"time"

	"gorm.io/gorm"
)

type SessionStatus string

const (
	SessionPending   SessionStatus = "pending"
	SessionActive    SessionStatus = "active"
	SessionCompleted SessionStatus = "completed"
	SessionFailed    SessionStatus = "failed"
)

type Session struct {
	gorm.Model
	UserID      uint          `json:"user_id" gorm:"not null;index"`
	Duration    int           `json:"duration" gorm:"not null"` // in minutes
	StakeAmount float64       `json:"stake_amount" gorm:"not null"`
	Reward      float64       `json:"reward" gorm:"default:0"`
	Status      SessionStatus `json:"status" gorm:"default:'pending'"`
	StartedAt   *time.Time    `json:"started_at,omitempty"`
	EndedAt     *time.Time    `json:"ended_at,omitempty"`
	IsSuccess   *bool         `json:"is_success,omitempty"`
	TxHash      string        `json:"tx_hash,omitempty"` // Blockchain transaction hash
}

type SessionActivity struct {
	gorm.Model
	SessionID uint      `json:"session_id" gorm:"not null;index"`
	Type      string    `json:"type"` // e.g., "distraction_detected", "app_switched"
	Details   string    `json:"details"`
	Timestamp time.Time `json:"timestamp"`
}
