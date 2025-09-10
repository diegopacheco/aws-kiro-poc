package handlers

import (
	"net/http"
	"strconv"

	"coaching-app-backend/models"
	"coaching-app-backend/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FeedbackHandler struct {
	service *services.FeedbackService
}

func NewFeedbackHandler(db *gorm.DB) *FeedbackHandler {
	return &FeedbackHandler{
		service: services.NewFeedbackService(db),
	}
}

func (h *FeedbackHandler) CreateFeedback(c *gin.Context) {
	var feedback models.Feedback
	if err := c.ShouldBindJSON(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if feedback.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Feedback content is required"})
		return
	}

	if feedback.TargetType != "team" && feedback.TargetType != "member" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Target type must be 'team' or 'member'"})
		return
	}

	if err := h.service.CreateFeedback(&feedback); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid target ID or failed to create feedback"})
		return
	}

	c.JSON(http.StatusCreated, feedback)
}

func (h *FeedbackHandler) GetAllFeedback(c *gin.Context) {
	feedback, err := h.service.GetAllFeedback()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve feedback"})
		return
	}

	c.JSON(http.StatusOK, feedback)
}

func (h *FeedbackHandler) GetFeedbackForTeam(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	feedback, err := h.service.GetFeedbackByTarget("team", uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve feedback"})
		return
	}

	c.JSON(http.StatusOK, feedback)
}

func (h *FeedbackHandler) GetFeedbackForMember(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	feedback, err := h.service.GetFeedbackByTarget("member", uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve feedback"})
		return
	}

	c.JSON(http.StatusOK, feedback)
}

func SetupFeedbackRoutes(api *gin.RouterGroup, db *gorm.DB) {
	handler := NewFeedbackHandler(db)

	api.POST("/feedback", handler.CreateFeedback)
	api.GET("/feedback", handler.GetAllFeedback)
	api.GET("/feedback/team/:id", handler.GetFeedbackForTeam)
	api.GET("/feedback/member/:id", handler.GetFeedbackForMember)
}
