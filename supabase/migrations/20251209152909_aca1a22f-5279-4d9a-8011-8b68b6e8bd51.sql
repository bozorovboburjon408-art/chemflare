-- Add DELETE policy for chemistry_books (admin can delete)
CREATE POLICY "Authenticated users can delete books"
ON public.chemistry_books FOR DELETE
USING (true);

-- Add UPDATE policy for chemistry_books
CREATE POLICY "Authenticated users can update books"
ON public.chemistry_books FOR UPDATE
USING (true);