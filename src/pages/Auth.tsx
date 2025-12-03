import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Atom, Loader2, Key } from "lucide-react";

// Access codes - these can be expanded or managed differently
const VALID_CODES = ["chemlearn2024", "kimyo123", "student", "teacher", "demo"];

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const isAuthenticated = localStorage.getItem("chemlearn_auth");
    if (isAuthenticated === "true") {
      navigate("/quiz");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Xato",
        description: "Kirish kodini kiriting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (VALID_CODES.includes(code.toLowerCase().trim())) {
      localStorage.setItem("chemlearn_auth", "true");
      localStorage.setItem("chemlearn_code", code.toLowerCase().trim());
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "Tizimga kirdingiz",
      });
      navigate("/quiz");
    } else {
      toast({
        title: "Xato",
        description: "Noto'g'ri kod. Iltimos, to'g'ri kodni kiriting.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-gradient-card border-primary/20 shadow-elegant">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elegant mb-4">
            <Atom className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            ChemLearn
          </h1>
          <p className="text-muted-foreground">
            Kirish kodini kiriting
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Kirish kodi
            </label>
            <Input
              type="text"
              placeholder="Kodingizni kiriting..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              className="text-center text-lg tracking-wider border-primary/30 focus:border-primary"
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
                Tekshirilmoqda...
              </>
            ) : (
              "Kirish"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Kirish kodi sizning o'qituvchingizda yoki administratorda</p>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
