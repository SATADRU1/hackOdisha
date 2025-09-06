package main

import (
	"hackodisha/backend/internal/session"

	"github.com/gin-gonic/gin"
)

func setupSessionRoutes(r *gin.RouterGroup) {
	sessionGroup := r.Group("/sessions")
	sessionGroup.Use(auth.AuthMiddleware())
	{
		sessionGroup.POST("/start", session.StartSession)
		sessionGroup.POST("/complete", session.CompleteSession)
		sessionGroup.GET("/details/:userId", session.GetSessionDetails)
	}
}
