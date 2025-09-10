package services

import (
	"coaching-app-backend/models"

	"gorm.io/gorm"
)

type TeamService struct {
	db *gorm.DB
}

func NewTeamService(db *gorm.DB) *TeamService {
	return &TeamService{db: db}
}

func (s *TeamService) CreateTeam(team *models.Team) error {
	return s.db.Create(team).Error
}

func (s *TeamService) GetAllTeams() ([]models.Team, error) {
	var teams []models.Team
	err := s.db.Find(&teams).Error
	return teams, err
}

func (s *TeamService) GetTeamByID(id uint) (*models.Team, error) {
	var team models.Team
	err := s.db.Preload("Members").First(&team, id).Error
	if err != nil {
		return nil, err
	}
	return &team, nil
}
