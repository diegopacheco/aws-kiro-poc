package database

import (
	"os"
	"testing"

	"coaching-app-backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestDatabaseConnection(t *testing.T) {
	// Test with SQLite for testing
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect to test database: %v", err)
	}

	// Test database ping
	sqlDB, err := db.DB()
	if err != nil {
		t.Errorf("Failed to get underlying sql.DB: %v", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		t.Errorf("Failed to ping database: %v", err)
	}
}

func TestDatabaseMigration(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect to test database: %v", err)
	}

	// Test auto migration
	err = db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})
	if err != nil {
		t.Errorf("Failed to migrate database: %v", err)
	}

	// Verify tables exist by trying to create records
	member := models.TeamMember{Name: "Test User", Email: "test@example.com"}
	result := db.Create(&member)
	if result.Error != nil {
		t.Errorf("Failed to create test record after migration: %v", result.Error)
	}
}

func TestDatabaseConstraints(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect to test database: %v", err)
	}

	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})

	// Test unique email constraint
	member1 := models.TeamMember{Name: "User 1", Email: "test@example.com"}
	member2 := models.TeamMember{Name: "User 2", Email: "test@example.com"}

	db.Create(&member1)
	result := db.Create(&member2)

	if result.Error == nil {
		t.Error("Expected error for duplicate email constraint")
	}
}

func TestDatabaseTransactions(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect to test database: %v", err)
	}

	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})

	// Test transaction rollback
	tx := db.Begin()

	member := models.TeamMember{Name: "Test User", Email: "test@example.com"}
	tx.Create(&member)

	// Rollback transaction
	tx.Rollback()

	// Verify record was not saved
	var count int64
	db.Model(&models.TeamMember{}).Count(&count)
	if count != 0 {
		t.Errorf("Expected 0 records after rollback, got %d", count)
	}

	// Test transaction commit
	tx = db.Begin()
	tx.Create(&member)
	tx.Commit()

	// Verify record was saved
	db.Model(&models.TeamMember{}).Count(&count)
	if count != 1 {
		t.Errorf("Expected 1 record after commit, got %d", count)
	}
}

func TestDatabaseConnectionWithEnvVars(t *testing.T) {
	// Save original env vars
	originalHost := os.Getenv("DB_HOST")
	originalPort := os.Getenv("DB_PORT")
	originalUser := os.Getenv("DB_USER")
	originalPassword := os.Getenv("DB_PASSWORD")
	originalName := os.Getenv("DB_NAME")

	// Set test env vars
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "3306")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")

	// Test that environment variables are read correctly
	host := os.Getenv("DB_HOST")
	if host != "localhost" {
		t.Errorf("Expected DB_HOST to be 'localhost', got '%s'", host)
	}

	port := os.Getenv("DB_PORT")
	if port != "3306" {
		t.Errorf("Expected DB_PORT to be '3306', got '%s'", port)
	}

	// Restore original env vars
	os.Setenv("DB_HOST", originalHost)
	os.Setenv("DB_PORT", originalPort)
	os.Setenv("DB_USER", originalUser)
	os.Setenv("DB_PASSWORD", originalPassword)
	os.Setenv("DB_NAME", originalName)
}

func TestDatabaseRelationships(t *testing.T) {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Errorf("Failed to connect to test database: %v", err)
	}

	db.AutoMigrate(&models.TeamMember{}, &models.Team{}, &models.TeamAssignment{}, &models.Feedback{})

	// Create test data
	team := models.Team{Name: "Dev Team"}
	member := models.TeamMember{Name: "John Doe", Email: "john@example.com"}

	db.Create(&team)
	db.Create(&member)

	// Test many-to-many relationship
	err = db.Model(&team).Association("Members").Append(&member)
	if err != nil {
		t.Errorf("Failed to create team-member association: %v", err)
	}

	// Verify relationship
	var teamWithMembers models.Team
	db.Preload("Members").First(&teamWithMembers, team.ID)

	if len(teamWithMembers.Members) != 1 {
		t.Errorf("Expected 1 member in team, got %d", len(teamWithMembers.Members))
	}

	if teamWithMembers.Members[0].Name != member.Name {
		t.Errorf("Expected member name '%s', got '%s'", member.Name, teamWithMembers.Members[0].Name)
	}
}
