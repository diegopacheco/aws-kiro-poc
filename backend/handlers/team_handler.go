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

func SetupTeamRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewTeamHandler(db)

	api.POST("/teams", handler.CreateTeam)
	api.GET("/teams", handler.GetAllTeams)
	api.GET("/teams/:id", handler.GetTeamByID)
}
