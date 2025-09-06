# Free NFT Maker | Design & Mint - Mediamodifier https://share.google/3Rij5fdeEPaN7b9rB - Analytics & AI Service

A comprehensive analytics and AI service for the BlockDAG network, providing real-time insights, anomaly detection, and predictive analytics.

## 🚀 Features

### Core Analytics
- **Real-time Data Ingestion**: Live BlockDAG network data via WebSocket
- **KPI Computation**: TPS, latency, hashrate, orphan rate calculations
- **Network Health Monitoring**: Comprehensive network status tracking
- **Mining Analytics**: Miner performance and distribution analysis

### AI & Insights
- **Anomaly Detection**: Automatic detection of network anomalies
- **Predictive Analytics**: Trend analysis and future predictions
- **Smart Recommendations**: AI-powered optimization suggestions
- **Network Health Analysis**: Comprehensive health scoring

### APIs
- **REST API**: Full REST endpoints for all analytics data
- **WebSocket**: Real-time data streaming
- **Simple API**: Lightweight endpoints for basic operations
- **Enhanced API**: Advanced analytics and AI features

## 🏗️ Architecture

```
services/studio/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── adapters/
│   │   ├── blockdag.ts       # BlockDAG network adapter
│   │   └── verbwire.ts       # Verbwire integration
│   ├── api/
│   │   ├── ai.ts            # AI insights endpoints
│   │   ├── charts.ts        # Chart data endpoints
│   │   └── blockdag.ts      # BlockDAG data endpoints
│   ├── jobs/
│   │   ├── ingest-ledger.ts # Data ingestion jobs
│   │   └── compute-kpis.ts  # KPI computation jobs
│   ├── lib/
│   │   ├── ai.ts            # AI analysis functions
│   │   └── metrics.ts       # Metrics calculation utilities
│   └── db/
│       └── prisma/
│           └── schema.prisma # Database schema
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for caching)

### Local Development

1. **Install dependencies**
   ```bash
   cd services/studio
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Start the service**
   ```bash
   npm run dev
   ```

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   # From project root
   docker-compose -f deploy/docker-compose.yml up --build studio
   ```

2. **Or build individually**
   ```bash
   cd services/studio
   docker build -t nft-maker-studio .
   docker run -p 4002:4002 nft-maker-studio
   ```

## 📊 API Endpoints

### Simple API (Starter Code)
- `GET /charts/simple/kpis` - Get basic KPIs
- `GET /charts/simple/tps` - Get TPS data
- `GET /charts/simple/blocks/latest` - Get latest blocks
- `POST /ai/simple/analyze` - Analyze data with AI

### Enhanced API (Full Implementation)
- `GET /api/v1/charts/data` - Get chart data
- `GET /api/v1/charts/tps` - Get TPS metrics
- `GET /api/v1/charts/hashrate` - Get hashrate data
- `GET /api/v1/charts/miners` - Get miner statistics
- `GET /api/v1/ai/insights` - Get AI insights
- `POST /api/v1/ai/insights/generate` - Generate new insights
- `POST /api/v1/ai/anomalies/detect` - Detect anomalies
- `GET /api/v1/ai/recommendations/mining` - Get mining recommendations

### WebSocket
- `WS /ws` - Real-time data streaming

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studio

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Server
PORT=4002
HOST=0.0.0.0

# BlockDAG Network
BLOCKDAG_RPC=http://localhost:8080
BLOCKDAG_WS=ws://localhost:8080/ws

# AI Services
OPENAI_API_KEY=your-openai-api-key

# Verbwire (optional)
VERBWIRE_API_KEY=your-verbwire-api-key
VERBWIRE_BASE_URL=https://api.verbwire.com/v1
```

### Database Schema

The service uses PostgreSQL with Prisma ORM. Key models include:

- **Block**: BlockDAG blocks and transactions
- **NetworkMetrics**: Network performance metrics
- **MiningStats**: Miner performance data
- **AIInsight**: AI-generated insights and recommendations
- **ChartData**: Time-series chart data
- **Peer**: Network peer information

## 🔄 Data Flow

1. **Ingestion**: WebSocket connection to BlockDAG node
2. **Processing**: Real-time data processing and validation
3. **Storage**: PostgreSQL database with Prisma ORM
4. **Analysis**: AI-powered insights and anomaly detection
5. **API**: REST and WebSocket endpoints for data access

## 🤖 AI Features

### Anomaly Detection
- Automatic detection of network anomalies
- Configurable thresholds and timeframes
- Confidence scoring for detected anomalies

### Predictive Analytics
- Trend analysis using historical data
- Future value predictions
- Multiple time horizons (1h, 24h, 7d)

### Smart Recommendations
- Mining optimization suggestions
- Network performance improvements
- Resource allocation recommendations

## 📈 Monitoring

### Health Checks
- `GET /health` - Service health status
- Database connection monitoring
- BlockDAG node connectivity

### Metrics
- Real-time performance metrics
- Error rate monitoring
- Response time tracking

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=postgresql://user:pass@host:5432/studio
   export OPENAI_API_KEY=your-key
   ```

2. **Database Migration**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start Service**
   ```bash
   npm run build
   npm start
   ```

### Docker Production

```bash
docker build -t nft-maker-studio .
docker run -d \
  --name nft-maker-studio \
  -p 4002:4002 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/studio \
  -e OPENAI_API_KEY=your-key \
  nft-maker-studio
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **BlockDAG Connection Issues**
   - Check BLOCKDAG_RPC and BLOCKDAG_WS URLs
   - Ensure BlockDAG node is running
   - Verify network connectivity

3. **AI Features Not Working**
   - Check OPENAI_API_KEY is set
   - Verify API key has sufficient credits
   - Check network connectivity to OpenAI

### Logs

```bash
# View logs
docker logs nft-maker-studio

# Follow logs
docker logs -f nft-maker-studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the main README.md
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
