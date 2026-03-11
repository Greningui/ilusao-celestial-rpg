import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Campaign = Tables<'campaigns'>;
export type CampaignInscription = Tables<'campaign_inscriptions'>;

export function useCampaigns(status?: string) {
  return useQuery({
    queryKey: ['campaigns', status ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false });
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (campaign: TablesInsert<'campaigns'>) => {
      const { data, error } = await supabase.from('campaigns').insert(campaign).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'campaigns'> & { id: string }) => {
      const { data, error } = await supabase.from('campaigns').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['campaigns'] });
      qc.invalidateQueries({ queryKey: ['campaigns', data.id] });
    },
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  });
}

export function useCampaignInscriptions(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaign-inscriptions', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const { data, error } = await supabase
        .from('campaign_inscriptions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data as CampaignInscription[];
    },
    enabled: !!campaignId,
  });
}

export function usePlayerInscriptions(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player-inscriptions', playerId],
    queryFn: async () => {
      if (!playerId) return [];
      const { data, error } = await supabase
        .from('campaign_inscriptions')
        .select('*')
        .eq('player_id', playerId)
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data as CampaignInscription[];
    },
    enabled: !!playerId,
  });
}

export function useCreateInscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (inscription: TablesInsert<'campaign_inscriptions'>) => {
      const { data, error } = await supabase.from('campaign_inscriptions').insert(inscription).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign-inscriptions'] });
      qc.invalidateQueries({ queryKey: ['player-inscriptions'] });
    },
  });
}

export function useUpdateInscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<'campaign_inscriptions'> & { id: string }) => {
      const { data, error } = await supabase.from('campaign_inscriptions').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign-inscriptions'] });
      qc.invalidateQueries({ queryKey: ['player-inscriptions'] });
    },
  });
}

export function useDeleteInscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('campaign_inscriptions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaign-inscriptions'] });
      qc.invalidateQueries({ queryKey: ['player-inscriptions'] });
    },
  });
}
