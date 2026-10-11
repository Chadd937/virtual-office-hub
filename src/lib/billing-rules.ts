export type PlanId = 'starter' | 'growth' | 'scale';
export const PLANS: Record<PlanId, { name: string; price: number; projects: number }> = {
  starter: { name: 'Starter', price: 29.99, projects: 1 },
  growth: { name: 'Growth', price: 49.99, projects: 3 },
  scale: { name: 'Scale', price: 99.99, projects: 10 },
};
export const TRIAL_DAYS = 3;
export const PERIOD_DAYS = 30;

export type Sub = { status: string; current_period_end: string | null } | null | undefined;
export function hasAccess(sub: Sub, now = new Date()) {
  return Boolean(sub && (sub.status === 'trialing' || sub.status === 'active') && sub.current_period_end && new Date(sub.current_period_end) > now);
}
export function canOpenProject(plan: PlanId, openProjects: number) { return openProjects < PLANS[plan].projects; }
/** Token amount (in smallest units) required for a plan. */
export function requiredUnits(plan: PlanId, decimals: number) {
  return BigInt(Math.round(PLANS[plan].price * 100)) * 10n ** BigInt(decimals) / 100n;
}

export const WALLETS = {
  solana: 'Ew8mbrKwD6LGaSX28a6XGmXqeQSs2hykRibjXVhftTRC',
  evm: '0x6e57597d15e7069e60b2b98f136b1e109c23cbf2',
  tron: 'TY5CSu6UyMYvQNjBApfhxwSN4QHhW2n48u',
} as const;
export type Network = 'solana' | 'ethereum' | 'base' | 'polygon' | 'arbitrum' | 'bsc' | 'tron';
export const NETWORKS: Record<Network, { label: string; wallet: string }> = {
  solana: { label: 'Solana', wallet: WALLETS.solana },
  ethereum: { label: 'Ethereum', wallet: WALLETS.evm },
  base: { label: 'Base', wallet: WALLETS.evm },
  polygon: { label: 'Polygon', wallet: WALLETS.evm },
  arbitrum: { label: 'Arbitrum', wallet: WALLETS.evm },
  bsc: { label: 'BNB Chain', wallet: WALLETS.evm },
  tron: { label: 'Tron (TRC-20)', wallet: WALLETS.tron },
};
