-- Allow inserting chapter questions (for edge function with service role)
CREATE POLICY "Service role can insert chapter questions"
ON public.chapter_questions FOR INSERT
WITH CHECK (true);

-- Allow inserting book chapters (for edge function with service role)
CREATE POLICY "Service role can insert book chapters"
ON public.book_chapters FOR INSERT
WITH CHECK (true);