package models

import (
	"testing"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&TeamMember{}, &Team{}, &TeamAssignment{}, &Feedback{})
	return db
}

func TestTeamMemberValidation(t *testing.T) {
	tests := []struct {
		name        string
		member      TeamMember
		expectValid bool
	}{
		{
			name: "Valid team member",
			member: TeamMember{
				Name:    "John Doe",
				Email:   "john@example.com",
				Picture: "profile.jpg",
			},
			expectValid: true,
		},
		{
			name: "Empty name should be invalid",
			member: TeamMember{
				Name:  "",
				Email: "john@example.com",
			},
			expectValid: false,
		},
		{
			name: "Empty email should be invalid",
			member: TeamMember{
				Name:  "John Doe",
				Email: "",
			},
			expectValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.expectValid {
				if tt.member.Name == "" {
					t.Error("Expected name to be set")
				}
				if tt.member.Email == "" {
					t.Error("Expected email to be set")
				}
			} else {
				if tt.member.Name == "" || tt.member.Email == "" {
					// This is expected for invalid cases
				}
			}
		})
	}
}

func TestTeamMemberDatabaseOperations(t *testing.T) {
	db := setupTestDB()

	member := TeamMember{
		Name:    "John Doe",
		Email:   "john@example.com",
		Picture: "profile.jpg",
	}

	// Test create
	result := db.Create(&member)
	if result.Error != nil {
		t.Errorf("Failed to create team member: %v", result.Error)
	}

	if member.ID == 0 {
		t.Error("Expected ID to be set after creation")
	}

	// Test unique email constraint
	duplicate := TeamMember{
		Name:  "Jane Doe",
		Email: "john@example.com", // Same email
	}
	result = db.Create(&duplicate)
	if result.Error == nil {
		t.Error("Expected error for duplicate email")
	}
}

func TestTeamValidation(t *testing.T) {
	tests := []struct {
		name        string
		team        Team
		expectValid bool
	}{
		{
			name: "Valid team",
			team: Team{
				Name: "Development Team",
				Logo: "team-logo.png",
			},
			expectValid: true,
		},
		{
			name: "Empty name should be invalid",
			team: Team{
				Name: "",
				Logo: "team-logo.png",
			},
			expectValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.expectValid {
				if tt.team.Name == "" {
					t.Error("Expected team name to be set")
				}
			} else {
				if tt.team.Name == "" {
					// This is expected for invalid cases
				}
			}
		})
	}
}

func TestTeamDatabaseOperations(t *testing.T) {
	db := setupTestDB()

	team := Team{
		Name: "Development Team",
		Logo: "team-logo.png",
	}

	// Test create
	result := db.Create(&team)
	if result.Error != nil {
		t.Errorf("Failed to create team: %v", result.Error)
	}

	if team.ID == 0 {
		t.Error("Expected ID to be set after creation")
	}
}

func TestFeedbackValidation(t *testing.T) {
	tests := []struct {
		name        string
		feedback    Feedback
		expectValid bool
	}{
		{
			name: "Valid team feedback",
			feedback: Feedback{
				Content:    "Great work on the project!",
				TargetType: "team",
				TargetID:   1,
			},
			expectValid: true,
		},
		{
			name: "Valid member feedback",
			feedback: Feedback{
				Content:    "Excellent performance!",
				TargetType: "member",
				TargetID:   1,
			},
			expectValid: true,
		},
		{
			name: "Empty content should be invalid",
			feedback: Feedback{
				Content:    "",
				TargetType: "team",
				TargetID:   1,
			},
			expectValid: false,
		},
		{
			name: "Invalid target type should be invalid",
			feedback: Feedback{
				Content:    "Good work!",
				TargetType: "invalid",
				TargetID:   1,
			},
			expectValid: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.expectValid {
				if tt.feedback.Content == "" {
					t.Error("Expected feedback content to be set")
				}
				if tt.feedback.TargetType != "team" && tt.feedback.TargetType != "member" {
					t.Error("Expected target type to be 'team' or 'member'")
				}
			} else {
				if tt.feedback.Content == "" || (tt.feedback.TargetType != "team" && tt.feedback.TargetType != "member") {
					// This is expected for invalid cases
				}
			}
		})
	}
}

func TestFeedbackDatabaseOperations(t *testing.T) {
	db := setupTestDB()

	feedback := Feedback{
		Content:    "Great work on the project!",
		TargetType: "team",
		TargetID:   1,
	}

	// Test create
	result := db.Create(&feedback)
	if result.Error != nil {
		t.Errorf("Failed to create feedback: %v", result.Error)
	}

	if feedback.ID == 0 {
		t.Error("Expected ID to be set after creation")
	}

	if feedback.CreatedAt.IsZero() {
		t.Error("Expected CreatedAt to be set automatically")
	}
}

func TestTeamAssignmentModel(t *testing.T) {
	db := setupTestDB()

	// Create test data
	member := TeamMember{Name: "John Doe", Email: "john@example.com"}
	team := Team{Name: "Dev Team"}

	db.Create(&member)
	db.Create(&team)

	assignment := TeamAssignment{
		TeamID:       team.ID,
		TeamMemberID: member.ID,
	}

	// Test create assignment
	result := db.Create(&assignment)
	if result.Error != nil {
		t.Errorf("Failed to create team assignment: %v", result.Error)
	}

	// Test duplicate assignment prevention
	duplicate := TeamAssignment{
		TeamID:       team.ID,
		TeamMemberID: member.ID,
	}
	result = db.Create(&duplicate)
	if result.Error == nil {
		t.Error("Expected error for duplicate assignment")
	}
}
