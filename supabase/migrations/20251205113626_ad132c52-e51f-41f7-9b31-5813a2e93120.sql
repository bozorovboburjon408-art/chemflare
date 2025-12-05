-- Allow anyone to upload to developer-avatars bucket (for migration)
CREATE POLICY "Anyone can upload developer avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'developer-avatars');

-- Allow anyone to update developer avatars
CREATE POLICY "Anyone can update developer avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'developer-avatars');