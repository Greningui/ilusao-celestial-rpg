
-- Campaigns table
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  master_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  master_name text,
  max_players integer NOT NULL DEFAULT 5,
  current_players integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns viewable by authenticated" ON public.campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Masters create campaigns" ON public.campaigns FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'master') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Masters update own campaigns" ON public.campaigns FOR UPDATE TO authenticated USING (master_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Masters delete own campaigns" ON public.campaigns FOR DELETE TO authenticated USING (master_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Campaign inscriptions/requests
CREATE TABLE public.campaign_inscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  player_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  player_name text,
  character_id uuid REFERENCES public.characters(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  UNIQUE(campaign_id, player_id)
);

ALTER TABLE public.campaign_inscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inscriptions viewable by authenticated" ON public.campaign_inscriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Players create inscriptions" ON public.campaign_inscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = player_id);
CREATE POLICY "Masters manage inscriptions" ON public.campaign_inscriptions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND master_id = auth.uid()) OR public.has_role(auth.uid(), 'admin')
);
CREATE POLICY "Masters delete inscriptions" ON public.campaign_inscriptions FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.campaigns WHERE id = campaign_id AND master_id = auth.uid()) OR public.has_role(auth.uid(), 'admin')
);

-- Bestiary table
CREATE TABLE public.bestiary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  type text,
  rarity text,
  hp text,
  defense text,
  attack text,
  special_ability text,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bestiary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bestiary viewable by authenticated" ON public.bestiary FOR SELECT TO authenticated USING (true);
CREATE POLICY "Creators create bestiary" ON public.bestiary FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'creator') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators update own bestiary" ON public.bestiary FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators delete own bestiary" ON public.bestiary FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bestiary_updated_at BEFORE UPDATE ON public.bestiary
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
