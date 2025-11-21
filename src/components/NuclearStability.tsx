import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Zap, Clock } from "lucide-react";

interface NuclearStabilityProps {
  atomicNumber: number;
  atomicMass: string;
  symbol: string;
}

// Radioactive elements data with half-lives
const radioactiveData: Record<number, {
  halfLife: string;
  decayMode: string;
  isRadioactive: boolean;
  stability: number; // 0-100
}> = {
  1: { halfLife: "Barqaror", decayMode: "-", isRadioactive: false, stability: 100 },
  43: { halfLife: "4.2 million yil", decayMode: "Beta", isRadioactive: true, stability: 30 },
  61: { halfLife: "17.7 yil", decayMode: "Beta", isRadioactive: true, stability: 20 },
  84: { halfLife: "138 kun", decayMode: "Alfa", isRadioactive: true, stability: 10 },
  85: { halfLife: "8.1 soat", decayMode: "Alfa", isRadioactive: true, stability: 5 },
  86: { halfLife: "3.8 kun", decayMode: "Alfa", isRadioactive: true, stability: 8 },
  87: { halfLife: "22 daqiqa", decayMode: "Beta", isRadioactive: true, stability: 3 },
  88: { halfLife: "1600 yil", decayMode: "Alfa", isRadioactive: true, stability: 15 },
  89: { halfLife: "21.8 yil", decayMode: "Beta", isRadioactive: true, stability: 12 },
  90: { halfLife: "14 milliard yil", decayMode: "Alfa", isRadioactive: true, stability: 45 },
  91: { halfLife: "32,760 yil", decayMode: "Alfa", isRadioactive: true, stability: 25 },
  92: { halfLife: "4.5 milliard yil", decayMode: "Alfa", isRadioactive: true, stability: 40 },
  93: { halfLife: "2.1 million yil", decayMode: "Alfa", isRadioactive: true, stability: 22 },
  94: { halfLife: "24,100 yil", decayMode: "Alfa", isRadioactive: true, stability: 18 },
  95: { halfLife: "432 yil", decayMode: "Alfa", isRadioactive: true, stability: 15 },
  96: { halfLife: "18 yil", decayMode: "Alfa", isRadioactive: true, stability: 10 },
  // Add more as needed
};

// Calculate stability based on N/Z ratio
const calculateStability = (protons: number, neutrons: number): number => {
  if (protons <= 20) {
    // Light elements: N/Z should be close to 1
    const ratio = neutrons / protons;
    return Math.max(0, 100 - Math.abs(ratio - 1) * 100);
  } else if (protons <= 83) {
    // Medium elements: N/Z should be around 1.3-1.5
    const ratio = neutrons / protons;
    const ideal = 1.3 + (protons - 20) * 0.003;
    return Math.max(0, 100 - Math.abs(ratio - ideal) * 50);
  } else {
    // Heavy elements: naturally unstable
    return Math.max(0, 30 - (protons - 83) * 2);
  }
};

export const NuclearStability = ({ atomicNumber, atomicMass, symbol }: NuclearStabilityProps) => {
  const [decayProgress, setDecayProgress] = useState(100);
  const [isDecaying, setIsDecaying] = useState(false);

  const mass = Math.round(parseFloat(atomicMass.replace(/[()]/g, '')) || atomicNumber);
  const neutrons = mass - atomicNumber;
  
  const radioData = radioactiveData[atomicNumber] || {
    halfLife: atomicNumber <= 83 ? "Barqaror" : "Noma'lum",
    decayMode: atomicNumber <= 83 ? "-" : "Radioaktiv",
    isRadioactive: atomicNumber > 83,
    stability: calculateStability(atomicNumber, neutrons)
  };

  const isStable = !radioData.isRadioactive;
  const stabilityPercent = radioData.stability;

  // Decay animation
  useEffect(() => {
    if (!isStable && isDecaying) {
      const interval = setInterval(() => {
        setDecayProgress((prev) => {
          if (prev <= 0) {
            setIsDecaying(false);
            return 100;
          }
          return prev - 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isStable, isDecaying]);

  const handleDecayDemo = () => {
    setDecayProgress(100);
    setIsDecaying(true);
  };

  const getStabilityColor = (stability: number) => {
    if (stability >= 80) return "text-green-500 bg-green-500/10 border-green-500/30";
    if (stability >= 50) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
    if (stability >= 20) return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    return "text-red-500 bg-red-500/10 border-red-500/30";
  };

  const getStabilityLabel = (stability: number) => {
    if (stability >= 80) return "Juda barqaror";
    if (stability >= 50) return "Barqaror";
    if (stability >= 20) return "Nisbatan barqaror";
    return "Nobarqaror";
  };

  return (
    <div className="space-y-4">
      {/* Stability Indicator */}
      <div className={`p-4 rounded-lg border ${getStabilityColor(stabilityPercent)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isStable ? (
              <Zap className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <h3 className="font-semibold">Yadro barqarorligi</h3>
          </div>
          <Badge variant="outline" className={getStabilityColor(stabilityPercent)}>
            {getStabilityLabel(stabilityPercent)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Barqarorlik darajasi</span>
            <span className="font-semibold">{stabilityPercent}%</span>
          </div>
          <Progress value={stabilityPercent} className="h-2" />
        </div>
      </div>

      {/* N/Z Ratio Analysis */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">N/Z nisbati</p>
          <p className="text-xl font-bold text-primary">
            {(neutrons / atomicNumber).toFixed(2)}
          </p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className="text-lg font-semibold">
            {isStable ? "Barqaror" : "Radioaktiv"}
          </p>
        </div>
      </div>

      {/* Radioactive Properties */}
      {!isStable && (
        <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/30">
          <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Radioaktivlik xususiyatlari
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Yarim yemirilish davri</p>
                <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {radioData.halfLife}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Parchalanish turi</p>
              <Badge variant="outline" className="bg-orange-500/20 border-orange-500/40">
                {radioData.decayMode} parchalanish
              </Badge>
            </div>

            {/* Decay Animation */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Parchalanish simulyatsiyasi</p>
                <button
                  onClick={handleDecayDemo}
                  disabled={isDecaying}
                  className="text-xs px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 rounded-md transition-colors disabled:opacity-50"
                >
                  {isDecaying ? "Parchalanmoqda..." : "Boshlash"}
                </button>
              </div>
              <Progress value={decayProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(decayProgress)}% yadro qoldi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stability Information */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Barqarorlik haqida</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {isStable ? (
            <>
              <p>
                <span className="font-semibold text-foreground">{symbol}</span> barqaror element hisoblanadi.
                Uning yadrosi o'z-o'zidan parchalanmaydi.
              </p>
              <p>
                Protonlar ({atomicNumber}) va neytronlar ({neutrons}) o'rtasida optimal nisbat mavjud.
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold text-foreground">{symbol}</span> radioaktiv element.
                Uning yadrosi o'z-o'zidan parchalanadi va nurlanish chiqaradi.
              </p>
              <p>
                {atomicNumber > 83 
                  ? "Barcha 83 dan katta atom raqamli elementlar radioaktivdir."
                  : "Nisbatan kam sonli radioaktiv elementlardan biri."}
              </p>
              {radioData.decayMode === "Alfa" && (
                <p className="text-orange-600 dark:text-orange-400">
                  Alfa parchalanishda 2 proton va 2 neytrondan iborat geliy yadrosi chiqariladi.
                </p>
              )}
              {radioData.decayMode === "Beta" && (
                <p className="text-blue-600 dark:text-blue-400">
                  Beta parchalanishda neytron protonga aylanadi va elektron chiqariladi.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Safety Warning for highly radioactive elements */}
      {stabilityPercent < 20 && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">
              <span className="font-semibold">Xavfli!</span> Bu element yuqori darajada radioaktiv 
              va jiddiy sog'liq xavfini tug'dirishi mumkin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
