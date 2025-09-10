package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"coaching-app-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.Feedback{})
	return db
}

func TestCreateTeamMember(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/team-members", handler.CreateTeamMember)

	member := models.TeamMember{
		Name:  "John Doe",
		Email: "john@example.com",
	}

	jsonData, _ := json.Marshal(member)
	req, _ := http.NewRequest("POST", "/team-members", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status %d, got %d", http.StatusCreated, w.Code)
	}
}

func TestCreateTeamMemberValidation(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/team-members", handler.CreateTeamMember)

	member := models.TeamMember{
		Name:  "",
		Email: "",
	}

	jsonData, _ := json.Marshal(member)
	req, _ := http.NewRequest("POST", "/team-members", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status %d, got %d", http.StatusBadRequest, w.Code)
	}
}
