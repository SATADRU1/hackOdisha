# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HackOdisha is a **FocusStake platform** - a blockchain-based productivity platform that combines focus sessions with economic incentives, AI-powered analytics, and NFT achievements. Users stake cryptocurrency to start focus sessions and earn rewards for successful completion.

## Architecture

### Multi-Service Architecture
The project uses a microservices architecture with four main components:

1. **Frontend** (Next.js 15) - React-based UI with App Router
2. **GoFR Backend** (Go) - Focus session management and user authentication
3. **Studio Service** (Node.js/Fastify) - Analytics, AI insights, and chart generation
4. **BlockDAG Node** (Go) - Custom blockchain node with DAG consensus

### Service Communication
- Frontend acts as a bridge via Next.js API routes in `src/app/api/`
- API routes proxy to backend services using Next.js rewrites
- Real-time updates via WebSocket connections
- Cross-service communication through REST APIs

### Key Directories
```
src/
├── app/(app)/           # Main application pages (dashboard, focus, portfolio, analytics)
├── app/api/            # Next.js API routes (proxy to services)
├── components/         # React components organized by feature
├── hooks/              # Custom hooks (use-gofr, use-studio, use-verbwire)
├── lib/                # Utility libraries and service wrappers
└── ai/                 # Genkit AI flows and configuration

backend/                # GoFR backend (Go)
├── internal/           # Business logic (focus, auth, portfolio)
└── cmd/               # Application entry points

services/
├── blockdag-node/     # Custom blockchain implementation
└── studio/           # Analytics and AI service
```

## Common Development Commands

### Frontend Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run typecheck

# Start Genkit AI development server
npm run genkit:start
```

### Backend Services

#### GoFR Backend (Go)
```bash
cd backend
go mod download
go run cmd/gofr/main.go           # Start on port 8081
```

#### Studio Service (Node.js)
```bash
cd services/studio
npm install
npm run dev                       # Start on port 3001
```

#### BlockDAG Node (Go)
```bash
cd services/blockdag-node
go mod download
go run cmd/blockdag-node/main.go  # Start on port 8080 (RPC), 4001 (P2P)
```

### Docker Development
```bash
# Start all services with Docker Compose
cd deploy
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose build [service-name]
```

### Database Operations
```bash
# For Studio service (Prisma)
cd services/studio
npm run prisma:migrate
npm run prisma:generate
```

## Testing Commands

### Single Test Execution
```bash
# Run specific test file
npm test -- --testNamePattern="FocusTimer"

# Test specific API endpoint
curl -X POST http://localhost:3000/api/studio/ai \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze", "symbol": "BTC"}'
```

### AI Service Testing
```bash
# Test Ollama connection
curl http://localhost:11434/api/tags

# Test specific model
ollama run llama3.2 "Analyze Bitcoin market trends"
```

## AI Integration

### Setup Requirements
The project integrates multiple AI services:
- **Gemini API** for market analysis and trading signals
- **Ollama** for mining recommendations and portfolio analysis
- **Genkit** as the AI orchestration framework

### Required Environment Variables
```bash
GOOGLE_AI_API_KEY=your_gemini_key
OLLAMA_SERVER_URL=http://127.0.0.1:11434
```

### AI Models Used
- **llama3.2** - General analysis and recommendations
- **mistral** - Price predictions and financial analysis
- **codellama** - Technical indicators and code analysis

## Service Endpoints

### GoFR Backend (Port 8081)
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/focus/status/:userId` - Current focus session status
- `POST /api/v1/focus/start` - Start new focus session
- `POST /api/v1/focus/complete` - Complete focus session
- `GET /api/v1/portfolio/:userId` - Portfolio data

### Studio Service (Port 3001)  
- `POST /api/v1/ai/insights` - AI-powered market insights
- `GET /api/v1/charts/tps` - TPS chart data
- `GET /api/v1/blockdag/status` - BlockDAG network status
- `WebSocket /ws` - Real-time updates

### BlockDAG Node (Port 8080)
- `GET /api/v1/status` - Node health and status
- `GET /api/v1/peers` - Connected P2P peers
- `POST /api/v1/transactions` - Submit transaction
- `WebSocket /ws` - Network events

## Key Features Implementation

### Focus Sessions (FocusStake Protocol)
- Users stake cryptocurrency to start focus sessions
- Pomodoro-style timer with distraction detection
- Rewards distributed based on session completion
- Achievement system with NFT badges via Verbwire

### Multi-Network Support
- Alpha Network (testing)
- Primordial Network (staging)  
- Community Network (production)

### Integration Points
- **Verbwire** - NFT minting and wallet operations
- **Firebase** - User authentication and data storage
- **PostgreSQL** - Primary database for all services
- **Redis** - Caching and session management

## Environment Configuration

### Required Variables
```bash
# Database
POSTGRES_PASSWORD=your_db_password
DATABASE_URL=postgresql://user:pass@host:5432/db

# AI Services  
GOOGLE_AI_API_KEY=your_gemini_key
OLLAMA_SERVER_URL=http://127.0.0.1:11434

# External APIs
VERBWIRE_API_KEY=your_verbwire_key
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your_jwt_secret
```

## Development Patterns

### Component Organization
Components are organized by service/feature:
- `components/focus/` - Focus session components
- `components/verbwire/` - NFT and wallet components  
- `components/studio/` - Analytics and AI components
- `components/ui/` - Reusable UI components (shadcn/ui)

### Custom Hooks Pattern
Each service has dedicated hooks:
- `use-gofr.ts` - Focus session and auth operations
- `use-studio.ts` - Analytics and AI functions
- `use-verbwire.ts` - NFT and wallet operations

### API Route Proxying
Next.js API routes act as proxies to backend services, configured in `next.config.ts`:
- `/api/gofr/*` → GoFR backend
- `/api/studio/*` → Studio service  
- `/api/blockdag/*` → BlockDAG node

## Deployment

### Health Check Endpoints
All services expose `/health` endpoints for monitoring:
- Frontend: `GET /health`
- GoFR: `GET /health` 
- Studio: `GET /health`
- BlockDAG: `GET /health`

### Production Build
```bash
# Build all services
docker-compose -f deploy/docker-compose.yml build

# Deploy with health checks
docker-compose -f deploy/docker-compose.yml up -d
```

## Important Notes

- TypeScript build errors are currently ignored (`ignoreBuildErrors: true`)
- ESLint errors are ignored during builds for rapid development
- The project uses Turbopack for faster development builds
- All services use PostgreSQL with separate schemas for isolation
- WebSocket connections are used for real-time features across all services
