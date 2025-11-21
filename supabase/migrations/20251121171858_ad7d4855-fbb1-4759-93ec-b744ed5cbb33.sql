-- Create chemistry tasks table with difficulty levels
CREATE TABLE public.chemistry_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 0 AND difficulty_level <= 10),
  points INTEGER NOT NULL DEFAULT 10,
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_level INTEGER NOT NULL DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 10),
  total_points INTEGER NOT NULL DEFAULT 0,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create completed tasks junction table
CREATE TABLE public.completed_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.chemistry_tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- Create chemistry books table
CREATE TABLE public.chemistry_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  cover_image_url TEXT,
  difficulty_level INTEGER CHECK (difficulty_level >= 0 AND difficulty_level <= 10),
  topic TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create book chapters table
CREATE TABLE public.book_chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.chemistry_books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapter questions table
CREATE TABLE public.chapter_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.book_chapters(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chemistry_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chemistry_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chemistry_tasks (public read)
CREATE POLICY "Anyone can view chemistry tasks"
  ON public.chemistry_tasks FOR SELECT
  USING (true);

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for completed_tasks
CREATE POLICY "Users can view their completed tasks"
  ON public.completed_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their completed tasks"
  ON public.completed_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chemistry_books (public read)
CREATE POLICY "Anyone can view chemistry books"
  ON public.chemistry_books FOR SELECT
  USING (true);

-- RLS Policies for book_chapters (public read)
CREATE POLICY "Anyone can view book chapters"
  ON public.book_chapters FOR SELECT
  USING (true);

-- RLS Policies for chapter_questions (public read)
CREATE POLICY "Anyone can view chapter questions"
  ON public.chapter_questions FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_chemistry_tasks_difficulty ON public.chemistry_tasks(difficulty_level);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_completed_tasks_user_id ON public.completed_tasks(user_id);
CREATE INDEX idx_completed_tasks_task_id ON public.completed_tasks(task_id);
CREATE INDEX idx_book_chapters_book_id ON public.book_chapters(book_id);
CREATE INDEX idx_chapter_questions_chapter_id ON public.chapter_questions(chapter_id);

-- Function to update user progress
CREATE OR REPLACE FUNCTION public.update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_progress();

-- Insert sample chemistry tasks
INSERT INTO public.chemistry_tasks (title, description, question, correct_answer, explanation, difficulty_level, points, topic) VALUES
('Atom tuzilishi', 'Atomning asosiy qismlari haqida savol', 'Atomning markaziy qismi nima deb ataladi?', 'Yadro', 'Atom yadrosi atomning markazida joylashgan bo''lib, proton va neytronlardan iborat.', 0, 10, 'Atom tuzilishi'),
('Kimyoviy elementlar', 'Davriy jadval haqida asosiy bilim', 'Davriy jadvalning birinchi elementi qaysi?', 'Vodorod', 'Vodorod (H) eng yengil va eng sodda element bo''lib, atom raqami 1 ga teng.', 0, 10, 'Davriy jadval'),
('Molekula', 'Molekula tushunchasi', 'Bir xil atomlardan tashkil topgan modda nima deb ataladi?', 'Oddiy modda', 'Oddiy moddalar bir xil atomlardan tashkil topgan, masalan O2, H2.', 1, 15, 'Moddalar'),
('Kimyoviy bog''lanish', 'Atomlar orasidagi bog''lanish', 'Atomlar orasida elektronlar almashish orqali hosil bo''ladigan bog''lanish qanday ataladi?', 'Kovalent bog''lanish', 'Kovalent bog''lanish atomlar orasida elektronlar umumiylashuvi natijasida hosil bo''ladi.', 2, 20, 'Kimyoviy bog''lanish'),
('Oksidlanish', 'Oksidlanish reaksiyalari', 'Moddaning kislorod bilan birikishi qanday jarayon?', 'Oksidlanish', 'Oksidlanish - bu moddaning kislorod bilan birikishi yoki elektronlarni yo''qotishi.', 3, 25, 'Kimyoviy reaksiyalar');

-- Insert sample chemistry books
INSERT INTO public.chemistry_books (title, author, description, difficulty_level, topic) VALUES
('Kimyo asoslari', 'Akademik dastur', 'Kimyoning asosiy tushunchalari va qonunlari bilan tanishish', 0, 'Umumiy kimyo'),
('Organik kimyo', 'Professor Aliyev', 'Organik birikmalar va ularning xossalari', 5, 'Organik kimyo'),
('Anorganik kimyo', 'Dotsent Karimov', 'Anorganik moddalar va ularning reaksiyalari', 3, 'Anorganik kimyo');