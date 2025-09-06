package main

import (
	"./backend/internal/auth"

	"github.com/gin-gonic/gin"
)

func setupAuthRoutes(r *gin.RouterGroup) {
	authGroup := r.Group("/auth")
	{
		authGroup.POST("/login", auth.Login)
		authGroup.POST("/register", auth.Register)
		authGroup.POST("/logout", auth.Logout)
		authGroup.GET("/verify", auth.VerifyToken)
		authGroup.POST("/refresh", auth.RefreshToken)
		authGroup.GET("/profile", auth.GetProfile)
		authGroup.PUT("/profile", auth.UpdateProfile)
	}
}
