package services

import (
	"testing"

	"coaching-app-backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})
	return db
}

// TeamMember Service Tests
func TestTeamMemberService(t *testing.T) {
	db := setupTestDB()
	service := NewTeamMemberService(db)

	member := &models.TeamMember{
		Name:    "John Doe",
		Email:   "john@example.com",
		Picture: "profile.jpg",
	}

	// Test create
	err := service.CreateTeamMember(member)
	if err != nil {
		t.Errorf("Failed to create team member: %v", err)
	}

	if member.ID == 0 {
		t.Error("Expected ID to be set after creation")
	}

	// Test get all
	members, err := service.GetAllTeamMembers()
	if err != nil {
		t.Errorf("Failed to get team members: %v", err)
	}

	if len(members) != 1 {
		t.Errorf("Expected 1 team member, got %d", len(members))
	}

	// Test get by ID
	retrievedMember, err := service.GetTeamMemberByID(member.ID)
	if err != nil {
		t.Errorf("Failed to get team member by ID: %v", err)
	}

	if retrievedMember.Name != member.Name {
		t.Errorf("Expected name %s, got %s", member.Name, retrievedMember.Name)
	}

	// Test get non-existent member
	_, err = service.GetTeamMemberByID(999)
	if err == nil {
		t.Error("Expected error for non-existent team member")
	}
}

func TestTeamMemberServiceDuplicateEmail(t *testing.T) {
	db := setupTestDB()
	service := NewTeamMemberService(db)

	member1 := &models.TeamMember{
		Name:  "John Doe",
		Email: "john@example.com",
	}

	member2 := &models.TeamMember{
		Name:  "Jane Doe",
		Email: "john@example.com", // Same email
	}

	// Create first member
	err := service.CreateTeamMember(member1)
	if err != nil {
		t.Errorf("Failed to create first team member: %v", err)
	}

	// Try to create second member with same email
	err = service.CreateTeamMember(member2)
	if err == nil {
		t.Error("Expected error for duplicate email")
	}
}

// Team Service Tests
func TestTeamService(t *testing.T) {
	db := setupTestDB()
	service := NewTeamService(db)

	team := &models.Team{
		Name: "Development Team",
		Logo: "team-logo.png",
	}

	// Test create
	err := service.CreateTeam(team)
	if err != nil {
		t.Errorf("Failed to create team: %v", err)
	}

	if team.ID == 0 {
		t.Error("Expected ID to be set after creation")
	}

	// Test get all
	teams, err := service.GetAllTeams()
	if err != nil {
		t.Errorf("Failed to get teams: %v", err)
	}

	if len(teams) != 1 {
		t.Errorf("Expected 1 team, got %d", len(teams))
	}

	// Test get by ID
	retrievedTeam, err := service.GetTeamByID(team.ID)
	if err != nil {
		t.Errorf("Failed to get team by ID: %v", err)
	}

	if retrievedTeam.Name != team.Name {
		t.Errorf("Expected name %s, got %s", team.Name, retrievedTeam.Name)
	}

	// Test get non-existent team
	_, err = service.GetTeamByID(999)
	if err == nil {
		t.Error("Expected error for non-existent team")
	}
}

// Feedback Service Tests
func TestFeedbackService(t *testing.T) {
	db := setupTestDB()
	service := NewFeedbackService(db)

	// Create test data
	team := models.Team{Name: "Dev Team"}
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	db.Create(&team)
	db.Create(&member)

	// Test team feedback
	teamFeedback := &models.Feedback{
		Content:    "Great team work!",
		TargetType: "team",
		TargetID:   team.ID,
	}

	err := service.CreateFeedback(teamFeedback)
	if err != nil {
		t.Errorf("Failed to create team feedback: %v", err)
	}

	// Test member feedback
	memberFeedback := &models.Feedback{
		Content:    "Excellent individual performance!",
		TargetType: "member",
		TargetID:   member.ID,
	}

	err = service.CreateFeedback(memberFeedback)
	if err != nil {
		t.Errorf("Failed to create member feedback: %v", err)
	}

	// Test get all feedback
	allFeedback, err := service.GetAllFeedback()
	if err != nil {
		t.Errorf("Failed to get all feedback: %v", err)
	}

	if len(allFeedback) != 2 {
		t.Errorf("Expected 2 feedback items, got %d", len(allFeedback))
	}

	// Test get feedback by target
	teamFeedbackList, err := service.GetFeedbackByTarget("team", team.ID)
	if err != nil {
		t.Errorf("Failed to get team feedback: %v", err)
	}

	if len(teamFeedbackList) != 1 {
		t.Errorf("Expected 1 team feedback item, got %d", len(teamFeedbackList))
	}

	memberFeedbackList, err := service.GetFeedbackByTarget("member", member.ID)
	if err != nil {
		t.Errorf("Failed to get member feedback: %v", err)
	}

	if len(memberFeedbackList) != 1 {
		t.Errorf("Expected 1 member feedback item, got %d", len(memberFeedbackList))
	}
}

func TestFeedbackServiceInvalidTarget(t *testing.T) {
	db := setupTestDB()
	service := NewFeedbackService(db)

	// Test feedback with non-existent target
	feedback := &models.Feedback{
		Content:    "Test feedback",
		TargetType: "team",
		TargetID:   999, // Non-existent team
	}

	err := service.CreateFeedback(feedback)
	if err == nil {
		t.Error("Expected error for non-existent target")
	}
}

// Assignment Service Tests
func TestAssignmentService(t *testing.T) {
	db := setupTestDB()
	service := NewAssignmentService(db)

	// Create test data
	team := models.Team{Name: "Dev Team"}
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}
	db.Create(&team)
	db.Create(&member)

	// Test assignment
	err := service.AssignMemberToTeam(team.ID, member.ID)
	if err != nil {
		t.Errorf("Failed to assign member to team: %v", err)
	}

	// Test get all assignments (returns teams with members)
	teams, err := service.GetAllAssignments()
	if err != nil {
		t.Errorf("Failed to get assignments: %v", err)
	}

	if len(teams) != 1 {
		t.Errorf("Expected 1 team, got %d", len(teams))
	}

	if len(teams[0].Members) != 1 {
		t.Errorf("Expected 1 member in team, got %d", len(teams[0].Members))
	}

	// Test duplicate assignment
	err = service.AssignMemberToTeam(team.ID, member.ID)
	if err == nil {
		t.Error("Expected error for duplicate assignment")
	}

	// Test remove assignment
	err = service.RemoveMemberFromTeam(team.ID, member.ID)
	if err != nil {
		t.Errorf("Failed to remove member from team: %v", err)
	}

	// Verify removal
	teams, err = service.GetAllAssignments()
	if err != nil {
		t.Errorf("Failed to get assignments after removal: %v", err)
	}

	if len(teams) != 1 {
		t.Errorf("Expected 1 team after removal, got %d", len(teams))
	}

	if len(teams[0].Members) != 0 {
		t.Errorf("Expected 0 members in team after removal, got %d", len(teams[0].Members))
	}
}

func TestAssignmentServiceInvalidIDs(t *testing.T) {
	db := setupTestDB()
	service := NewAssignmentService(db)

	// Test assignment with non-existent team
	err := service.AssignMemberToTeam(999, 1)
	if err == nil {
		t.Error("Expected error for non-existent team")
	}

	// Test assignment with non-existent member
	err = service.AssignMemberToTeam(1, 999)
	if err == nil {
		t.Error("Expected error for non-existent member")
	}
}
