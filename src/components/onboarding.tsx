import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { MessageCircle, Send, X, ShieldCheck, ArrowRight, CheckCheck, Undo2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useOffice } from '@/lib/office-context';
import { supabase } from '@/integrations/supabase/client';
import { askStoreManager, taskAction } from '@/lib/office.functions';
import { LegalText, LEGAL_VERSION } from './legal-text';
import { Person } from './office-scene';

const KEY = 'gcd-onboarding';
type Intake = { domain: string; hasSite: string; business: string; goals: string[]; audience: string; budget: string; notes: string };
type Saved = { terms?: string; welcomed?: boolean; intake?: Intake; intakeSkipped?: boolean; intakeSaved?: string };
const goalOptions = ['Build a website', 'Build a mobile app', 'Publish to Google Play', 'Sell or flip the domain', 'Earn from ads / affiliates', 'Sell subscriptions', 'Grow traffic (SEO)', 'Brand & logo'];
const load = (): Saved => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { return {}; } };
const intakeText = (i?: Intake) => i ? `Domain: ${i.domain || 'none yet'}. Existing site: ${i.hasSite}. Business: ${i.business}. Goals: ${i.goals.join(', ')}. Audience: ${i.audience}. Budget: ${i.budget}. Notes: ${i.notes}` : undefined;

export function Onboarding() {
  const { user, data, refresh } = useOffice();
  const [saved, setSaved] = useState<Saved | null>(null);
  const [agree, setAgree] = useState({ terms: false, risk: false });
  const [form, setForm] = useState<Intake>({ domain: '', hasSite: 'No', business: '', goals: [], audience: '', budget: 'Not sure', notes: '' });
  const update = (s: Saved) => { localStorage.setItem(KEY, JSON.stringify(s)); setSaved(s); };
  useEffect(() => { setSaved(load()); }, []);

  // Save intake into the signed-in owner's office as a project, once.
  useEffect(() => {
    if (!user || !saved?.intake || saved.intakeSaved === user.id) return;
    const i = saved.intake;
    supabase.from('projects').insert({ owner_id: user.id, name: i.domain || 'My new web & app project', domain: i.domain, objective: intakeText(i)!.slice(0, 2000) }).then(({ error }) => {
      if (error) { toast.error(`Could not save your website answers: ${error.message}`); return; }
      update({ ...saved, intakeSaved: user.id }); refresh(); toast.success('Your website answers were saved as a project.');
    });
  }, [user, saved]);

  if (!saved) return null;
  const step = saved.terms !== LEGAL_VERSION ? 'terms' : !saved.welcomed ? 'welcome' : !saved.intake && !saved.intakeSkipped ? 'intake' : null;
  const submitIntake = (e: FormEvent) => { e.preventDefault(); update({ ...saved, intake: form }); toast.success(user ? 'Thanks! Saving to your office…' : 'Thanks! Sign in to save this to your office.'); };

  return <>
    <Dialog open={step === 'terms'}>
      <DialogContent className="onboard-dialog no-close" onInteractOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
        <DialogHeader><DialogTitle><ShieldCheck className="inline mr-2 text-primary" size={18}/>Before you enter</DialogTitle><DialogDescription>Please read and accept our terms, privacy policy and crypto disclosures. We do not sell your personal information.</DialogDescription></DialogHeader>
        <div className="legal-scroll"><LegalText /></div>
        <label className="check-row"><input type="checkbox" checked={agree.terms} onChange={e => setAgree({ ...agree, terms: e.target.checked })}/>I am 18+ and agree to the Terms of Service and Privacy Policy.</label>
        <label className="check-row"><input type="checkbox" checked={agree.risk} onChange={e => setAgree({ ...agree, risk: e.target.checked })}/>I understand this is not financial advice, crypto assets are risky, and AI work must be reviewed by me.</label>
        <Button disabled={!agree.terms || !agree.risk} onClick={() => update({ ...saved, terms: LEGAL_VERSION })}>I agree — continue<ArrowRight size={14}/></Button>
      </DialogContent>
    </Dialog>
    <Dialog open={step === 'welcome'}>
      <DialogContent className="onboard-dialog no-close" onInteractOutside={e => e.preventDefault()}>
        <div className="welcome-hero"><span className="welcome-avatar"><Person index={0}/></span><div><p className="eyebrow">WELCOME TO</p><h2>GetCryptoDomains.com</h2></div></div>
        <p>Hi, I'm <strong>Morgan, your Store Manager</strong>. I'm your direct assistant and I run this whole virtual office for you.</p>
        <ul className="welcome-list"><li>Tell me about your domain and goals — I'll help plan the website, the app, and a Google Play release package.</li><li>My managers break your requests into tasks. Nothing runs until <strong>you approve it</strong>.</li><li>When employees finish, they <strong>turn in their work</strong> to you for review.</li><li>I'm always in the bottom-right corner if you need me.</li></ul>
        <Button onClick={() => update({ ...saved, welcomed: true })}>Nice to meet you, Morgan<ArrowRight size={14}/></Button>
      </DialogContent>
    </Dialog>
    <Dialog open={step === 'intake'}>
      <DialogContent className="onboard-dialog no-close" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader><DialogTitle>Tell Morgan about your project</DialogTitle><DialogDescription>This helps your office plan the right work. No passwords, wallet keys or payment details, please.</DialogDescription></DialogHeader>
        <form className="intake-form" onSubmit={submitIntake}>
          <label>Your domain<input placeholder="example.com or example.crypto" value={form.domain} maxLength={253} onChange={e => setForm({ ...form, domain: e.target.value.trim() })}/></label>
          <label>Do you already have a website on it?<select value={form.hasSite} onChange={e => setForm({ ...form, hasSite: e.target.value })}><option>No</option><option>Yes, it's live</option><option>Parked / for sale page</option></select></label>
          <label>What is the business or idea?<textarea required minLength={5} maxLength={800} placeholder="e.g. a marketplace for premium crypto domains" value={form.business} onChange={e => setForm({ ...form, business: e.target.value })}/></label>
          <fieldset><legend>What do you want? (pick any)</legend><div className="goal-grid">{goalOptions.map(g => <label key={g} className={`goal-chip ${form.goals.includes(g) ? 'on' : ''}`}><input type="checkbox" checked={form.goals.includes(g)} onChange={e => setForm({ ...form, goals: e.target.checked ? [...form.goals, g] : form.goals.filter(x => x !== g) })}/>{g}</label>)}</div></fieldset>
          <label>Who are your customers?<input maxLength={300} placeholder="e.g. crypto investors in the U.S." value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}/></label>
          <label>Rough budget<select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}><option>Not sure</option><option>Under $500</option><option>$500 – $2,000</option><option>$2,000 – $10,000</option><option>$10,000+</option></select></label>
          <label>Anything else?<textarea maxLength={800} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}/></label>
          <div className="flex gap-2 justify-end"><Button type="button" variant="ghost" onClick={() => update({ ...saved, intakeSkipped: true })}>Skip for now</Button><Button type="submit">Enter my office<ArrowRight size={14}/></Button></div>
        </form>
      </DialogContent>
    </Dialog>
    {!step && <StoreManagerChat intake={intakeText(saved.intake)} />}
    {!step && user && <TurnInWork tasks={data.tasks} agents={data.agents} refresh={refresh} />}
  </>;
}

function StoreManagerChat({ intake }: { intake: string | undefined }) {
  const { user } = useOffice();
  const ask = useServerFn(askStoreManager);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [messages, busy]);
  const send = async (e: FormEvent) => {
    e.preventDefault(); const text = input.trim(); if (!text || busy) return;
    const next = [...messages, { role: 'user' as const, content: text.slice(0, 4000) }].slice(-20);
    setMessages(next); setInput(''); setBusy(true);
    try { const r = await ask({ data: { messages: next, ...(intake ? { intake: intake.slice(0, 3000) } : {}) } }); setMessages([...next, { role: 'assistant', content: r.text }]); }
    catch (err) { toast.error(err instanceof Error ? err.message : 'Morgan could not reply.'); }
    finally { setBusy(false); }
  };
  return <div className="chat-dock">
    {open && <div className="chat-panel" role="dialog" aria-label="Chat with Morgan, your Store Manager">
      <div className="chat-head"><span className="chat-avatar"><Person index={0}/></span><div><strong>Morgan</strong><small>Store Manager · your assistant</small></div><Button size="icon" variant="ghost" className="ml-auto" title="Close chat" onClick={() => setOpen(false)}><X size={16}/></Button></div>
      <div className="chat-body">
        <div className="chat-msg assistant">Hi! I manage your whole office. Ask me how to turn your domain into a site, an app, or a Google Play listing — or ideas to make it profitable.</div>
        {messages.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>)}
        {busy && <div className="chat-msg assistant chat-typing">Morgan is thinking…</div>}
        <div ref={end}/>
      </div>
      {user ? <form className="chat-input" onSubmit={send}><input aria-label="Message Morgan" placeholder="Ask Morgan anything…" value={input} maxLength={4000} onChange={e => setInput(e.target.value)}/><Button size="icon" type="submit" disabled={busy || !input.trim()} title="Send"><Send size={15}/></Button></form>
        : <p className="chat-signin">Sign in as the owner (bottom-left of the menu) to chat with Morgan. <Link to="/legal" className="text-primary">Terms & privacy</Link></p>}
    </div>}
    <button className="chat-launcher" onClick={() => setOpen(!open)} aria-label="Open chat with Morgan"><span className="chat-avatar"><Person index={0}/></span><MessageCircle size={14} className="chat-badge"/></button>
  </div>;
}

function TurnInWork({ tasks, agents, refresh }: { tasks: ReturnType<typeof useOffice>['data']['tasks']; agents: ReturnType<typeof useOffice>['data']['agents']; refresh: () => Promise<void> }) {
  const act = useServerFn(taskAction);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [busy, setBusy] = useState(false);
  const waiting = tasks.filter(t => t.status === 'verification' && t.output);
  const task = waiting.find(t => !dismissed.includes(t.id));
  if (!task) return waiting.length ? <button className="review-pill" onClick={() => setDismissed([])}><CheckCheck size={14}/>{waiting.length} turned-in {waiting.length === 1 ? 'item' : 'items'} to review</button> : null;
  const agent = agents.find(a => a.id === task.agent_id);
  const run = async (action: 'verify' | 'revise') => {
    setBusy(true);
    try { await act({ data: { taskId: task.id, action, ...(action === 'revise' ? { feedback } : {}) } }); toast.success(action === 'verify' ? 'Work accepted and marked complete.' : 'Sent back for revision. Run it again from Tasks when ready.'); setFeedback(''); await refresh(); }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Action failed.'); }
    finally { setBusy(false); }
  };
  return <Dialog open onOpenChange={o => { if (!o) setDismissed([...dismissed, task.id]); }}>
    <DialogContent className="onboard-dialog">
      <DialogHeader><DialogTitle>{agent?.name ?? 'An employee'} turned in work</DialogTitle><DialogDescription>{task.title} · {waiting.length} waiting for your review</DialogDescription></DialogHeader>
      <p className="text-xs text-muted-foreground"><strong>Acceptance criteria:</strong> {task.criteria}</p>
      <div className="deliverable-scroll">{task.output}</div>
      <textarea className="review-feedback" placeholder="What should change? (required to send back)" maxLength={2000} value={feedback} onChange={e => setFeedback(e.target.value)}/>
      <div className="flex gap-2 justify-end flex-wrap"><Button variant="ghost" onClick={() => setDismissed([...dismissed, task.id])}>Review later</Button><Button variant="outline" disabled={busy || !feedback.trim()} onClick={() => run('revise')}><Undo2 size={14}/>Send back</Button><Button disabled={busy} onClick={() => run('verify')}><CheckCheck size={14}/>Accept work</Button></div>
    </DialogContent>
  </Dialog>;
}
