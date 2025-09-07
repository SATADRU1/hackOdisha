# Environment Setup Guide

This guide explains how to configure environment variables for the HackOdisha crypto project.

## Quick Start

1. **Copy the development template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your API keys:**
   - **Google AI API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Verbwire API Key**: Visit [Verbwire Dashboard](https://dashboard.verbwire.com/)

3. **Fill in your API keys in `.env.local`:**
   ```env
   VERBWIRE_API_KEY=your_verbwire_key_here
   GOOGLE_AI_API_KEY=your_google_ai_key_here
   NEXT_PUBLIC_GEMINI_API_KEY=your_google_ai_key_here
   ```

## Environment Files Explained

### `.env.local` (Development)
- Used for local development
- Contains your personal API keys
- **Never commit this file to git**

### `deploy/env.example` (Production)
- Template for production deployment
- Used with Docker Compose
- Copy to `.env` for production

### `services/studio/env.example` (Studio Service)
- Template for the analytics studio service
- Copy to `services/studio/.env`

## Required API Keys

| Key | Purpose | Cost | Where to Get |
|-----|---------|------|--------------|
| `GOOGLE_AI_API_KEY` | AI analysis, market predictions | Free tier available | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `VERBWIRE_API_KEY` | Blockchain operations, NFT minting | Paid service | [Verbwire Dashboard](https://dashboard.verbwire.com/) |

## Optional API Keys

| Key | Purpose | When Needed |
|-----|---------|-------------|
| `OPENAI_API_KEY` | Advanced analytics | Only if you want enhanced AI features |

## Environment Variables by Service

### Frontend (Next.js)
```env
NEXT_PUBLIC_GEMINI_API_KEY=  # For client-side AI calls
VERBWIRE_API_KEY=            # For blockchain operations
NEXT_PUBLIC_API_URL=         # Backend API URL
NEXT_PUBLIC_STUDIO_URL=      # Studio service URL
NEXT_PUBLIC_BLOCKDAG_URL=    # BlockDAG node URL
```

### Studio Service (Analytics)
```env
DATABASE_URL=                # PostgreSQL connection
REDIS_URL=                   # Redis cache
BLOCKDAG_RPC=               # BlockDAG RPC endpoint
OPENAI_API_KEY=             # Optional: for AI analytics
```

### Backend (GoFR)
```env
DATABASE_URL=                # PostgreSQL connection
JWT_SECRET=                  # Authentication secret
REDIS_URL=                   # Redis cache
```

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit API keys to git**
2. `NEXT_PUBLIC_*` variables are exposed to the browser
3. Use server-side API keys when possible
4. Regenerate keys if accidentally exposed

## Common Issues

### Issue: "API key not found"
**Solution:** Make sure you've copied `.env.local.example` to `.env.local` and filled in your keys.

### Issue: "CORS errors"
**Solution:** Check that your service URLs are correct in the environment variables.

### Issue: "Database connection failed"
**Solution:** Make sure Docker containers are running or update the DATABASE_URL.

## Minimal Setup (Just to Test)

If you just want to test the app with minimal functionality:

```env
# .env.local
GOOGLE_AI_API_KEY=your_google_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_google_key_here
```

This will enable:
- AI-powered analysis
- Basic app functionality
- Most UI features

You can add other API keys later as needed.
