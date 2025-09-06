package store

import (
	"focusstake/pkg/model"
	"sync"

	"gofr.dev/pkg/gofr"
)

// User is the interface for user data operations
type User interface {
	GetByEmail(ctx *gofr.Context, email string) (*model.User, error)
	Create(ctx *gofr.Context, user model.User) (int, error)
}

// Session is the interface for session data operations
type Session interface {
	Create(ctx *gofr.Context, session model.FocusSession) (int, error)
	GetByUserID(ctx *gofr.Context, userID int) ([]model.FocusSession, error)
}

// store implements the interfaces using an in-memory store.
// NOTE: This is for demonstration. In a real app, you would use a database like PostgreSQL or MySQL.
type store struct {
	sync.Mutex
	users    map[string]model.User
	sessions []model.FocusSession
	userInc  int
	sessInc  int
}

// New creates a new in-memory store
func New() *store {
	return &store{
		users:    make(map[string]model.User),
		sessions: make([]model.FocusSession, 0),
		userInc:  1,
		sessInc:  1,
	}
}