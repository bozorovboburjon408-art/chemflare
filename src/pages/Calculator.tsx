import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles, FlaskConical, Calculator as CalcIcon, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SolutionRenderer from "@/components/SolutionRenderer";
import { supabase } from "@/integrations/supabase/client";

const Calculator = () => {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const solveProblem = async (problemText: string) => {
    setIsProcessing(true);
    setSolution("");

    try {
      const { data, error } = await supabase.functions.invoke('solve-chemistry', {
        body: { question: problemText }
      });

      if (error) throw error;

      if (data?.solution) {
        setSolution(data.solution);
        toast({
          title: "Muvaffaqiyatli!",
          description: "Masala yechildi",
        });
      } else {
        throw new Error("Javob olinmadi");
      }
    } catch (error: any) {
      console.error("Error solving problem:", error);
      toast({
        title: "Xatolik",
        description: error.message || "Masalani yechishda xatolik. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await solveProblem(question);
  };

  const exampleQuestions = [
    "H2SO4 ning molyar massasi",
    "4g H2 dan qancha mol hosil bo'ladi",
    "NaCl ning tarkibi",
    "pH = 3 bo'lsa H+ konsentratsiyasi qancha",
    "2 mol gazning hajmi (n.sh.)",
    "50g CaCO3 dan qancha CaO hosil bo'ladi",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-hero shadow-elegant mb-6">
            <CalcIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Kimyoviy Kalkulyator
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Har qanday kimyoviy masalani yuboring - sun'iy intellekt yordamida darhol yechim oling!
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6 shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Kimyoviy masala yoki hisob-kitobni kiriting
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Masalan: H2O ning molyar massasi, 10g NaCl dan qancha mol, pH=2 bo'lsa H+ qancha..."
                  className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {exampleQuestions.map((q, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuestion(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={isProcessing || !question.trim()}
                className="w-full bg-gradient-hero hover:opacity-90 shadow-elegant transition-all duration-300"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Yechilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Yechish
                  </>
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold text-lg">Kalkulyator imkoniyatlari</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  <h4 className="font-medium text-primary">Hisob-kitoblar</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    Molyar massa hisoblash
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    Mol soni va massa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    pH va pOH hisoblash
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    Gaz hajmi (n.sh.)
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-secondary" />
                  <h4 className="font-medium text-secondary">Qo'shimcha</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Reaksiya bo'yicha hisob
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Konsentratsiya
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Elektroliz (Faradey)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Element ma'lumotlari
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {solution && (
            <Card className="p-6 bg-gradient-card border-primary/20 shadow-elegant animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Yechim</h3>
                  <p className="text-xs text-muted-foreground">Batafsil bosqichma-bosqich javob</p>
                </div>
              </div>
              <SolutionRenderer solution={solution} />
            </Card>
          )}

          <div className="text-center">
            <Card className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-silver border-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Gemini AI yordamida har qanday kimyoviy masalani yechadi
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;
