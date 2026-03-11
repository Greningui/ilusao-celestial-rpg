
-- Fix overly permissive INSERT policies on child tables by checking parent ownership

DROP POLICY "Users create jutsu techniques" ON public.jutsu_techniques;
CREATE POLICY "Users create jutsu techniques" ON public.jutsu_techniques 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.jutsus WHERE id = jutsu_id AND created_by = auth.uid())
  );

DROP POLICY "Users create indiv techniques" ON public.individuality_techniques;
CREATE POLICY "Users create indiv techniques" ON public.individuality_techniques 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.individualities WHERE id = individuality_id AND created_by = auth.uid())
  );

DROP POLICY "Users create breathing forms" ON public.breathing_forms;
CREATE POLICY "Users create breathing forms" ON public.breathing_forms 
  FOR INSERT TO authenticated 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.breathings WHERE id = breathing_id AND created_by = auth.uid())
  );
