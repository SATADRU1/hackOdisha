package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// DashboardData represents the data to be displayed on the dashboard
type DashboardData struct {
	TotalSessions      int     `json:"total_sessions"`
	SuccessfulSessions int     `json:"successful_sessions"`
	SessionSuccessRate float64 `json:"session_success_rate"`
	TotalStake         float64 `json:"total_stake"`
	TotalEarnings      float64 `json:"total_earnings"`
}

// GetDashboardData retrieves and calculates the data for the dashboard
func GetDashboardData(c *gin.Context) {
	// In a real application, you would fetch this data from the database
	// For now, we'll use some mock data
	data := DashboardData{
		TotalSessions:      100,
		SuccessfulSessions: 80,
		SessionSuccessRate: 80.0,
		TotalStake:         500.0,
		TotalEarnings:      50.0,
	}

	c.JSON(http.StatusOK, data)
}