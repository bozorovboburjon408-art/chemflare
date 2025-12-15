import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2, CheckCircle2, XCircle, Trophy, LogOut, Shuffle, Brain, Sparkles, ChevronLeft, ChevronRight, Pencil, Trash2, MoreVertical, X, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

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

interface AIQuizQuestion {
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

const QUESTION_COUNTS = [5, 10, 15, 20, 25, 30];
const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Oson', description: 'Asosiy tushunchalar' },
  { value: 'medium', label: "O'rtacha", description: 'Amaliy masalalar' },
  { value: 'hard', label: 'Qiyin', description: 'Murakkab va rasmli' },
];

const Quiz = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [questionsImages, setQuestionsImages] = useState<string[]>([]);
  const [answersImages, setAnswersImages] = useState<string[]>([]);
  
  // AI Quiz states
  const [aiQuizMode, setAiQuizMode] = useState(false);
  const [aiQuizQuestions, setAiQuizQuestions] = useState<AIQuizQuestion[]>([]);
  const [aiCurrentIndex, setAiCurrentIndex] = useState(0);
  const [aiSelectedAnswer, setAiSelectedAnswer] = useState<string | null>(null);
  const [aiShowResult, setAiShowResult] = useState(false);
  const [aiScore, setAiScore] = useState(0);
  const [aiQuizComplete, setAiQuizComplete] = useState(false);
  const [aiAnswers, setAiAnswers] = useState<{ selected: string; correct: string; isCorrect: boolean }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  
  // Edit quiz states
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadQuizzes();
    }
  }, [user]);

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

  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
  const MAX_FILES = 10;

  const handleFileUpload = async (type: 'questions' | 'answers', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check number of files
    if (files.length > MAX_FILES) {
      toast({
        title: "Xato",
        description: `Maksimum ${MAX_FILES} ta fayl yuklash mumkin`,
        variant: "destructive",
      });
      return;
    }

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Xato",
          description: `"${file.name}" - faqat rasm fayllari qabul qilinadi`,
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Xato",
          description: `"${file.name}" - fayl hajmi 2GB dan oshmasligi kerak`,
          variant: "destructive",
        });
        return;
      }
    }

    // Read all files
    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error("Rasmni o'qishda xatolik"));
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Images: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await readFile(files[i]);
        base64Images.push(base64);
      }

      if (type === 'questions') {
        setQuestionsImages(base64Images);
        toast({
          title: "Yuklandi",
          description: `${base64Images.length} ta savollar rasmi yuklandi. Endi javoblar rasmini yuklang.`,
        });
      } else {
        setAnswersImages(base64Images);
        toast({
          title: "Yuklandi",
          description: `${base64Images.length} ta javoblar rasmi yuklandi. Rasmlar tayyor.`,
        });
      }
      e.target.value = "";
    } catch (error) {
      toast({
        title: "Xato",
        description: "Rasmlarni o'qishda xatolik",
        variant: "destructive",
      });
    }
  };

  const createQuiz = async () => {
    if (questionsImages.length === 0 || answersImages.length === 0) {
      toast({
        title: "Xato",
        description: "Iltimos, ikkala turdagi rasmlarni ham yuklang",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Check auth
      if (!user) {
        toast({
          title: "Xato",
          description: "Tizimga kirish talab qilinadi",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('process-quiz-image', {
        body: {
          imageBase64: questionsImages[0],
          answersImageBase64: answersImages[0],
          questionsImages: questionsImages,
          answersImages: answersImages,
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
      setQuestionsImages([]);
      setAnswersImages([]);
      loadQuizzes();
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

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleQuestion = (question: Question): Question => {
    const options = [
      { key: 'A', value: question.option_a },
      { key: 'B', value: question.option_b },
      { key: 'C', value: question.option_c },
      { key: 'D', value: question.option_d },
    ];

    const correctOption = options.find(opt => opt.key === question.correct_answer);
    const shuffledOptions = shuffleArray(options);

    const newCorrectAnswer = shuffledOptions.findIndex(
      opt => opt.value === correctOption?.value
    );

    return {
      ...question,
      option_a: shuffledOptions[0].value,
      option_b: shuffledOptions[1].value,
      option_c: shuffledOptions[2].value,
      option_d: shuffledOptions[3].value,
      correct_answer: ['A', 'B', 'C', 'D'][newCorrectAnswer],
    };
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

    // Shuffle questions and their answers
    const shuffledQuestions = shuffleArray(data || []).map(q => shuffleQuestion(q));

    setQuestions(shuffledQuestions);
    setCurrentQuiz(quizId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResults(false);

    toast({
      title: "Test boshlandi",
      description: "Savollar va javoblar tasodifiy tartibda ko'rsatiladi",
    });
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

  // AI Quiz functions
  const generateAiQuiz = async () => {
    setIsGenerating(true);
    try {
      const topicText = aiTopic.trim() || 'Umumiy kimyo - turli mavzular';
      
      const response = await supabase.functions.invoke('generate-book-quiz', {
        body: {
          bookTitle: 'AI Test',
          chapterTitle: topicText,
          chapterContent: `Kimyo bo'yicha "${topicText}" mavzusida test savollarini tuzish. Savollar turli xil bo'lsin: nazariy, amaliy, hisoblash. Kimyoviy reaksiyalar, formulalar, xossalar, qonunlar haqida.`,
          questionCount: aiQuestionCount,
          difficulty: aiDifficulty,
        },
      });

      if (response.error) throw response.error;

      const data = response.data;
      if (data.questions && data.questions.length > 0) {
        const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
        setAiQuizQuestions(shuffled);
        setAiCurrentIndex(0);
        setAiSelectedAnswer(null);
        setAiShowResult(false);
        setAiScore(0);
        setAiQuizComplete(false);
        setAiAnswers([]);
        setAiQuizMode(true);
      } else {
        throw new Error("Savollar yaratilmadi");
      }
    } catch (error: any) {
      console.error('Error generating AI quiz:', error);
      toast({
        title: "Xato",
        description: error.message || "Test yaratishda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiAnswerSelect = (answer: string) => {
    if (aiShowResult) return;
    setAiSelectedAnswer(answer);
  };

  const checkAiAnswer = () => {
    if (!aiSelectedAnswer || !aiQuizQuestions[aiCurrentIndex]) return;

    const currentQuestion = aiQuizQuestions[aiCurrentIndex];
    const isCorrect = aiSelectedAnswer === currentQuestion.correct;
    
    setAiShowResult(true);
    setAiAnswers([...aiAnswers, { selected: aiSelectedAnswer, correct: currentQuestion.correct, isCorrect }]);
    
    if (isCorrect) {
      setAiScore(aiScore + 1);
    }
  };

  const nextAiQuestion = () => {
    if (aiCurrentIndex < aiQuizQuestions.length - 1) {
      setAiCurrentIndex(aiCurrentIndex + 1);
      setAiSelectedAnswer(null);
      setAiShowResult(false);
    } else {
      setAiQuizComplete(true);
    }
  };

  const resetAiQuiz = () => {
    setAiQuizMode(false);
    setAiQuizQuestions([]);
    setAiCurrentIndex(0);
    setAiSelectedAnswer(null);
    setAiShowResult(false);
    setAiScore(0);
    setAiQuizComplete(false);
    setAiAnswers([]);
  };

  // Edit quiz functions
  const startEditingQuiz = (quiz: Quiz, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingQuizId(quiz.id);
    setEditingTitle(quiz.title);
  };

  const cancelEditing = () => {
    setEditingQuizId(null);
    setEditingTitle('');
  };

  const saveQuizTitle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingQuizId || !editingTitle.trim()) return;

    const { error } = await supabase
      .from('quizzes')
      .update({ title: editingTitle.trim() })
      .eq('id', editingQuizId);

    if (error) {
      toast({
        title: "Xato",
        description: "Test nomini o'zgartirishda xatolik",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Muvaffaqiyatli",
      description: "Test nomi o'zgartirildi",
    });

    setEditingQuizId(null);
    setEditingTitle('');
    loadQuizzes();
  };

  const confirmDeleteQuiz = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteQuizId(quizId);
  };

  const deleteQuiz = async () => {
    if (!deleteQuizId) return;

    // First delete questions
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('quiz_id', deleteQuizId);

    if (questionsError) {
      toast({
        title: "Xato",
        description: "Test savollarini o'chirishda xatolik",
        variant: "destructive",
      });
      return;
    }

    // Then delete quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', deleteQuizId);

    if (quizError) {
      toast({
        title: "Xato",
        description: "Testni o'chirishda xatolik",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Muvaffaqiyatli",
      description: "Test o'chirildi",
    });

    setDeleteQuizId(null);
    loadQuizzes();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // AI Quiz taking view
  if (aiQuizMode && aiQuizQuestions.length > 0 && !aiQuizComplete) {
    const currentQuestion = aiQuizQuestions[aiCurrentIndex];
    const progress = ((aiCurrentIndex + 1) / aiQuizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={resetAiQuiz} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Savol {aiCurrentIndex + 1} / {aiQuizQuestions.length}
                </span>
                <Badge variant="outline">
                  Ball: {aiScore}
                </Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isSelected = aiSelectedAnswer === key;
                  const isCorrect = key === currentQuestion.correct;

                  return (
                    <button
                      key={key}
                      onClick={() => handleAiAnswerSelect(key)}
                      disabled={aiShowResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                        aiShowResult && isCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : aiShowResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-500/10'
                          : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        aiShowResult && isCorrect ? 'bg-green-500 text-white' :
                        aiShowResult && isSelected && !isCorrect ? 'bg-red-500 text-white' :
                        isSelected ? 'bg-primary text-primary-foreground' :
                        'bg-muted'
                      }`}>
                        {key}
                      </span>
                      <span className="flex-1">{value}</span>
                      {aiShowResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {aiShowResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {aiShowResult && currentQuestion.explanation && (
                <Card className="p-4 mb-6 mt-4 bg-muted/50">
                  <p className="text-sm">
                    <span className="font-semibold">Izoh:</span> {currentQuestion.explanation}
                  </p>
                </Card>
              )}

              {!aiShowResult ? (
                <Button 
                  onClick={checkAiAnswer} 
                  disabled={!aiSelectedAnswer}
                  className="w-full mt-6"
                  size="lg"
                >
                  Tekshirish
                </Button>
              ) : (
                <Button onClick={nextAiQuestion} className="w-full mt-6" size="lg">
                  {aiCurrentIndex < aiQuizQuestions.length - 1 ? (
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

  // AI Quiz complete view
  if (aiQuizComplete) {
    const percentage = Math.round((aiScore / aiQuizQuestions.length) * 100);
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
                {aiScore} / {aiQuizQuestions.length} to'g'ri javob ({percentage}%)
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 bg-green-500/10">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-500">{aiScore}</p>
                  <p className="text-sm text-muted-foreground">To'g'ri</p>
                </Card>
                <Card className="p-4 bg-red-500/10">
                  <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-500">{aiQuizQuestions.length - aiScore}</p>
                  <p className="text-sm text-muted-foreground">Noto'g'ri</p>
                </Card>
              </div>

              <Button onClick={resetAiQuiz} size="lg">
                Testlarga qaytish
              </Button>
            </Card>
          </div>
        </main>
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
              Test rasmini yuklang, AI test yarating yoki mavjud testlarni yeching
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Chiqish
          </Button>
        </div>

        <Tabs defaultValue="upload" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Rasmdan test
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Test
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Rasmdan test yaratish</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Test nomi (ixtiyoriy)"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  disabled={isUploading}
                />
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="questions-upload" className="block">
                      <Button 
                        variant={questionsImages.length > 0 ? "outline" : "default"}
                        size="lg"
                        disabled={isUploading}
                        className="w-full cursor-pointer"
                        asChild
                      >
                        <span>
                          <Upload className="w-5 h-5 mr-2" />
                          {questionsImages.length > 0 
                            ? `Savollar yuklandi (${questionsImages.length} ta) ✓` 
                            : "1. Savollar rasmlarini yuklash"}
                        </span>
                      </Button>
                      <input
                        id="questions-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload('questions', e)}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div>
                    <label htmlFor="answers-upload" className="block">
                      <Button 
                        variant={answersImages.length > 0 ? "outline" : "default"}
                        size="lg"
                        disabled={isUploading || questionsImages.length === 0}
                        className="w-full cursor-pointer"
                        asChild
                      >
                        <span>
                          <Upload className="w-5 h-5 mr-2" />
                          {answersImages.length > 0 
                            ? `Javoblar yuklandi (${answersImages.length} ta) ✓` 
                            : "2. Javoblar rasmlarini yuklash"}
                        </span>
                      </Button>
                      <input
                        id="answers-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload('answers', e)}
                        className="hidden"
                        disabled={isUploading || questionsImages.length === 0}
                      />
                    </label>
                  </div>
                </div>

                <Button
                  onClick={createQuiz}
                  disabled={isUploading || questionsImages.length === 0 || answersImages.length === 0}
                  size="lg"
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI tahlil qilmoqda...
                    </>
                  ) : (
                    "Test yaratish"
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  AI ikkala rasmni tahlil qilib, test savollarini va to'g'ri javoblarni avtomatik aniqlaydi.
                  <br />
                  <span className="text-xs">Maksimum 10 ta fayl, har biri 30MB gacha</span>
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ai">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-2">AI Test Yaratish</h2>
              <p className="text-muted-foreground text-center mb-8">
                AI sizga kimyo bo'yicha test savollarini yaratib beradi
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Mavzu (ixtiyoriy)</label>
                  <Textarea
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="Masalan: Organik kimyo, Metallar, pH va kislotalar, Elektroliz..."
                    className="min-h-[80px] resize-none"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Bo'sh qoldirsangiz, turli mavzulardan savollar beriladi</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Qiyinlik darajasi:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <Button
                        key={level.value}
                        variant={aiDifficulty === level.value ? "default" : "outline"}
                        onClick={() => setAiDifficulty(level.value)}
                        className="min-w-[100px]"
                        disabled={isGenerating}
                      >
                        <div className="text-center">
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs opacity-70">{level.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Savollar soni:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {QUESTION_COUNTS.map((count) => (
                      <Button
                        key={count}
                        variant={aiQuestionCount === count ? "default" : "outline"}
                        onClick={() => setAiQuestionCount(count)}
                        size="lg"
                        className="min-w-[50px]"
                        disabled={isGenerating}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={generateAiQuiz} 
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
                      {aiQuestionCount} ta savol bilan testni boshlash
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quizzes List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sizning testlaringiz</h2>
          
          {quizzes.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Hozircha testlar yo'q. Yuqorida rasm yuklab yoki AI orqali test yarating!
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={() => editingQuizId !== quiz.id && startQuiz(quiz.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    {editingQuizId === quiz.id ? (
                      <div className="flex items-center gap-2 flex-1 mr-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="h-8"
                          autoFocus
                        />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveQuizTitle}>
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); cancelEditing(); }}>
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    )}
                    
                    {editingQuizId !== quiz.id && (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-primary/10 border-primary/30">
                          <Shuffle className="w-3 h-3 mr-1" />
                          Aralash
                        </Badge>
                        {quiz.completed_at && (
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Bajarilgan
                          </Badge>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => startEditingQuiz(quiz, e as any)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Nomini o'zgartirish
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => confirmDeleteQuiz(quiz.id, e as any)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

          {/* Delete confirmation dialog */}
          <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Testni o'chirish</AlertDialogTitle>
                <AlertDialogDescription>
                  Haqiqatan ham bu testni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction onClick={deleteQuiz} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  O'chirish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
