@echo off
REM AI Services Setup Script for Windows
REM This script helps set up Gemini API and Ollama for the AI features

echo 🚀 Setting up AI Services for HackOdisha...

REM Check if Ollama is installed
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Ollama is not installed. Please download and install from:
    echo    https://ollama.ai/download
    echo.
    echo After installation, run this script again.
    pause
    exit /b 1
) else (
    echo ✅ Ollama is already installed
)

REM Start Ollama service
echo 🔄 Starting Ollama service...
start /b ollama serve

REM Wait for Ollama to start
echo ⏳ Waiting for Ollama to start...
timeout /t 5 /nobreak >nul

REM Pull required models
echo 📥 Pulling AI models...

echo Pulling llama3.2...
ollama pull llama3.2

echo Pulling mistral...
ollama pull mistral

echo Pulling codellama...
ollama pull codellama

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file and add your API keys:
    echo    - GOOGLE_AI_API_KEY (get from https://makersuite.google.com/app/apikey)
    echo    - VERBWIRE_API_KEY
    echo    - Other required keys
) else (
    echo ✅ .env file already exists
)

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
npm install

REM Test Ollama connection
echo 🧪 Testing Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ollama is running and accessible
) else (
    echo ❌ Ollama is not responding. Please check if it's running.
)

REM Test a simple model
echo 🧪 Testing AI model...
ollama run llama3.2 "Hello, how are you?" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ AI models are working correctly
) else (
    echo ❌ AI models test failed. Please check Ollama installation.
)

echo.
echo 🎉 AI Services setup complete!
echo.
echo Next steps:
echo 1. Edit your .env file with the required API keys
echo 2. Start the development server: npm run dev
echo 3. Test AI features in the application
echo.
echo To stop Ollama service, close the terminal or run: taskkill /f /im ollama.exe
echo To start Ollama manually: ollama serve
pause
