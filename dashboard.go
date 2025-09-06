package handler

import (
	"strconv"

	"gofr.dev/pkg/gofr"
)

type dashboardService interface {
	Get(ctx *gofr.Context, userID int) (interface{}, error)
}

type dashboard struct {
	service dashboardService
}

func NewDashboard(s dashboardService) *dashboard {
	return &dashboard{service: s}
}

func (h *dashboard) Get(ctx *gofr.Context) (interface{}, error) {
	// Get userID from the URL path, e.g., /dashboard/1
	userID, err := strconv.Atoi(ctx.PathParam("userID"))
	if err != nil {
		return nil, gofr.NewError(400, "Invalid User ID")
	}

	return h.service.Get(ctx, userID)
}