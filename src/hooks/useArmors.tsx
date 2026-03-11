import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Armor = Tables<'armors'>;

export function useArmors(category?: string) {
  return useQuery({
    queryKey: ['armors', category ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('armors').select('*').order('created_at', { ascending: false });
      if (category) {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Armor[];
    },
  });
}

export function useArmor(id: string | undefined) {
  return useQuery({
    queryKey: ['armors', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('armors')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Armor;
    },
    enabled: !!id,
  });
}

export function useCreateArmor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (armor: TablesInsert<'armors'>) => {
      const { data, error } = await supabase.from('armors').insert(armor).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['armors'] }),
  });
}

export function useUpdateArmor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'armors'> & { id: string }) => {
      const { data, error } = await supabase.from('armors').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['armors'] });
      qc.invalidateQueries({ queryKey: ['armors', data.id] });
    },
  });
}

export function useDeleteArmor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('armors').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['armors'] }),
  });
}
