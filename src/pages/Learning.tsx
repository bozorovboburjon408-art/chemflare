import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  Brain,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ChemistryBook {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  difficulty_level: number | null;
  topic: string;
}

interface BookChapter {
  id: string;
  book_id: string;
  title: string;
  content: string;
  order_num: number;
}

interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: string;
  explanation: string;
}

interface UserProgress {
  current_level: number;
  total_points: number;
  completed_tasks: number;
}

const QUESTION_COUNTS = [3, 5, 10, 15, 20];

const Learning = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ 
    current_level: 0, 
    total_points: 0, 
    completed_tasks: 0 
  });
  const [books, setBooks] = useState<ChemistryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<ChemistryBook | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<{ selected: string; correct: string; isCorrect: boolean }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadBooks();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });
  };

  const loadUserData = async () => {
    try {
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (progressError) throw progressError;

      if (!progressData) {
        const { data: newProgress, error: createError } = await supabase
          .from('user_progress')
          .insert({ user_id: user!.id })
          .select()
          .single();

        if (createError) throw createError;
        setProgress({
          current_level: newProgress.current_level,
          total_points: newProgress.total_points,
          completed_tasks: newProgress.completed_tasks,
        });
      } else {
        setProgress({
          current_level: progressData.current_level,
          total_points: progressData.total_points,
          completed_tasks: progressData.completed_tasks,
        });
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
    }
  };

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chemistry_books')
        .select('*')
        .order('difficulty_level', { ascending: true });

      if (error) throw error;
      setBooks(data || []);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast({
        title: "Xato",
        description: "Kitoblarni yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectBook = async (book: ChemistryBook) => {
    setSelectedBook(book);
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('order_num');

      if (error) throw error;
      setChapters(data || []);
    } catch (error: any) {
      console.error('Error loading chapters:', error);
      toast({
        title: "Xato",
        description: "Bo'limlarni yuklashda xatolik",
        variant: "destructive",
      });
    }
  };

  const generateQuiz = async () => {
    if (!selectedBook || !selectedChapter) return;

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-book-quiz', {
        body: {
          bookTitle: selectedBook.title,
          chapterTitle: selectedChapter.title,
          chapterContent: selectedChapter.content,
          questionCount: questionCount,
        },
      });

      if (response.error) throw response.error;

      const data = response.data;
      if (data.questions && data.questions.length > 0) {
        // Shuffle questions
        const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
        setQuizQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setQuizComplete(false);
        setAnswers([]);
      } else {
        throw new Error("Savollar yaratilmadi");
      }
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast({
        title: "Xato",
        description: error.message || "Test yaratishda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const checkAnswer = async () => {
    if (!selectedAnswer || !quizQuestions[currentQuestionIndex]) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    
    setShowResult(true);
    setAnswers([...answers, { selected: selectedAnswer, correct: currentQuestion.correct, isCorrect }]);
    
    if (isCorrect) {
      setScore(score + 1);
      
      // Update user progress
      try {
        const newPoints = progress.total_points + 10;
        const newCompletedTasks = progress.completed_tasks + 1;
        const newLevel = Math.min(Math.floor(newCompletedTasks / 10), 10);

        await supabase
          .from('user_progress')
          .update({
            total_points: newPoints,
            completed_tasks: newCompletedTasks,
            current_level: newLevel,
          })
          .eq('user_id', user!.id);

        setProgress({
          current_level: newLevel,
          total_points: newPoints,
          completed_tasks: newCompletedTasks,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnswers([]);
    setSelectedChapter(null);
  };

  const goBack = () => {
    if (quizQuestions.length > 0) {
      resetQuiz();
    } else if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedBook) {
      setSelectedBook(null);
      setChapters([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Quiz complete view
  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-500/20' : percentage >= 50 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <Trophy className={`w-12 h-12 ${
                  percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`} />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Test yakunlandi!</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {score} / {quizQuestions.length} to'g'ri javob ({percentage}%)
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 bg-green-500/10">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{score}</p>
                  <p className="text-sm text-muted-foreground">To'g'ri</p>
                </Card>
                <Card className="p-4 bg-red-500/10">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{quizQuestions.length - score}</p>
                  <p className="text-sm text-muted-foreground">Noto'g'ri</p>
                </Card>
              </div>

              <div className="space-y-3 mb-8">
                {quizQuestions.map((q, idx) => (
                  <Card key={idx} className={`p-4 text-left ${
                    answers[idx]?.isCorrect ? 'border-green-500/50' : 'border-red-500/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      {answers[idx]?.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{idx + 1}. {q.question}</p>
                        {!answers[idx]?.isCorrect && (
                          <p className="text-xs text-muted-foreground">
                            To'g'ri: {q.correct}) {q.options[q.correct as keyof typeof q.options]}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetQuiz} className="flex-1">
                  Yangi test
                </Button>
                <Button onClick={() => { resetQuiz(); setSelectedBook(null); setChapters([]); }} className="flex-1">
                  Boshqa kitob
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Active quiz view
  if (quizQuestions.length > 0) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={goBack} size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Chiqish
              </Button>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {currentQuestionIndex + 1} / {quizQuestions.length}
              </Badge>
            </div>

            <Progress 
              value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
              className="h-2 mb-6" 
            />

            <Card className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                {currentQuestion.question}
              </h3>

              <div className="space-y-3 mb-6">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isSelected = selectedAnswer === key;
                  const isCorrect = key === currentQuestion.correct;
                  let buttonClass = "w-full p-4 text-left flex items-center gap-3 rounded-lg border-2 transition-all ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "border-green-500 bg-green-500/10";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "border-red-500 bg-red-500/10";
                    } else {
                      buttonClass += "border-muted opacity-50";
                    }
                  } else if (isSelected) {
                    buttonClass += "border-primary bg-primary/10";
                  } else {
                    buttonClass += "border-muted hover:border-primary/50";
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        showResult && isCorrect ? 'bg-green-500 text-white' :
                        showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-primary text-primary-foreground' :
                        'bg-muted'
                      }`}>
                        {key}
                      </span>
                      <span className="flex-1">{value}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResult && currentQuestion.explanation && (
                <Card className="p-4 mb-6 bg-muted/50">
                  <p className="text-sm">
                    <span className="font-semibold">Izoh:</span> {currentQuestion.explanation}
                  </p>
                </Card>
              )}

              {!showResult ? (
                <Button 
                  onClick={checkAnswer} 
                  disabled={!selectedAnswer}
                  className="w-full"
                  size="lg"
                >
                  Tekshirish
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="w-full" size="lg">
                  {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <>Keyingi savol <ChevronRight className="w-4 h-4 ml-2" /></>
                  ) : (
                    <>Natijalarni ko'rish <Trophy className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              )}
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Chapter selection with question count
  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>

            <Card className="p-6 md:p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Test yaratish</h2>
              <p className="text-muted-foreground mb-6">
                <span className="font-medium">{selectedBook?.title}</span>
                <br />
                {selectedChapter.title}
              </p>

              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-3">Savollar sonini tanlang:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUESTION_COUNTS.map((count) => (
                    <Button
                      key={count}
                      variant={questionCount === count ? "default" : "outline"}
                      onClick={() => setQuestionCount(count)}
                      size="lg"
                      className="min-w-[60px]"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={generateQuiz} 
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Test yaratilmoqda...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {questionCount} ta savol bilan testni boshlash
                  </>
                )}
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Chapter list view
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>

            <Card className="p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                  {selectedBook.author && (
                    <p className="text-muted-foreground">{selectedBook.author}</p>
                  )}
                  {selectedBook.description && (
                    <p className="text-sm text-muted-foreground mt-2">{selectedBook.description}</p>
                  )}
                </div>
              </div>
            </Card>

            <h3 className="text-xl font-semibold mb-4">Bo'limni tanlang:</h3>
            
            <div className="space-y-3">
              {chapters.map((chapter, idx) => (
                <Card
                  key={chapter.id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-primary">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{chapter.title}</h4>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main view - Book selection
  const progressPercentage = (progress.completed_tasks % 10) * 10;
  const nextLevelTasks = 10 - (progress.completed_tasks % 10);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Kimyo O'rganish
          </h1>
          <p className="text-muted-foreground mb-8">
            Kitoblardan AI yordamida test ishlang
          </p>

          {/* Progress Card */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Joriy daraja</span>
                </div>
                <p className="text-4xl font-bold text-primary">
                  {progress.current_level}
                  <span className="text-lg text-muted-foreground">/10</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Jami ballar</span>
                </div>
                <p className="text-4xl font-bold">{progress.total_points}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Bajarilgan savollar</span>
                </div>
                <p className="text-4xl font-bold">{progress.completed_tasks}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Keyingi darajagacha
                </span>
                <span className="text-sm font-semibold text-primary">
                  {nextLevelTasks} ta savol
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </Card>

          {/* Books Grid */}
          <h2 className="text-2xl font-semibold mb-4">Kitobni tanlang</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card
                key={book.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                onClick={() => selectBook(book)}
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                  {book.author && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {book.author}
                    </p>
                  )}
                  {book.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{book.topic}</Badge>
                    {book.difficulty_level !== null && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        Daraja {book.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Learning;
