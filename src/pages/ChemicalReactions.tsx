import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Flame, Droplets, Wind, Sparkles, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MoleculeViewer from "@/components/MoleculeViewer";

interface Reaction {
  equation: string;
  type: string;
  description: string;
  conditions: string;
  observation: string;
  color?: string;
  icon: "flame" | "droplets" | "wind" | "sparkles";
  reactants: string[];
  products: string[];
}

interface Reactant {
  id: string;
  name: string;
  formula: string;
  category: string;
}

const reactants: Reactant[] = [
  // Kislotalar
  { id: "hcl", name: "Xlorid kislota", formula: "HCl", category: "Kislota" },
  { id: "h2so4", name: "Sulfat kislota", formula: "H₂SO₄", category: "Kislota" },
  { id: "hno3", name: "Nitrat kislota", formula: "HNO₃", category: "Kislota" },
  { id: "ch3cooh", name: "Sirka kislota", formula: "CH₃COOH", category: "Kislota" },
  
  // Asoslar (ishqorlar)
  { id: "naoh", name: "Natriy gidroksid", formula: "NaOH", category: "Asos" },
  { id: "koh", name: "Kaliy gidroksid", formula: "KOH", category: "Asos" },
  { id: "ca_oh_2", name: "Kalsiy gidroksid", formula: "Ca(OH)₂", category: "Asos" },
  
  // Metallar
  { id: "zn", name: "Rux", formula: "Zn", category: "Metall" },
  { id: "fe", name: "Temir", formula: "Fe", category: "Metall" },
  { id: "al", name: "Alyuminiy", formula: "Al", category: "Metall" },
  { id: "mg", name: "Magniy", formula: "Mg", category: "Metall" },
  { id: "cu", name: "Mis", formula: "Cu", category: "Metall" },
  { id: "ag", name: "Kumush", formula: "Ag", category: "Metall" },
  
  // Tuzlar
  { id: "nacl", name: "Osh tuzi", formula: "NaCl", category: "Tuz" },
  { id: "agno3", name: "Kumush nitrat", formula: "AgNO₃", category: "Tuz" },
  { id: "cuso4", name: "Mis sulfat", formula: "CuSO₄", category: "Tuz" },
  { id: "na2co3", name: "Natriy karbonat", formula: "Na₂CO₃", category: "Tuz" },
  
  // Oksidlar
  { id: "cao", name: "Kalsiy oksid", formula: "CaO", category: "Oksid" },
  { id: "so2", name: "Oltingugurt dioksid", formula: "SO₂", category: "Oksid" },
  { id: "co2", name: "Karbonat angidrid", formula: "CO₂", category: "Oksid" },
  
  // Boshqalar
  { id: "h2o", name: "Suv", formula: "H₂O", category: "Boshqa" },
  { id: "o2", name: "Kislorod", formula: "O₂", category: "Boshqa" },
  { id: "h2", name: "Vodorod", formula: "H₂", category: "Boshqa" },
];

const reactions: { [key: string]: Reaction } = {
  // Kislota + Metall
  "hcl-zn": {
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    type: "Almashtirish reaksiyasi",
    description: "Rux xlorid kislota bilan reaksiyaga kirib, sink xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Vodorod gazi pufakchalar ko'rinishida ajralib chiqadi, eritma isiydi",
    color: "Ko'k-yashil",
    icon: "droplets",
    reactants: ["Zn", "HCl"],
    products: ["ZnCl2", "H2"]
  },
  "h2so4-zn": {
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    type: "Almashtirish reaksiyasi",
    description: "Rux sulfat kislota bilan reaksiyaga kirib, sink sulfat va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Vodorod gazi pufakchalar shaklida ajralib chiqadi",
    icon: "droplets",
    reactants: ["Zn", "H2SO4"],
    products: ["ZnSO4", "H2"]
  },
  "hcl-fe": {
    equation: "Fe + 2HCl → FeCl₂ + H₂↑",
    type: "Almashtirish reaksiyasi",
    description: "Temir xlorid kislota bilan reaksiyaga kirib, temir xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Yashil rangli eritma hosil bo'ladi, vodorod gazi ajraladi",
    color: "Yashil",
    icon: "droplets",
    reactants: ["Fe", "HCl"],
    products: ["FeCl2", "H2"]
  },
  "hcl-mg": {
    equation: "Mg + 2HCl → MgCl₂ + H₂↑",
    type: "Almashtirish reaksiyasi",
    description: "Magniy xlorid kislota bilan jadal reaksiyaga kirib, magniy xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida, tez",
    observation: "Magniy eriydi, ko'p miqdorda vodorod gazi ajraladi, eritma qiziydi",
    icon: "flame",
    reactants: ["Mg", "HCl"],
    products: ["MgCl2", "H2"]
  },
  
  // Kislota + Asos (Neytrallanish)
  "hcl-naoh": {
    equation: "HCl + NaOH → NaCl + H₂O",
    type: "Neytrallanish reaksiyasi",
    description: "Kislota va asos o'zaro ta'sirlashib, tuz va suv hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Rang o'zgarmaydi, eritma isiydi, tuz kristallari hosil bo'ladi",
    icon: "droplets",
    reactants: ["HCl", "NaOH"],
    products: ["NaCl", "H2O"]
  },
  "h2so4-naoh": {
    equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
    type: "Neytrallanish reaksiyasi",
    description: "Sulfat kislota natriy gidroksid bilan neytrallanib, natriy sulfat va suv hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Ko'p issiqlik ajraladi",
    icon: "flame",
    reactants: ["H2SO4", "NaOH"],
    products: ["Na2SO4", "H2O"]
  },
  
  // Tuz + Tuz (Almashinish)
  "nacl-agno3": {
    equation: "NaCl + AgNO₃ → AgCl↓ + NaNO₃",
    type: "Almashinish reaksiyasi",
    description: "Kumush xlorid cho'kmasi hosil bo'ladi",
    conditions: "Xona haroratida",
    observation: "Oq rangli cho'kma hosil bo'ladi",
    color: "Oq",
    icon: "sparkles",
    reactants: ["NaCl", "AgNO3"],
    products: ["AgCl", "NaNO3"]
  },
  "cuso4-naoh": {
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    type: "Almashinish reaksiyasi",
    description: "Mis gidroksid cho'kmasi hosil bo'ladi",
    conditions: "Xona haroratida",
    observation: "Ko'k rangli cho'kma hosil bo'ladi",
    color: "Ko'k",
    icon: "sparkles",
    reactants: ["CuSO4", "NaOH"],
    products: ["Cu(OH)2", "Na2SO4"]
  },
  
  // Oksid + Suv
  "cao-h2o": {
    equation: "CaO + H₂O → Ca(OH)₂",
    type: "Birikish reaksiyasi",
    description: "Kalsiy oksid suv bilan birikib, kalsiy gidroksid (ohak suvi) hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Ko'p issiqlik ajraladi, oq chang eriydi",
    icon: "flame",
    reactants: ["CaO", "H2O"],
    products: ["Ca(OH)2"]
  },
  "so2-h2o": {
    equation: "SO₂ + H₂O → H₂SO₃",
    type: "Birikish reaksiyasi",
    description: "Oltingugurt dioksid suv bilan birikib, sulfat kislota hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Gaz suvda eriydi, kislotali eritma hosil bo'ladi",
    icon: "droplets",
    reactants: ["SO2", "H2O"],
    products: ["H2SO3"]
  },
  
  // Yonish
  "mg-o2": {
    equation: "2Mg + O₂ → 2MgO",
    type: "Oksidlanish (yonish)",
    description: "Magniy kislorodda porlaq oq yorug'lik bilan yonadi",
    conditions: "Yuqori harorat yoki alanga",
    observation: "Juda yorqin oq yorug'lik, oq chang (magniy oksid) hosil bo'ladi",
    color: "Oq yorug'lik",
    icon: "flame",
    reactants: ["Mg", "O2"],
    products: ["MgO"]
  },
  "h2-o2": {
    equation: "2H₂ + O₂ → 2H₂O",
    type: "Birikish (yonish)",
    description: "Vodorod kislorodda yonib, suv hosil qiladi",
    conditions: "Alanga yoki uchqun",
    observation: "Portlash bilan yonadi, suv tomchilari hosil bo'ladi",
    icon: "flame",
    reactants: ["H2", "O2"],
    products: ["H2O"]
  },
  
  // Karbonat + Kislota
  "na2co3-hcl": {
    equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑",
    type: "Almashinish reaksiyasi",
    description: "Natriy karbonat kislota bilan reaksiyaga kirib, karbonat angidrid gazi ajraladi",
    conditions: "Xona haroratida",
    observation: "Ko'p miqdorda gaz pufakchalar ajralib chiqadi, shivirlash eshitiladi",
    icon: "wind",
    reactants: ["Na2CO3", "HCl"],
    products: ["NaCl", "H2O", "CO2"]
  },
};

const ChemicalReactions = () => {
  const [reactant1, setReactant1] = useState<string>("");
  const [reactant2, setReactant2] = useState<string>("");
  const [result, setResult] = useState<Reaction | null>(null);
  const [noReaction, setNoReaction] = useState(false);

  const handleReaction = () => {
    if (!reactant1 || !reactant2) return;

    const key1 = `${reactant1}-${reactant2}`;
    const key2 = `${reactant2}-${reactant1}`;

    const reaction = reactions[key1] || reactions[key2];

    if (reaction) {
      setResult(reaction);
      setNoReaction(false);
    } else {
      setResult(null);
      setNoReaction(true);
    }
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "flame":
        return <Flame className="w-6 h-6" />;
      case "droplets":
        return <Droplets className="w-6 h-6" />;
      case "wind":
        return <Wind className="w-6 h-6" />;
      case "sparkles":
        return <Sparkles className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Kislota":
        return "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400";
      case "Asos":
        return "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400";
      case "Metall":
        return "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400";
      case "Tuz":
        return "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400";
      case "Oksid":
        return "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400";
      default:
        return "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kimyoviy Reaksiyalar Simulyatori
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikki moddani tanlang va ularning o'zaro ta'sirini ko'ring
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Selection Section */}
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  1-modda
                </label>
                <Select value={reactant1} onValueChange={setReactant1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Moddani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {reactants.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex items-center gap-2">
                          <span>{r.name}</span>
                          <span className="text-muted-foreground text-sm">({r.formula})</span>
                          <Badge variant="outline" className={getCategoryColor(r.category)}>
                            {r.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reactant1 && (
                  <Card className="p-3 bg-muted/50">
                    <p className="font-semibold">{reactants.find(r => r.id === reactant1)?.name}</p>
                    <p className="text-2xl font-mono text-primary">{reactants.find(r => r.id === reactant1)?.formula}</p>
                  </Card>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium">
                  2-modda
                </label>
                <Select value={reactant2} onValueChange={setReactant2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Moddani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {reactants.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        <div className="flex items-center gap-2">
                          <span>{r.name}</span>
                          <span className="text-muted-foreground text-sm">({r.formula})</span>
                          <Badge variant="outline" className={getCategoryColor(r.category)}>
                            {r.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {reactant2 && (
                  <Card className="p-3 bg-muted/50">
                    <p className="font-semibold">{reactants.find(r => r.id === reactant2)?.name}</p>
                    <p className="text-2xl font-mono text-primary">{reactants.find(r => r.id === reactant2)?.formula}</p>
                  </Card>
                )}
              </div>
            </div>

            <Button
              onClick={handleReaction}
              disabled={!reactant1 || !reactant2}
              size="lg"
              className="w-full mt-6"
            >
              Reaksiyani ko'rish
            </Button>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="p-6 animate-fade-in bg-gradient-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-primary">
                  {getIcon(result.icon)}
                </div>
                <h2 className="text-2xl font-bold">Reaksiya natijasi</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Reaksiya tenglamasi:</p>
                  <p className="text-2xl font-mono text-primary">{result.equation}</p>
                </div>

                {/* 3D Molecule Visualization */}
                <div className="p-6 bg-background rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-4">3D Molekulyar tuzilma:</p>
                  <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    <div className="space-y-4">
                      <p className="text-center font-semibold text-sm text-muted-foreground">Dastlabki moddalar</p>
                      {result.reactants.map((molecule, idx) => (
                        <MoleculeViewer 
                          key={`reactant-${idx}`}
                          formula={molecule} 
                          label={`Reaktiv ${idx + 1}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center justify-center px-4">
                      <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
                      <p className="text-xs text-muted-foreground mt-2">Reaksiya</p>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-center font-semibold text-sm text-muted-foreground">Hosil bo'lgan moddalar</p>
                      {result.products.map((molecule, idx) => (
                        <MoleculeViewer 
                          key={`product-${idx}`}
                          formula={molecule} 
                          label={`Mahsulot ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Reaksiya turi:</p>
                    <Badge variant="outline" className="text-base px-4 py-2">
                      {result.type}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Sharoit:</p>
                    <p className="text-base">{result.conditions}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Tavsif:</p>
                  <p className="text-base">{result.description}</p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-sm font-medium mb-2">🔍 Kuzatish:</p>
                  <p className="text-base">{result.observation}</p>
                  {result.color && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Rang: <span className="font-semibold">{result.color}</span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {noReaction && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tanlangan moddalar o'rtasida ma'lum reaksiya mavjud emas yoki u juda murakkab sharoitlarda sodir bo'ladi.
                Boshqa moddalarni tanlang.
              </AlertDescription>
            </Alert>
          )}

          {/* Info Card */}
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3">💡 Foydali ma'lumot:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Reaksiyalar tabiiy sharoitlarda xavfli bo'lishi mumkin</li>
              <li>• Bu simulyator faqat ta'lim maqsadida</li>
              <li>• Haqiqiy tajribalarda xavfsizlik qoidalariga rioya qiling</li>
              <li>• ↑ belgisi gaz ajralishini, ↓ belgisi cho'kma hosil bo'lishini bildiradi</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ChemicalReactions;