package services

import (
	"coaching-app-backend/models"

	"gorm.io/gorm"
)

type FeedbackService struct {
	db *gorm.DB
}

func NewFeedbackService(db *gorm.DB) *FeedbackService {
	return &FeedbackService{db: db}
}

func (s *FeedbackService) CreateFeedback(feedback *models.Feedback) error {
	if feedback.TargetType == "team" {
		var team models.Team
		if err := s.db.First(&team, feedback.TargetID).Error; err != nil {
			return err
		}
	} else if feedback.TargetType == "member" {
		var member models.TeamMember
		if err := s.db.First(&member, feedback.TargetID).Error; err != nil {
			return err
		}
	}

	return s.db.Create(feedback).Error
}

func (s *FeedbackService) GetAllFeedback() ([]models.Feedback, error) {
	var feedback []models.Feedback
	err := s.db.Find(&feedback).Error
	return feedback, err
}

func (s *FeedbackService) GetFeedbackByTarget(targetType string, targetID uint) ([]models.Feedback, error) {
	var feedback []models.Feedback
	err := s.db.Where("target_type = ? AND target_id = ?", targetType, targetID).Find(&feedback).Error
	return feedback, err
}
