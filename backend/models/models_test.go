package models

import (
	"testing"
	"time"
)

func TestTeamMemberValidation(t *testing.T) {
	member := TeamMember{
		Name:    "John Doe",
		Email:   "john@example.com",
		Picture: "profile.jpg",
	}

	if member.Name == "" {
		t.Error("Expected name to be set")
	}

	if member.Email == "" {
		t.Error("Expected email to be set")
	}
}

func TestTeamValidation(t *testing.T) {
	team := Team{
		Name: "Development Team",
		Logo: "team-logo.png",
	}

	if team.Name == "" {
		t.Error("Expected team name to be set")
	}
}

func TestFeedbackValidation(t *testing.T) {
	feedback := Feedback{
		Content:    "Great work on the project!",
		TargetType: "team",
		TargetID:   1,
		CreatedAt:  time.Now(),
	}

	if feedback.Content == "" {
		t.Error("Expected feedback content to be set")
	}

	if feedback.TargetType != "team" && feedback.TargetType != "member" {
		t.Error("Expected target type to be 'team' or 'member'")
	}
}
