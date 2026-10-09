import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { canTransition, canRun } from './workforce-rules';

export const planObjective = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ objective: z.string().min(3).max(6000), managerId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const { data: office } = await context.supabase.from('offices').select('*').eq('owner_id', context.userId).single();
    if (!office || office.paused || office.ai_blocked) throw new Error(office?.ai_blocked || 'Office is paused or not set up.');
    const { data: manager } = await context.supabase.from('agents').select('*').eq('id', data.managerId).eq('kind', 'manager').eq('status','idle').single();
    if (!manager) throw new Error('Select an available manager.');
    const { data: staff } = await context.supabase.from('agents').select('id,name,role').eq('manager_id', manager.id).eq('kind','employee').eq('status','idle');
    if (!staff?.length) throw new Error('Hire an employee reporting to this manager first.');
    const firstEmployee = staff[0];
    if (!firstEmployee) throw new Error('No employee is available.');
    const { generatePlan } = await import('./office-ai.server');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    try {
      const result = await generatePlan(process.env['LOVABLE_API_KEY'], data.objective, manager.role, staff);
      const rows = result.plan.tasks.slice(0, 5).map(t => ({ owner_id: context.userId, agent_id: staff.find(s => s.id === t.agentId)?.id ?? firstEmployee.id, title: t.title, objective: t.objective, criteria: t.criteria, status: 'awaiting_approval', run_id: result.runId }));
      const { error } = await supabaseAdmin.from('tasks').insert(rows);
      if (error) throw error;
      await supabaseAdmin.from('audit_events').insert({ owner_id: context.userId, action: 'Manager proposed a plan', target_id: manager.id, detail: data.objective });
      return { count: rows.length };
    } catch (error) {
      const { aiError } = await import('./office-ai.server');
      const failure = aiError(error);
      if (failure.block) await supabaseAdmin.from('offices').update({ ai_blocked: failure.message }).eq('owner_id', context.userId);
      throw new Error(failure.message);
    }
  });

export const taskAction = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ taskId: z.string().uuid(), action: z.enum(['approve','run','verify','cancel']) }))
  .handler(async ({ data, context }) => {
    const { data: task } = await context.supabase.from('tasks').select('*').eq('id', data.taskId).single();
    const { data: office } = await context.supabase.from('offices').select('*').eq('owner_id',context.userId).single();
    if (!task || !office) throw new Error('Task not found.');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const target = data.action === 'approve' ? 'queued' : data.action === 'run' ? 'running' : data.action === 'verify' ? 'completed' : 'cancelled';
    if (!canTransition(task.status, target)) throw new Error('This action is not allowed in the current task state.');
    if (data.action === 'verify' && !task.output?.trim()) throw new Error('A deliverable is required before completion.');
    if (data.action === 'run' && !canRun(office.paused, office.ai_blocked, task.approved_at, task.status)) throw new Error(office.ai_blocked || 'Work is paused or not approved.');
    let agent;
    if (data.action === 'run') {
      const response = await context.supabase.from('agents').select('*').eq('id',task.agent_id ?? '').eq('status','idle').single();
      agent = response.data;
      if (!agent) throw new Error('Assigned employee is unavailable.');
    }
    const { data: claimed, error } = await supabaseAdmin.from('tasks').update({ status: target, updated_at: new Date().toISOString(), ...(data.action === 'approve' ? { approved_at: new Date().toISOString() } : {}) }).eq('id', task.id).eq('owner_id',context.userId).eq('status',task.status).select('id').maybeSingle();
    if (error || !claimed) throw new Error('Task changed elsewhere. Refresh and try again.');
    await supabaseAdmin.from('audit_events').insert({ owner_id: context.userId, action: `Task ${data.action}`, target_id: task.id, detail: task.title });
    if (data.action !== 'run' || !agent) return { ok: true };
    try {
      const { writeDeliverable } = await import('./office-ai.server');
      const result = await writeDeliverable(process.env['LOVABLE_API_KEY'], task.objective, task.criteria, agent.role);
      const { error: saveError } = await supabaseAdmin.from('tasks').update({ status: 'verification', output: result.text, error: null, run_id: result.runId, input_tokens: result.inputTokens, output_tokens: result.outputTokens, updated_at: new Date().toISOString() }).eq('id',task.id).eq('status','running');
      if (saveError) throw saveError;
      return { ok: true };
    } catch (error) {
      const { aiError } = await import('./office-ai.server');
      const failure = aiError(error);
      await supabaseAdmin.from('tasks').update({ status: 'failed', error: failure.message, updated_at: new Date().toISOString() }).eq('id',task.id);
      if (failure.block) await supabaseAdmin.from('offices').update({ ai_blocked: failure.message }).eq('owner_id',context.userId);
      throw new Error(failure.message);
    }
  });