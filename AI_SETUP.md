# AI Services Setup Guide

This guide will help you set up Gemini API and Ollama for AI-powered cryptocurrency analysis and recommendations.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** installed on your system
3. **Google AI API Key** for Gemini

## 1. Install Ollama

### Windows
```bash
# Download and install from https://ollama.ai/download
# Or use winget
winget install Ollama.Ollama
```

### macOS
```bash
# Download and install from https://ollama.ai/download
# Or use Homebrew
brew install ollama
```

### Linux
```bash
# Install using the official script
curl -fsSL https://ollama.ai/install.sh | sh
```

## 2. Start Ollama Service

```bash
# Start Ollama server
ollama serve

# In a new terminal, pull the required models
ollama pull llama3.2
ollama pull mistral
ollama pull codellama
```

## 3. Get Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for the next step

## 4. Environment Configuration

Create a `.env.local` file in your project root:

```bash
# AI Services Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
OLLAMA_SERVER_URL=http://127.0.0.1:11434

# Other existing environment variables...
NEXT_PUBLIC_VERBWIRE_API_URL=https://api.verbwire.com/v1
VERBWIRE_API_KEY=your_verbwire_api_key_here
# ... etc
```

## 5. Install Dependencies

```bash
npm install
```

## 6. Test AI Services

### Test Ollama
```bash
# Test if Ollama is running
curl http://localhost:11434/api/tags

# Test a model
ollama run llama3.2 "Hello, how are you?"
```

### Test Gemini API
You can test the Gemini integration by making a request to the AI API endpoint:

```bash
curl -X POST http://localhost:3000/api/studio/ai \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze", "symbol": "BTC", "timeframe": "1h"}'
```

## 7. Available AI Features

### Market Analysis (Gemini)
- **Endpoint**: `POST /api/studio/ai`
- **Action**: `analyze`
- **Features**:
  - Market sentiment analysis
  - Technical indicators analysis
  - Price target predictions
  - Risk assessment
  - Investment recommendations

### Mining Recommendations (Ollama)
- **Endpoint**: `POST /api/studio/ai`
- **Action**: `mining-recommendations`
- **Features**:
  - Coin profitability analysis
  - Hardware recommendations
  - Difficulty assessment
  - Market overview

### Price Predictions (Mistral via Ollama)
- **Endpoint**: `POST /api/studio/ai`
- **Action**: `predict`
- **Features**:
  - Short/medium/long-term predictions
  - Confidence intervals
  - Historical data analysis

### Portfolio Analysis (Ollama)
- **Endpoint**: `POST /api/studio/ai`
- **Action**: `portfolio-analysis`
- **Features**:
  - Performance analysis
  - Risk assessment
  - Diversification recommendations
  - Rebalancing suggestions

### Trading Signals (Gemini)
- **Endpoint**: `POST /api/studio/ai`
- **Action**: `trading-signals`
- **Features**:
  - Entry/exit points
  - Stop loss levels
  - Take profit targets
  - Signal strength

## 8. Troubleshooting

### Ollama Issues
```bash
# Check if Ollama is running
ps aux | grep ollama

# Restart Ollama
pkill ollama
ollama serve

# Check available models
ollama list

# Pull missing models
ollama pull llama3.2
ollama pull mistral
ollama pull codellama
```

### Gemini API Issues
- Verify your API key is correct
- Check if you have sufficient quota
- Ensure the API key has the necessary permissions

### Common Errors
1. **"Ollama connection failed"**: Make sure Ollama is running on the correct port
2. **"Gemini API key invalid"**: Verify your API key in the environment variables
3. **"Model not found"**: Pull the required models with `ollama pull <model_name>`

## 9. Performance Optimization

### Ollama Configuration
```bash
# Set environment variables for better performance
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_MAX_LOADED_MODELS=2
export OLLAMA_FLASH_ATTENTION=1
```

### Model Selection
- **llama3.2**: Best for general analysis and recommendations
- **mistral**: Good for price predictions and financial analysis
- **codellama**: Specialized for code analysis and technical indicators

## 10. Development

### Running with AI Services
```bash
# Start the development server
npm run dev

# In another terminal, start Genkit dev server
npm run genkit:dev
```

### Testing AI Flows
```bash
# Test the recommendation flow
npm run genkit:dev
# Then visit http://localhost:4000 to test flows
```

## 11. Production Deployment

### Environment Variables
Make sure to set all required environment variables in your production environment:

```bash
GOOGLE_AI_API_KEY=your_production_key
OLLAMA_SERVER_URL=your_ollama_server_url
```

### Ollama in Production
- Use a dedicated server for Ollama
- Consider using GPU acceleration
- Set up proper monitoring and logging
- Implement rate limiting

## 12. API Usage Examples

### Market Analysis
```javascript
const response = await fetch('/api/studio/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyze',
    symbol: 'BTC',
    timeframe: '1h',
    marketData: {
      price: 45000,
      volume: 1000000,
      change: 0.05
    }
  })
});
```

### Mining Recommendations
```javascript
const response = await fetch('/api/studio/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'mining-recommendations',
    marketData: marketData,
    userPreferences: {
      budget: 10000,
      hardware: 'GPU',
      riskTolerance: 'medium'
    }
  })
});
```

This setup provides a robust AI-powered analysis system for your cryptocurrency platform!
