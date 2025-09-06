# HackOdisha - FocusStake Platform

A comprehensive blockchain-based focus and productivity platform with integrated mining, analytics, and AI insights.

## 🏗️ Architecture Overview

```
hackOdisha/
├── src/                          # Next.js Frontend
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   └── lib/                      # Utility libraries
│
├── backend/                      # GoFR Backend (Go)
│   ├── cmd/gofr/                 # Main application entry
│   ├── internal/                 # Private application code
│   │   ├── auth/                 # Authentication handlers
│   │   ├── focus/                # Focus session management
│   │   ├── mining/               # Mining operations
│   │   ├── portfolio/            # Portfolio management
│   │   └── models/               # Data models
│   └── pkg/                      # Public packages
│
├── services/                     # External services
│   ├── blockdag-node/            # BlockDAG network node
│   │   ├── cmd/blockdag-node/    # Node entry point
│   │   ├── internal/             # Core node components
│   │   │   ├── dag/              # DAG structure management
│   │   │   ├── consensus/        # Consensus algorithms
│   │   │   ├── mempool/          # Transaction pool
│   │   │   ├── miner/            # Proof of Work mining
│   │   │   ├── p2p/              # Peer-to-peer networking
│   │   │   └── rpc/              # JSON-RPC server
│   │   └── storage/              # Data persistence
│   │
│   └── studio/                   # Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB (Analytics & AI)
│       ├── src/                  # TypeScript source
│       │   ├── adapters/         # External service adapters
│       │   ├── api/              # REST API endpoints
│       │   ├── db/               # Database schemas
│       │   ├── jobs/             # Background jobs
│       │   └── lib/              # Utility libraries
│       └── Dockerfile            # Container configuration
│
├── contracts/                    # Shared API/DTO schemas
│   ├── http/                     # HTTP API schemas
│   ├── rpc/                      # RPC method definitions
│   └── smart-contracts/          # Solidity contracts
│
├── deploy/                       # Infrastructure as Code
│   ├── docker-compose.yml        # Multi-service orchestration
│   ├── nginx.conf                # Reverse proxy config
│   ├── env.example               # Environment variables
│   └── k8s/                      # Kubernetes manifests
│
└── docs/                         # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Go 1.23+ (for backend development)
- PostgreSQL 15+ (for production)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackOdisha
   ```

2. **Set up environment variables**
   ```bash
   cp deploy/env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services with Docker Compose**
   ```bash
   cd deploy
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - GoFR Backend: http://localhost:8081
   - Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB: http://localhost:3001
   - BlockDAG Node: http://localhost:8080

### Local Development

#### Frontend (Next.js)
```bash
npm install
npm run dev
```

#### GoFR Backend (Go)
```bash
cd backend
go mod download
go run cmd/gofr/main.go
```

#### Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB (Node.js)
```bash
cd services/studio
npm install
npm run dev
```

#### BlockDAG Node (Go)
```bash
cd services/blockdag-node
go mod download
go run cmd/blockdag-node/main.go
```

## 🔧 Services

### Frontend (Next.js)
- **Port**: 3000
- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS + shadcn/ui
- **Features**: Dashboard, Focus Timer, Portfolio, Mining, Analytics

### GoFR Backend
- **Port**: 8081
- **Framework**: Gin (Go)
- **Database**: PostgreSQL
- **Features**: User management, Focus sessions, Portfolio tracking

### Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB
- **Port**: 3001
- **Framework**: Fastify (Node.js)
- **Database**: PostgreSQL + Redis
- **Features**: Analytics, AI insights, Chart generation, Real-time data

### BlockDAG Node
- **Ports**: 8080 (RPC), 4001 (P2P)
- **Framework**: Go
- **Storage**: BadgerDB
- **Features**: BlockDAG consensus, Mining, P2P networking

## 📊 Features

### Core Features
- **Focus Sessions**: Pomodoro-style focus tracking with rewards
- **Mining Integration**: Earn tokens through focus and mining
- **Portfolio Management**: Track investments and earnings
- **AI Insights**: Get personalized recommendations and analytics

### Advanced Features
- **BlockDAG Network**: Custom blockchain with DAG structure
- **Real-time Analytics**: Live network and user statistics
- **Smart Contracts**: FocusStake token and reward system
- **Multi-network Support**: Alpha, Primordial, and Community networks

## 🛠️ Development

### API Documentation

#### GoFR Backend API
- **Base URL**: `http://localhost:8081/api/v1`
- **Authentication**: JWT tokens
- **Endpoints**:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `GET /focus/status/:userId` - Get focus status
  - `POST /focus/start` - Start focus session
  - `GET /portfolio/:userId` - Get portfolio data

#### Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB API
- **Base URL**: `http://localhost:3001/api/v1`
- **Endpoints**:
  - `GET /ai/insights` - Get AI insights
  - `GET /charts/tps` - Get TPS chart data
  - `GET /blockdag/status` - Get BlockDAG status
  - `WebSocket /ws` - Real-time updates

#### BlockDAG Node API
- **Base URL**: `http://localhost:8080/api/v1`
- **RPC**: `http://localhost:8080/rpc`
- **WebSocket**: `ws://localhost:8080/ws`
- **Endpoints**:
  - `GET /status` - Node status
  - `GET /peers` - Connected peers
  - `GET /vertices` - DAG vertices
  - `POST /transactions` - Submit transaction

### Database Schema

The application uses PostgreSQL with the following main schemas:
- **gofr**: User data, sessions, portfolios
- **studio**: Analytics, metrics, AI insights
- **blockdag**: Blocks, transactions, network data

### Smart Contracts

Located in `contracts/smart-contracts/`:
- **FocusStake.sol**: Main token contract
- **RewardSystem.sol**: Focus session rewards
- **MiningPool.sol**: Mining reward distribution

## 🚀 Deployment

### Production Deployment

1. **Set up production environment**
   ```bash
   cp deploy/env.example .env.production
   # Configure production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f deploy/docker-compose.yml up -d
   ```

3. **Set up SSL certificates** (optional)
   ```bash
   # Place certificates in deploy/ssl/
   # Update nginx.conf for HTTPS
   ```

### Kubernetes Deployment

```bash
kubectl apply -f deploy/k8s/
```

## 📈 Monitoring

### Health Checks
- Frontend: `GET /health`
- GoFR Backend: `GET /health`
- Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB: `GET /health`
- BlockDAG Node: `GET /health`

### Metrics
- Network metrics via Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB
- Application metrics via Prometheus (planned)
- Log aggregation via ELK stack (planned)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style
- **Go**: Use `gofmt` and `golint`
- **TypeScript**: Use ESLint and Prettier
- **Commit messages**: Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] Multi-chain support
- [ ] Social features
- [ ] NFT marketplace integration
- [ ] DeFi protocols integration