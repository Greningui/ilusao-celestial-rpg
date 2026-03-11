import { supabase } from '@/integrations/supabase/client';
import CryptoJS from 'crypto-js';

// ============================================
// RATE LIMITING
// ============================================

export async function checkRateLimit(
  identifier: string, // user_id or ip_address
  action: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15
): Promise<{ allowed: boolean; remainingAttempts: number; blockedUntil?: Date }> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('action', action)
    .or(`user_id.eq.${identifier},ip_address.eq.${identifier}`)
    .gte('last_attempt_at', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Rate limit check error:', error);
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  if (!data) {
    // First attempt in this window
    await supabase.from('rate_limits').insert({
      user_id: identifier.includes('-') ? identifier : null,
      ip_address: identifier.includes('-') ? null : identifier,
      action,
      attempt_count: 1,
    });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (data.blocked_until && new Date(data.blocked_until) > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: new Date(data.blocked_until),
    };
  }

  if (data.attempt_count >= maxAttempts) {
    const blockedUntil = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    await supabase
      .from('rate_limits')
      .update({ blocked_until: blockedUntil.toISOString() })
      .eq('id', data.id);

    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil,
    };
  }

  await supabase
    .from('rate_limits')
    .update({
      attempt_count: data.attempt_count + 1,
      last_attempt_at: now.toISOString(),
    })
    .eq('id', data.id);

  return {
    allowed: true,
    remainingAttempts: maxAttempts - data.attempt_count - 1,
  };
}

export async function resetRateLimit(identifier: string, action: string) {
  await supabase
    .from('rate_limits')
    .delete()
    .eq('action', action)
    .or(`user_id.eq.${identifier},ip_address.eq.${identifier}`);
}

// ============================================
// SESSION MANAGEMENT
// ============================================

export async function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string,
  deviceFingerprint?: string
): Promise<string> {
  const sessionToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Check if user has active sessions and enforce single session
  const { data: existingSessions } = await supabase
    .from('user_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (existingSessions && existingSessions.length > 0) {
    // Logout all existing sessions
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId);
  }

  const { error } = await supabase.from('user_sessions').insert({
    user_id: userId,
    session_token: sessionToken,
    ip_address: ipAddress,
    user_agent: userAgent,
    device_fingerprint: deviceFingerprint,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw error;

  return sessionToken;
}

export async function validateSession(sessionToken: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .eq('is_active', true)
    .single();

  if (error || !data) return false;

  const now = new Date();
  if (new Date(data.expires_at) < now) {
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', data.id);
    return false;
  }

  // Update last activity
  await supabase
    .from('user_sessions')
    .update({ last_activity_at: now.toISOString() })
    .eq('id', data.id);

  return true;
}

export async function endSession(sessionToken: string) {
  await supabase
    .from('user_sessions')
    .update({ is_active: false })
    .eq('session_token', sessionToken);
}

export async function checkSessionTimeout(sessionToken: string, timeoutMinutes: number = 30): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('last_activity_at')
    .eq('session_token', sessionToken)
    .single();

  if (error || !data) return false;

  const lastActivity = new Date(data.last_activity_at);
  const now = new Date();
  const minutesInactive = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

  if (minutesInactive > timeoutMinutes) {
    await endSession(sessionToken);
    return false;
  }

  return true;
}

// ============================================
// CSRF TOKEN MANAGEMENT
// ============================================

export async function generateCSRFToken(userId: string): Promise<string> {
  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await supabase.from('csrf_tokens').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  });

  return token;
}

export async function validateCSRFToken(userId: string, token: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('csrf_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('token', token)
    .eq('used', false)
    .single();

  if (error || !data) return false;

  if (new Date(data.expires_at) < new Date()) {
    return false;
  }

  // Mark token as used
  await supabase
    .from('csrf_tokens')
    .update({ used: true })
    .eq('id', data.id);

  return true;
}

// ============================================
// ENCRYPTION/DECRYPTION
// ============================================

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production';

export function encryptData(data: string): { encrypted: string; iv: string } {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY, { iv }).toString();
  return {
    encrypted,
    iv: iv.toString(),
  };
}

export function decryptData(encrypted: string, iv: string): string {
  const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export async function storeEncryptedData(
  userId: string,
  dataType: string,
  value: string
): Promise<void> {
  const { encrypted, iv } = encryptData(value);

  await supabase.from('encrypted_data').upsert(
    {
      user_id: userId,
      data_type: dataType,
      encrypted_value: encrypted,
      iv,
      encryption_key_id: 'v1',
    },
    { onConflict: 'user_id,data_type' }
  );
}

export async function retrieveEncryptedData(userId: string, dataType: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('encrypted_data')
    .select('encrypted_value, iv')
    .eq('user_id', userId)
    .eq('data_type', dataType)
    .single();

  if (error || !data) return null;

  return decryptData(data.encrypted_value, data.iv);
}

// ============================================
// SECURITY AUDIT LOGGING
// ============================================

export async function logSecurityEvent(
  userId: string | null,
  eventType: string,
  severity: 'info' | 'warning' | 'critical',
  description: string,
  metadata?: any
): Promise<void> {
  const ipAddress = await getClientIP();
  const userAgent = navigator.userAgent;

  await supabase.from('security_audit_log').insert({
    user_id: userId,
    event_type: eventType,
    severity,
    description,
    ip_address: ipAddress,
    user_agent: userAgent,
    metadata,
  });
}

export async function logFailedLogin(identifier: string, reason: string): Promise<void> {
  await logSecurityEvent(null, 'failed_login', 'warning', `Failed login attempt: ${reason}`, {
    identifier,
  });
}

export async function logSuccessfulLogin(userId: string): Promise<void> {
  await logSecurityEvent(userId, 'login', 'info', 'Successful login');
}

export async function logPasswordChange(userId: string): Promise<void> {
  await logSecurityEvent(userId, 'password_change', 'info', 'Password changed');
}

export async function log2FAEnabled(userId: string, method: string): Promise<void> {
  await logSecurityEvent(userId, '2fa_enabled', 'info', `2FA enabled via ${method}`);
}

export async function logSuspiciousActivity(
  userId: string,
  activityType: string,
  description: string
): Promise<void> {
  await logSecurityEvent(userId, 'suspicious_activity', 'critical', description, {
    activityType,
  });
}

// ============================================
// SECURITY ALERTS
// ============================================

export async function createSecurityAlert(
  userId: string,
  alertType: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  description: string,
  ipAddress?: string
): Promise<void> {
  await supabase.from('security_alerts').insert({
    user_id: userId,
    alert_type: alertType,
    severity,
    description,
    ip_address: ipAddress,
  });
}

// ============================================
// DEVICE FINGERPRINTING
// ============================================

export function generateDeviceFingerprint(): string {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
  };

  return CryptoJS.SHA256(JSON.stringify(fingerprint)).toString();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }
  return token;
}

export async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Pelo menos uma letra maiúscula');
  if (!/[a-z]/.test(password)) errors.push('Pelo menos uma letra minúscula');
  if (!/[0-9]/.test(password)) errors.push('Pelo menos um número');
  if (!/[!@#$%^&*]/.test(password)) errors.push('Pelo menos um caractere especial (!@#$%^&*)');

  return {
    valid: errors.length === 0,
    errors,
  };
}
