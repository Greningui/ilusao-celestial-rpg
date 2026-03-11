
-- Weapons table
CREATE TABLE public.weapons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  type text,
  rarity text,
  damage text,
  weight text,
  special_effect text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.weapons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weapons viewable by authenticated" ON public.weapons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own weapons" ON public.weapons FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage weapons" ON public.weapons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Armors table
CREATE TABLE public.armors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  type text,
  rarity text,
  defense text,
  weight text,
  special_effect text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.armors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Armors viewable by authenticated" ON public.armors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own armors" ON public.armors FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage armors" ON public.armors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Items table
CREATE TABLE public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  type text,
  rarity text,
  quantity integer DEFAULT 1,
  weight text,
  effect text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items viewable by authenticated" ON public.items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own items" ON public.items FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage items" ON public.items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
