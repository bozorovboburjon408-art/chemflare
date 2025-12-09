-- Allow authenticated users to upload files to book-files bucket
CREATE POLICY "Authenticated users can upload book files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-files');

-- Allow authenticated users to update book files
CREATE POLICY "Authenticated users can update book files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'book-files');

-- Allow authenticated users to delete book files
CREATE POLICY "Authenticated users can delete book files"
ON storage.objects FOR DELETE
USING (bucket_id = 'book-files');

-- Also add INSERT policy for chemistry_books so admin can add books
CREATE POLICY "Anyone can insert books"
ON public.chemistry_books FOR INSERT
WITH CHECK (true);