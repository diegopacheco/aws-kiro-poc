package handlers

import (
	"net/http"
	"strconv"

	"coaching-app-backend/models"
	"coaching-app-backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TeamHandler struct {
	service *services.TeamService
}

func NewTeamHandler(db *gorm.DB) *TeamHandler {
	return &TeamHandler{
		service: services.NewTeamService(db),
	}
}

func (h *TeamHandler) CreateTeam(c *gin.Context) {
	var team models.Team
	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if team.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Team name is required"})
		return
	}

	if err := h.service.CreateTeam(&team); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
		return
	}

	c.JSON(http.StatusCreated, team)
}

func (h *TeamHandler) GetAllTeams(c *gin.Context) {
	teams, err := h.service.GetAllTeams()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve teams"})
		return
	}

	c.JSON(http.StatusOK, teams)
}

func (h *TeamHandler) GetTeamByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	team, err := h.service.GetTeamByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found"})
		return
	}

	c.JSON(http.StatusOK, team)
}

func (h *TeamHandler) GetTeamMembers(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	members, err := h.service.GetTeamMembers(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Team not found or failed to retrieve members"})
		return
	}

	c.JSON(http.StatusOK, members)
}

func (h *TeamHandler) RemoveMemberFromTeam(c *gin.Context) {
	teamIdStr := c.Param("id")
	memberIdStr := c.Param("memberId")

	teamId, err := strconv.ParseUint(teamIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid team ID"})
		return
	}

	memberId, err := strconv.ParseUint(memberIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid member ID"})
		return
	}

	if err := h.service.RemoveMemberFromTeam(uint(teamId), uint(memberId)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to remove member from team"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Member removed from team successfully"})
}

func (h *TeamHandler) DeleteTeam(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.DeleteTeam(uint(id)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to delete team"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Team deleted successfully"})
}

func SetupTeamRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewTeamHandler(db)

	api.POST("/teams", handler.CreateTeam)
	api.GET("/teams", handler.GetAllTeams)
	api.GET("/teams/:id", handler.GetTeamByID)
	api.GET("/teams/:id/members", handler.GetTeamMembers)
	api.DELETE("/teams/:id/members/:memberId", handler.RemoveMemberFromTeam)
	api.DELETE("/teams/:id", handler.DeleteTeam)
}
