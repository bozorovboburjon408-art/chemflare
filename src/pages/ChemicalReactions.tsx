import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Beaker, AlertCircle, Info, Plus, X, Sparkles, Flame, Droplets, Wind, Atom } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { predefinedReactions, reactionCategories, type PredefinedReaction } from "@/data/predefinedReactions";
import ReactionAnimation3D from "@/components/ReactionAnimation3D";
interface ReactionResult {
  possible: boolean;
  reactions?: Array<{
    equation: string;
    conditions: string;
    type: string;
    observation: string;
    explanation: string;
    products: string[];
    category: string;
    applications?: string[];
    safetyNotes?: string;
    energyChange?: string;
    mechanism?: string;
  }>;
  noReactionReason?: string;
}

const ChemicalReactions = () => {
  const [activeTab, setActiveTab] = useState<"generator" | "library">("generator");
  
  // AI Generator state
  const [substances, setSubstances] = useState<string[]>(['']);
  const [aiResult, setAiResult] = useState<ReactionResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Library state
  const [selectedCategory, setSelectedCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReaction, setSelectedReaction] = useState<PredefinedReaction | null>(null);
  
  const { toast } = useToast();

  // AI Generator functions
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

  const generateReaction = () => {
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
    setAiResult(null);

    // Search in predefined reactions locally (no API needed)
    setTimeout(() => {
      const searchTerms = filledSubstances.map(s => s.toLowerCase().trim().replace(/\s+/g, ''));
      
      const matchingReactions = predefinedReactions.filter(reaction => {
        const equationLower = reaction.equation.toLowerCase().replace(/\s+/g, '');
        const descLower = reaction.description.toLowerCase();
        const detailLower = (reaction.detailedExplanation || '').toLowerCase();
        const typeLower = reaction.type.toLowerCase();
        const reactantsLower = reaction.reactants.join(' ').toLowerCase();
        const productsLower = reaction.products.join(' ').toLowerCase();
        const categoryLower = reaction.category.toLowerCase();
        
        return searchTerms.some(term => 
          equationLower.includes(term) || 
          descLower.includes(term) || 
          detailLower.includes(term) ||
          typeLower.includes(term) ||
          reactantsLower.includes(term) ||
          productsLower.includes(term) ||
          categoryLower.includes(term)
        );
      });

      if (matchingReactions.length > 0) {
        setAiResult({
          possible: true,
          reactions: matchingReactions.map(r => ({
            equation: r.equation,
            conditions: r.conditions,
            type: r.type,
            observation: r.observation,
            explanation: r.detailedExplanation || r.description,
            products: r.products,
            category: r.category,
            applications: r.applications,
            safetyNotes: r.safetyNotes,
            energyChange: r.energyChange,
            mechanism: r.mechanism
          }))
        });
        toast({
          title: "Topildi!",
          description: `${matchingReactions.length} ta reaksiya topildi`,
        });
      } else {
        setAiResult({
          possible: false,
          noReactionReason: `"${filledSubstances.join(', ')}" bo'yicha reaksiya bazadan topilmadi. Kutubxonadan qidiring yoki boshqa moddalarni sinab ko'ring.`
        });
        toast({
          title: "Topilmadi",
          description: "Mos reaksiya topilmadi. Kutubxonadan qidiring.",
        });
      }
      setLoading(false);
    }, 300);
  };

  // Library functions
  const getIcon = (iconName: string) => {
    const icons = {
      flame: Flame,
      droplets: Droplets,
      wind: Wind,
      sparkles: Sparkles,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Beaker;
    return <IconComponent className="w-5 h-5" />;
  };

  const filteredReactions = predefinedReactions.filter(reaction => {
    const matchesCategory = selectedCategory === "Barchasi" || reaction.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase().replace(/\s+/g, '');
    const matchesSearch = searchQuery === "" || 
      reaction.equation.toLowerCase().replace(/\s+/g, '').includes(searchLower) ||
      reaction.description.toLowerCase().includes(searchLower) ||
      reaction.type.toLowerCase().includes(searchLower) ||
      reaction.reactants.join(' ').toLowerCase().includes(searchLower) ||
      reaction.products.join(' ').toLowerCase().includes(searchLower) ||
      (reaction.detailedExplanation || '').toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <Beaker className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Kimyoviy Reaksiyalar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            AI generator yoki 100+ laboratoriya reaksiyalari kutubxonasidan foydalaning
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generator" | "library")} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generator">AI Generator</TabsTrigger>
            <TabsTrigger value="library">Reaksiyalar Kutubxonasi ({predefinedReactions.length})</TabsTrigger>
          </TabsList>

          {/* AI Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
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

            {aiResult && !aiResult.possible && (
              <Alert className="backdrop-blur-sm bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Reaksiya sodir bo'lmaydi:</strong> {aiResult.noReactionReason || "Bu moddalar o'rtasida kimyoviy reaksiya bo'lmaydi."}
                </AlertDescription>
              </Alert>
            )}

            {aiResult && aiResult.possible && aiResult.reactions && aiResult.reactions.map((reaction, idx) => (
              <Card key={idx} className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 space-y-6">
                {aiResult.reactions && aiResult.reactions.length > 1 && (
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

                  {reaction.conditions && (
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                        Sharoitlar
                      </h4>
                      <Badge variant="outline">🌡️ {reaction.conditions}</Badge>
                    </div>
                  )}

                  {reaction.mechanism && (
                    <div>
                      <h4 className="font-semibold mb-2 text-cyan-600 dark:text-cyan-400">
                        Mexanizm
                      </h4>
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg font-mono text-sm">
                        {reaction.mechanism}
                      </div>
                    </div>
                  )}

                  {reaction.applications && reaction.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">
                        Qo'llanilishi
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {reaction.applications.map((app, i) => (
                          <Badge key={i} variant="secondary">{app}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {reaction.safetyNotes && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold mb-1 text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Xavfsizlik
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200">{reaction.safetyNotes}</p>
                    </div>
                  )}

                  {reaction.energyChange && (
                    <Badge variant="outline" className="w-fit">⚡ {reaction.energyChange}</Badge>
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
                    AI generator istalgan kimyoviy moddalar o'rtasidagi reaksiyalarni tahlil qiladi.
                    Haqiqiy kimyo qoidalariga amal qiladi: metalllar aktivlik qatori, eruvchanlık jadvali, 
                    oksidlanish-qaytarilish reaksiyalari.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Kategoriya</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reactionCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Qidiruv</label>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Reaksiya, modda yoki tur bo'yicha qidiring..."
                  />
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredReactions.map(reaction => (
                <Card
                  key={reaction.id}
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0"
                  onClick={() => setSelectedReaction(reaction)}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                      {getIcon(reaction.icon)}
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">{reaction.type}</Badge>
                      <div className="font-mono text-sm mb-2">{reaction.equation}</div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {reaction.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredReactions.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hech qanday reaksiya topilmadi. Boshqa kategoriya yoki qidiruv so'zini sinab ko'ring.
                </AlertDescription>
              </Alert>
            )}

            {selectedReaction && (
              <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 shadow-xl border-0 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                      {getIcon(selectedReaction.icon)}
                    </div>
                    <div>
                      <Badge className="mb-2">{selectedReaction.category}</Badge>
                      <h3 className="font-bold text-lg">{selectedReaction.type}</h3>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedReaction(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <Separator />

                {/* 3D Animation */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Atom className="w-4 h-4" />
                    3D Reaksiya Animatsiyasi
                  </h4>
                  <ReactionAnimation3D
                    reactants={selectedReaction.reactants}
                    products={selectedReaction.products}
                    equation={selectedReaction.equation}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Beaker className="w-4 h-4" />
                      Reaksiya tenglamasi
                    </h4>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg font-mono text-center text-lg">
                      {selectedReaction.equation}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Sharoitlar</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReaction.conditions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Kuzatilishi</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReaction.observation}</p>
                    </div>
                  </div>

                  {selectedReaction.mechanism && (
                    <div>
                      <h4 className="font-semibold mb-2 text-cyan-600 dark:text-cyan-400">Mexanizm</h4>
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg font-mono text-sm">
                        {selectedReaction.mechanism}
                      </div>
                    </div>
                  )}

                  {selectedReaction.applications && selectedReaction.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">Qo'llanilishi</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReaction.applications.map((app, i) => (
                          <Badge key={i} variant="secondary">{app}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReaction.safetyNotes && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <h4 className="font-semibold mb-1 text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Xavfsizlik
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200">{selectedReaction.safetyNotes}</p>
                    </div>
                  )}

                  {selectedReaction.energyChange && (
                    <Badge variant="outline" className="w-fit">⚡ {selectedReaction.energyChange}</Badge>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {selectedReaction.description}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChemicalReactions;
