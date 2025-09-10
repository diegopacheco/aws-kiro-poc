package handlers

import (
	"net/http"

	"coaching-app-backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AssignmentHandler struct {
	service *services.AssignmentService
}

type AssignmentRequest struct {
	TeamID       uint `json:"team_id" binding:"required"`
	TeamMemberID uint `json:"team_member_id" binding:"required"`
}

func NewAssignmentHandler(db *gorm.DB) *AssignmentHandler {
	return &AssignmentHandler{
		service: services.NewAssignmentService(db),
	}
}

func (h *AssignmentHandler) AssignMemberToTeam(c *gin.Context) {
	var req AssignmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.AssignMemberToTeam(req.TeamID, req.TeamMemberID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to assign member to team"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Member assigned to team successfully"})
}

func (h *AssignmentHandler) GetAllAssignments(c *gin.Context) {
	assignments, err := h.service.GetAllAssignments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve assignments"})
		return
	}

	c.JSON(http.StatusOK, assignments)
}

func (h *AssignmentHandler) RemoveMemberFromTeam(c *gin.Context) {
	var req AssignmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.RemoveMemberFromTeam(req.TeamID, req.TeamMemberID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to remove member from team"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Member removed from team successfully"})
}

func SetupAssignmentRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewAssignmentHandler(db)

	api.POST("/assignments", handler.AssignMemberToTeam)
	api.GET("/assignments", handler.GetAllAssignments)
	api.DELETE("/assignments", handler.RemoveMemberFromTeam)
}
