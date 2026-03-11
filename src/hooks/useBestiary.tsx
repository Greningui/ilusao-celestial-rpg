import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type BestiaryCreature = Tables<'bestiary'>;

export function useBestiary(category?: string) {
  return useQuery({
    queryKey: ['bestiary', category ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('bestiary').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as BestiaryCreature[];
    },
  });
}

export function useBestiaryCreature(id: string | undefined) {
  return useQuery({
    queryKey: ['bestiary', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('bestiary')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as BestiaryCreature;
    },
    enabled: !!id,
  });
}

export function useCreateBestiaryCreature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (creature: TablesInsert<'bestiary'>) => {
      const { data, error } = await supabase.from('bestiary').insert(creature).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bestiary'] }),
  });
}

export function useUpdateBestiaryCreature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'bestiary'> & { id: string }) => {
      const { data, error } = await supabase.from('bestiary').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['bestiary'] });
      qc.invalidateQueries({ queryKey: ['bestiary', data.id] });
    },
  });
}

export function useDeleteBestiaryCreature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bestiary').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bestiary'] }),
  });
}
