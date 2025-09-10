package models

import (
	"time"
)

type TeamMember struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	Name    string `json:"name" gorm:"not null;size:255"`
	Picture string `json:"picture" gorm:"size:500"`
	Email   string `json:"email" gorm:"not null;unique;size:255"`
}

type Team struct {
	ID      uint         `json:"id" gorm:"primaryKey"`
	Name    string       `json:"name" gorm:"not null;size:255"`
	Logo    string       `json:"logo" gorm:"size:500"`
	Members []TeamMember `json:"members" gorm:"many2many:team_assignments;"`
}

type TeamAssignment struct {
	TeamID       uint `json:"team_id" gorm:"primaryKey"`
	TeamMemberID uint `json:"team_member_id" gorm:"primaryKey"`
}

type Feedback struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Content    string    `json:"content" gorm:"not null;type:text"`
	TargetType string    `json:"target_type" gorm:"not null;size:50"`
	TargetID   uint      `json:"target_id" gorm:"not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
}
