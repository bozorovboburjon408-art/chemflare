import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2, CheckCircle2, XCircle, Trophy, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  completed_at: string | null;
}

interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  user_answer: string | null;
  explanation: string | null;
  order_num: number;
}

const Quiz = () => {
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadQuizzes();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const loadQuizzes = async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading quizzes:', error);
      toast({
        title: "Xato",
        description: "Testlarni yuklashda xatolik",
        variant: "destructive",
      });
      return;
    }

    setQuizzes(data || []);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Xato",
        description: "Faqat rasm fayllari qabul qilinadi",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Xato",
            description: "Tizimga kirish talab qilinadi",
            variant: "destructive",
          });
          return;
        }

        const { data, error } = await supabase.functions.invoke('process-quiz-image', {
          body: {
            imageBase64: base64,
            title: uploadTitle || undefined,
          },
        });

        if (error) {
          throw error;
        }

        if (data.error) {
          throw new Error(data.error);
        }

        toast({
          title: "Muvaffaqiyatli!",
          description: `${data.questionCount} ta savol yaratildi`,
        });

        setUploadTitle("");
        e.target.value = "";
        loadQuizzes();
      };

      reader.onerror = () => {
        throw new Error("Rasmni o'qishda xatolik");
      };

      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Xato",
        description: error.message || "Test yaratishda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const startQuiz = async (quizId: string) => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_num');

    if (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Xato",
        description: "Savollarni yuklashda xatolik",
        variant: "destructive",
      });
      return;
    }

    setQuestions(data || []);
    setCurrentQuiz(quizId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
  };

  const handleAnswer = async () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];

    // Update answer in database
    await supabase
      .from('questions')
      .update({ user_answer: selectedAnswer })
      .eq('id', currentQuestion.id);

    // Update local state
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      user_answer: selectedAnswer,
    };
    setQuestions(updatedQuestions);

    // Move to next question or show results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Mark quiz as completed
      await supabase
        .from('quizzes')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', currentQuiz);

      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const correct = questions.filter(q => q.user_answer === q.correct_answer).length;
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);
    loadQuizzes();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Quiz taking view
  if (currentQuiz && !showResults) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Savol {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {currentQuestion?.question_text}
              </h2>

              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionKey = `option_${option.toLowerCase()}` as keyof Question;
                  const optionText = currentQuestion?.[optionKey] as string;

                  return (
                    <button
                      key={option}
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <span className="font-semibold text-primary mr-3">{option}.</span>
                      {optionText}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={resetQuiz}
                >
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Keyingisi" : "Yakunlash"}
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const score = calculateScore();

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-3xl font-bold mb-2">Test yakunlandi!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Sizning natijangiz
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-green-500">{score.correct}</p>
                  <p className="text-sm text-muted-foreground">To'g'ri</p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold text-red-500">{score.total - score.correct}</p>
                  <p className="text-sm text-muted-foreground">Noto'g'ri</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold text-primary">{score.percentage}%</p>
                  <p className="text-sm text-muted-foreground">Ball</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-left">Savol va javoblar:</h3>
                {questions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-lg border-2 text-left ${
                      q.user_answer === q.correct_answer
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {q.user_answer === q.correct_answer ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          {index + 1}. {q.question_text}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Sizning javobingiz:</span>{' '}
                            <span className={q.user_answer === q.correct_answer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {q.user_answer}
                            </span>
                          </p>
                          {q.user_answer !== q.correct_answer && (
                            <p>
                              <span className="text-muted-foreground">To'g'ri javob:</span>{' '}
                              <span className="text-green-600 dark:text-green-400">{q.correct_answer}</span>
                            </p>
                          )}
                          {q.explanation && (
                            <p className="text-muted-foreground italic mt-2">
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={resetQuiz} size="lg">
                Testlarga qaytish
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Main quiz list view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Test va Viktorina
            </h1>
            <p className="text-muted-foreground">
              Test rasmini yuklang yoki mavjud testlarni yeching
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Yangi test yaratish</h2>
          <div className="space-y-4">
            <Input
              placeholder="Test nomi (ixtiyoriy)"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              disabled={isUploading}
            />
            
            <label htmlFor="file-upload" className="block">
              <Button 
                variant="default" 
                size="lg"
                disabled={isUploading}
                className="w-full cursor-pointer"
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI tahlil qilmoqda...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Test rasmini yuklash
                    </>
                  )}
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            <p className="text-sm text-muted-foreground text-center">
              AI test rasmini tahlil qilib, savollarni avtomatik yaratadi
            </p>
          </div>
        </Card>

        {/* Quizzes List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sizning testlaringiz</h2>
          
          {quizzes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Hozircha testlar yo'q. Yuqorida rasm yuklab test yarating!
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => startQuiz(quiz.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    {quiz.completed_at && (
                      <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Bajarilgan
                      </Badge>
                    )}
                  </div>
                  
                  {quiz.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {quiz.description}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {new Date(quiz.created_at).toLocaleDateString('uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
