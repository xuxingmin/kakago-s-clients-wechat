
-- Create trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  random_suffix TEXT;
BEGIN
  -- Generate a random 5-char suffix for WeChat-style nickname
  random_suffix := upper(substr(md5(random()::text), 1, 5));
  
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    '微信用户_' || random_suffix
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
