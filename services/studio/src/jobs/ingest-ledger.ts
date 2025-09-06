import { getNetworkConfig } from "../adapters/blockdag";

async function fetchFocusStakeData() {
  const config = getNetworkConfig("alpha");
  // Fetch data from Focus Stake contract using RPC
  // ...code to interact with Focus Stake...
}

async function fetchHackOdishaData() {
  const config = getNetworkConfig("primordial");
  // Fetch data from HackOdisha using RPC
  // ...code to interact with HackOdisha...
}

export async function ingestLedger() {
  await fetchFocusStakeData();
  await fetchHackOdishaData();
  // ...existing ETL logic...
}