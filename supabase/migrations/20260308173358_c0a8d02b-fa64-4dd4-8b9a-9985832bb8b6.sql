
DROP POLICY IF EXISTS "Characters viewable by authenticated" ON public.characters;

CREATE POLICY "Characters viewable by owner or admin"
ON public.characters
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)
);
