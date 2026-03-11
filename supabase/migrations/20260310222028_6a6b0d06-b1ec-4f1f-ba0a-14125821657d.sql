
-- Skills table (elemental skills)
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills viewable by authenticated" ON public.skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage skills" ON public.skills FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Jutsus table
CREATE TABLE public.jutsus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jutsus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jutsus viewable by authenticated" ON public.jutsus FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own jutsus" ON public.jutsus FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage jutsus" ON public.jutsus FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Jutsu techniques (for taijutsu sub-techniques)
CREATE TABLE public.jutsu_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jutsu_id uuid REFERENCES public.jutsus(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text
);

ALTER TABLE public.jutsu_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jutsu techniques viewable by authenticated" ON public.jutsu_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create jutsu techniques" ON public.jutsu_techniques FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage jutsu techniques" ON public.jutsu_techniques FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Cursed/innate techniques
CREATE TABLE public.cursed_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cursed_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cursed techniques viewable by authenticated" ON public.cursed_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own cursed techniques" ON public.cursed_techniques FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage cursed techniques" ON public.cursed_techniques FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Individualities
CREATE TABLE public.individualities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.individualities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individualities viewable by authenticated" ON public.individualities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own individualities" ON public.individualities FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage individualities" ON public.individualities FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Individuality techniques (for offensive type)
CREATE TABLE public.individuality_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  individuality_id uuid REFERENCES public.individualities(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text
);

ALTER TABLE public.individuality_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Indiv techniques viewable by authenticated" ON public.individuality_techniques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create indiv techniques" ON public.individuality_techniques FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage indiv techniques" ON public.individuality_techniques FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Breathings
CREATE TABLE public.breathings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  lvl text,
  forms_count integer NOT NULL DEFAULT 1,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.breathings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Breathings viewable by authenticated" ON public.breathings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own breathings" ON public.breathings FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Admins manage breathings" ON public.breathings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Breathing forms
CREATE TABLE public.breathing_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  breathing_id uuid REFERENCES public.breathings(id) ON DELETE CASCADE NOT NULL,
  form_number integer NOT NULL,
  name text NOT NULL,
  lvl text,
  damage text,
  cost text,
  duration text,
  cooldown text,
  effect text DEFAULT 'nenhum',
  effect_damage text,
  effect_duration text,
  description text
);

ALTER TABLE public.breathing_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Breathing forms viewable by authenticated" ON public.breathing_forms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create breathing forms" ON public.breathing_forms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins manage breathing forms" ON public.breathing_forms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
