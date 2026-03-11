import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateSecureToken } from '@/lib/security';

export interface TwoFactorAuth {
  id: string;
  user_id: string;
  enabled: boolean;
  method: 'sms' | 'email' | 'authenticator';
  backup_codes?: string[];
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export function use2FA(userId: string | undefined) {
  return useQuery({
    queryKey: ['2fa', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data as TwoFactorAuth | null;
    },
    enabled: !!userId,
  });
}

export function useEnable2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      method,
    }: {
      userId: string;
      method: 'sms' | 'email' | 'authenticator';
    }) => {
      const backupCodes = Array.from({ length: 10 }, () => generateSecureToken(8));

      const { data, error } = await supabase.from('two_factor_auth').upsert(
        {
          user_id: userId,
          method,
          enabled: false, // Not verified yet
          backup_codes: backupCodes,
        },
        { onConflict: 'user_id' }
      );

      if (error) throw error;
      return { ...data, backupCodes };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['2fa', data.user_id] });
    },
  });
}

export function useVerify2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      code,
    }: {
      userId: string;
      code: string;
    }) => {
      // Verify the code (in real implementation, this would validate against SMS/Email/Authenticator)
      const { data, error } = await supabase
        .from('two_factor_auth')
        .update({
          enabled: true,
          verified_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['2fa', data.user_id] });
    },
  });
}

export function useDisable2FA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('two_factor_auth')
        .update({
          enabled: false,
          verified_at: null,
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['2fa', data.user_id] });
    },
  });
}

export function useSend2FACode() {
  return useMutation({
    mutationFn: async ({
      userId,
      method,
    }: {
      userId: string;
      method: 'sms' | 'email';
    }) => {
      const code = generateSecureToken(6);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const { error } = await supabase.from('two_factor_codes').insert({
        user_id: userId,
        code,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      // In real implementation, send via SMS or Email
      console.log(`2FA Code sent via ${method}: ${code}`);

      return { success: true, expiresAt };
    },
  });
}

export function useVerify2FACode() {
  return useMutation({
    mutationFn: async ({
      userId,
      code,
    }: {
      userId: string;
      code: string;
    }) => {
      const { data, error } = await supabase
        .from('two_factor_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .eq('verified_at', null)
        .single();

      if (error || !data) {
        throw new Error('Código inválido ou expirado');
      }

      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Código expirado');
      }

      if (data.attempts >= 3) {
        throw new Error('Muitas tentativas. Tente novamente mais tarde.');
      }

      // Mark as verified
      await supabase
        .from('two_factor_codes')
        .update({ verified_at: new Date().toISOString() })
        .eq('id', data.id);

      return { success: true };
    },
  });
}

export function useBackupCodes(userId: string | undefined) {
  return useQuery({
    queryKey: ['backup-codes', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('backup_codes')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data?.backup_codes || [];
    },
    enabled: !!userId,
  });
}

export function useRegenerateBackupCodes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const backupCodes = Array.from({ length: 10 }, () => generateSecureToken(8));

      const { data, error } = await supabase
        .from('two_factor_auth')
        .update({ backup_codes: backupCodes })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['backup-codes', data.user_id] });
    },
  });
}
