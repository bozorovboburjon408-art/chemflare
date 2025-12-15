import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Atom, Loader2, User, Lock, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/quiz");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/quiz");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Xato",
        description: "Login va parolni kiriting",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Xato",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Xato",
              description: "Bu login allaqachon ro'yxatdan o'tgan",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Xato",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Muvaffaqiyatli!",
            description: "Ro'yxatdan o'tdingiz",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Xato",
              description: "Noto'g'ri login yoki parol",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Xato",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Muvaffaqiyatli!",
            description: "Tizimga kirdingiz",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Xato",
        description: "Tizimda xatolik yuz berdi",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Bosh sahifaga
        </Button>
        <Card className="p-8 space-y-6 bg-gradient-card border-primary/20 shadow-elegant">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elegant mb-4">
            <Atom className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            ChemLearn
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Ro'yxatdan o'tish" : "Tizimga kirish"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Login (email)
            </label>
            <Input
              type="email"
              placeholder="login@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border-primary/30 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Parol
            </label>
            <Input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-primary/30 focus:border-primary"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-hero hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isSignUp ? "Ro'yxatdan o'tilmoqda..." : "Kirilmoqda..."}
              </>
            ) : (
              isSignUp ? "Ro'yxatdan o'tish" : "Kirish"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isSignUp 
              ? "Akkauntingiz bormi? Kirish" 
              : "Akkauntingiz yo'qmi? Ro'yxatdan o'tish"}
          </button>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
