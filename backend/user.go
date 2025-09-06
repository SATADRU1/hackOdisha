package main

import "gorm.io/gorm"

// User represents a user in the system
type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique;not null"`
	Email    string `json:"email" gorm:"unique;not null"`
	Password string `json:"-"`
}