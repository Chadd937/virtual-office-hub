import { NETWORKS, requiredUnits, type Network, type PlanId } from './billing-rules';

type Token = 'USDC' | 'USDT';
const EVM: Record<Exclude<Network, 'solana' | 'tron'>, { rpc: string; confirmations: number; tokens: Record<Token, [string, number]> }> = {
  ethereum: { rpc: 'https://ethereum-rpc.publicnode.com', confirmations: 12, tokens: { USDC: ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6], USDT: ['0xdac17f958d2ee523a2206206994597c13d831ec7', 6] } },
  base: { rpc: 'https://base-rpc.publicnode.com', confirmations: 20, tokens: { USDC: ['0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 6], USDT: ['0xfde4c96c8593536e31f229ea8f37b2ada2699bb2', 6] } },
  polygon: { rpc: 'https://polygon-bor-rpc.publicnode.com', confirmations: 64, tokens: { USDC: ['0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', 6], USDT: ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6] } },
  arbitrum: { rpc: 'https://arbitrum-one-rpc.publicnode.com', confirmations: 20, tokens: { USDC: ['0xaf88d065e77c8cc2239327c5edb3a432268e5831', 6], USDT: ['0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', 6] } },
  bsc: { rpc: 'https://bsc-rpc.publicnode.com', confirmations: 15, tokens: { USDC: ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', 18], USDT: ['0x55d398326f99059ff775485246999027b3197955', 18] } },
};
const SOL_MINTS: Record<Token, string> = { USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' };
const TRON_TOKENS: Record<Token, string> = { USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', USDC: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8' };
const TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

async function rpc(url: string, method: string, params: unknown[]) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  if (!r.ok) throw new Error(`Network lookup failed (${r.status}). Try again in a minute.`);
  const j = await r.json() as { result?: any; error?: { message: string } };
  if (j.error) throw new Error(`Network lookup failed: ${j.error.message}`);
  return j.result;
}

function base58ToHex(s: string) {
  const A = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let n = 0n; for (const c of s) { const i = A.indexOf(c); if (i < 0) throw new Error('Bad address'); n = n * 58n + BigInt(i); }
  let hex = n.toString(16); if (hex.length % 2) hex = '0' + hex;
  return hex.slice(0, -8); // drop 4-byte checksum -> 41 + 20 bytes
}

export type VerifyResult = { ok: true; amount: string } | { ok: false; reason: string };

export async function verifyTransfer(network: Network, token: Token, tx: string, plan: PlanId): Promise<VerifyResult> {
  const wallet = NETWORKS[network].wallet;
  if (network === 'solana') {
    const t = await rpc('https://api.mainnet-beta.solana.com', 'getTransaction', [tx, { encoding: 'jsonParsed', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
    if (!t) return { ok: false, reason: 'Not finalized on Solana yet. Wait a minute and try again.' };
    if (t.meta?.err) return { ok: false, reason: 'This transaction failed on chain.' };
    const bal = (arr: any[]) => arr.filter(b => b.owner === wallet && b.mint === SOL_MINTS[token]).reduce((s, b) => s + BigInt(b.uiTokenAmount.amount), 0n);
    const got = bal(t.meta?.postTokenBalances ?? []) - bal(t.meta?.preTokenBalances ?? []);
    return got >= requiredUnits(plan, 6) ? { ok: true, amount: (Number(got) / 1e6).toFixed(2) } : { ok: false, reason: `No ${token} payment of the full plan amount to our Solana wallet was found in this transaction.` };
  }
  if (network === 'tron') {
    const r = await fetch('https://api.trongrid.io/walletsolidity/gettransactioninfobyid', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: tx }) });
    if (!r.ok) throw new Error(`Tron lookup failed (${r.status}).`);
    const info = await r.json() as any;
    if (!info?.id) return { ok: false, reason: 'Not confirmed on Tron yet. Wait a minute and try again.' };
    if (info.receipt?.result && info.receipt.result !== 'SUCCESS') return { ok: false, reason: 'This transaction failed on chain.' };
    const contract = base58ToHex(TRON_TOKENS[token]).slice(2).toLowerCase();
    const to = base58ToHex(wallet).slice(2).toLowerCase();
    let got = 0n;
    for (const l of info.log ?? []) if (String(l.address).toLowerCase() === contract && `0x${l.topics?.[0]}` === TRANSFER && String(l.topics?.[2]).toLowerCase().endsWith(to)) got += BigInt(`0x${l.data}`);
    return got >= requiredUnits(plan, 6) ? { ok: true, amount: (Number(got) / 1e6).toFixed(2) } : { ok: false, reason: `No ${token} payment of the full plan amount to our Tron wallet was found.` };
  }
  const cfg = EVM[network]; const [contract, decimals] = cfg.tokens[token];
  const receipt = await rpc(cfg.rpc, 'eth_getTransactionReceipt', [tx]);
  if (!receipt) return { ok: false, reason: 'Transaction not found yet. Wait a minute and try again.' };
  if (receipt.status !== '0x1') return { ok: false, reason: 'This transaction failed on chain.' };
  const head = BigInt(await rpc(cfg.rpc, 'eth_blockNumber', []));
  if (head - BigInt(receipt.blockNumber) < BigInt(cfg.confirmations)) return { ok: false, reason: `Waiting for ${cfg.confirmations} confirmations. Try again shortly.` };
  const to = wallet.toLowerCase().slice(2);
  let got = 0n;
  for (const l of receipt.logs ?? []) if (String(l.address).toLowerCase() === contract && l.topics?.[0] === TRANSFER && String(l.topics?.[2]).toLowerCase().endsWith(to)) got += BigInt(l.data);
  return got >= requiredUnits(plan, decimals) ? { ok: true, amount: (Number(got / 10n ** BigInt(decimals - 2)) / 100).toFixed(2) } : { ok: false, reason: `No ${token} payment of the full plan amount to our wallet was found on ${NETWORKS[network].label}.` };
}
