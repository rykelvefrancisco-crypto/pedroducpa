CREATE TABLE public.proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  value TEXT NOT NULL CHECK (char_length(value) BETWEEN 1 AND 80),
  image TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.proofs TO anon, authenticated;
GRANT ALL ON public.proofs TO service_role;

ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view proofs"
ON public.proofs
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.update_proofs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_proofs_updated_at
BEFORE UPDATE ON public.proofs
FOR EACH ROW
EXECUTE FUNCTION public.update_proofs_updated_at();

INSERT INTO public.proofs (id, title, value, display_order) VALUES
  ('00000000-0000-4000-8000-000000000001', 'Comissão em uma semana', 'R$ 12.840', 1),
  ('00000000-0000-4000-8000-000000000002', 'Resultado de operação', 'R$ 27.500', 2),
  ('00000000-0000-4000-8000-000000000003', 'Equipe em expansão', '+340 FTDs', 3),
  ('00000000-0000-4000-8000-000000000004', 'Volume acumulado', '+R$ 100 mil', 4),
  ('00000000-0000-4000-8000-000000000005', 'Campanha direcionada', '186 cadastros', 5),
  ('00000000-0000-4000-8000-000000000006', 'Crescimento mensal', '+72%', 6),
  ('00000000-0000-4000-8000-000000000007', 'Comissão liberada', 'R$ 8.920', 7),
  ('00000000-0000-4000-8000-000000000008', 'Novos depositantes', '94 FTDs', 8);