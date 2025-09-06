package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"hackodisha/backend/internal/auth"
	"hackodisha/backend/internal/mining"
	"hackodisha/backend/internal/portfolio"
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
		AllowOrigins:     []string{"http://localhost:3000", "https://yourdomain.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "healthy",
			"service": "gofr-backend",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// Authentication routes
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/login", auth.Login)
			authGroup.POST("/register", auth.Register)
			authGroup.POST("/logout", auth.Logout)
			authGroup.GET("/verify", auth.VerifyToken)
			authGroup.POST("/refresh", auth.RefreshToken)
			authGroup.GET("/profile", auth.GetProfile)
			authGroup.PUT("/profile", auth.UpdateProfile)
		}

		// Mining routes
		miningGroup := v1.Group("/mining")
		miningGroup.Use(auth.AuthMiddleware())
		{
			miningGroup.GET("/status/:userId", mining.GetStatus)
			miningGroup.POST("/start", mining.StartMining)
			miningGroup.POST("/stop", mining.StopMining)
			miningGroup.PUT("/configure", mining.ConfigureMining)
			miningGroup.GET("/stats/:userId", mining.GetStats)
			miningGroup.GET("/history/:userId", mining.GetHistory)
			miningGroup.GET("/earnings/:userId", mining.GetEarnings)
			miningGroup.GET("/pool/info", mining.GetPoolInfo)
		}

		// Portfolio routes
		portfolioGroup := v1.Group("/portfolio")
		portfolioGroup.Use(auth.AuthMiddleware())
		{
			portfolioGroup.GET("/:userId", portfolio.GetPortfolio)
			portfolioGroup.POST("/:userId/assets", portfolio.AddAsset)
			portfolioGroup.PUT("/:userId/assets/:assetId", portfolio.UpdateAsset)
			portfolioGroup.DELETE("/:userId/assets/:assetId", portfolio.RemoveAsset)
			portfolioGroup.GET("/:userId/performance", portfolio.GetPerformance)
		}
	}

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Gofr backend server on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
