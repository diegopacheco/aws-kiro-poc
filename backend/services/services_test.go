package services

import (
	"testing"

	"coaching-app-backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.Feedback{})
	return db
}

func TestTeamMemberService(t *testing.T) {
	db := setupTestDB()
	service := NewTeamMemberService(db)

	member := &models.TeamMember{
		Name:  "John Doe",
		Email: "john@example.com",
	}

	err := service.CreateTeamMember(member)
	if err != nil {
		t.Errorf("Failed to create team member: %v", err)
	}

	members, err := service.GetAllTeamMembers()
	if err != nil {
		t.Errorf("Failed to get team members: %v", err)
	}

	if len(members) != 1 {
		t.Errorf("Expected 1 team member, got %d", len(members))
	}
}

func TestTeamService(t *testing.T) {
	db := setupTestDB()
	service := NewTeamService(db)

	team := &models.Team{
		Name: "Development Team",
	}

	err := service.CreateTeam(team)
	if err != nil {
		t.Errorf("Failed to create team: %v", err)
	}

	teams, err := service.GetAllTeams()
	if err != nil {
		t.Errorf("Failed to get teams: %v", err)
	}

	if len(teams) != 1 {
		t.Errorf("Expected 1 team, got %d", len(teams))
	}
}
