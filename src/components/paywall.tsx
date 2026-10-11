import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { Check, CreditCard, Coins, Copy, ShieldCheck, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useOffice } from '@/lib/office-context';
import { PLANS, NETWORKS, TRIAL_DAYS, hasAccess, type PlanId, type Network } from '@/lib/billing-rules';
import { confirmCryptoPayment, startCardTrial } from '@/lib/billing.functions';

export function useSubscription() {
  const { user } = useOffice();
  return useQuery({ queryKey: ['subscription', user?.id], enabled: Boolean(user), queryFn: async () => {
    const { data, error } = await supabase.from('subscriptions').select('*').maybeSingle();
    if (error) throw error; return data;
  } });
}

export function Paywall() {
  const { user } = useOffice();
  const sub = useSubscription();
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => { setDismissed(sessionStorage.getItem('gcd-paywall') === '1'); }, []);
  if (!user || sub.isLoading || hasAccess(sub.data) || dismissed) return null;
  return <Dialog open onOpenChange={o => { if (!o) { sessionStorage.setItem('gcd-paywall', '1'); setDismissed(true); } }}>
    <DialogContent className="onboard-dialog paywall-dialog">
      <DialogHeader><DialogTitle>Start your {TRIAL_DAYS}-day free trial</DialogTitle><DialogDescription>Full access, no holdbacks. A card is required to start the trial, or pay with USDC/USDT for 30 days of access.</DialogDescription></DialogHeader>
      <PricingPanel />
    </DialogContent>
  </Dialog>;
}

export function PricingPanel() {
  const { user } = useOffice();
  const client = useQueryClient();
  const sub = useSubscription();
  const card = useServerFn(startCardTrial);
  const confirm = useServerFn(confirmCryptoPayment);
  const [plan, setPlan] = useState<PlanId>('growth');
  const [mode, setMode] = useState<'choose' | 'crypto'>('choose');
  const [network, setNetwork] = useState<Network>('solana');
  const [token, setToken] = useState<'USDC' | 'USDT'>('USDC');
  const [tx, setTx] = useState('');
  const [busy, setBusy] = useState(false);
  const active = hasAccess(sub.data);
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } catch (e) { toast.error(e instanceof Error ? e.message : 'Payment failed.'); } finally { setBusy(false); } };

  return <div className="pricing">
    {active && sub.data && <p className="pill w-fit"><ShieldCheck size={12}/>{PLANS[sub.data.plan as PlanId].name} plan active until {new Date(sub.data.current_period_end!).toLocaleDateString()}</p>}
    <div className="plan-grid">{(Object.keys(PLANS) as PlanId[]).map(id => <button type="button" key={id} className={`plan-card ${plan === id ? 'on' : ''}`} onClick={() => setPlan(id)}>
      <strong>{PLANS[id].name}</strong><span className="plan-price">${PLANS[id].price}<small>/month</small></span>
      <span><Check size={12}/>{PLANS[id].projects} open project{PLANS[id].projects > 1 ? 's' : ''}</span><span><Check size={12}/>Full AI office & Morgan</span><span><Check size={12}/>Website, app & Google Play packages</span>
    </button>)}</div>
    {!user ? <p className="text-sm text-muted-foreground">Sign in as the owner (bottom-left menu) to start your trial.</p>
    : mode === 'choose' ? <div className="flex gap-2 flex-wrap">
      <Button disabled={busy} onClick={() => run(async () => { await card({ data: { plan } }); })}><CreditCard size={14}/>Start {TRIAL_DAYS}-day free trial with card</Button>
      <Button variant="outline" onClick={() => setMode('crypto')}><Coins size={14}/>Pay with crypto (USDC / USDT)</Button>
    </div>
    : <div className="crypto-flow">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => setMode('choose')}><ArrowLeft size={14}/>Back</Button>
      <ol>
        <li>Choose a network and coin.<div className="flex gap-2 flex-wrap mt-2"><select aria-label="Network" value={network} onChange={e => setNetwork(e.target.value as Network)}>{(Object.keys(NETWORKS) as Network[]).map(n => <option key={n} value={n}>{NETWORKS[n].label}</option>)}</select><select aria-label="Coin" value={token} onChange={e => setToken(e.target.value as 'USDC' | 'USDT')}><option>USDC</option><option>USDT</option></select></div></li>
        <li>Send exactly <strong>{PLANS[plan].price} {token}</strong> on <strong>{NETWORKS[network].label}</strong> to:<div className="wallet-box"><code>{NETWORKS[network].wallet}</code><Button size="icon" variant="ghost" title="Copy address" onClick={() => { void navigator.clipboard.writeText(NETWORKS[network].wallet); toast.success('Address copied'); }}><Copy size={14}/></Button></div><small className="text-muted-foreground">Only send {token} on {NETWORKS[network].label}. Coins sent on the wrong network may be lost forever. Payments are final.</small></li>
        <li>Paste your transaction ID. We check it on the blockchain and switch on 30 days of access once it's confirmed.<input className="mt-2" placeholder="Transaction hash / signature" value={tx} onChange={e => setTx(e.target.value.trim())} maxLength={120}/></li>
      </ol>
      <Button disabled={busy || tx.length < 40} onClick={() => run(async () => { const r = await confirm({ data: { plan, network, token, txHash: tx } }); toast.success(`Payment of ${r.amount} ${token} confirmed. Your plan is active.`); setTx(''); await client.invalidateQueries({ queryKey: ['subscription'] }); })}>{busy ? 'Checking the blockchain…' : 'Confirm my payment'}</Button>
    </div>}
    <p className="text-xs text-muted-foreground">Cancel anytime before the trial ends and you won't be charged. Prices in USD. Crypto payments are non-refundable once confirmed on chain.</p>
  </div>;
}
