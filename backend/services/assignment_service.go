package services

import (
	"coaching-app-backend/models"

	"gorm.io/gorm"
)

type AssignmentService struct {
	db *gorm.DB
}

func NewAssignmentService(db *gorm.DB) *AssignmentService {
	return &AssignmentService{db: db}
}

func (s *AssignmentService) AssignMemberToTeam(teamID, memberID uint) error {
	var team models.Team
	if err := s.db.First(&team, teamID).Error; err != nil {
		return err
	}

	var member models.TeamMember
	if err := s.db.First(&member, memberID).Error; err != nil {
		return err
	}

	return s.db.Model(&team).Association("Members").Append(&member)
}

func (s *AssignmentService) GetAllAssignments() ([]models.Team, error) {
	var teams []models.Team
	err := s.db.Preload("Members").Find(&teams).Error
	return teams, err
}

func (s *AssignmentService) RemoveMemberFromTeam(teamID, memberID uint) error {
	var team models.Team
	if err := s.db.First(&team, teamID).Error; err != nil {
		return err
	}

	var member models.TeamMember
	if err := s.db.First(&member, memberID).Error; err != nil {
		return err
	}

	return s.db.Model(&team).Association("Members").Delete(&member)
}
