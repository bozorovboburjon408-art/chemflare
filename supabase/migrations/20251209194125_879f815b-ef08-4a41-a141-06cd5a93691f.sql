-- Delete duplicate user_progress records, keeping only the one with highest total_points
DELETE FROM public.user_progress a
USING public.user_progress b
WHERE a.user_id = b.user_id 
  AND a.id < b.id;

-- Now add unique constraint on user_id column
ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_id_key UNIQUE (user_id);