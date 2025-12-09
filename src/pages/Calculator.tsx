import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, Loader2, Sparkles, FlaskConical, Calculator as CalcIcon, Beaker } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SolutionRenderer from "@/components/SolutionRenderer";

const Calculator = () => {
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const solveProblem = async (problemText: string, imageData?: string) => {
    setIsProcessing(true);
    setSolution("");

    try {
      const { data, error } = await supabase.functions.invoke('solve-chemistry', {
        body: { question: problemText, imageData }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Xizmatda xatolik yuz berdi');
      }

      if (data.error) {
        console.error('Response error:', data.error);
        throw new Error(data.error);
      }

      if (!data.solution) {
        throw new Error('Yechim topilmadi');
      }

      setSolution(data.solution);
      toast({
        title: "Muvaffaqiyatli!",
        description: "Masala yechildi",
      });
    } catch (error: any) {
      console.error('Error solving problem:', error);
      toast({
        title: "Xatolik",
        description: error.message || "Masalani yechishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    solveProblem(question);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      solveProblem(question || "", base64Data);
    };
    reader.readAsDataURL(file);
  };

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
            Har qanday kimyoviy hisob-kitob yoki masalani yuboring - AI yechim topadi
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
                  placeholder="Masalan: 2H₂ + O₂ → 2H₂O reaksiyasida 4g H₂ dan qancha suv hosil bo'ladi?"
                  className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isProcessing || !question.trim()}
                  className="flex-1 bg-gradient-hero hover:opacity-90 shadow-elegant transition-all duration-300"
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

                <label htmlFor="image-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isProcessing}
                    asChild
                    className="border-secondary/50 hover:bg-secondary/10 hover:border-secondary transition-all duration-300"
                  >
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Rasm yuklash
                    </span>
                  </Button>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </label>
              </div>
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
                    Reaksiya tenglamalari
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    Konsentratsiya hisoblash
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    pH va pOH hisoblash
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-secondary" />
                  <h4 className="font-medium text-secondary">Rasm tahlili</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 ml-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Strukturaviy formula tahlili
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Grafik va diagram o'qish
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Qo'lda yozilgan tenglamalar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    Jadval ma'lumotlarini olish
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
                  <p className="text-xs text-muted-foreground">AI tomonidan tayyorlangan batafsil javob</p>
                </div>
              </div>
              <SolutionRenderer solution={solution} />
            </Card>
          )}

          <div className="text-center">
            <Card className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-silver border-0 shadow-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                AI yordamida kimyoviy masalalarni yeching
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;
