#!/bin/bash

# AI Services Setup Script
# This script helps set up Gemini API and Ollama for the AI features

echo "🚀 Setting up AI Services for HackOdisha..."

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "📦 Installing Ollama..."
    
    # Detect OS and install accordingly
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            echo "Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        # Windows
        echo "Please download and install Ollama from: https://ollama.ai/download"
        echo "Then run this script again."
        exit 1
    else
        echo "Unsupported OS. Please install Ollama manually from: https://ollama.ai/"
        exit 1
    fi
else
    echo "✅ Ollama is already installed"
fi

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 5

# Pull required models
echo "📥 Pulling AI models..."

echo "Pulling llama3.2..."
ollama pull llama3.2

echo "Pulling mistral..."
ollama pull mistral

echo "Pulling codellama..."
ollama pull codellama

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your API keys:"
    echo "   - GOOGLE_AI_API_KEY (get from https://makersuite.google.com/app/apikey)"
    echo "   - VERBWIRE_API_KEY"
    echo "   - Other required keys"
else
    echo "✅ .env file already exists"
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Check if required environment variables are set
echo "🔍 Checking environment variables..."

if [ -z "$GOOGLE_AI_API_KEY" ]; then
    echo "⚠️  GOOGLE_AI_API_KEY is not set in .env file"
    echo "   Get your API key from: https://makersuite.google.com/app/apikey"
fi

if [ -z "$VERBWIRE_API_KEY" ]; then
    echo "⚠️  VERBWIRE_API_KEY is not set in .env file"
    echo "   Get your API key from: https://verbwire.com/"
fi

# Test Ollama connection
echo "🧪 Testing Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running and accessible"
else
    echo "❌ Ollama is not responding. Please check if it's running."
fi

# Test a simple model
echo "🧪 Testing AI model..."
if ollama run llama3.2 "Hello, how are you?" > /dev/null 2>&1; then
    echo "✅ AI models are working correctly"
else
    echo "❌ AI models test failed. Please check Ollama installation."
fi

echo ""
echo "🎉 AI Services setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit your .env file with the required API keys"
echo "2. Start the development server: npm run dev"
echo "3. Test AI features in the application"
echo ""
echo "To stop Ollama service, run: kill $OLLAMA_PID"
echo "To start Ollama manually: ollama serve"
