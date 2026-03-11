
-- Update app_role enum to include 'creator' and 'master'
ALTER TYPE public.app_role ADD VALUE 'creator';
ALTER TYPE public.app_role ADD VALUE 'master';

-- Note: The existing roles are: 'admin', 'player'
-- New roles: 'creator', 'master'
-- A user can have multiple roles
