export function weiToGen(wei: number | bigint): number {
  return Number(wei) / 1e18;
}

export function formatGen(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  if (amount >= 1) return amount.toFixed(2);
  if (amount >= 0.001) return amount.toFixed(4);
  return amount.toFixed(6);
}
