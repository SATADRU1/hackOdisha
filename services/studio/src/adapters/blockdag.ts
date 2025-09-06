const networks = {
  alpha: {
    rpcUrl: "rpc-stage.devdomian123.com",
    chainId: 24171,
    explorerUrl: "https://bdagscan.com/",
    currencySymbol: "BDAG",
  },
  primordial: {
    rpcUrl: "https://rpc.primordial.bdagscan.com",
    chainId: 1043,
    explorerUrl: "https://primordial.bdagscan.com/",
    faucetUrl: "https://primordial.bdagscan.com/faucet",
    currencySymbol: "BDAG",
  },
  community: {
    rpcUrl: "https://rpc-testnet.bdagscan.com",
    chainId: 24171,
    currencySymbol: "BDAG",
  },
};

export function getNetworkConfig(network: keyof typeof networks) {
  return networks[network];
}