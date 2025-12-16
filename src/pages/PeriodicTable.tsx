import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AtomVisualization, NucleusVisualization } from "@/components/AtomVisualization";
import { NuclearStability } from "@/components/NuclearStability";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { elements, Element } from "@/data/elementsData";

const categoryColors = {
  nonmetal: "bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30",
  noble: "bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30",
  alkali: "bg-red-500/20 border-red-500/40 hover:bg-red-500/30",
  alkaline: "bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30",
  metalloid: "bg-green-500/20 border-green-500/40 hover:bg-green-500/30",
  halogen: "bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30",
  metal: "bg-gray-500/20 border-gray-500/40 hover:bg-gray-500/30",
  transition: "bg-cyan-500/20 border-cyan-500/40 hover:bg-cyan-500/30",
  lanthanide: "bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/30",
  actinide: "bg-rose-500/20 border-rose-500/40 hover:bg-rose-500/30",
};

// Standard Mendeleev periodic table positions (col, row)
const getElementPosition = (atomicNumber: number): { col: number; row: number } | null => {
  const positions: { [key: number]: { col: number; row: number } } = {
    // Period 1
    1: { col: 1, row: 1 },   // H
    2: { col: 18, row: 1 },  // He
    
    // Period 2
    3: { col: 1, row: 2 },   // Li
    4: { col: 2, row: 2 },   // Be
    5: { col: 13, row: 2 },  // B
    6: { col: 14, row: 2 },  // C
    7: { col: 15, row: 2 },  // N
    8: { col: 16, row: 2 },  // O
    9: { col: 17, row: 2 },  // F
    10: { col: 18, row: 2 }, // Ne
    
    // Period 3
    11: { col: 1, row: 3 },  // Na
    12: { col: 2, row: 3 },  // Mg
    13: { col: 13, row: 3 }, // Al
    14: { col: 14, row: 3 }, // Si
    15: { col: 15, row: 3 }, // P
    16: { col: 16, row: 3 }, // S
    17: { col: 17, row: 3 }, // Cl
    18: { col: 18, row: 3 }, // Ar
    
    // Period 4
    19: { col: 1, row: 4 },  // K
    20: { col: 2, row: 4 },  // Ca
    21: { col: 3, row: 4 },  // Sc
    22: { col: 4, row: 4 },  // Ti
    23: { col: 5, row: 4 },  // V
    24: { col: 6, row: 4 },  // Cr
    25: { col: 7, row: 4 },  // Mn
    26: { col: 8, row: 4 },  // Fe
    27: { col: 9, row: 4 },  // Co
    28: { col: 10, row: 4 }, // Ni
    29: { col: 11, row: 4 }, // Cu
    30: { col: 12, row: 4 }, // Zn
    31: { col: 13, row: 4 }, // Ga
    32: { col: 14, row: 4 }, // Ge
    33: { col: 15, row: 4 }, // As
    34: { col: 16, row: 4 }, // Se
    35: { col: 17, row: 4 }, // Br
    36: { col: 18, row: 4 }, // Kr
    
    // Period 5
    37: { col: 1, row: 5 },  // Rb
    38: { col: 2, row: 5 },  // Sr
    39: { col: 3, row: 5 },  // Y
    40: { col: 4, row: 5 },  // Zr
    41: { col: 5, row: 5 },  // Nb
    42: { col: 6, row: 5 },  // Mo
    43: { col: 7, row: 5 },  // Tc
    44: { col: 8, row: 5 },  // Ru
    45: { col: 9, row: 5 },  // Rh
    46: { col: 10, row: 5 }, // Pd
    47: { col: 11, row: 5 }, // Ag
    48: { col: 12, row: 5 }, // Cd
    49: { col: 13, row: 5 }, // In
    50: { col: 14, row: 5 }, // Sn
    51: { col: 15, row: 5 }, // Sb
    52: { col: 16, row: 5 }, // Te
    53: { col: 17, row: 5 }, // I
    54: { col: 18, row: 5 }, // Xe
    
    // Period 6
    55: { col: 1, row: 6 },  // Cs
    56: { col: 2, row: 6 },  // Ba
    // Lanthanides (57-71) go in row 9
    72: { col: 4, row: 6 },  // Hf
    73: { col: 5, row: 6 },  // Ta
    74: { col: 6, row: 6 },  // W
    75: { col: 7, row: 6 },  // Re
    76: { col: 8, row: 6 },  // Os
    77: { col: 9, row: 6 },  // Ir
    78: { col: 10, row: 6 }, // Pt
    79: { col: 11, row: 6 }, // Au
    80: { col: 12, row: 6 }, // Hg
    81: { col: 13, row: 6 }, // Tl
    82: { col: 14, row: 6 }, // Pb
    83: { col: 15, row: 6 }, // Bi
    84: { col: 16, row: 6 }, // Po
    85: { col: 17, row: 6 }, // At
    86: { col: 18, row: 6 }, // Rn
    
    // Period 7
    87: { col: 1, row: 7 },  // Fr
    88: { col: 2, row: 7 },  // Ra
    // Actinides (89-103) go in row 10
    104: { col: 4, row: 7 },  // Rf
    105: { col: 5, row: 7 },  // Db
    106: { col: 6, row: 7 },  // Sg
    107: { col: 7, row: 7 },  // Bh
    108: { col: 8, row: 7 },  // Hs
    109: { col: 9, row: 7 },  // Mt
    110: { col: 10, row: 7 }, // Ds
    111: { col: 11, row: 7 }, // Rg
    112: { col: 12, row: 7 }, // Cn
    113: { col: 13, row: 7 }, // Nh
    114: { col: 14, row: 7 }, // Fl
    115: { col: 15, row: 7 }, // Mc
    116: { col: 16, row: 7 }, // Lv
    117: { col: 17, row: 7 }, // Ts
    118: { col: 18, row: 7 }, // Og
    
    // Lanthanides (row 9)
    57: { col: 4, row: 9 },  // La
    58: { col: 5, row: 9 },  // Ce
    59: { col: 6, row: 9 },  // Pr
    60: { col: 7, row: 9 },  // Nd
    61: { col: 8, row: 9 },  // Pm
    62: { col: 9, row: 9 },  // Sm
    63: { col: 10, row: 9 }, // Eu
    64: { col: 11, row: 9 }, // Gd
    65: { col: 12, row: 9 }, // Tb
    66: { col: 13, row: 9 }, // Dy
    67: { col: 14, row: 9 }, // Ho
    68: { col: 15, row: 9 }, // Er
    69: { col: 16, row: 9 }, // Tm
    70: { col: 17, row: 9 }, // Yb
    71: { col: 18, row: 9 }, // Lu
    
    // Actinides (row 10)
    89: { col: 4, row: 10 },  // Ac
    90: { col: 5, row: 10 },  // Th
    91: { col: 6, row: 10 },  // Pa
    92: { col: 7, row: 10 },  // U
    93: { col: 8, row: 10 },  // Np
    94: { col: 9, row: 10 },  // Pu
    95: { col: 10, row: 10 }, // Am
    96: { col: 11, row: 10 }, // Cm
    97: { col: 12, row: 10 }, // Bk
    98: { col: 13, row: 10 }, // Cf
    99: { col: 14, row: 10 }, // Es
    100: { col: 15, row: 10 }, // Fm
    101: { col: 16, row: 10 }, // Md
    102: { col: 17, row: 10 }, // No
    103: { col: 18, row: 10 }, // Lr
  };
  
  return positions[atomicNumber] || null;
};

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            KIMYOVIY ELEMENTLAR DAVRIY JADVALI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Barcha elementlarni o'rganing va ularning xususiyatlari haqida batafsil ma'lumot oling
          </p>
        </div>

        {/* Standard Mendeleev Periodic Table Layout */}
        <div className="overflow-x-auto pb-4">
          <div className="grid gap-0 min-w-[950px] border border-border/50 rounded-lg overflow-hidden" style={{ 
            gridTemplateColumns: 'auto repeat(18, minmax(45px, 1fr))',
            gridTemplateRows: 'auto auto repeat(10, auto)'
          }}>
            {/* Group Names Row */}
            <div style={{ gridColumn: 1, gridRow: 1 }}></div>
            <div 
              className="text-[8px] md:text-[10px] text-red-400 font-medium text-center py-1"
              style={{ gridColumn: 2, gridRow: 1 }}
            >
              Ishqoriy
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-orange-400 font-medium text-center py-1"
              style={{ gridColumn: 3, gridRow: 1 }}
            >
              Ishqoriy-yer
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-cyan-400 font-medium text-center py-1 col-span-10"
              style={{ gridColumn: '4 / 14', gridRow: 1 }}
            >
              O'tish metallari
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-gray-400 font-medium text-center py-1"
              style={{ gridColumn: 14, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-gray-400 font-medium text-center py-1"
              style={{ gridColumn: 15, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-blue-400 font-medium text-center py-1"
              style={{ gridColumn: 16, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-yellow-400 font-medium text-center py-1"
              style={{ gridColumn: 18, gridRow: 1 }}
            >
              Galogenlar
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-purple-400 font-medium text-center py-1"
              style={{ gridColumn: 19, gridRow: 1 }}
            >
              Inert gazlar
            </div>
            
            {/* Group Numbers Row */}
            <div 
              className="text-[10px] md:text-xs text-muted-foreground font-bold text-center"
              style={{ gridColumn: 1, gridRow: 2 }}
            >
              Davr
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group) => (
              <div 
                key={`group-${group}`}
                className="text-[10px] md:text-xs text-primary font-bold text-center py-1"
                style={{ gridColumn: group + 1, gridRow: 2 }}
              >
                {group}
              </div>
            ))}
            
            {/* Period Labels */}
            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
              <div 
                key={`period-${period}`}
                className="text-[10px] md:text-xs text-primary font-bold flex items-center justify-center"
                style={{ gridColumn: 1, gridRow: period + 2 }}
              >
                {period}
              </div>
            ))}
            
            {/* Lanthanide/Actinide Period Labels */}
            <div 
              className="text-[10px] md:text-xs text-pink-400 font-bold flex items-center justify-center"
              style={{ gridColumn: 1, gridRow: 11 }}
            >
              *
            </div>
            <div 
              className="text-[10px] md:text-xs text-rose-400 font-bold flex items-center justify-center"
              style={{ gridColumn: 1, gridRow: 12 }}
            >
              **
            </div>
            
            {elements.map((element) => {
              const position = getElementPosition(element.atomicNumber);
              if (!position) return null;
              
              return (
                <Card
                  key={element.symbol}
                  onClick={() => setSelectedElement(element)}
                  className={`p-1.5 md:p-2 cursor-pointer border border-border/70 rounded-none transition-all hover:scale-105 hover:shadow-elegant hover:z-10 hover:border-primary ${
                    categoryColors[element.category as keyof typeof categoryColors]
                  }`}
                  style={{
                    gridColumn: position.col + 1,
                    gridRow: position.row + 2
                  }}
                >
                  <div className="text-[8px] md:text-[10px] text-muted-foreground text-right mb-0.5">
                    {element.atomicNumber}
                  </div>
                  <div className="text-sm md:text-lg font-bold text-center text-foreground mb-0.5">
                    {element.symbol}
                  </div>
                  <div className="text-[7px] md:text-[9px] text-center text-muted-foreground truncate">
                    {element.nameUz}
                  </div>
                  <div className="text-[7px] md:text-[9px] text-center text-muted-foreground">
                    {element.atomicMass}
                  </div>
                </Card>
              );
            })}
            
            {/* Lanthanide indicator */}
            <div 
              className="flex items-center justify-center text-[10px] md:text-xs text-pink-400 font-medium"
              style={{ gridColumn: 4, gridRow: 8 }}
            >
              *57-71
            </div>
            
            {/* Actinide indicator */}
            <div 
              className="flex items-center justify-center text-[10px] md:text-xs text-rose-400 font-medium"
              style={{ gridColumn: 4, gridRow: 9 }}
            >
              **89-103
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 md:gap-3 justify-center text-xs md:text-sm">
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/40">
            Nometall
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 border-purple-500/40">
            Inert gaz
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 border-red-500/40">
            Ishqoriy metall
          </Badge>
          <Badge variant="outline" className="bg-orange-500/10 border-orange-500/40">
            Ishqoriy-yer metall
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 border-green-500/40">
            Yarim metall
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/40">
            Galogen
          </Badge>
          <Badge variant="outline" className="bg-gray-500/10 border-gray-500/40">
            Metall
          </Badge>
          <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/40">
            O'tish metall
          </Badge>
          <Badge variant="outline" className="bg-pink-500/10 border-pink-500/40">
            Lantanoidlar
          </Badge>
          <Badge variant="outline" className="bg-rose-500/10 border-rose-500/40">
            Aktinoidlar
          </Badge>
        </div>
      </main>

      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedElement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl flex items-center justify-between">
                  <span>{selectedElement.nameUz}</span>
                  <span className="text-5xl font-bold text-primary">{selectedElement.symbol}</span>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="3d" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="3d">3D Model</TabsTrigger>
                  <TabsTrigger value="nucleus">Yadro</TabsTrigger>
                  <TabsTrigger value="stability">Barqarorlik</TabsTrigger>
                  <TabsTrigger value="info">Ma'lumot</TabsTrigger>
                </TabsList>
                
                <TabsContent value="3d" className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      3D atom modeli - aylanish uchun sichqoncha bilan sudrab boring, zoom qilish uchun scroll qiling
                    </p>
                    <AtomVisualization
                      atomicNumber={selectedElement.atomicNumber}
                      symbol={selectedElement.symbol}
                      electrons={selectedElement.electrons}
                      atomicMass={selectedElement.atomicMass}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Protonlar</p>
                      <p className="text-xl font-bold text-primary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Elektronlar</p>
                      <p className="text-xl font-bold text-secondary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Qobiqlar</p>
                      <p className="text-xl font-bold text-accent">{selectedElement.electrons.split(',').length}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <p className="text-sm font-semibold text-primary mb-2">Elektron taqsimoti</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedElement.electrons.split(',').map((e, i) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {i + 1}-qobiq: {e} elektron
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="nucleus" className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      Yadro tuzilishi - har bir proton va neytron alohida ko'rsatilgan. Aylanish uchun sudrab boring.
                    </p>
                    <NucleusVisualization
                      atomicNumber={selectedElement.atomicNumber}
                      symbol={selectedElement.symbol}
                      electrons={selectedElement.electrons}
                      atomicMass={selectedElement.atomicMass}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <p className="text-xs text-muted-foreground">Protonlar</p>
                      </div>
                      <p className="text-2xl font-bold text-red-500">{selectedElement.atomicNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">Musbat (+) zaryad</p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <p className="text-xs text-muted-foreground">Neytronlar</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-500">
                        {Math.round(parseFloat(selectedElement.atomicMass.replace(/[()]/g, '')) || selectedElement.atomicNumber) - selectedElement.atomicNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Neytral (0) zaryad</p>
                    </div>
                    
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <p className="text-xs text-muted-foreground">Jami</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-500">
                        {Math.round(parseFloat(selectedElement.atomicMass.replace(/[()]/g, '')) || selectedElement.atomicNumber)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Nuklonlar soni</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <h3 className="text-sm font-semibold text-primary mb-3">Yadro haqida</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">Yadro o'lchami:</span> Atom o'lchamidan 100,000 marta kichikroq, lekin atomning 99.9% massasini tashkil qiladi.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Kuchli o'zaro ta'sir:</span> Proton va neytronlarni bir-biriga bog'laydigan eng kuchli tabiiy kuch.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Massa raqami:</span> {selectedElement.atomicMass} - proton va neytronlar yig'indisi.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Zaryad:</span> +{selectedElement.atomicNumber} (protonlar soni tufayli).
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <h3 className="text-sm font-semibold text-accent-foreground mb-2">Qiziqarli fakt</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedElement.atomicNumber <= 2 && "Bu element Big Bang vaqtida paydo bo'lgan."}
                      {selectedElement.atomicNumber > 2 && selectedElement.atomicNumber <= 26 && "Bu element yulduzlar ichida sintez qilinadi."}
                      {selectedElement.atomicNumber > 26 && selectedElement.atomicNumber <= 92 && "Bu element supernova portlashlarida yoki neytron yulduzlar to'qnashuvida hosil bo'ladi."}
                      {selectedElement.atomicNumber > 92 && "Bu element faqat laboratoriyada sun'iy ravishda yaratiladi."}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="stability" className="space-y-4">
                  <NuclearStability
                    atomicNumber={selectedElement.atomicNumber}
                    atomicMass={selectedElement.atomicMass}
                    symbol={selectedElement.symbol}
                  />
                </TabsContent>
                
                <TabsContent value="info" className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Atom raqami</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Atom massasi</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.atomicMass}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Davr</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.period || selectedElement.electrons.split(',').length}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Guruh</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.group || "—"}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Elektronlar taqsimoti</p>
                    <p className="text-lg font-mono font-semibold">{selectedElement.electrons}</p>
                    {selectedElement.valencElectrons && (
                      <p className="text-xs text-muted-foreground mt-1">Valent elektronlar: {selectedElement.valencElectrons}</p>
                    )}
                  </div>
                  
                  {/* Discovery Info */}
                  {(selectedElement.discoveryYear || selectedElement.discoveredBy) && (
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <p className="text-sm font-semibold text-amber-400 mb-2">Kashfiyot</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedElement.discoveryYear && (
                          <div>
                            <p className="text-xs text-muted-foreground">Kashf etilgan yili</p>
                            <p className="font-medium">{selectedElement.discoveryYear}</p>
                          </div>
                        )}
                        {selectedElement.discoveredBy && (
                          <div>
                            <p className="text-xs text-muted-foreground">Kashf etgan olim</p>
                            <p className="font-medium">{selectedElement.discoveredBy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Physical Properties */}
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm font-semibold text-blue-400 mb-3">Fizik xususiyatlar</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedElement.state && (
                        <div>
                          <p className="text-xs text-muted-foreground">Holati (xona t°)</p>
                          <p className="font-medium">{selectedElement.state}</p>
                        </div>
                      )}
                      {selectedElement.color && (
                        <div>
                          <p className="text-xs text-muted-foreground">Rangi</p>
                          <p className="font-medium">{selectedElement.color}</p>
                        </div>
                      )}
                      {selectedElement.meltingPoint && (
                        <div>
                          <p className="text-xs text-muted-foreground">Erish harorati</p>
                          <p className="font-medium">{selectedElement.meltingPoint}</p>
                        </div>
                      )}
                      {selectedElement.boilingPoint && (
                        <div>
                          <p className="text-xs text-muted-foreground">Qaynash harorati</p>
                          <p className="font-medium">{selectedElement.boilingPoint}</p>
                        </div>
                      )}
                      {selectedElement.density && (
                        <div>
                          <p className="text-xs text-muted-foreground">Zichlik</p>
                          <p className="font-medium">{selectedElement.density}</p>
                        </div>
                      )}
                      {selectedElement.crystalStructure && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kristall tuzilishi</p>
                          <p className="font-medium">{selectedElement.crystalStructure}</p>
                        </div>
                      )}
                      {selectedElement.magneticOrdering && (
                        <div>
                          <p className="text-xs text-muted-foreground">Magnit xususiyati</p>
                          <p className="font-medium">{selectedElement.magneticOrdering}</p>
                        </div>
                      )}
                      {selectedElement.thermalConductivity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Issiqlik o'tkazuvchanlik</p>
                          <p className="font-medium">{selectedElement.thermalConductivity}</p>
                        </div>
                      )}
                      {selectedElement.electricalResistivity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektr qarshilik</p>
                          <p className="font-medium">{selectedElement.electricalResistivity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Chemical Properties */}
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm font-semibold text-green-400 mb-3">Kimyoviy xususiyatlar</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedElement.electronegativity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektronegativlik</p>
                          <p className="font-medium">{selectedElement.electronegativity}</p>
                        </div>
                      )}
                      {selectedElement.oxidationStates && (
                        <div>
                          <p className="text-xs text-muted-foreground">Oksidlanish darajasi</p>
                          <p className="font-medium">{selectedElement.oxidationStates}</p>
                        </div>
                      )}
                      {selectedElement.ionizationEnergy && (
                        <div>
                          <p className="text-xs text-muted-foreground">Ionlanish energiyasi</p>
                          <p className="font-medium">{selectedElement.ionizationEnergy}</p>
                        </div>
                      )}
                      {selectedElement.electronAffinity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektron affinligi</p>
                          <p className="font-medium">{selectedElement.electronAffinity}</p>
                        </div>
                      )}
                      {selectedElement.block && (
                        <div>
                          <p className="text-xs text-muted-foreground">Blok</p>
                          <p className="font-medium">{selectedElement.block}-blok</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Atomic Radii */}
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-semibold text-purple-400 mb-3">Atom o'lchamlari</p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {selectedElement.atomicRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Atom radiusi</p>
                          <p className="font-medium">{selectedElement.atomicRadius}</p>
                        </div>
                      )}
                      {selectedElement.covalentRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kovalent radius</p>
                          <p className="font-medium">{selectedElement.covalentRadius}</p>
                        </div>
                      )}
                      {selectedElement.vanDerWaalsRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Van der Waals</p>
                          <p className="font-medium">{selectedElement.vanDerWaalsRadius}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Isotopes */}
                  {(selectedElement.isotopeCount || selectedElement.stableIsotopes) && (
                    <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-sm font-semibold text-cyan-400 mb-3">Izotoplar</p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        {selectedElement.isotopeCount && (
                          <div>
                            <p className="text-xs text-muted-foreground">Izotoplar soni</p>
                            <p className="font-medium">{selectedElement.isotopeCount}</p>
                          </div>
                        )}
                        {selectedElement.stableIsotopes && (
                          <div>
                            <p className="text-xs text-muted-foreground">Barqaror izotoplar</p>
                            <p className="font-medium">{selectedElement.stableIsotopes}</p>
                          </div>
                        )}
                        {selectedElement.halfLife && (
                          <div>
                            <p className="text-xs text-muted-foreground">Yarim yemirilish</p>
                            <p className="font-medium">{selectedElement.halfLife}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Abundance & Origin */}
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-sm font-semibold text-orange-400 mb-3">Tarqalishi va kelib chiqishi</p>
                    <div className="space-y-2 text-sm">
                      {selectedElement.abundance && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tarqalishi</p>
                          <p className="font-medium">{selectedElement.abundance}</p>
                        </div>
                      )}
                      {selectedElement.origin && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kelib chiqishi</p>
                          <p className="font-medium">{selectedElement.origin}</p>
                        </div>
                      )}
                      {selectedElement.naturalOccurrence && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tabiatda uchraydi</p>
                          <p className="font-medium">{selectedElement.naturalOccurrence}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Uses */}
                  {selectedElement.uses && selectedElement.uses.length > 0 && (
                    <div className="p-4 bg-gradient-card rounded-lg border border-border">
                      <p className="text-sm font-semibold text-primary mb-3">Qo'llanilishi</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedElement.uses.map((use, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Hazards */}
                  {selectedElement.hazards && (
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm font-semibold text-red-400 mb-2">Xavflar</p>
                      <p className="text-sm">{selectedElement.hazards}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Inglizcha nomi</p>
                    <p className="text-xl font-semibold">{selectedElement.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <p className="text-sm font-semibold text-primary mb-2">Qisqacha ma'lumot</p>
                    <p className="text-foreground leading-relaxed">{selectedElement.description}</p>
                  </div>
                  
                  {selectedElement.detailedInfo && (
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm font-semibold text-accent-foreground mb-2">Batafsil ma'lumot</p>
                      <p className="text-foreground leading-relaxed">{selectedElement.detailedInfo}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeriodicTable;
