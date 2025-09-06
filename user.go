package handler

import (
	"focusstake/pkg/model"

	"gofr.dev/pkg/gofr"
)

// Define an interface for the service we depend on
type userService interface {
	Signup(ctx *gofr.Context, user model.User) (*model.User, error)
	Login(ctx *gofr.Context, email, password string) (string, error)
}

type user struct {
	service userService
}

func NewUser(s userService) *user {
	return &user{service: s}
}

func (h *user) Signup(ctx *gofr.Context) (interface{}, error) {
	var u model.User

	if err := ctx.Bind(&u); err != nil {
		return nil, err
	}

	resp, err := h.service.Signup(ctx, u)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (h *user) Login(ctx *gofr.Context) (interface{}, error) {
	var req model.LoginRequest

	if err := ctx.Bind(&req); err != nil {
		return nil, err
	}

	token, err := h.service.Login(ctx, req.Email, req.Password)
	if err != nil {
		return nil, err // In a real app, return a 401 Unauthorized status
	}

	return map[string]string{"token": token}, nil
}