/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

let cachedClient: any = null;
let cachedFor: string | null = null;

function buildClient(address: string) {
  if (cachedClient && cachedFor === address) return cachedClient;

  const client = createClient({
    chain: studionet,
    account: address as `0x${string}`,
  });

  cachedClient = client;
  cachedFor = address;
  return client;
}

async function ensureConnected(address: string) {
  const client = buildClient(address);
  try {
    await (client as any).connect('studionet');
  } catch {
    // Rabby/others: ignore connect error, already on correct network
  }
  return client;
}

let readonlyClient: any = null;

function getReadonlyClient() {
  if (readonlyClient) return readonlyClient;
  readonlyClient = createClient({ chain: studionet });
  return readonlyClient;
}

async function writeAndWait(
  address: string,
  functionName: string,
  args: unknown[],
  value: bigint = 0n
) {
  const client = await ensureConnected(address);

  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName,
    args: args as never[],
    value,
  });

  // Wait up to 3 min for Studionet finalization
  const MAX_WAIT = 180_000;
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT) {
    try {
      const receipt = await client.waitForTransactionReceipt({ hash });
      if (receipt) return hash;
    } catch {
      // not ready
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return hash;
}

export async function createMarket(
  address: string,
  params: {
    title: string;
    description: string;
    resolutionSource: string;
    resolutionCriteria: string;
    endDate: number;
  }
) {
  return writeAndWait(address, 'create_market', [
    params.title,
    params.description,
    params.resolutionSource,
    params.resolutionCriteria,
    BigInt(params.endDate),
  ]);
}

export async function placeBet(
  address: string,
  marketId: number,
  prediction: 'yes' | 'no',
  amount: bigint
) {
  return writeAndWait(address, 'place_bet', [
    BigInt(marketId),
    prediction,
  ], amount);
}

export async function resolveMarket(address: string, marketId: number) {
  return writeAndWait(address, 'resolve_market', [
    BigInt(marketId),
  ]);
}

export async function claimWinnings(
  address: string,
  marketId: number,
  betId: number
) {
  return writeAndWait(address, 'claim_winnings', [
    BigInt(marketId),
    BigInt(betId),
  ]);
}

export async function updateResolutionSource(
  address: string,
  marketId: number,
  newSource: string
) {
  return writeAndWait(address, 'update_resolution_source', [
    BigInt(marketId),
    newSource,
  ]);
}

export async function getMarket(marketId: number) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_market',
      args: [BigInt(marketId)],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result); } catch { return result; }
    }
    return result;
  } catch (err) {
    console.error(`getMarket(${marketId}) failed:`, err);
    return null;
  }
}

export async function getBetsByMarket(marketId: number) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_bets_by_market',
      args: [BigInt(marketId)],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result) as Array<Record<string, unknown>>; } catch { return []; }
    }
    return (result || []) as Array<Record<string, unknown>>;
  } catch (err) {
    console.error(`getBetsByMarket(${marketId}) failed:`, err);
    return [];
  }
}

export async function getBet(betId: number) {
  const client = getReadonlyClient();
  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_bet',
    args: [BigInt(betId)],
  });
  return result;
}

export async function getOdds(marketId: number) {
  const client = getReadonlyClient();
  const result = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_odds',
    args: [BigInt(marketId)],
  });
  return result;
}

export async function getMarketCount() {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_market_count',
      args: [],
    });
    return Number(result);
  } catch (err) {
    console.error('getMarketCount failed:', err);
    return 0;
  }
}

export async function getBetsByOwner(owner: string) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_bets_by_owner',
      args: [owner],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result) as Array<Record<string, unknown>>; } catch { return []; }
    }
    return (result || []) as Array<Record<string, unknown>>;
  } catch (err) {
    console.error('getBetsByOwner failed:', err);
    return [];
  }
}

export async function getMarketsByStatus(status: string) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_markets_by_status',
      args: [status],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result) as Array<Record<string, unknown>>; } catch { return []; }
    }
    return (result || []) as Array<Record<string, unknown>>;
  } catch (err) {
    console.error('getMarketsByStatus failed:', err);
    return [];
  }
}

export async function getUserStats(user: string) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_user_stats',
      args: [user],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result); } catch { return null; }
    }
    return result;
  } catch (err) {
    console.error('getUserStats failed:', err);
    return null;
  }
}

export async function getCreatedMarketCount(user: string) {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_created_market_count',
      args: [user],
    });
    return Number(result);
  } catch (err) {
    console.error('getCreatedMarketCount failed:', err);
    return 0;
  }
}

export async function getPlatformStats() {
  try {
    const client = getReadonlyClient();
    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName: 'get_platform_stats',
      args: [],
    });
    if (typeof result === 'string') {
      try { return JSON.parse(result); } catch { return null; }
    }
    return result;
  } catch (err) {
    console.error('getPlatformStats failed:', err);
    return null;
  }
}

export async function waitForTransaction(txHash: string) {
  const client = getReadonlyClient();
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
  });
  return receipt;
}
