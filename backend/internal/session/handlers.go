package session

import (
	"errors"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"hackodisha/backend/models"
)

type SessionService struct {
	db *gorm.DB
}

func NewSessionService(db *gorm.DB) *SessionService {
	return &SessionService{db: db}
}

type startSessionRequest struct {
	Duration    int     `json:"duration" binding:"required,min=1"`
	StakeAmount float64 `json:"stake_amount" binding:"required,gt=0"`
}

// StartSession starts a new focus session
func (s *SessionService) StartSession(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var req startSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create session
	session := models.Session{
		UserID:      userID.(uint),
		Duration:    req.Duration,
		StakeAmount: req.StakeAmount,
		Status:      string(models.SessionActive),
		StartedAt:   time.Now(),
	}

	if err := s.db.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not start session"})
		return
	}

	c.JSON(http.StatusCreated, session)
}

// CompleteSession marks a session as completed
func (s *SessionService) CompleteSession(c *gin.Context) {
	userID, _ := c.Get("user_id")
	sessionID := c.Param("id")

	var session models.Session
	if err := s.db.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "session not found"})
		return
	}

	// Update session
	now := time.Now()
	success := true
	s.db.Model(&session).Updates(models.Session{
		Status:    string(models.SessionCompleted),
		EndedAt:   &now,
		IsSuccess: &success,
		Reward:    session.StakeAmount * 1.1, // 10% reward
	})

	c.JSON(http.StatusOK, gin.H{"message": "session completed"})
}

// GetUserSessions returns user's session history
func (s *SessionService) GetUserSessions(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var sessions []models.Session
	s.db.Where("user_id = ?", userID).Order("created_at desc").Find(&sessions)
	c.JSON(http.StatusOK, sessions)
}
