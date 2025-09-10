package services

import (
	"coaching-app-backend/models"

	"gorm.io/gorm"
)

type TeamMemberService struct {
	db *gorm.DB
}

func NewTeamMemberService(db *gorm.DB) *TeamMemberService {
	return &TeamMemberService{db: db}
}

func (s *TeamMemberService) CreateTeamMember(member *models.TeamMember) error {
	return s.db.Create(member).Error
}

func (s *TeamMemberService) GetAllTeamMembers() ([]models.TeamMember, error) {
	var members []models.TeamMember
	err := s.db.Find(&members).Error
	return members, err
}

func (s *TeamMemberService) GetTeamMemberByID(id uint) (*models.TeamMember, error) {
	var member models.TeamMember
	err := s.db.First(&member, id).Error
	if err != nil {
		return nil, err
	}
	return &member, nil
}
