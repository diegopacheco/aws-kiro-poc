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

func (s *TeamService) GetTeamMembers(teamID uint) ([]models.TeamMember, error) {
	var team models.Team
	err := s.db.Preload("Members").First(&team, teamID).Error
	if err != nil {
		return nil, err
	}
	return team.Members, nil
}

func (s *TeamService) RemoveMemberFromTeam(teamID, memberID uint) error {
	// Remove the association between team and member
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

func (s *TeamService) DeleteTeam(teamID uint) error {
	// First remove all team assignments
	if err := s.db.Where("team_id = ?", teamID).Delete(&models.TeamAssignment{}).Error; err != nil {
		return err
	}

	// Then delete the team
	return s.db.Delete(&models.Team{}, teamID).Error
}
