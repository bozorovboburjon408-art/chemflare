import { useState, useEffect, useMemo } from "react";
import { ArrowRight } from "lucide-react";
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

  const elements = useMemo(() => [
    { symbol: "H", number: 1, color: "#60a5fa", name: "Vodorod" },
    { symbol: "O", number: 8, color: "#f87171", name: "Kislorod" },
    { symbol: "C", number: 6, color: "#4ade80", name: "Uglerod" },
    { symbol: "N", number: 7, color: "#a78bfa", name: "Azot" },
    { symbol: "Fe", number: 26, color: "#fbbf24", name: "Temir" },
    { symbol: "Na", number: 11, color: "#38bdf8", name: "Natriy" },
    { symbol: "Cl", number: 17, color: "#34d399", name: "Xlor" },
    { symbol: "Au", number: 79, color: "#fcd34d", name: "Oltin" },
  ], []);

  const formulas = useMemo(() => [
    "H₂O", "CO₂", "NaCl", "H₂SO₄", "NaOH", "CH₄", "O₂", "N₂", 
    "HCl", "CaCO₃", "Fe₂O₃", "C₆H₁₂O₆"
  ], []);

  const particles = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 3,
    }))
  , []);

  const shootingStars = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      startX: 10 + i * 20,
      startY: Math.random() * 30,
      delay: i * 3 + Math.random() * 2,
      duration: 1.5 + Math.random(),
    }))
  , []);

  const bubbles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 35 + Math.random() * 30,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 4 + Math.random() * 8,
    }))
  , []);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 25);

    const timer = setTimeout(() => setShowButtons(true), 2000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleEnterApp = () => {
    setIsExiting(true);
    setTimeout(onComplete, 600);
  };

  if (isExiting) {
    return (
      <div 
        className="fixed inset-0 z-[9999]"
        style={{ 
          background: "hsl(var(--background))",
          animation: "fadeOut 0.6s ease-out forwards" 
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 20%, hsl(221 83% 15%) 0%, hsl(222 47% 8%) 40%, hsl(250 47% 6%) 70%, hsl(222 47% 4%) 100%)",
      }}
    >
      {/* Hexagonal grid */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.5'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.25) 0%, transparent 60%)",
            top: "5%", left: "5%",
            animation: "orbFloat 12s ease-in-out infinite",
            filter: "blur(60px)"
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(280 91% 60% / 0.2) 0%, transparent 60%)",
            bottom: "10%", right: "5%",
            animation: "orbFloat 15s ease-in-out infinite 3s",
            filter: "blur(50px)"
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(43 96% 56% / 0.15) 0%, transparent 60%)",
            top: "40%", right: "15%",
            animation: "orbFloat 18s ease-in-out infinite 6s",
            filter: "blur(40px)"
          }}
        />
        <div 
          className="absolute w-[250px] h-[250px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(160 91% 50% / 0.15) 0%, transparent 60%)",
            bottom: "30%", left: "20%",
            animation: "orbFloat 14s ease-in-out infinite 2s",
            filter: "blur(35px)"
          }}
        />
      </div>

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            boxShadow: "0 0 6px 2px rgba(255,255,255,0.6), -20px 0 15px rgba(255,255,255,0.4), -40px 0 10px rgba(255,255,255,0.2)",
            animation: `shootingStar ${star.duration}s linear infinite ${star.delay}s`
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={`particle-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(217 91% 70% / 0.8), transparent)`,
            animation: `particleFloat ${p.duration}s ease-in-out infinite ${p.delay}s`
          }}
        />
      ))}

      {/* Floating chemical formulas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {formulas.map((formula, i) => (
          <div
            key={`formula-${i}`}
            className="absolute font-mono text-xs md:text-sm"
            style={{
              left: `${5 + (i * 8) % 90}%`,
              top: `${10 + (i * 13) % 75}%`,
              color: elements[i % elements.length].color,
              opacity: 0.25,
              animation: `formulaFloat ${8 + i % 5}s ease-in-out infinite ${i * 0.5}s`
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
            className="absolute w-12 h-14 md:w-14 md:h-16 rounded-lg flex flex-col items-center justify-center"
            style={{
              left: `${3 + i * 12}%`,
              top: `${55 + (i % 4) * 10}%`,
              background: `linear-gradient(135deg, ${el.color}22, ${el.color}08)`,
              border: `1px solid ${el.color}33`,
              opacity: 0.4,
              animation: `elementFloat ${9 + i * 1.2}s ease-in-out infinite ${i * 0.4}s`
            }}
          >
            <span className="text-[10px] opacity-60" style={{ color: el.color }}>{el.number}</span>
            <span className="font-bold text-sm md:text-base" style={{ color: el.color }}>{el.symbol}</span>
          </div>
        ))}
      </div>

      {/* DNA Helix - Left */}
      <div className="absolute left-2 md:left-6 top-1/4 bottom-1/4 w-10 opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`helix-l-${i}`} className="absolute flex items-center gap-1" style={{ top: `${i * 6.5}%` }}>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                left: `${50 + Math.sin(i * 0.7) * 35}%`,
                background: i % 2 === 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                animation: `helixPulse 2.5s ease-in-out infinite ${i * 0.12}s`
              }}
            />
            <div 
              className="h-px flex-1 opacity-40"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'}, transparent)` 
              }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "hsl(var(--secondary))" : "hsl(var(--primary))",
                animation: `helixPulse 2.5s ease-in-out infinite ${i * 0.12 + 0.5}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* DNA Helix - Right */}
      <div className="absolute right-2 md:right-6 top-1/4 bottom-1/4 w-10 opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={`helix-r-${i}`} className="absolute flex items-center gap-1" style={{ top: `${i * 6.5}%` }}>
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "hsl(var(--accent))" : "#f472b6",
                animation: `helixPulse 2.5s ease-in-out infinite ${i * 0.12 + 1}s`
              }}
            />
            <div 
              className="h-px flex-1 opacity-40"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'hsl(var(--accent))' : '#f472b6'}, transparent)` 
              }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: i % 2 === 0 ? "#f472b6" : "hsl(var(--accent))",
                animation: `helixPulse 2.5s ease-in-out infinite ${i * 0.12 + 1.5}s`
              }}
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative text-center px-4 z-10">
        {/* Complex atom visualization */}
        <div className="mb-6 flex justify-center">
          <div 
            className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center"
            style={{ animation: "scaleIn 0.8s ease-out" }}
          >
            {/* Outer glow */}
            <div 
              className="absolute w-full h-full rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                animation: "pulse 3s ease-in-out infinite"
              }}
            />

            {/* Multiple orbital rings */}
            {[100, 85, 70, 55].map((size, i) => (
              <div
                key={`orbit-${i}`}
                className="absolute rounded-full"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  border: `1.5px solid hsl(var(--${['primary', 'secondary', 'accent', 'primary'][i]}) / ${0.4 - i * 0.08})`,
                  animation: `spin ${6 + i * 3}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  transform: i === 1 ? 'rotateX(70deg)' : i === 2 ? 'rotateY(70deg)' : i === 3 ? 'rotateZ(45deg) rotateX(45deg)' : 'none'
                }}
              />
            ))}
            
            {/* Nucleus with protons and neutrons */}
            <div 
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center relative"
              style={{
                background: "radial-gradient(circle at 30% 30%, hsl(var(--primary)), hsl(var(--accent)))",
                boxShadow: "0 0 50px hsl(var(--primary) / 0.5), 0 0 100px hsl(var(--primary) / 0.3), inset 0 0 20px rgba(255,255,255,0.2)"
              }}
            >
              {/* Inner particles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`proton-${i}`}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#ef4444" : "#3b82f6",
                    left: `${35 + Math.cos(i * 60 * Math.PI / 180) * 15}%`,
                    top: `${35 + Math.sin(i * 60 * Math.PI / 180) * 15}%`,
                    boxShadow: `0 0 8px ${i % 2 === 0 ? '#ef4444' : '#3b82f6'}`,
                    animation: `nucleusPulse 1.5s ease-in-out infinite ${i * 0.2}s`
                  }}
                />
              ))}
              
              {/* Center symbol */}
              <span className="text-2xl md:text-3xl z-10">⚛️</span>
            </div>

            {/* Orbiting electrons */}
            {[
              { color: 'primary', radius: 72, duration: 2.5, delay: 0 },
              { color: 'secondary', radius: 62, duration: 3.5, delay: 0.8 },
              { color: 'accent', radius: 52, duration: 4.5, delay: 1.6 },
              { color: 'primary', radius: 42, duration: 3, delay: 2.4 },
            ].map((electron, i) => (
              <div
                key={`electron-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: `hsl(var(--${electron.color}))`,
                  boxShadow: `0 0 15px hsl(var(--${electron.color})), 0 0 30px hsl(var(--${electron.color}) / 0.5)`,
                  animation: `orbit${i + 1} ${electron.duration}s linear infinite ${electron.delay}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Flask with bubbles */}
        <div className="absolute bottom-[15%] left-[8%] md:left-[15%] opacity-40">
          <div className="relative w-16 h-24 md:w-20 md:h-28">
            {/* Flask body */}
            <div 
              className="absolute bottom-0 w-full h-[70%] rounded-b-full"
              style={{
                background: "linear-gradient(180deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.6))",
                border: "2px solid hsl(var(--primary) / 0.4)"
              }}
            >
              {/* Bubbles */}
              {bubbles.slice(0, 4).map((b) => (
                <div
                  key={`bubble-${b.id}`}
                  className="absolute rounded-full bg-white/40"
                  style={{
                    width: b.size,
                    height: b.size,
                    left: `${20 + Math.random() * 50}%`,
                    bottom: "10%",
                    animation: `bubble ${b.duration}s ease-in-out infinite ${b.delay}s`
                  }}
                />
              ))}
            </div>
            {/* Flask neck */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[35%]"
              style={{
                background: "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.2))",
                borderLeft: "2px solid hsl(var(--primary) / 0.4)",
                borderRight: "2px solid hsl(var(--primary) / 0.4)"
              }}
            />
          </div>
        </div>

        {/* Second flask */}
        <div className="absolute bottom-[15%] right-[8%] md:right-[15%] opacity-40">
          <div className="relative w-16 h-24 md:w-20 md:h-28">
            <div 
              className="absolute bottom-0 w-full h-[70%] rounded-b-full"
              style={{
                background: "linear-gradient(180deg, hsl(var(--secondary) / 0.3), hsl(var(--secondary) / 0.6))",
                border: "2px solid hsl(var(--secondary) / 0.4)"
              }}
            >
              {bubbles.slice(4).map((b) => (
                <div
                  key={`bubble2-${b.id}`}
                  className="absolute rounded-full bg-white/40"
                  style={{
                    width: b.size,
                    height: b.size,
                    left: `${20 + Math.random() * 50}%`,
                    bottom: "10%",
                    animation: `bubble ${b.duration}s ease-in-out infinite ${b.delay}s`
                  }}
                />
              ))}
            </div>
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[35%]"
              style={{
                background: "linear-gradient(180deg, transparent, hsl(var(--secondary) / 0.2))",
                borderLeft: "2px solid hsl(var(--secondary) / 0.4)",
                borderRight: "2px solid hsl(var(--secondary) / 0.4)"
              }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-2 min-h-[1.2em]"
          style={{ textShadow: "0 0 50px hsl(var(--primary) / 0.5), 0 4px 30px rgba(0,0,0,0.5)" }}
        >
          <span className="bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent">
            {typedText}
          </span>
          <span 
            className="inline-block w-1 h-8 md:h-12 ml-1 bg-primary align-middle rounded"
            style={{ animation: "blink 0.8s step-end infinite" }}
          />
        </h1>

        {/* Subtitle */}
        <p 
          className="text-base md:text-xl text-muted-foreground mb-6"
          style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
        >
          ✨ Kimyo ilmini o'rganing ✨
        </p>

        {/* Loading bar */}
        <div 
          className="w-52 md:w-72 h-2 mx-auto mb-6 rounded-full overflow-hidden"
          style={{ 
            background: "hsl(var(--muted) / 0.3)",
            animation: "fadeIn 0.5s ease-out 0.8s both",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
          }}
        >
          <div 
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: `${loadingProgress}%`,
              background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
              transition: "width 0.1s ease-out"
            }}
          />
        </div>

        <p 
          className="text-sm text-muted-foreground mb-6"
          style={{ animation: "fadeIn 0.5s ease-out 1s both" }}
        >
          {loadingProgress < 100 ? `Yuklanmoqda... ${Math.round(loadingProgress)}%` : "Tayyor!"}
        </p>

        {/* Enter button */}
        {showButtons && (
          <Button
            onClick={handleEnterApp}
            size="lg"
            className="px-10 py-7 text-lg relative overflow-hidden group"
            style={{ animation: "scaleIn 0.5s ease-out" }}
          >
            <span className="relative z-10 flex items-center font-semibold">
              🚀 Ilovaga Kirish
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-10px, -50px) scale(0.95); }
          75% { transform: translate(-30px, -20px) scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes formulaFloat {
          0%, 100% { transform: translateY(0) rotate(-2deg); opacity: 0.25; }
          50% { transform: translateY(-30px) rotate(2deg); opacity: 0.35; }
        }
        @keyframes elementFloat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-35px) rotate(3deg) scale(1.05); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-50px) scale(1.2); opacity: 0.9; }
        }
        @keyframes shootingStar {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translate(150px, 150px) scale(0); opacity: 0; }
        }
        @keyframes helixPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes nucleusPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(72px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(72px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(62px) rotate(-120deg); }
          to { transform: rotate(480deg) translateX(62px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(52px) rotate(-240deg); }
          to { transform: rotate(600deg) translateX(52px) rotate(-600deg); }
        }
        @keyframes orbit4 {
          from { transform: rotate(60deg) translateX(42px) rotate(-60deg); }
          to { transform: rotate(420deg) translateX(42px) rotate(-420deg); }
        }
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
