-- Create storage bucket for developer avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('developer-avatars', 'developer-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to avatars
CREATE POLICY "Public can view developer avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'developer-avatars');

-- Create table to store developer info
CREATE TABLE public.developers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  telegram TEXT,
  role TEXT,
  type TEXT NOT NULL CHECK (type IN ('member', 'mentor')),
  avatar_url TEXT,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

-- Everyone can view developers
CREATE POLICY "Anyone can view developers"
ON public.developers FOR SELECT
USING (true);

-- Insert default team members
INSERT INTO public.developers (name, telegram, type, order_num) VALUES
  ('Azamat Karimov', '@Azamat3434', 'member', 1),
  ('Bozorov Boburjon', '@Boburjon2108', 'member', 2),
  ('Binaqulov Sohibjon', '@sohib_2210', 'member', 3),
  ('Baxodirov Azizbek', '@bakhodirov_o6_o7', 'member', 4),
  ('Absalomov Shohijahon', '@renox_17', 'member', 5),
  ('Sardor Zarifov', '@Sardor_Zarifov', 'member', 6);

-- Insert default mentors
INSERT INTO public.developers (name, role, type, order_num) VALUES
  ('Jo''rayev I.', 'G''oya beruvchi ustoz', 'mentor', 1),
  ('X. Kamola', 'Qo''llab-quvvatlovchi ustoz', 'mentor', 2),
  ('Jamol aka', 'Yordam beruvchi ustoz', 'mentor', 3),
  ('Firdavs aka', 'Yordam beruvchi ustoz', 'mentor', 4);