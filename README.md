# FocusStake - Gamified Web3 Focus Protocol

Welcome to **FocusStake**, a revolutionary productivity app that uses economic incentives to boost personal focus and fight procrastination. Built with Next.js and GoFr backend, this application combines the Pomodoro technique with blockchain staking to create a powerful psychological motivator for productivity.

## 🎯 Concept

FocusStake transforms focus into a game with real economic stakes. Users stake cryptocurrency to start focus sessions, and if they successfully complete the session (verified by avoiding distracting websites), they get their stake back plus rewards. If they fail, their stake is forfeited to the reward pool for others to win.

## 🚀 How It Uses Sponsor Technologies

### BlockDAG
The core of the app. Smart contracts on BlockDAG manage:
- Staking mechanism for focus sessions
- Reward distribution from the collective pool
- Verification logic for session completion
- Automatic stake forfeiture for failed sessions

### Verbwire
Makes the experience engaging through:
- Non-transferable NFT badges for focus streaks (e.g., "10-Hour Focus Master," "7-Day Streak")
- Easy minting of achievement NFTs
- Integration with wallet management for staking

### Akash Network
Hosts personalized AI that:
- Analyzes focus patterns and productivity trends
- Suggests optimal times of day for focus sessions
- Recommends session lengths based on user behavior
- Provides personalized productivity insights

### GoFr
The backend service that:
- Manages user accounts and authentication
- Communicates with BlockDAG smart contracts
- Tracks focus session data and statistics
- Handles reward calculations and distributions

## Getting Started

To run the application locally, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Folder Structure

This project uses the Next.js App Router. Here is an overview of the directory structure:

```
.
├── src/
│   ├── app/
│   │   ├── (app)/                # Group for authenticated app pages
│   │   │   ├── analytics/
│   │   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Main layout for the dashboard
│   │   │   ├── mining/
│   │   │   ├── portfolio/
│   │   │   ├── pricing/
│   │   │   └── settings/
│   │   ├── auth/                 # Authentication page (Login/Sign Up)
│   │   ├── globals.css           # Global styles and Tailwind directives
│   │   ├── layout.tsx            # Root layout of the entire application
│   │   └── page.tsx              # Root page, redirects to /auth
│   │
│   ├── components/
│   │   ├── analytics/            # Components specific to the Analytics page
│   │   ├── auth/                 # Components for the Auth page
│   │   ├── dashboard/            # Components for the Dashboard page
│   │   ├── layout/               # Reusable layout components (Header, Sidebar)
│   │   ├── mining/               # Components for the Mining page
│   │   ├── portfolio/            # Components for the Portfolio page
│   │   ├── pricing/              # Components for the Pricing page
│   │   ├── ui/                   # ShadCN UI components (Button, Card, etc.)
│   │   └── theme-provider.tsx    # Provider for Next-themes
│   │
│   ├── hooks/
│   │   └── use-toast.ts          # Hook for showing toast notifications
│   │
│   ├── lib/
│   │   ├── mock-data.ts          # Mock data for charts and tables
│   │   └── utils.ts              # Utility functions (e.g., `cn` for class names)
│   │
│   └── ai/
│       ├── flows/                # Genkit AI flows
│       └── genkit.ts             # Genkit configuration
│
├── public/                     # Static assets (images, fonts, etc.)
│
├── .env                        # Environment variables (e.g., API keys)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

### Key Files & Directories

-   **`src/app`**: Contains all routes and UI for the application, following the App Router convention.
-   **`src/app/(app)`**: This is a route group for all pages that share the main application layout (sidebar, header).
-   **`src/components`**: All React components are organized here, categorized by the page or feature they belong to.
-   **`src/components/ui`**: Contains the reusable UI components from [ShadCN/UI](https://ui.shadcn.com/).
-   **`src/lib`**: Helper functions, utility code, and mock data.
-   **`src/ai`**: Home for all Generative AI functionality, powered by [Genkit](https://firebase.google.com/docs/genkit).
-   **`src/app/globals.css`**: Defines the application's theme (colors, fonts) using CSS variables for both light and dark modes.

## Tech Stack

### Frontend
-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **UI**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)

### Backend
-   **Framework**: [Go](https://golang.org/) with [Gin](https://gin-gonic.com/)
-   **Database**: [GORM](https://gorm.io/) with SQLite/PostgreSQL
-   **Authentication**: JWT tokens
-   **API**: RESTful endpoints

### Blockchain & Web3
-   **Blockchain**: [BlockDAG](https://blockdag.network/) for smart contracts
-   **NFT Platform**: [Verbwire](https://verbwire.com/) for achievement badges
-   **Wallet Integration**: Web3 wallet connectivity

### AI & Analytics
-   **AI Platform**: [Akash Network](https://akash.network/) for distributed AI
-   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit)
-   **Analytics**: Custom focus pattern analysis
