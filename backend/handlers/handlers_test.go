package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
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
	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})
	return db
}

// TeamMember Handler Tests
func TestCreateTeamMember(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/team-members", handler.CreateTeamMember)

	tests := []struct {
		name           string
		member         models.TeamMember
		expectedStatus int
	}{
		{
			name: "Valid team member",
			member: models.TeamMember{
				Name:    "John Doe",
				Email:   "john@example.com",
				Picture: "profile.jpg",
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "Missing name",
			member: models.TeamMember{
				Email: "john@example.com",
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "Missing email",
			member: models.TeamMember{
				Name: "John Doe",
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.member)
			req, _ := http.NewRequest("POST", "/team-members", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

func TestGetAllTeamMembers(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	// Create test data
	member1 := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	member2 := models.TeamMember{Name: "Jane Smith", Email: "jane@example.com"}
	db.Create(&member1)
	db.Create(&member2)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/team-members", handler.GetAllTeamMembers)

	req, _ := http.NewRequest("GET", "/team-members", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("Expected status %d, got %d", http.StatusOK, w.Code)
	}

	var members []models.TeamMember
	json.Unmarshal(w.Body.Bytes(), &members)

	if len(members) != 2 {
		t.Errorf("Expected 2 team members, got %d", len(members))
	}
}

func TestGetTeamMemberByID(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	// Create test data
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	db.Create(&member)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/team-members/:id", handler.GetTeamMemberByID)

	tests := []struct {
		name           string
		id             string
		expectedStatus int
	}{
		{
			name:           "Valid ID",
			id:             fmt.Sprintf("%d", member.ID),
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Invalid ID format",
			id:             "invalid",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Non-existent ID",
			id:             "999",
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/team-members/"+tt.id, nil)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

// Team Handler Tests
func TestCreateTeam(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamHandler(db)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/teams", handler.CreateTeam)

	tests := []struct {
		name           string
		team           models.Team
		expectedStatus int
	}{
		{
			name: "Valid team",
			team: models.Team{
				Name: "Development Team",
				Logo: "team-logo.png",
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "Missing name",
			team: models.Team{
				Logo: "team-logo.png",
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.team)
			req, _ := http.NewRequest("POST", "/teams", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

// Feedback Handler Tests
func TestCreateFeedback(t *testing.T) {
	db := setupTestDB()
	handler := NewFeedbackHandler(db)

	// Create test data
	team := models.Team{Name: "Dev Team"}
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	db.Create(&team)
	db.Create(&member)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/feedback", handler.CreateFeedback)

	tests := []struct {
		name           string
		feedback       models.Feedback
		expectedStatus int
	}{
		{
			name: "Valid team feedback",
			feedback: models.Feedback{
				Content:    "Great work!",
				TargetType: "team",
				TargetID:   team.ID,
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "Valid member feedback",
			feedback: models.Feedback{
				Content:    "Excellent performance!",
				TargetType: "member",
				TargetID:   member.ID,
			},
			expectedStatus: http.StatusCreated,
		},
		{
			name: "Missing content",
			feedback: models.Feedback{
				TargetType: "team",
				TargetID:   team.ID,
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, _ := json.Marshal(tt.feedback)
			req, _ := http.NewRequest("POST", "/feedback", bytes.NewBuffer(jsonData))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			if w.Code != tt.expectedStatus {
				t.Errorf("Expected status %d, got %d", tt.expectedStatus, w.Code)
			}
		})
	}
}

// Assignment Handler Tests
func TestAssignMemberToTeam(t *testing.T) {
	db := setupTestDB()
	handler := NewAssignmentHandler(db)

	// Create test data
	team := models.Team{Name: "Dev Team"}
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	db.Create(&team)
	db.Create(&member)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/assignments", handler.AssignMemberToTeam)

	assignment := map[string]uint{
		"team_id":        team.ID,
		"team_member_id": member.ID,
	}

	jsonData, _ := json.Marshal(assignment)
	req, _ := http.NewRequest("POST", "/assignments", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Errorf("Expected status %d, got %d", http.StatusCreated, w.Code)
	}
}

func TestInvalidJSONRequest(t *testing.T) {
	db := setupTestDB()
	handler := NewTeamMemberHandler(db)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/team-members", handler.CreateTeamMember)

	req, _ := http.NewRequest("POST", "/team-members", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("Expected status %d, got %d", http.StatusBadRequest, w.Code)
	}
}
