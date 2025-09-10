package models

import (
	"time"
)

type TeamMember struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	Name    string `json:"name" gorm:"not null"`
	Picture string `json:"picture"`
	Email   string `json:"email" gorm:"not null;unique"`
}

type Team struct {
	ID      uint         `json:"id" gorm:"primaryKey"`
	Name    string       `json:"name" gorm:"not null"`
	Logo    string       `json:"logo"`
	Members []TeamMember `json:"members" gorm:"many2many:team_assignments;"`
}

type TeamAssignment struct {
	TeamID       uint `json:"team_id" gorm:"primaryKey"`
	TeamMemberID uint `json:"team_member_id" gorm:"primaryKey"`
}

type Feedback struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Content    string    `json:"content" gorm:"not null"`
	TargetType string    `json:"target_type" gorm:"not null"`
	TargetID   uint      `json:"target_id" gorm:"not null"`
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
}
