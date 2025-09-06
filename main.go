package main

import (
    "hackodisha/backend/pkg/handler"
    "hackodisha/backend/pkg/service"
    "hackodisha/backend/pkg/store"
    "hackodisha/backend/internal/auth"
    "hackodisha/backend/internal/mining"
    "hackodisha/backend/internal/portfolio"
    "gofr.dev/pkg/gofr"
)


func main() {
	// Create a new GoFr application instance
	app := gofr.New()

	// Enable CORS for your React frontend
	// Replace "http://localhost:3000" with your actual frontend URL
	app.EnableCORS(gofr.CORSOptions{
		AllowedOrigins: []string{"http://localhost:3000"},
	})

	// The following line is for demonstration. We will replace it with a real database later.
	// For now, we use a simple in-memory store.
	s := store.New()

	// Create instances of our services, passing the store
	userService := service.NewUser(s)
	sessionService := service.NewSession(s)
	dashboardService := service.NewDashboard(s)

	// Create instances of our handlers, passing the services
	userHandler := handler.NewUser(userService)
	sessionHandler := handler.NewSession(sessionService)
	dashboardHandler := handler.NewDashboard(dashboardService)

	// User Authentication Routes
	app.POST("/signup", userHandler.Signup)
	app.POST("/login", userHandler.Login)

	// Focus Session Routes
	// We will add a JWT middleware here later for security
	app.POST("/sessions/start", sessionHandler.Start)
	app.POST("/sessions/complete", sessionHandler.Complete)

	// Dashboard Route
	app.GET("/dashboard/{userID}", dashboardHandler.Get)

	// Start the server
	// The default port is 8000, so your API will be at http://localhost:8000
	app.Start()
}