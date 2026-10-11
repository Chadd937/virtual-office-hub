import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { PERIOD_DAYS, hasAccess } from './billing-rules';

const plan = z.enum(['starter', 'growth', 'scale']);

export const confirmCryptoPayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ plan, network: z.enum(['solana', 'ethereum', 'base', 'polygon', 'arbitrum', 'bsc', 'tron']), token: z.enum(['USDC', 'USDT']), txHash: z.string().trim().min(40).max(120).regex(/^[A-Za-z0-9]+$/) }))
  .handler(async ({ data, context }) => {
    const tx = data.network === 'solana' ? data.txHash : data.txHash.toLowerCase().replace(/^0x/, data.network === 'tron' ? '' : '0x');
    const txNorm = data.network === 'tron' || data.network === 'solana' ? tx : (tx.startsWith('0x') ? tx : `0x${tx}`);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: used } = await supabaseAdmin.from('crypto_payments').select('id').eq('network', data.network).eq('tx_hash', txNorm).maybeSingle();
    if (used) throw new Error('This transaction has already been used for a plan.');
    const { verifyTransfer } = await import('./crypto-verify.server');
    const result = await verifyTransfer(data.network, data.token, txNorm, data.plan);
    if (!result.ok) throw new Error(result.reason);
    const { error } = await supabaseAdmin.from('crypto_payments').insert({ owner_id: context.userId, plan: data.plan, network: data.network, token: data.token, tx_hash: txNorm, amount: Number(result.amount) });
    if (error) throw new Error(error.code === '23505' ? 'This transaction has already been used for a plan.' : error.message);
    const { data: current } = await supabaseAdmin.from('subscriptions').select('*').eq('owner_id', context.userId).maybeSingle();
    const start = current && hasAccess(current) && current.current_period_end ? new Date(current.current_period_end) : new Date();
    const end = new Date(start.getTime() + PERIOD_DAYS * 86400000).toISOString();
    const { error: subError } = await supabaseAdmin.from('subscriptions').upsert({ owner_id: context.userId, plan: data.plan, status: 'active', method: 'crypto', current_period_end: end, updated_at: new Date().toISOString() });
    if (subError) throw new Error(subError.message);
    await supabaseAdmin.from('audit_events').insert({ owner_id: context.userId, action: 'Crypto payment confirmed on chain', detail: `${result.amount} ${data.token} on ${data.network}` });
    return { amount: result.amount, periodEnd: end };
  });

export const startCardTrial = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ plan }))
  .handler(async () => {
    if (!process.env['ZEN_TERMINAL_UUID'] || !process.env['ZEN_PAYWALL_SECRET']) {
      throw new Error('Card checkout through Zen is not switched on yet. Please use crypto for now, or check back soon.');
    }
    throw new Error('Card checkout through Zen is being finalized. Please use crypto for now.');
  });
