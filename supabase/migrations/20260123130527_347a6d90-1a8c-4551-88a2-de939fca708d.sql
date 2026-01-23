-- Grant admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('d17b67ee-6686-4a37-9c63-cfb31911f236', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;