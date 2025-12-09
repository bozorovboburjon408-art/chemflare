-- Create storage bucket for book files (PDFs and cover images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-files', 'book-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view files
CREATE POLICY "Anyone can view book files"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-files');

-- Add pdf_url column to chemistry_books table
ALTER TABLE public.chemistry_books
ADD COLUMN IF NOT EXISTS pdf_url TEXT;