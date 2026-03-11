-- ============================================
-- SECURITY FEATURES MIGRATION
-- ============================================

-- 1. TWO-FACTOR AUTHENTICATION (2FA)
CREATE TABLE IF NOT EXISTS public.two_factor_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  enabled boolean DEFAULT false,
  method text CHECK (method IN ('sms', 'email', 'authenticator')),
  secret text, -- For authenticator app
  backup_codes text[], -- Array of backup codes
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.two_factor_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own 2FA" ON public.two_factor_auth FOR ALL TO authenticated USING (user_id = auth.uid());

-- 2. 2FA VERIFICATION CODES
CREATE TABLE IF NOT EXISTS public.two_factor_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  attempts integer DEFAULT 0,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.two_factor_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own codes" ON public.two_factor_codes FOR ALL TO authenticated USING (user_id = auth.uid());

-- 3. RATE LIMITING
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  action text NOT NULL, -- 'login', 'signup', 'password_reset', etc
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limits_user_action ON public.rate_limits(user_id, action);
CREATE INDEX idx_rate_limits_ip_action ON public.rate_limits(ip_address, action);

-- 4. SESSION MANAGEMENT
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token text NOT NULL UNIQUE,
  ip_address text NOT NULL,
  user_agent text NOT NULL,
  device_fingerprint text,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions" ON public.user_sessions FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);

-- 5. CSRF TOKENS
CREATE TABLE IF NOT EXISTS public.csrf_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL UNIQUE,
  used boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_csrf_tokens_user_id ON public.csrf_tokens(user_id);
CREATE INDEX idx_csrf_tokens_token ON public.csrf_tokens(token);

-- 6. SECURITY AUDIT LOG
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'login', 'failed_login', 'logout', 'password_change', '2fa_enabled', 'suspicious_activity', etc
  severity text CHECK (severity IN ('info', 'warning', 'critical')),
  description text,
  ip_address text,
  user_agent text,
  device_fingerprint text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX idx_security_audit_event_type ON public.security_audit_log(event_type);
CREATE INDEX idx_security_audit_severity ON public.security_audit_log(severity);
CREATE INDEX idx_security_audit_created_at ON public.security_audit_log(created_at);

-- 7. ENCRYPTED DATA STORAGE
CREATE TABLE IF NOT EXISTS public.encrypted_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_type text NOT NULL, -- 'phone', 'email', 'ssn', etc
  encrypted_value text NOT NULL,
  encryption_key_id text NOT NULL,
  iv text NOT NULL, -- Initialization vector
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.encrypted_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own encrypted data" ON public.encrypted_data FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE INDEX idx_encrypted_data_user_id ON public.encrypted_data(user_id);

-- 8. SUSPICIOUS ACTIVITY ALERTS
CREATE TABLE IF NOT EXISTS public.security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type text NOT NULL, -- 'unusual_location', 'multiple_failed_logins', 'new_device', 'data_access', etc
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description text,
  ip_address text,
  location text,
  action_required boolean DEFAULT true,
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own alerts" ON public.security_alerts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users update own alerts" ON public.security_alerts FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 9. BLOCKED IPS AND USERS
CREATE TABLE IF NOT EXISTS public.security_blocklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_type text CHECK (block_type IN ('ip', 'user', 'email')),
  block_value text NOT NULL,
  reason text,
  blocked_by uuid REFERENCES auth.users(id),
  blocked_until timestamptz,
  permanent boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocklist_value ON public.security_blocklist(block_value);
CREATE INDEX idx_blocklist_type ON public.security_blocklist(block_type);

-- 10. DATA RETENTION POLICY
CREATE TABLE IF NOT EXISTS public.data_retention_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  retain_logs_days integer DEFAULT 90,
  retain_backups_days integer DEFAULT 30,
  auto_delete_inactive_days integer DEFAULT 365,
  last_activity_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.data_retention_policy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own policy" ON public.data_retention_policy FOR ALL TO authenticated USING (user_id = auth.uid());

-- 11. CONSENT AND PRIVACY
CREATE TABLE IF NOT EXISTS public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type text NOT NULL, -- 'terms_of_service', 'privacy_policy', 'marketing', 'analytics', etc
  version text NOT NULL,
  accepted boolean NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own consents" ON public.user_consents FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 12. RIGHT TO BE FORGOTTEN (GDPR/LGPD)
CREATE TABLE IF NOT EXISTS public.deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  status text CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  scheduled_deletion_at timestamptz,
  completed_at timestamptz,
  created_by uuid REFERENCES auth.users(id),
  notes text
);

CREATE INDEX idx_deletion_requests_user_id ON public.deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON public.deletion_requests(status);

-- 13. BACKUP METADATA
CREATE TABLE IF NOT EXISTS public.backup_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id text NOT NULL UNIQUE,
  backup_type text NOT NULL, -- 'full', 'incremental', 'differential'
  status text CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  size_bytes bigint,
  compressed_size_bytes bigint,
  encryption_algorithm text,
  checksum text,
  retention_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- 14. SECURITY SETTINGS
CREATE TABLE IF NOT EXISTS public.security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  require_2fa boolean DEFAULT false,
  session_timeout_minutes integer DEFAULT 30,
  allow_multiple_sessions boolean DEFAULT false,
  ip_whitelist text[], -- Array of allowed IPs
  ip_blacklist text[], -- Array of blocked IPs
  require_password_change_days integer DEFAULT 90,
  last_password_change_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings" ON public.security_settings FOR ALL TO authenticated USING (user_id = auth.uid());

-- TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_two_factor_auth_updated_at BEFORE UPDATE ON public.two_factor_auth
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_encrypted_data_updated_at BEFORE UPDATE ON public.encrypted_data
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_retention_policy_updated_at BEFORE UPDATE ON public.data_retention_policy
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CLEANUP JOB: Remove expired CSRF tokens (run daily)
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.csrf_tokens WHERE expires_at < now();
  DELETE FROM public.two_factor_codes WHERE expires_at < now();
  DELETE FROM public.rate_limits WHERE blocked_until < now();
END;
$$ LANGUAGE plpgsql;

-- CLEANUP JOB: Archive old audit logs (run weekly)
CREATE OR REPLACE FUNCTION public.archive_old_audit_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.security_audit_log 
  WHERE created_at < now() - interval '90 days'
  AND severity = 'info';
END;
$$ LANGUAGE plpgsql;
