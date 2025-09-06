package main

import (
	"hackodisha/backend/internal/user"

	"github.com/gin-gonic/gin"
)

func setupUserRoutes(r *gin.RouterGroup) {
	userGroup := r.Group("/user")
	userGroup.Use(auth.AuthMiddleware())
	{
		userGroup.GET("/:userId", user.GetUserDetails)
		userGroup.PUT("/:userId", user.UpdateUserDetails)
	}
}
