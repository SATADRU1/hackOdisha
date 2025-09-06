# MineR - Crypto Mining Dashboard

Welcome to **MineR**, a simulated cryptocurrency mining dashboard built with Next.js and Firebase Studio. This application provides a modern, feature-rich interface for users to simulate crypto mining, manage a portfolio, and get AI-powered recommendations.

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

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **UI**: [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
