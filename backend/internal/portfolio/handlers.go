package portfolio

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type Asset struct {
	ID            string    `json:"id"`
	UserID        string    `json:"user_id"`
	Symbol        string    `json:"symbol"`
	Amount        float64   `json:"amount"`
	PurchasePrice float64   `json:"purchase_price"`
	CurrentPrice  float64   `json:"current_price"`
	PurchaseDate  time.Time `json:"purchase_date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Portfolio struct {
	UserID           string    `json:"user_id"`
	TotalValue       float64   `json:"total_value"`
	TotalGain        float64   `json:"total_gain"`
	TotalGainPercent float64   `json:"total_gain_percent"`
	Assets           []Asset   `json:"assets"`
	LastUpdated      time.Time `json:"last_updated"`
}

type PerformanceData struct {
	UserID     string      `json:"user_id"`
	Timeframe  string      `json:"timeframe"`
	DataPoints []DataPoint `json:"data_points"`
	Summary    Summary     `json:"summary"`
}

type DataPoint struct {
	Timestamp   time.Time `json:"timestamp"`
	Value       float64   `json:"value"`
	Gain        float64   `json:"gain"`
	GainPercent float64   `json:"gain_percent"`
}

type Summary struct {
	StartValue       float64 `json:"start_value"`
	EndValue         float64 `json:"end_value"`
	TotalGain        float64 `json:"total_gain"`
	TotalGainPercent float64 `json:"total_gain_percent"`
	BestDay          float64 `json:"best_day"`
	WorstDay         float64 `json:"worst_day"`
	Volatility       float64 `json:"volatility"`
}

func GetPortfolio(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Mock portfolio data
	assets := []Asset{
		{
			ID:            "1",
			UserID:        userID,
			Symbol:        "BTC",
			Amount:        0.5,
			PurchasePrice: 45000.0,
			CurrentPrice:  47000.0,
			PurchaseDate:  time.Now().Add(-30 * 24 * time.Hour),
			CreatedAt:     time.Now().Add(-30 * 24 * time.Hour),
			UpdatedAt:     time.Now(),
		},
		{
			ID:            "2",
			UserID:        userID,
			Symbol:        "ETH",
			Amount:        2.0,
			PurchasePrice: 3000.0,
			CurrentPrice:  3200.0,
			PurchaseDate:  time.Now().Add(-15 * 24 * time.Hour),
			CreatedAt:     time.Now().Add(-15 * 24 * time.Hour),
			UpdatedAt:     time.Now(),
		},
	}

	// Calculate portfolio totals
	totalValue := 0.0
	totalCost := 0.0
	for _, asset := range assets {
		totalValue += asset.Amount * asset.CurrentPrice
		totalCost += asset.Amount * asset.PurchasePrice
	}

	totalGain := totalValue - totalCost
	totalGainPercent := (totalGain / totalCost) * 100

	portfolio := Portfolio{
		UserID:           userID,
		TotalValue:       totalValue,
		TotalGain:        totalGain,
		TotalGainPercent: totalGainPercent,
		Assets:           assets,
		LastUpdated:      time.Now(),
	}

	c.JSON(http.StatusOK, portfolio)
}

func AddAsset(c *gin.Context) {
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var asset Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set user ID and timestamps
	asset.UserID = userID
	asset.CreatedAt = time.Now()
	asset.UpdatedAt = time.Now()

	// Mock response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Asset added successfully",
		"asset":   asset,
	})
}

func UpdateAsset(c *gin.Context) {
	userID := c.Param("userId")
	assetID := c.Param("assetId")

	if userID == "" || assetID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID and Asset ID are required"})
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock response
	c.JSON(http.StatusOK, gin.H{
		"message":  "Asset updated successfully",
		"asset_id": assetID,
		"updates":  updateData,
	})
}

func RemoveAsset(c *gin.Context) {
	userID := c.Param("userId")
	assetID := c.Param("assetId")

	if userID == "" || assetID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID and Asset ID are required"})
		return
	}

	// Mock response
	c.JSON(http.StatusOK, gin.H{
		"message":  "Asset removed successfully",
		"asset_id": assetID,
	})
}

func GetPerformance(c *gin.Context) {
	userID := c.Param("userId")
	timeframe := c.DefaultQuery("timeframe", "1y")

	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	// Mock performance data
	dataPoints := []DataPoint{}
	startValue := 10000.0
	currentValue := 11500.0

	// Generate mock data points based on timeframe
	days := 365
	if timeframe == "1m" {
		days = 30
	} else if timeframe == "3m" {
		days = 90
	} else if timeframe == "6m" {
		days = 180
	}

	for i := 0; i < days; i++ {
		value := startValue + (currentValue-startValue)*float64(i)/float64(days-1) + (float64(i%7)-3)*50
		gain := value - startValue
		gainPercent := (gain / startValue) * 100

		dataPoints = append(dataPoints, DataPoint{
			Timestamp:   time.Now().Add(-time.Duration(days-i) * 24 * time.Hour),
			Value:       value,
			Gain:        gain,
			GainPercent: gainPercent,
		})
	}

	summary := Summary{
		StartValue:       startValue,
		EndValue:         currentValue,
		TotalGain:        currentValue - startValue,
		TotalGainPercent: ((currentValue - startValue) / startValue) * 100,
		BestDay:          5.2,
		WorstDay:         -3.1,
		Volatility:       12.5,
	}

	performance := PerformanceData{
		UserID:     userID,
		Timeframe:  timeframe,
		DataPoints: dataPoints,
		Summary:    summary,
	}

	c.JSON(http.StatusOK, performance)
}
