import { useState, useEffect } from "react";
import { ArrowRight, Atom } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [showButtons, setShowButtons] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fullText = "CHEMFLARE";

  const elements = [
    { symbol: "H", color: "#60a5fa" },
    { symbol: "O", color: "#f87171" },
    { symbol: "C", color: "#4ade80" },
    { symbol: "N", color: "#a78bfa" },
    { symbol: "Fe", color: "#fbbf24" },
    { symbol: "Na", color: "#38bdf8" },
  ];

  const formulas = ["H₂O", "CO₂", "NaCl", "H₂SO₄", "NaOH", "CH₄", "O₂", "N₂"];

  useEffect(() => {
    // Typing effect
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    // Loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Show button after loading
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1800);

    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleEnterApp = () => {
    setIsExiting(true);
    setTimeout(onComplete, 500);
  };

  if (isExiting) {
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-background"
        style={{ animation: "fadeOut 0.5s ease-out forwards" }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(222 47% 6%) 0%, hsl(221 83% 12%) 30%, hsl(250 47% 10%) 70%, hsl(222 47% 6%) 100%)",
      }}
    >
      {/* Hexagonal grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.3) 0%, transparent 60%)",
            top: "10%",
            left: "10%",
            animation: "float 8s ease-in-out infinite",
            filter: "blur(40px)"
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(280 91% 60% / 0.25) 0%, transparent 60%)",
            bottom: "10%",
            right: "10%",
            animation: "float 10s ease-in-out infinite 2s",
            filter: "blur(40px)"
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(43 96% 56% / 0.2) 0%, transparent 60%)",
            top: "50%",
            right: "20%",
            animation: "float 12s ease-in-out infinite 4s",
            filter: "blur(30px)"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${5 + (i * 5) % 90}%`,
              top: `${10 + (i * 7) % 80}%`,
              animation: `particleFloat ${5 + (i % 5)}s ease-in-out infinite ${i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Floating chemical formulas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {formulas.map((formula, i) => (
          <div
            key={`formula-${i}`}
            className="absolute font-mono text-sm md:text-base opacity-20"
            style={{
              left: `${8 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              color: elements[i % elements.length].color,
              animation: `float ${7 + i}s ease-in-out infinite ${i * 0.7}s`
            }}
          >
            {formula}
          </div>
        ))}
      </div>

      {/* Floating periodic elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {elements.map((el, i) => (
          <div
            key={`element-${i}`}
            className="absolute w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-sm md:text-base opacity-30"
            style={{
              left: `${5 + i * 16}%`,
              top: `${60 + (i % 3) * 12}%`,
              background: `linear-gradient(135deg, ${el.color}33, ${el.color}11)`,
              border: `1px solid ${el.color}44`,
              color: el.color,
              animation: `elementFloat ${8 + i * 1.5}s ease-in-out infinite ${i * 0.5}s`
            }}
          >
            {el.symbol}
          </div>
        ))}
      </div>

      {/* DNA Helix decoration */}
      <div className="absolute left-4 md:left-8 top-1/4 bottom-1/4 w-8 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`helix-${i}`}
            className="absolute w-3 h-3 rounded-full"
            style={{
              top: `${i * 8}%`,
              left: `${50 + Math.sin(i * 0.8) * 40}%`,
              background: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
              animation: `helixPulse 2s ease-in-out infinite ${i * 0.15}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative text-center px-6 z-10">
        {/* Animated atom with multiple orbits */}
        <div className="mb-8 flex justify-center">
          <div 
            className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
            style={{ animation: "scaleIn 0.8s ease-out" }}
          >
            {/* Multiple orbits */}
            <div 
              className="absolute w-full h-full rounded-full border border-primary/40"
              style={{ animation: "spin 6s linear infinite" }}
            />
            <div 
              className="absolute w-[90%] h-[90%] rounded-full border border-secondary/30"
              style={{ 
                animation: "spin 8s linear infinite reverse",
                transform: "rotateX(70deg)"
              }}
            />
            <div 
              className="absolute w-[80%] h-[80%] rounded-full border border-accent/30"
              style={{ 
                animation: "spin 10s linear infinite",
                transform: "rotateY(70deg)"
              }}
            />
            <div 
              className="absolute w-[70%] h-[70%] rounded-full border border-purple-400/20"
              style={{ 
                animation: "spin 12s linear infinite reverse",
                transform: "rotateZ(45deg) rotateX(45deg)"
              }}
            />
            
            {/* Center nucleus with glow */}
            <div 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                boxShadow: "0 0 40px hsl(var(--primary) / 0.6), 0 0 80px hsl(var(--primary) / 0.3)"
              }}
            >
              <Atom className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
            </div>

            {/* Multiple electrons */}
            <div 
              className="absolute w-2.5 h-2.5 rounded-full bg-primary"
              style={{
                animation: "orbit1 3s linear infinite",
                boxShadow: "0 0 12px hsl(var(--primary))"
              }}
            />
            <div 
              className="absolute w-2 h-2 rounded-full bg-secondary"
              style={{
                animation: "orbit2 4s linear infinite 0.5s",
                boxShadow: "0 0 10px hsl(var(--secondary))"
              }}
            />
            <div 
              className="absolute w-2 h-2 rounded-full bg-accent"
              style={{
                animation: "orbit3 5s linear infinite 1s",
                boxShadow: "0 0 10px hsl(var(--accent))"
              }}
            />
          </div>
        </div>

        {/* Title with typing effect */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 min-h-[1.2em]"
          style={{ textShadow: "0 0 40px hsl(var(--primary) / 0.4)" }}
        >
          <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
            {typedText}
          </span>
          <span 
            className="inline-block w-1 h-8 md:h-12 ml-1 bg-primary align-middle rounded"
            style={{ animation: "blink 0.8s step-end infinite" }}
          />
        </h1>

        {/* Subtitle with fade in */}
        <p 
          className="text-base md:text-xl text-muted-foreground mb-8"
          style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
        >
          Kimyo ilmini o'rganing
        </p>

        {/* Loading bar */}
        <div 
          className="w-48 md:w-64 h-1.5 mx-auto mb-8 rounded-full overflow-hidden bg-muted/30"
          style={{ animation: "fadeIn 0.5s ease-out 0.8s both" }}
        >
          <div 
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${loadingProgress}%`,
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))"
            }}
          />
        </div>

        {/* Enter button */}
        {showButtons && (
          <Button
            onClick={handleEnterApp}
            size="lg"
            className="px-8 py-6 text-lg relative overflow-hidden group"
            style={{ animation: "scaleIn 0.4s ease-out" }}
          >
            <span className="relative z-10 flex items-center">
              Ilovaga Kirish
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-25px) translateX(0px); }
          75% { transform: translateY(-15px) translateX(-5px); }
        }
        @keyframes elementFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-40px); opacity: 0.8; }
        }
        @keyframes helixPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.3); opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(64px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(64px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(90deg) translateX(56px) rotate(-90deg); }
          to { transform: rotate(450deg) translateX(56px) rotate(-450deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(180deg) translateX(48px) rotate(-180deg); }
          to { transform: rotate(540deg) translateX(48px) rotate(-540deg); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
