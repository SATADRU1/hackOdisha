package focus

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// Mock data for development - replace with real database in production
var mockUsers = map[string]interface{}{
	"1": map[string]interface{}{
		"id":               1,
		"email":            "user@example.com",
		"wallet_address":   "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
		"total_sessions":   42,
		"completed_sessions": 38,
		"total_staked":     0.95,
		"total_earned":     1.12,
		"streak":           5,
	},
}

var mockSessions = []map[string]interface{}{
	{
		"id":           1,
		"user_id":      1,
		"duration":     25,
		"stake_amount": 0.01,
		"reward":       0.011,
		"status":       "completed",
		"started_at":   "2024-01-15T10:00:00Z",
		"ended_at":     "2024-01-15T10:25:00Z",
		"is_success":   true,
		"tx_hash":      "0x1234567890abcdef",
	},
}

type FocusStatus struct {
	UserID           string    `json:"userId"`
	Status           string    `json:"status"`
	CurrentSession   *Session  `json:"currentSession,omitempty"`
	Streak           int       `json:"streak"`
	TotalSessions    int       `json:"totalSessions"`
	CompletedSessions int      `json:"completedSessions"`
	TotalStaked      float64   `json:"totalStaked"`
	TotalEarned      float64   `json:"totalEarned"`
	LastUpdated      time.Time `json:"lastUpdated"`
}

type Session struct {
	ID          uint      `json:"id"`
	Duration    int       `json:"duration"`    // in minutes
	StakeAmount float64   `json:"stakeAmount"`
	Reward      float64   `json:"reward"`
	Status      string    `json:"status"`
	StartedAt   time.Time `json:"startedAt"`
	EndedAt     *time.Time `json:"endedAt,omitempty"`
	IsSuccess   *bool     `json:"isSuccess,omitempty"`
	TxHash      string    `json:"txHash,omitempty"`
}

type FocusConfig struct {
	DefaultDuration    int     `json:"defaultDuration"`
	DefaultStake       float64 `json:"defaultStake"`
	BlockedWebsites    []string `json:"blockedWebsites"`
	NotificationSound  bool    `json:"notificationSound"`
	AutoStartBreak     bool    `json:"autoStartBreak"`
	BreakDuration      int     `json:"breakDuration"`
}

type FocusStats struct {
	UserID           string    `json:"userId"`
	Timeframe        string    `json:"timeframe"`
	TotalSessions    int       `json:"totalSessions"`
	CompletedSessions int      `json:"completedSessions"`
	SuccessRate      float64   `json:"successRate"`
	TotalStaked      float64   `json:"totalStaked"`
	TotalEarned      float64   `json:"totalEarned"`
	AverageSession   float64   `json:"averageSession"`
	LongestStreak    int       `json:"longestStreak"`
	StartTime        time.Time `json:"startTime"`
	EndTime          time.Time `json:"endTime"`
}

func GetStatus(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Get user from mock data
	userData, exists := mockUsers[userID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user := userData.(map[string]interface{})

	// Mock current session (none active for now)
	var currentSession *Session

	status := FocusStatus{
		UserID:            userID,
		Status:            "idle",
		CurrentSession:    currentSession,
		Streak:            int(user["streak"].(float64)),
		TotalSessions:     int(user["total_sessions"].(float64)),
		CompletedSessions: int(user["completed_sessions"].(float64)),
		TotalStaked:       user["total_staked"].(float64),
		TotalEarned:       user["total_earned"].(float64),
		LastUpdated:       time.Now(),
	}

	c.JSON(http.StatusOK, status)
}

func StartFocusSession(c *gin.Context) {
	var req struct {
		Duration    int     `json:"duration" binding:"required,min=5,max=120"`
		StakeAmount float64 `json:"stakeAmount" binding:"required,min=0.001"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock session creation
	now := time.Now()
	sessionID := len(mockSessions) + 1

	// Add new session to mock data
	newSession := map[string]interface{}{
		"id":           sessionID,
		"user_id":      1, // Mock user ID
		"duration":     req.Duration,
		"stake_amount": req.StakeAmount,
		"reward":       0,
		"status":       "active",
		"started_at":   now.Format(time.RFC3339),
		"ended_at":     nil,
		"is_success":   nil,
		"tx_hash":      "",
	}
	mockSessions = append(mockSessions, newSession)

	c.JSON(http.StatusOK, gin.H{
		"status":    "active",
		"message":   "Focus session started successfully",
		"sessionId": sessionID,
		"duration":  req.Duration,
		"stake":     req.StakeAmount,
		"timestamp": now.Format(time.RFC3339),
	})
}

func CompleteFocusSession(c *gin.Context) {
	var req struct {
		SessionID uint `json:"sessionId" binding:"required"`
		IsSuccess bool `json:"isSuccess" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find and update session in mock data
	var sessionFound bool
	now := time.Now()
	reward := 0.0

	for i, session := range mockSessions {
		if int(session["id"].(int)) == int(req.SessionID) && session["status"] == "active" {
			// Calculate reward based on success
			if req.IsSuccess {
				stakeAmount := session["stake_amount"].(float64)
				reward = stakeAmount * 1.1 // 10% bonus for successful completion
			}

			// Update session
			mockSessions[i]["status"] = "completed"
			mockSessions[i]["ended_at"] = now.Format(time.RFC3339)
			mockSessions[i]["is_success"] = req.IsSuccess
			mockSessions[i]["reward"] = reward
			sessionFound = true
			break
		}
	}

	if !sessionFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "Active session not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "completed",
		"message":   "Focus session completed successfully",
		"isSuccess": req.IsSuccess,
		"reward":    reward,
		"timestamp": now.Format(time.RFC3339),
	})
}

func ConfigureFocus(c *gin.Context) {
	var config FocusConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock configuration update
	c.JSON(http.StatusOK, gin.H{
		"message": "Focus configuration updated successfully",
		"config":  config,
	})
}

func GetStats(c *gin.Context) {
	userID := c.Param("userId")
	timeframe := c.DefaultQuery("timeframe", "24h")

	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Get user from mock data
	userData, exists := mockUsers[userID]
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user := userData.(map[string]interface{})

	// Calculate time range based on timeframe
	var startTime time.Time
	switch timeframe {
	case "1h":
		startTime = time.Now().Add(-1 * time.Hour)
	case "24h":
		startTime = time.Now().Add(-24 * time.Hour)
	case "7d":
		startTime = time.Now().Add(-7 * 24 * time.Hour)
	case "30d":
		startTime = time.Now().Add(-30 * 24 * time.Hour)
	default:
		startTime = time.Now().Add(-24 * time.Hour)
	}

	// Calculate mock statistics
	totalSessions := len(mockSessions)
	completedSessions := 0
	totalStaked := 0.0
	totalEarned := 0.0

	for _, session := range mockSessions {
		if session["status"] == "completed" {
			completedSessions++
		}
		totalStaked += session["stake_amount"].(float64)
		if session["is_success"] == true {
			totalEarned += session["reward"].(float64)
		}
	}

	successRate := 0.0
	if totalSessions > 0 {
		successRate = float64(completedSessions) / float64(totalSessions) * 100
	}

	stats := FocusStats{
		UserID:            userID,
		Timeframe:         timeframe,
		TotalSessions:     totalSessions,
		CompletedSessions: completedSessions,
		SuccessRate:       successRate,
		TotalStaked:       totalStaked,
		TotalEarned:       totalEarned,
		AverageSession:    float64(totalSessions),
		LongestStreak:     int(user["streak"].(float64)),
		StartTime:         startTime,
		EndTime:           time.Now(),
	}

	c.JSON(http.StatusOK, stats)
}

func GetHistory(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "100")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid limit parameter"})
		return
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid offset parameter"})
		return
	}

	// Get focus session history from mock data
	total := len(mockSessions)
	
	// Apply pagination
	start := offset
	end := offset + limit
	if start >= len(mockSessions) {
		start = len(mockSessions)
	}
	if end > len(mockSessions) {
		end = len(mockSessions)
	}

	// Convert to response format
	history := make([]gin.H, end-start)
	for i, session := range mockSessions[start:end] {
		history[i] = gin.H{
			"id":           session["id"],
			"user_id":      session["user_id"],
			"duration":     session["duration"],
			"stake_amount": session["stake_amount"],
			"reward":       session["reward"],
			"status":       session["status"],
			"started_at":   session["started_at"],
			"ended_at":     session["ended_at"],
			"is_success":   session["is_success"],
			"tx_hash":      session["tx_hash"],
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"history": history,
		"total":   total,
		"limit":   limit,
		"offset":  offset,
	})
}

func GetEarnings(c *gin.Context) {
	userID := c.Param("userId")
	period := c.DefaultQuery("period", "all")

	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Calculate mock earnings data
	totalEarned := 0.0
	totalStaked := 0.0
	successfulSessions := 0

	// Get recent successful sessions for transaction history
	var transactions []gin.H

	for _, session := range mockSessions {
		totalStaked += session["stake_amount"].(float64)
		if session["is_success"] == true {
			totalEarned += session["reward"].(float64)
			successfulSessions++
			
			// Add to transactions
			transactions = append(transactions, gin.H{
				"id":        session["id"],
				"amount":    session["reward"],
				"currency":  "ETH",
				"timestamp": session["ended_at"],
				"status":    "confirmed",
				"type":      "focus_reward",
			})
		}
	}

	// Limit transactions to 10 most recent
	if len(transactions) > 10 {
		transactions = transactions[:10]
	}

	earnings := gin.H{
		"user_id":   userID,
		"period":    period,
		"total":     totalEarned,
		"currency":  "ETH",
		"breakdown": gin.H{
			"total_earned":        totalEarned,
			"total_staked":        totalStaked,
			"successful_sessions": successfulSessions,
			"roi_percentage": func() float64 {
				if totalStaked > 0 {
					return (totalEarned / totalStaked) * 100
				}
				return 0
			}(),
		},
		"transactions": transactions,
	}

	c.JSON(http.StatusOK, earnings)
}
