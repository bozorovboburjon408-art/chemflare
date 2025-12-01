import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Beaker, AlertCircle, Info, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface ReactionResult {
  possible: boolean;
  reactions?: Array<{
    equation: string;
    conditions: {
      temperature?: string;
      pressure?: string;
      catalyst?: string;
      medium?: string;
      concentration?: string;
    };
    type: string;
    ionicEquation?: string;
    observation: string;
    explanation: string;
    products: string[];
  }>;
  noReactionReason?: string;
}

const ChemicalReactions = () => {
  const [substances, setSubstances] = useState<string[]>(['']);
  const [result, setResult] = useState<ReactionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addSubstanceInput = () => {
    setSubstances([...substances, '']);
  };

  const removeSubstanceInput = (index: number) => {
    if (substances.length > 1) {
      setSubstances(substances.filter((_, i) => i !== index));
    }
  };

  const updateSubstance = (index: number, value: string) => {
    const newSubstances = [...substances];
    newSubstances[index] = value;
    setSubstances(newSubstances);
  };

  const generateReaction = async () => {
    const filledSubstances = substances.filter(s => s.trim() !== '');
    
    if (filledSubstances.length < 1) {
      toast({
        title: "Xato",
        description: "Kamida bitta modda kiriting",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-reaction', {
        body: { substances: filledSubstances }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      
      if (!data.possible) {
        toast({
          title: "Reaksiya bo'lmaydi",
          description: data.noReactionReason || "Bu moddalar o'rtasida reaksiya sodir bo'lmaydi",
        });
      }
    } catch (error: any) {
      console.error('Reaction generation error:', error);
      toast({
        title: "Xato",
        description: error.message || "Reaksiyani tahlil qilishda xatolik yuz berdi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <Beaker className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Intellektual Reaksiya Generatori
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Istalgan kimyoviy moddalarni kiriting va AI barcha mumkin bo'lgan reaksiyalarni tahlil qiladi
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium block">
                  Kimyoviy moddalar (formula yoki nom)
                </label>
                {substances.map((substance, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={substance}
                      onChange={(e) => updateSubstance(index, e.target.value)}
                      placeholder="Masalan: HCl, NaOH, H2SO4, Fe, CuSO4, CH4..."
                      className="flex-1"
                    />
                    {substances.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSubstanceInput(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addSubstanceInput}
                  className="w-full"
                  disabled={substances.length >= 5}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yana modda qo'shish
                </Button>
              </div>

              <Button 
                onClick={generateReaction}
                disabled={loading || substances.every(s => s.trim() === '')}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Tahlil qilinmoqda...
                  </>
                ) : (
                  <>
                    <Beaker className="w-5 h-5 mr-2" />
                    Reaksiyani Tahlil Qilish
                  </>
                )}
              </Button>
            </div>
          </Card>

          {result && !result.possible && (
            <Alert className="backdrop-blur-sm bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reaksiya sodir bo'lmaydi:</strong> {result.noReactionReason || "Bu moddalar o'rtasida kimyoviy reaksiya bo'lmaydi."}
              </AlertDescription>
            </Alert>
          )}

          {result && result.possible && result.reactions && result.reactions.map((reaction, idx) => (
            <Card key={idx} className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 space-y-6">
              {result.reactions && result.reactions.length > 1 && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  Variant {idx + 1}
                </Badge>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Beaker className="w-4 h-4" />
                    Reaksiya tenglamasi
                  </h4>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg font-mono text-center text-lg">
                    {reaction.equation}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
                      Reaksiya turi
                    </h4>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      {reaction.type}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                      Kuzatilishi
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reaction.observation}</p>
                  </div>
                </div>

                {reaction.conditions && Object.keys(reaction.conditions).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                      Sharoitlar
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {reaction.conditions.temperature && (
                        <Badge variant="outline">🌡️ {reaction.conditions.temperature}</Badge>
                      )}
                      {reaction.conditions.pressure && (
                        <Badge variant="outline">⚡ {reaction.conditions.pressure}</Badge>
                      )}
                      {reaction.conditions.catalyst && (
                        <Badge variant="outline">⚗️ {reaction.conditions.catalyst}</Badge>
                      )}
                      {reaction.conditions.medium && (
                        <Badge variant="outline">💧 {reaction.conditions.medium}</Badge>
                      )}
                      {reaction.conditions.concentration && (
                        <Badge variant="outline">📊 {reaction.conditions.concentration}</Badge>
                      )}
                    </div>
                  </div>
                )}

                {reaction.ionicEquation && (
                  <div>
                    <h4 className="font-semibold mb-2 text-cyan-600 dark:text-cyan-400">
                      Ionli tenglama
                    </h4>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg font-mono text-sm">
                      {reaction.ionicEquation}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Tushuntirish
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {reaction.explanation}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                  Intellektual Reaksiya Generatori Haqida
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Ushbu generator sun'iy intellekt yordamida istalgan kimyoviy moddalar o'rtasidagi reaksiyalarni tahlil qiladi.
                  U haqiqiy kimyo qoidalariga amal qiladi: metalllar aktivlik qatori, eruvchanlık jadvali, 
                  oksidlanish-qaytarilish reaksiyalari, organik va noorganik kimyo qonunlari.
                </p>
                <ul className="text-sm text-purple-800 dark:text-purple-200 list-disc list-inside space-y-1">
                  <li>Barcha turdagi moddalarni qo'llab-quvvatlaydi (kislotalar, ishqorlar, tuzlar, metallar, organik moddalar)</li>
                  <li>Turli sharoitlarda (harorat, bosim, katalizator) mumkin bo'lgan barcha reaksiyalarni ko'rsatadi</li>
                  <li>Agar reaksiya bo'lmasa, sababini tushuntiradi</li>
                  <li>Ionli tenglamalar va batafsil tushuntirishlar beradi</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChemicalReactions;
