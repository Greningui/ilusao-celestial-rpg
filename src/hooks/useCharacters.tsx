import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Character = Tables<'characters'>;

export function useCharacters(ownerId?: string) {
  return useQuery({
    queryKey: ['characters', ownerId ?? 'mine'],
    queryFn: async () => {
      let query = supabase.from('characters').select('*').order('nome');
      if (ownerId) {
        query = query.eq('owner_id', ownerId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Character[];
    },
  });
}

export function useCharacter(id: string | undefined) {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Character;
    },
    enabled: !!id,
  });
}

export function useCreateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (character: TablesInsert<'characters'>) => {
      const { data, error } = await supabase.from('characters').insert(character).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['characters'] }),
  });
}

export function useUpdateCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'characters'> & { id: string }) => {
      const { data, error } = await supabase.from('characters').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['characters'] });
      qc.invalidateQueries({ queryKey: ['characters', data.id] });
    },
  });
}

export function useDeleteCharacter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['characters'] }),
  });
}
