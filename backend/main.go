package main

import (
	"log"
	"os"

	"coaching-app-backend/database"
	"coaching-app-backend/handlers"
	"coaching-app-backend/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	db, err := database.Connect()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = database.Migrate(db)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	r := gin.Default()

	r.Use(middleware.CORS())

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "coaching-app-backend",
		})
	})

	api := r.Group("/api")
	{
		handlers.SetupTeamMemberRoutes(api, db)
		handlers.SetupTeamRoutes(api, db)
		handlers.SetupAssignmentRoutes(api, db)
		handlers.SetupFeedbackRoutes(api, db)
	}

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
