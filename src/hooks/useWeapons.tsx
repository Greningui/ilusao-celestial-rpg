import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Weapon = Tables<'weapons'>;

export function useWeapons(category?: string) {
  return useQuery({
    queryKey: ['weapons', category ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('weapons').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Weapon[];
    },
  });
}

export function useWeapon(id: string | undefined) {
  return useQuery({
    queryKey: ['weapons', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('weapons')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Weapon;
    },
    enabled: !!id,
  });
}

export function useCreateWeapon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (weapon: TablesInsert<'weapons'>) => {
      const { data, error } = await supabase.from('weapons').insert(weapon).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weapons'] }),
  });
}

export function useUpdateWeapon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'weapons'> & { id: string }) => {
      const { data, error } = await supabase.from('weapons').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['weapons'] });
      qc.invalidateQueries({ queryKey: ['weapons', data.id] });
    },
  });
}

export function useDeleteWeapon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('weapons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['weapons'] }),
  });
}
