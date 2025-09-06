package handler

import (
	"focusstake/pkg/model"

	"gofr.dev/pkg/gofr"
)

type sessionService interface {
	Start(ctx *gofr.Context, userID int, duration int, stake float64) (*model.FocusSession, error)
	Complete(ctx *gofr.Context, sessionID int) (string, error)
}

type session struct {
	service sessionService
}

func NewSession(s sessionService) *session {
	return &session{service: s}
}

type StartRequest struct {
	UserID   int     `json:"userID"` // In a real app, you'd get this from the JWT token
	Duration int     `json:"duration"`
	Stake    float64 `json:"stake"`
}

func (h *session) Start(ctx *gofr.Context) (interface{}, error) {
	var req StartRequest
	if err := ctx.Bind(&req); err != nil {
		return nil, err
	}

	resp, err := h.service.Start(ctx, req.UserID, req.Duration, req.Stake)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

type CompleteRequest struct {
	SessionID int `json:"sessionID"`
}

func (h *session) Complete(ctx *gofr.Context) (interface{}, error) {
	var req CompleteRequest
	if err := ctx.Bind(&req); err != nil {
		return nil, err
	}

	return h.service.Complete(ctx, req.SessionID)
}