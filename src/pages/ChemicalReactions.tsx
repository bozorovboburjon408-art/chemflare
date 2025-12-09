import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, Beaker, AlertCircle, Info, Plus, X, Sparkles, Flame, Droplets, Wind,
  ArrowRight, Zap, FlaskConical, Atom, TestTube2, BookOpen, Eye, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import AnimatedReactionViewer from "@/components/AnimatedReactionViewer";
import { predefinedReactions, reactionCategories, type PredefinedReaction } from "@/data/predefinedReactions";

interface MoleculeAtom {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface MoleculeBond {
  from: number;
  to: number;
  order: number;
}

interface MoleculeData {
  formula: string;
  name: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

interface AnimationStep {
  phase: string;
  description: string;
}

interface MolecularAnimationData {
  reactants: MoleculeData[];
  products: MoleculeData[];
  animationSteps: AnimationStep[];
}

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
    molecularAnimation?: MolecularAnimationData;
  }>;
  noReactionReason?: string;
}

// Popular reaction examples
const popularExamples = [
  { reactants: ["HCl", "NaOH"], name: "Neytralizatsiya", icon: Droplets },
  { reactants: ["Fe", "CuSO4"], name: "Almashish", icon: Zap },
  { reactants: ["H2", "O2"], name: "Sintez", icon: Flame },
  { reactants: ["CaCO3"], name: "Parchalanish", icon: FlaskConical },
];

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

  const useExample = (reactants: string[]) => {
    setSubstances(reactants);
    setAiResult(null);
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
    setAiResult(null);

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

      setAiResult(data);
      
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
    const matchesSearch = searchQuery === "" || 
      reaction.equation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reaction.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navigation />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      <div className="container mx-auto px-4 py-8 pt-24 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/30">
            <Atom className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Kimyoviy Reaksiyalar
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Sun'iy intellekt yordamida kimyoviy reaksiyalarni kashf qiling va ularni 
            <span className="text-cyan-400 font-medium"> 3D animatsiya</span> orqali kuzating
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">100+</div>
              <div className="text-sm text-gray-500">Reaksiyalar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">3D</div>
              <div className="text-sm text-gray-500">Vizualizatsiya</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">AI</div>
              <div className="text-sm text-gray-500">Tahlil</div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "generator" | "library")} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="generator" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg py-3"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger 
              value="library"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg py-3"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Kutubxona ({predefinedReactions.length})
            </TabsTrigger>
          </TabsList>

          {/* AI Generator Tab */}
          <TabsContent value="generator" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Popular Examples */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Tez boshlash - Mashhur misollar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {popularExamples.map((example, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => useExample(example.reactants)}
                      className="h-auto py-3 px-4 bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <example.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                        <span className="text-xs text-gray-400">{example.name}</span>
                        <span className="text-xs font-mono text-cyan-400">
                          {example.reactants.join(" + ")}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Input Section */}
              <Card className="p-8 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <TestTube2 className="w-5 h-5 text-purple-400" />
                      Kimyoviy moddalarni kiriting
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Formula (H2O, NaCl) yoki nomini (suv, osh tuzi) yozing
                    </p>
                  </div>

                  <div className="space-y-3">
                    {substances.map((substance, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-bold">
                          {index + 1}
                        </div>
                        <Input
                          value={substance}
                          onChange={(e) => updateSubstance(index, e.target.value)}
                          placeholder="Masalan: HCl, NaOH, Fe, CuSO4, CH4..."
                          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 text-lg focus:border-purple-500"
                        />
                        {substances.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeSubstanceInput(index)}
                            className="h-12 w-12 border-red-500/30 hover:bg-red-500/20 hover:border-red-500"
                          >
                            <X className="w-5 h-5 text-red-400" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={addSubstanceInput}
                    className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                    disabled={substances.length >= 5}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Yana modda qo'shish ({substances.length}/5)
                  </Button>

                  <Button 
                    onClick={generateReaction}
                    disabled={loading || substances.every(s => s.trim() === '')}
                    className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-xl shadow-purple-500/25"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        AI tahlil qilmoqda...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 mr-3" />
                        Reaksiyani Kashf Qilish
                        <ArrowRight className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* No Reaction Alert */}
            <AnimatePresence>
              {aiResult && !aiResult.possible && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Alert className="bg-yellow-500/10 border-yellow-500/30">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <AlertDescription className="text-yellow-200 text-base">
                      <strong className="text-yellow-300">Reaksiya sodir bo'lmaydi:</strong>{" "}
                      {aiResult.noReactionReason || "Bu moddalar o'rtasida kimyoviy reaksiya bo'lmaydi."}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reaction Results */}
            <AnimatePresence>
              {aiResult && aiResult.possible && aiResult.reactions && aiResult.reactions.map((reaction, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 p-6 border-b border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        {aiResult.reactions && aiResult.reactions.length > 1 && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            <Zap className="w-3 h-3 mr-1" />
                            Variant {idx + 1}
                          </Badge>
                        )}
                        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                          {reaction.type}
                        </Badge>
                      </div>
                      
                      {/* Equation */}
                      <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                        <div className="text-2xl md:text-3xl font-mono text-center text-white font-bold tracking-wide">
                          {reaction.equation}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* 3D Animation */}
                      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-cyan-400">
                          <Eye className="w-5 h-5" />
                          3D Molekulyar Animatsiya
                        </h4>
                        <AnimatedReactionViewer 
                          animationData={reaction.molecularAnimation}
                          reactants={substances.filter(s => s.trim() !== '')} 
                          products={reaction.products || []}
                        />
                      </div>

                      {/* Info Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Observation */}
                        <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20">
                          <h4 className="font-semibold mb-2 text-pink-400 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Kuzatilishi
                          </h4>
                          <p className="text-gray-300">{reaction.observation}</p>
                        </div>

                        {/* Conditions */}
                        {reaction.conditions && Object.keys(reaction.conditions).length > 0 && (
                          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                            <h4 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
                              <Zap className="w-4 h-4" />
                              Sharoitlar
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {reaction.conditions.temperature && (
                                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                                  🌡️ {reaction.conditions.temperature}
                                </Badge>
                              )}
                              {reaction.conditions.pressure && (
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                  ⚡ {reaction.conditions.pressure}
                                </Badge>
                              )}
                              {reaction.conditions.catalyst && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                  ⚗️ {reaction.conditions.catalyst}
                                </Badge>
                              )}
                              {reaction.conditions.medium && (
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                  💧 {reaction.conditions.medium}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Ionic Equation */}
                      {reaction.ionicEquation && (
                        <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20">
                          <h4 className="font-semibold mb-2 text-cyan-400 flex items-center gap-2">
                            <Atom className="w-4 h-4" />
                            Ionli tenglama
                          </h4>
                          <div className="font-mono text-lg text-cyan-200 bg-black/20 p-3 rounded-lg">
                            {reaction.ionicEquation}
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/20">
                        <h4 className="font-semibold mb-3 text-blue-400 flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          Batafsil tushuntirish
                        </h4>
                        <p className="text-gray-300 leading-relaxed">
                          {reaction.explanation}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Info Card */}
            {!aiResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Info className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        AI Reaksiya Generatori qanday ishlaydi?
                      </h4>
                      <ul className="text-sm text-gray-400 space-y-2">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          Metallar aktivlik qatoriga asoslanadi
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          Eruvchanlık jadvalini hisobga oladi
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          3D molekulyar vizualizatsiya yaratadi
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          Ionli tenglamalarni hisoblaydi
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Kategoriya</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
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
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Qidiruv</label>
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Reaksiya qidiring..."
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReactions.map((reaction, idx) => (
                <motion.div
                  key={reaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <Card
                    className="p-4 cursor-pointer bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all group"
                    onClick={() => setSelectedReaction(reaction)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all">
                        {getIcon(reaction.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2 text-xs border-white/20 text-gray-400">
                          {reaction.type}
                        </Badge>
                        <div className="font-mono text-sm text-cyan-400 mb-2 truncate">
                          {reaction.equation}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {reaction.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredReactions.length === 0 && (
              <Alert className="bg-white/5 border-white/10">
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <AlertDescription className="text-gray-400">
                  Hech qanday reaksiya topilmadi. Boshqa kategoriya yoki qidiruv sozini sinab ko'ring.
                </AlertDescription>
              </Alert>
            )}

            {/* Selected Reaction Modal */}
            <AnimatePresence>
              {selectedReaction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                          {getIcon(selectedReaction.icon)}
                        </div>
                        <div>
                          <Badge className="mb-1 bg-purple-500/20 text-purple-300">
                            {selectedReaction.category}
                          </Badge>
                          <h3 className="font-bold text-lg text-white">{selectedReaction.type}</h3>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setSelectedReaction(null)}
                        className="border-white/20 hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                        <div className="text-2xl font-mono text-center text-white font-bold">
                          {selectedReaction.equation}
                        </div>
                      </div>

                      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
                        <h5 className="font-medium mb-3 text-cyan-400">3D Animatsiya</h5>
                        <AnimatedReactionViewer
                          reactants={selectedReaction.reactants}
                          products={selectedReaction.products}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                          <h4 className="font-semibold mb-2 text-green-400">Sharoitlar</h4>
                          <p className="text-gray-300">{selectedReaction.conditions}</p>
                        </div>
                        <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20">
                          <h4 className="font-semibold mb-2 text-pink-400">Kuzatilishi</h4>
                          <p className="text-gray-300">{selectedReaction.observation}</p>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                        <p className="text-gray-300">{selectedReaction.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChemicalReactions;