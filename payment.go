package main

import (
    "hackodisha/backend/internal/payment"
    "github.com/gin-gonic/gin"
)

func setupPaymentRoutes(r *gin.RouterGroup) {
    paymentGroup := r.Group("/payment")
    {
        paymentGroup.POST("/stake", payment.Stake)
        paymentGroup.POST("/reward", payment.DistributeReward)
        paymentGroup.GET("/history/:userId", payment.GetPaymentHistory)
    }
}