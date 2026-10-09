REVOKE ALL ON public.tasks, public.audit_events FROM anon, authenticated;
GRANT SELECT ON public.tasks, public.audit_events TO authenticated;
GRANT ALL ON public.tasks, public.audit_events TO service_role;
REVOKE ALL ON public.offices, public.agents, public.projects, public.departments FROM anon;