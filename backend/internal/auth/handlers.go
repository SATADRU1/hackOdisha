package auth

import (
	"errors"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"hackodisha/backend/models"
)

var (
	errInvalidCredentials = errors.New("invalid email or password")
	errEmailExists        = errors.New("email already in use")
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

type loginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type registerRequest struct {
	Email          string  `json:"email" binding:"required,email"`
	Password       string  `json:"password" binding:"required,min=8"`
	WalletAddress  string  `json:"wallet_address" binding:"required"`
}

type authResponse struct {
	Token string     `json:"token"`
	User  userDetail `json:"user"`
}

type userDetail struct {
	ID               uint    `json:"id"`
	Email           string  `json:"email"`
	WalletAddress   string  `json:"wallet_address"`
	TotalSessions   int     `json:"total_sessions"`
	CompletedSessions int    `json:"completed_sessions"`
	TotalStaked     float64 `json:"total_staked"`
	TotalEarned     float64 `json:"total_earned"`
	Streak          int     `json:"streak"`
}

func (s *AuthService) hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func (s *AuthService) comparePasswords(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}

func (s *AuthService) generateJWT(user *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

// Login handles user login
func (s *AuthService) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": errInvalidCredentials.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	if err := s.comparePasswords(user.PasswordHash, req.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": errInvalidCredentials.Error()})
		return
	}

	token, err := s.generateJWT(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}

	c.JSON(http.StatusOK, authResponse{
		Token: token,
		User:  s.mapUserToDetail(&user),
	})
}

// Register handles user registration
func (s *AuthService) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := s.hashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create user"})
		return
	}

	user := models.User{
		Email:         req.Email,
		PasswordHash:  hashedPassword,
		WalletAddress: req.WalletAddress,
	}

	if err := s.db.Create(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			c.JSON(http.StatusConflict, gin.H{"error": errEmailExists.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create user"})
		return
	}

	token, err := s.generateJWT(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}

	c.JSON(http.StatusCreated, authResponse{
		Token: token,
		User:  s.mapUserToDetail(&user),
	})
}

// GetProfile retrieves the user's profile
func (s *AuthService) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, s.mapUserToDetail(&user))
}

// UpdateProfile updates the user's profile
func (s *AuthService) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var req struct {
		Email         *string `json:"email,omitempty"`
		WalletAddress *string `json:"wallet_address,omitempty"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := make(map[string]interface{})
	if req.Email != nil {
		updates["email"] = *req.Email
	}
	if req.WalletAddress != nil {
		updates["wallet_address"] = *req.WalletAddress
	}

	if err := s.db.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update profile"})
		return
	}

	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	c.JSON(http.StatusOK, s.mapUserToDetail(&user))
}

// mapUserToDetail converts a User model to a userDetail response
func (s *AuthService) mapUserToDetail(user *models.User) userDetail {
	return userDetail{
		ID:               user.ID,
		Email:           user.Email,
		WalletAddress:   user.WalletAddress,
		TotalSessions:   user.TotalSessions,
		CompletedSessions: user.CompletedSessions,
		TotalStaked:     user.TotalStaked,
		TotalEarned:     user.TotalEarned,
		Streak:          user.Streak,
	}
}

// AuthMiddleware verifies the JWT token and sets the user ID in the context
func (s *AuthService) AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}

		userID := uint(claims["user_id"].(float64))
		c.Set("user_id", userID)
		c.Next()
	}
}

// AuthMiddleware provides authentication middleware
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Implementation for authentication middleware
		c.Next()
	}
}
