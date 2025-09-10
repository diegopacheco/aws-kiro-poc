package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error string `json:"error"`
	Code  string `json:"code,omitempty"`
}

func SendError(c *gin.Context, statusCode int, message string, code ...string) {
	response := ErrorResponse{
		Error: message,
	}

	if len(code) > 0 {
		response.Code = code[0]
	}

	c.JSON(statusCode, response)
}

func SendSuccess(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, data)
}

func SendCreated(c *gin.Context, data interface{}) {
	c.JSON(http.StatusCreated, data)
}
