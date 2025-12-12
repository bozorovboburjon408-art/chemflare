-- Create experiments table
CREATE TABLE public.experiments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;

-- Anyone can view experiments
CREATE POLICY "Anyone can view experiments" 
ON public.experiments 
FOR SELECT 
USING (true);

-- Anyone can insert experiments (admin check is done in code)
CREATE POLICY "Anyone can insert experiments" 
ON public.experiments 
FOR INSERT 
WITH CHECK (true);

-- Anyone can delete experiments (admin check is done in code)
CREATE POLICY "Anyone can delete experiments" 
ON public.experiments 
FOR DELETE 
USING (true);

-- Create storage bucket for experiment videos
INSERT INTO storage.buckets (id, name, public, file_size_limit) 
VALUES ('experiment-files', 'experiment-files', true, 52428800);

-- Storage policies for experiment files
CREATE POLICY "Anyone can view experiment files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'experiment-files');

CREATE POLICY "Anyone can upload experiment files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'experiment-files');

CREATE POLICY "Anyone can delete experiment files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'experiment-files');