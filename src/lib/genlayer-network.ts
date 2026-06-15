export const GENLAYER_NETWORKS = {
  localnet: {
    name: 'GenLayer Localnet',
    chainId: 61999,
    rpcUrl: 'http://127.0.0.1:4000/api',
    currencySymbol: 'GEN',
    blockExplorerUrl: '',
  },
  studionet: {
    name: 'GenLayer Studionet',
    chainId: 61999,
    rpcUrl: 'https://studio.genlayer.com/api',
    currencySymbol: 'GEN',
    blockExplorerUrl: '',
  },
} as const;

export type NetworkName = keyof typeof GENLAYER_NETWORKS;

export const DEFAULT_NETWORK: NetworkName = 'studionet';

export const GENLAYER_CHAIN_PARAMS = {
  chainId: `0x${(GENLAYER_NETWORKS.studionet.chainId).toString(16)}`,
  chainName: GENLAYER_NETWORKS.studionet.name,
  nativeCurrency: {
    name: 'GEN',
    symbol: GENLAYER_NETWORKS.studionet.currencySymbol,
    decimals: 18,
  },
  rpcUrls: [GENLAYER_NETWORKS.studionet.rpcUrl],
  blockExplorerUrls: GENLAYER_NETWORKS.studionet.blockExplorerUrl
    ? [GENLAYER_NETWORKS.studionet.blockExplorerUrl]
    : [],
};
