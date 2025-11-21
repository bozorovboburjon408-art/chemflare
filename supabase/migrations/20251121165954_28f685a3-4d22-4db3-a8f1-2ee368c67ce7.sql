-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  user_answer TEXT CHECK (user_answer IS NULL OR user_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  order_num INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Users can view their own quizzes"
  ON public.quizzes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON public.quizzes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON public.quizzes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for questions
CREATE POLICY "Users can view questions from their quizzes"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for their quizzes"
  ON public.questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions from their quizzes"
  ON public.questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from their quizzes"
  ON public.questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.user_id = auth.uid()
    )
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON public.quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON public.questions(quiz_id, order_num);