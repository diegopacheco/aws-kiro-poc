package handlers

import (
	"net/http"
	"strconv"

	"coaching-app-backend/models"
	"coaching-app-backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TeamMemberHandler struct {
	service *services.TeamMemberService
}

func NewTeamMemberHandler(db *gorm.DB) *TeamMemberHandler {
	return &TeamMemberHandler{
		service: services.NewTeamMemberService(db),
	}
}

func (h *TeamMemberHandler) CreateTeamMember(c *gin.Context) {
	var member models.TeamMember
	if err := c.ShouldBindJSON(&member); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if member.Name == "" || member.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and email are required"})
		return
	}

	if err := h.service.CreateTeamMember(&member); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team member"})
		return
	}

	c.JSON(http.StatusCreated, member)
}

func (h *TeamMemberHandler) GetAllTeamMembers(c *gin.Context) {
	members, err := h.service.GetAllTeamMembers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve team members"})
		return
	}

	c.JSON(http.StatusOK, members)
}

func (h *TeamMemberHandler) GetTeamMemberByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	member, err := h.service.GetTeamMemberByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team member not found"})
		return
	}

	c.JSON(http.StatusOK, member)
}

func SetupTeamMemberRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewTeamMemberHandler(db)

	api.POST("/team-members", handler.CreateTeamMember)
	api.GET("/team-members", handler.GetAllTeamMembers)
	api.GET("/team-members/:id", handler.GetTeamMemberByID)
}
