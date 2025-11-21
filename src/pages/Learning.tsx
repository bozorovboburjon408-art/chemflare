import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Trophy, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ChevronRight,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ChemistryTask {
  id: string;
  title: string;
  description: string;
  question: string;
  correct_answer: string;
  explanation: string | null;
  difficulty_level: number;
  points: number;
  topic: string;
}

interface UserProgress {
  current_level: number;
  total_points: number;
  completed_tasks: number;
}

const Learning = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ 
    current_level: 0, 
    total_points: 0, 
    completed_tasks: 0 
  });
  const [tasks, setTasks] = useState<ChemistryTask[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [currentTask, setCurrentTask] = useState<ChemistryTask | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserData();
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
      setIsLoading(true);

      // Load or create user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (progressError) throw progressError;

      if (!progressData) {
        // Create initial progress
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

      // Load completed tasks
      const { data: completedData, error: completedError } = await supabase
        .from('completed_tasks')
        .select('task_id')
        .eq('user_id', user!.id);

      if (completedError) throw completedError;
      setCompletedTaskIds(new Set(completedData.map(ct => ct.task_id)));

      // Load available tasks for current level
      await loadTasksForLevel(progressData?.current_level || 0);
    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast({
        title: "Xato",
        description: "Ma'lumotlarni yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasksForLevel = async (level: number) => {
    const { data, error } = await supabase
      .from('chemistry_tasks')
      .select('*')
      .eq('difficulty_level', level)
      .order('created_at');

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    setTasks(data || []);
  };

  const startTask = (task: ChemistryTask) => {
    if (completedTaskIds.has(task.id)) {
      toast({
        title: "Diqqat",
        description: "Siz bu vazifani allaqachon bajarib bo'lgansiz",
      });
      return;
    }

    setCurrentTask(task);
    setUserAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  const submitAnswer = async () => {
    if (!currentTask || !userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === currentTask.correct_answer.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      try {
        // Mark task as completed
        await supabase
          .from('completed_tasks')
          .insert({
            user_id: user!.id,
            task_id: currentTask.id,
          });

        // Update user progress
        const newPoints = progress.total_points + currentTask.points;
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

        setCompletedTaskIds(prev => new Set([...prev, currentTask.id]));

        if (newLevel > progress.current_level) {
          toast({
            title: "Tabriklaymiz! 🎉",
            description: `Siz ${newLevel}-darajaga ko'tarildingiz!`,
          });
          await loadTasksForLevel(newLevel);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const nextTask = () => {
    setCurrentTask(null);
    setShowResult(false);
    setUserAnswer("");
    setIsCorrect(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Task solving view
  if (currentTask) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge variant="outline" className="text-lg">
                  Daraja {currentTask.difficulty_level}
                </Badge>
                <Badge className="text-lg">
                  <Trophy className="w-4 h-4 mr-1" />
                  {currentTask.points} ball
                </Badge>
              </div>

              <h2 className="text-2xl font-bold mb-2">{currentTask.title}</h2>
              <p className="text-muted-foreground mb-6">{currentTask.description}</p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-3">Savol:</h3>
                <p className="text-lg">{currentTask.question}</p>
              </div>

              {!showResult ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Javobingizni kiriting..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setCurrentTask(null)}>
                      Bekor qilish
                    </Button>
                    <Button onClick={submitAnswer} disabled={!userAnswer.trim()} className="flex-1">
                      Tekshirish
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {isCorrect ? (
                    <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                        <div>
                          <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                            To'g'ri!
                          </h3>
                          <p className="text-green-600 dark:text-green-400">
                            +{currentTask.points} ball
                          </p>
                        </div>
                      </div>
                      {currentTask.explanation && (
                        <p className="text-muted-foreground">{currentTask.explanation}</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <XCircle className="w-8 h-8 text-red-500" />
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                          Noto'g'ri
                        </h3>
                      </div>
                      <p className="mb-2">
                        <span className="text-muted-foreground">To'g'ri javob:</span>{' '}
                        <span className="font-semibold">{currentTask.correct_answer}</span>
                      </p>
                      {currentTask.explanation && (
                        <p className="text-muted-foreground">{currentTask.explanation}</p>
                      )}
                    </div>
                  )}
                  <Button onClick={nextTask} className="w-full">
                    Davom etish <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Main learning dashboard
  const progressPercentage = (progress.completed_tasks % 10) * 10;
  const nextLevelTasks = 10 - (progress.completed_tasks % 10);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Kimyo O'rganish
          </h1>

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
                  <span className="text-muted-foreground">Bajarilgan vazifalar</span>
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
                  {nextLevelTasks} ta vazifa
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </Card>

          {/* Tasks Grid */}
          <h2 className="text-2xl font-semibold mb-4">
            {progress.current_level}-daraja vazifalari
          </h2>

          {tasks.length === 0 ? (
            <Card className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">
                Barcha vazifalar bajarildi!
              </h3>
              <p className="text-muted-foreground mb-4">
                {progress.current_level === 10 
                  ? "Siz barcha darajalarni tugatdingiz! Tabriklaymiz!" 
                  : "Yangi vazifalar tez orada qo'shiladi"}
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => {
                const isCompleted = completedTaskIds.has(task.id);
                return (
                  <Card
                    key={task.id}
                    className={`p-6 hover:shadow-lg transition-all cursor-pointer ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                    onClick={() => startTask(task)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{task.topic}</Badge>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {task.points} ball
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {task.description}
                    </p>

                    <Button 
                      variant={isCompleted ? "outline" : "default"} 
                      className="w-full"
                      disabled={isCompleted}
                    >
                      {isCompleted ? "Bajarilgan" : "Boshlash"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Learning;
