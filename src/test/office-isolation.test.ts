import { createClient } from '@supabase/supabase-js';
import { describe, it, expect } from 'vitest';
const enabled = Boolean(process.env['OFFICE_TEST_ACCESS_TOKEN'] && process.env['OFFICE_TEST_OWNER_ID']);
describe.skipIf(!enabled)('office data permissions', () => {
  it('cannot create a project for a different owner', async () => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'] ?? '';
    const client = createClient(process.env['SUPABASE_URL'] ?? '', key, { auth: { persistSession:false }, global: { headers: { Authorization:`Bearer ${process.env['OFFICE_TEST_ACCESS_TOKEN']}` } } });
    const response = await client.from('projects').insert({ owner_id:'00000000-0000-4000-8000-000000000099', name:'Forbidden test project' });
    expect(response.error?.code).toBe('42501');
  });
  it('cannot update task state directly and bypass approval', async () => {
    const client = createClient(process.env['SUPABASE_URL'] ?? '', process.env['SUPABASE_PUBLISHABLE_KEY'] ?? '', { auth:{persistSession:false}, global:{headers:{Authorization:`Bearer ${process.env['OFFICE_TEST_ACCESS_TOKEN']}`}} });
    const response = await client.from('tasks').update({status:'completed'}).eq('owner_id',process.env['OFFICE_TEST_OWNER_ID'] ?? '');
    expect(response.error?.code).toBe('42501');
  });
  it('anonymous users cannot read company projects', async () => {
    const key=process.env['SUPABASE_PUBLISHABLE_KEY'] ?? '';
    const client=createClient(process.env['SUPABASE_URL'] ?? '',key,{auth:{persistSession:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers);if(key.startsWith('sb_'))headers.delete('Authorization');headers.set('apikey',key);return fetch(input,{...init,headers});}}});
    const response=await client.from('projects').select('*');
    expect(response.error?.code === '42501' || (response.error === null && Array.isArray(response.data) && response.data.length === 0)).toBe(true);
  });
});