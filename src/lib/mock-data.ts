
import type { ChartConfig } from '@/components/ui/chart';

export const marketOverviewData = [
  { name: 'Market Cap', value: '$2.3T', change: '+1.2%', up: true },
  { name: '24h Volume', value: '$85.6B', change: '-5.4%', up: false },
  { name: 'BTC Dominance', value: '51.7%', change: '+0.3%', up: true },
  { name: 'Gas Fee (ETH)', value: '18 Gwei', change: '+2.1%', up: true },
];

export const coinPerformanceData = [
  { date: '2024-07-01', BTC: 61000, ETH: 3400, SOL: 135 },
  { date: '2024-07-02', BTC: 62500, ETH: 3450, SOL: 140 },
  { date: '2024-07-03', BTC: 61800, ETH: 3380, SOL: 138 },
  { date: '2024-07-04', BTC: 63200, ETH: 3500, SOL: 145 },
  { date: '2024-07-05', BTC: 64000, ETH: 3550, SOL: 150 },
  { date: '2024-07-06', BTC: 63500, ETH: 3520, SOL: 148 },
  { date: '2024-07-07', BTC: 65100, ETH: 3600, SOL: 155 },
];

export const marketDominanceData = [
  { name: 'Bitcoin', value: 51.7, fill: 'var(--color-btc)' },
  { name: 'Ethereum', value: 18.2, fill: 'var(--color-eth)' },
  { name: 'Tether', value: 6.5, fill: 'var(--color-usdt)' },
  { name: 'Solana', value: 4.1, fill: 'var(--color-sol)' },
  { name: 'Others', value: 19.5, fill: 'var(--color-others)' },
];

export const marketDominanceConfig = {
  value: { label: 'Dominance' },
  btc: { label: 'Bitcoin', color: 'hsl(var(--chart-1))' },
  eth: { label: 'Ethereum', color: 'hsl(var(--chart-2))' },
  usdt: { label: 'Tether', color: 'hsl(var(--chart-3))' },
  sol: { label: 'Solana', color: 'hsl(var(--chart-4))' },
  others: { label: 'Others', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

export const portfolioAllocationData = [
  { name: 'Bitcoin', value: 60, fill: 'var(--color-Bitcoin)' },
  { name: 'Ethereum', value: 25, fill: 'var(--color-Ethereum)' },
  { name: 'Solana', value: 10, fill: 'var(--color-Solana)' },
  { name: 'USDT', value: 5, fill: 'var(--color-USDT)' },
];

export const portfolioAllocationConfig = {
  value: { label: 'Value' },
  Bitcoin: { label: 'Bitcoin', color: 'hsl(var(--chart-1))' },
  Ethereum: { label: 'Ethereum', color: 'hsl(var(--chart-2))' },
  Solana: { label: 'Solana', color: 'hsl(var(--chart-4))' },
  USDT: { label: 'USDT', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;


export const earningsData = [
    { date: "Jul 1", earnings: 25.50 },
    { date: "Jul 2", earnings: 28.75 },
    { date: "Jul 3", earnings: 32.10 },
    { date: "Jul 4", earnings: 29.50 },
    { date: "Jul 5", earnings: 35.00 },
    { date: "Jul 6", earnings: 38.25 },
    { date: "Jul 7", earnings: 41.60 },
]

export const holdings = [
  { coin: "Bitcoin", symbol: 'BTC', quantity: 0.5, value: 32050, pnl: 2500, pnl_perc: 8.4 },
  { coin: "Ethereum", symbol: 'ETH', quantity: 10, value: 35500, pnl: -1200, pnl_perc: -3.2 },
  { coin: "Solana", symbol: 'SOL', quantity: 100, value: 15000, pnl: 5000, pnl_perc: 50 },
];

export const history = [
    { type: "Mined", date: "2024-07-07 10:00", coin: "BTC", amount: "+0.001", value: 65.10 },
    { type: "Deposit", date: "2024-07-06 15:30", coin: "USD", amount: "+1000", value: 1000.00 },
    { type: "Withdrawal", date: "2024-07-05 09:15", coin: "ETH", amount: "-1.0", value: -3550.00 },
    { type: "Mined", date: "2024-07-04 18:45", coin: "SOL", amount: "+2.5", value: 362.50 },
];

export const pricingPlans = [
    { name: "Basic", price: "2.99", duration: "25 mins", features: ["Basic Hashrate", "1 Coin Choice", "Email Support"], recommended: false, buttonLabel: "Get Started"},
    { name: "Gold", price: "5.99", duration: "60 mins", features: ["Advanced Hashrate", "5 Coin Choices", "Priority Support", "AI Recommendations"], recommended: true, buttonLabel: "Go for Gold"},
    { name: "Premium", price: "8.99", duration: "90 mins", features: ["Pro Hashrate", "All Coin Choices", "24/7 Dedicated Support", "Advanced Analytics"], recommended: false, buttonLabel: "Become a Pro"},
];

export const seasonLeaderboard = [
    { rank: 1, user: "CypherMiner", mined: 1250.50, avatar: 'https://picsum.photos/40/40?random=1' },
    { rank: 2, user: "BlockMaster", mined: 1180.75, avatar: 'https://picsum.photos/40/40?random=2' },
    { rank: 3, user: "SatoshiJr", mined: 1125.00, avatar: 'https://picsum.photos/40/40?random=3' },
    { rank: 4, user: "You", mined: 980.25, avatar: 'https://picsum.photos/100' },
    { rank: 5, user: "HashQueen", mined: 950.80, avatar: 'https://picsum.photos/40/40?random=4' },
];
