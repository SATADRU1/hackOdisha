# Project Architecture

This document outlines the reorganized project structure that separates concerns by service (Verbwire, Gofr, Studio) rather than by feature.

## Directory Structure

```
├── src/
│   ├── app/                          # Next.js App Router (frontend pages)
│   │   ├── (app)/
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── mining/
│   │   │   ├── portfolio/
│   │   │   ├── pricing/
│   │   │   ├── settings/
│   │   │   └── verbwire/             # Verbwire-specific frontend pages
│   │   │       ├── wallet/
│   │   │       │   └── page.tsx
│   │   │       ├── nft/
│   │   │       │   └── page.tsx
│   │   │       └── payments/
│   │   │           └── page.tsx
│   │   │
│   │   ├── api/                      # Next.js API routes (acts as bridge)
│   │   │   ├── verbwire/             # Verbwire API handlers
│   │   │   │   ├── wallet.ts
│   │   │   │   ├── nft.ts
│   │   │   │   └── payments.ts
│   │   │   ├── gofr/                 # Backend endpoints (proxy to Gofr)
│   │   │   │   ├── auth.ts
│   │   │   │   └── mining.ts
│   │   │   └── studio/               # Blackdag / Threeway Studio APIs
│   │   │       ├── charts.ts
│   │   │       └── ai.ts
│   │   │
│   │   ├── auth/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── layout/
│   │   ├── mining/
│   │   ├── portfolio/
│   │   ├── pricing/
│   │   ├── ui/
│   │   ├── verbwire/                 # Verbwire UI Components
│   │   │   ├── WalletCard.tsx
│   │   │   ├── TransactionList.tsx
│   │   │   ├── NFTCard.tsx
│   │   │   └── PaymentForm.tsx
│   │   ├── gofr/                     # Gofr UI Components
│   │   │   ├── GofrStatus.tsx
│   │   │   └── MiningControl.tsx
│   │   └── studio/                   # Blackdag / Threeway Studio components
│   │       ├── ChartRenderer.tsx
│   │       └── AIInsights.tsx
│   │
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   ├── use-verbwire.ts           # Custom hook for Verbwire
│   │   ├── use-gofr.ts               # Hook for Gofr backend calls
│   │   └── use-studio.ts             # Hook for Blackdag/Threeway Studio
│   │
│   ├── lib/
│   │   ├── mock-data.ts
│   │   ├── utils.ts
│   │   ├── verbwire.ts               # Axios instance + Verbwire wrappers
│   │   ├── gofr.ts                   # Axios instance + Gofr backend wrappers
│   │   └── studio.ts                 # Axios instance + Studio wrappers
│   │
│   └── ai/
│       ├── flows/
│       └── genkit.ts
│
├── backend/                          # Separate backend folder for Gofr
│   ├── cmd/                          # Gofr entry points
│   ├── internal/                     # Business logic
│   │   ├── mining/
│   │   ├── auth/
│   │   └── portfolio/
│   ├── pkg/                          # Shared packages
│   ├── go.mod
│   ├── go.sum
│   └── main.go
│
├── public/
│
├── .env.example                      # Environment variables template
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Service Organization

### Verbwire Integration
- **Frontend Pages**: `/app/(app)/verbwire/` - Wallet, NFT, and Payment pages
- **API Routes**: `/app/api/verbwire/` - API handlers for Verbwire services
- **Components**: `/components/verbwire/` - Reusable UI components
- **Hooks**: `/hooks/use-verbwire.ts` - Custom React hooks
- **Lib**: `/lib/verbwire.ts` - Axios configuration and utility functions

### Gofr Backend
- **Frontend Integration**: API routes in `/app/api/gofr/` proxy to Go backend
- **Components**: `/components/gofr/` - Mining and status components
- **Hooks**: `/hooks/use-gofr.ts` - Authentication and mining hooks
- **Lib**: `/lib/gofr.ts` - Backend API configuration
- **Backend**: `/backend/` - Complete Go backend with Gin framework

### Studio (Blackdag/Threeway)
- **Frontend Pages**: Charts and AI insights pages
- **API Routes**: `/app/api/studio/` - Chart and AI analysis endpoints
- **Components**: `/components/studio/` - Chart and AI components
- **Hooks**: `/hooks/use-studio.ts` - Chart and AI analysis hooks
- **Lib**: `/lib/studio.ts` - Studio API configuration

## Key Features

### 1. Service-Specific Components
Each service has its own component library:
- **Verbwire**: Wallet management, NFT marketplace, payment processing
- **Gofr**: Mining status, configuration, earnings tracking
- **Studio**: Chart rendering, AI analysis, market insights

### 2. Centralized API Management
- Next.js API routes act as a bridge between frontend and external services
- Consistent error handling and response formatting
- Authentication and authorization middleware

### 3. Custom Hooks
- Service-specific hooks for data fetching and state management
- Consistent API across different services
- Built-in error handling and loading states

### 4. Backend Architecture
- Go-based backend for Gofr services
- RESTful API design
- JWT authentication
- Modular structure with separate packages

## Navigation Structure

The main sidebar has been updated to reflect the new organization:
- **Core Features**: Dashboard, Mining, Portfolio, Analytics, Pricing
- **Verbwire Section**: Wallet, NFTs, Payments
- **Studio Section**: Charts, AI Insights

## Environment Configuration

Create a `.env` file based on `.env.example`:
```bash
# Verbwire API Configuration
NEXT_PUBLIC_VERBWIRE_API_URL=https://api.verbwire.com/v1
VERBWIRE_API_KEY=your_verbwire_api_key_here

# Gofr Backend Configuration
NEXT_PUBLIC_GOFR_API_URL=http://localhost:8080/api/v1
GOFR_API_KEY=your_gofr_api_key_here

# Blackdag / Threeway Studio API Configuration
NEXT_PUBLIC_STUDIO_API_URL=https://api.blackdag.studio/v1
STUDIO_API_KEY=your_studio_api_key_here
```

## Development

### Frontend
```bash
npm run dev
```

### Backend (Gofr)
```bash
cd backend
go mod tidy
go run main.go
```

## Benefits of This Architecture

1. **Clear Separation of Concerns**: Each service has its own dedicated space
2. **Scalability**: Easy to add new services or modify existing ones
3. **Maintainability**: Related code is grouped together
4. **Team Collaboration**: Different teams can work on different services
5. **Testing**: Service-specific testing is easier to implement
6. **Deployment**: Services can be deployed independently

This architecture provides a solid foundation for a multi-service crypto mining and trading platform with clear boundaries between different functionalities.
