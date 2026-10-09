import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
type Row<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Agent = Row<'agents'>;
export type Task = Row<'tasks'>;
type OfficeData = { office:Row<'offices'> | null; agents:Agent[]; tasks:Task[]; projects:Row<'projects'>[]; departments:Row<'departments'>[]; events:Row<'audit_events'>[] };
const empty:OfficeData = { office:null,agents:[],tasks:[],projects:[],departments:[],events:[] };
const Context = createContext<{user:User|null;data:OfficeData;refresh:()=>Promise<void>;loading:boolean}>({user:null,data:empty,refresh:async()=>{},loading:false});
export function OfficeProvider({children}:{children:ReactNode}) {
  const [user,setUser] = useState<User|null>(null);
  const client = useQueryClient();
  useEffect(() => {
    supabase.auth.getUser().then(({data})=>setUser(data.user));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((event,session)=>{
      if (['SIGNED_IN','SIGNED_OUT','USER_UPDATED'].includes(event)) { setUser(session?.user ?? null); if(event === 'SIGNED_OUT') client.removeQueries({queryKey:['office']}); else client.invalidateQueries({queryKey:['office']}); }
    });
    return ()=>subscription.unsubscribe();
  },[client]);
  const query = useQuery({queryKey:['office',user?.id],enabled:Boolean(user),queryFn:async()=>{
    const results = await Promise.all([supabase.from('offices').select('*').maybeSingle(),supabase.from('agents').select('*').neq('status','retired').order('created_at').limit(100),supabase.from('tasks').select('*').order('created_at',{ascending:false}).limit(100),supabase.from('projects').select('*').order('created_at').limit(100),supabase.from('departments').select('*').order('created_at').limit(100),supabase.from('audit_events').select('*').order('created_at',{ascending:false}).limit(50)]);
    for (const r of results) if(r.error) throw r.error;
    return {office:results[0].data,agents:results[1].data ?? [],tasks:results[2].data ?? [],projects:results[3].data ?? [],departments:results[4].data ?? [],events:results[5].data ?? []};
  }});
  return <Context.Provider value={{user,data:query.data ?? empty,refresh:async()=>{await client.invalidateQueries({queryKey:['office']});},loading:query.isLoading}}>{query.error && <div role="alert" className="connection-error">Office connection: {query.error.message}</div>}{children}</Context.Provider>;
}
export const useOffice = ()=>useContext(Context);