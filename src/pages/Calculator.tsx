import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kimyoviy Kalkulyator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Har qanday kimyoviy hisob-kitob yoki masalani yuboring - AI yechim topadi
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kimyoviy masala yoki hisob-kitobni kiriting
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Masalan: 2H₂ + O₂ → 2H₂O reaksiyasida 4g H₂ dan qancha suv hosil bo'ladi?"
                  className="min-h-[100px] resize-none"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isProcessing || !question.trim()}
                  className="flex-1"
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

          <Card className="p-6 bg-gradient-card">
            <h3 className="font-semibold mb-4 text-lg">Kalkulyator imkoniyatlari:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Hisob-kitoblar:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Molyar massa hisoblash</li>
                  <li>• Reaksiya tenglamalari</li>
                  <li>• Konsentratsiya hisoblash</li>
                  <li>• pH va pOH hisoblash</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Rasm tahlili:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Strukturaviy formula tahlili</li>
                  <li>• Grafik va diagram o'qish</li>
                  <li>• Qo'lda yozilgan tenglamalar</li>
                  <li>• Jadval ma'lumotlarini olish</li>
                </ul>
              </div>
            </div>
          </Card>

          {solution && (
            <Card className="p-6 bg-gradient-card animate-fade-in">
              <h3 className="font-semibold mb-4 text-lg">Yechim:</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm">{solution}</pre>
              </div>
            </Card>
          )}

          <div className="text-center">
            <Card className="inline-block p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                💡 AI yordamida kimyoviy masalalarni yeching
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;
