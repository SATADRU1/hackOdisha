package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"hackodisha/backend/internal/focus"
)

func main() {
	// Set Gin mode
	if os.Getenv("GIN_MODE") == "" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:8080"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"service": "focusstake-backend",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Dashboard route
		v1.GET("/dashboard", GetDashboardData)

		// Focus routes (no auth middleware for now)
		focusGroup := v1.Group("/focus")
		{
			focusGroup.GET("/status/:userId", focus.GetStatus)
			focusGroup.POST("/start", focus.StartFocusSession)
			focusGroup.POST("/complete", focus.CompleteFocusSession)
			focusGroup.PUT("/configure", focus.ConfigureFocus)
			focusGroup.GET("/stats/:userId", focus.GetStats)
			focusGroup.GET("/history/:userId", focus.GetHistory)
			focusGroup.GET("/earnings/:userId", focus.GetEarnings)
		}
	}

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting FocusStake backend server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// GetDashboardData returns dashboard data
func GetDashboardData(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "FocusStake Dashboard API",
		"version": "1.0.0",
		"status":  "active",
	})
}
