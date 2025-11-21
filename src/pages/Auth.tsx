import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Atom, Loader2 } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/quiz");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Xato",
        description: "Email va parol to'ldirish shart",
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
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Muvaffaqiyatli!",
          description: "Tizimga kirdingiz",
        });
        navigate("/quiz");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/quiz`,
          },
        });

        if (error) throw error;

        toast({
          title: "Muvaffaqiyatli!",
          description: "Hisob yaratildi. Endi tizimga kirishingiz mumkin.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Xato",
        description: error.message || "Xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-hero flex items-center justify-center shadow-elegant mb-4">
            <Atom className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">ChemLearn</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Parol</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              minLength={6}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yuklanmoqda...
              </>
            ) : isLogin ? (
              "Kirish"
            ) : (
              "Ro'yxatdan o'tish"
            )}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
            disabled={isLoading}
          >
            {isLogin
              ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting"
              : "Hisobingiz bormi? Kirish"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
