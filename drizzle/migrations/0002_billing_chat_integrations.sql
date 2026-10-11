ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
GRANT UPDATE, DELETE ON public.projects TO authenticated;
DROP POLICY IF EXISTS "Owners update projects" ON public.projects;
CREATE POLICY "Owners update projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Owners delete projects" ON public.projects;
CREATE POLICY "Owners delete projects" ON public.projects FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 12000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read chat" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners write chat" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners clear chat" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE INDEX chat_messages_owner_idx ON public.chat_messages(owner_id, created_at);

CREATE TABLE public.integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  provider text NOT NULL,
  account_label text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'setup_requested',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, provider)
);
GRANT SELECT, INSERT, DELETE ON public.integration_connections TO authenticated;
GRANT ALL ON public.integration_connections TO service_role;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read connections" ON public.integration_connections FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners request connections" ON public.integration_connections FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND status = 'setup_requested');
CREATE POLICY "Owners disconnect" ON public.integration_connections FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.subscriptions (
  owner_id uuid PRIMARY KEY,
  plan text NOT NULL CHECK (plan IN ('starter','growth','scale')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','trialing','active','expired')),
  method text NOT NULL CHECK (method IN ('card','crypto')),
  current_period_end timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read subscription" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE TABLE public.crypto_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  plan text NOT NULL,
  network text NOT NULL,
  token text NOT NULL,
  tx_hash text NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (network, tx_hash)
);
GRANT SELECT ON public.crypto_payments TO authenticated;
GRANT ALL ON public.crypto_payments TO service_role;
ALTER TABLE public.crypto_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners read payments" ON public.crypto_payments FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.enforce_project_limit() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s public.subscriptions; lim int; used int;
BEGIN
  IF NEW.status <> 'active' OR (TG_OP = 'UPDATE' AND OLD.status = 'active') THEN RETURN NEW; END IF;
  SELECT * INTO s FROM public.subscriptions WHERE owner_id = NEW.owner_id;
  IF s IS NULL OR s.status NOT IN ('trialing','active') OR s.current_period_end IS NULL OR s.current_period_end < now() THEN
    RAISE EXCEPTION 'An active plan or free trial is required to open projects.';
  END IF;
  lim := CASE s.plan WHEN 'starter' THEN 1 WHEN 'growth' THEN 3 ELSE 10 END;
  SELECT count(*) INTO used FROM public.projects WHERE owner_id = NEW.owner_id AND status = 'active' AND id <> NEW.id;
  IF used >= lim THEN RAISE EXCEPTION 'Your plan allows % open projects. Close one or upgrade.', lim; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER projects_limit BEFORE INSERT OR UPDATE OF status ON public.projects FOR EACH ROW EXECUTE FUNCTION public.enforce_project_limit();