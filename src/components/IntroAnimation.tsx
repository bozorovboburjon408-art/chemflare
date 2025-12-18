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

  const fullText = "CHEMFLARE";

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
    }, 100);

    // Show button after typing
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 1200);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleEnterApp = () => {
    setIsExiting(true);
    setTimeout(onComplete, 400);
  };

  if (isExiting) {
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-background"
        style={{
          animation: "fadeOut 0.4s ease-out forwards"
        }}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(222 47% 8%) 0%, hsl(221 83% 15%) 50%, hsl(222 47% 6%) 100%)",
      }}
    >
      {/* Subtle gradient orbs */}
      <div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.4) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(43 96% 56% / 0.4) 0%, transparent 70%)",
          animation: "pulse 5s ease-in-out infinite 1s"
        }}
      />

      {/* Floating elements - simple CSS animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["H₂", "O₂", "CO₂", "H₂O", "NaCl"].map((formula, i) => (
          <div
            key={i}
            className="absolute text-primary/20 font-mono text-lg"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${6 + i}s ease-in-out infinite ${i * 0.5}s`
            }}
          >
            {formula}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative text-center px-6 z-10">
        {/* Animated atom icon */}
        <div className="mb-8 flex justify-center">
          <div 
            className="relative w-28 h-28 flex items-center justify-center"
            style={{
              animation: "scaleIn 0.6s ease-out"
            }}
          >
            {/* Orbits */}
            <div 
              className="absolute w-full h-full rounded-full border-2 border-primary/30"
              style={{ animation: "spin 8s linear infinite" }}
            />
            <div 
              className="absolute w-full h-full rounded-full border-2 border-secondary/30"
              style={{ 
                animation: "spin 10s linear infinite reverse",
                transform: "rotateX(60deg)"
              }}
            />
            <div 
              className="absolute w-full h-full rounded-full border-2 border-accent/30"
              style={{ 
                animation: "spin 12s linear infinite",
                transform: "rotateY(60deg)"
              }}
            />
            
            {/* Center nucleus */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                boxShadow: "0 0 30px hsl(var(--primary) / 0.5)"
              }}
            >
              <Atom className="w-6 h-6 text-primary-foreground" />
            </div>

            {/* Electrons */}
            <div 
              className="absolute w-3 h-3 rounded-full bg-primary"
              style={{
                animation: "orbit 4s linear infinite",
                boxShadow: "0 0 10px hsl(var(--primary))"
              }}
            />
          </div>
        </div>

        {/* Title with typing effect */}
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-foreground min-h-[1.2em]"
          style={{
            textShadow: "0 0 30px hsl(var(--primary) / 0.3)"
          }}
        >
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {typedText}
          </span>
          <span 
            className="inline-block w-1 h-10 ml-1 bg-primary align-middle"
            style={{ animation: "blink 1s step-end infinite" }}
          />
        </h1>

        {/* Subtitle */}
        <p 
          className="text-lg md:text-xl text-muted-foreground mb-12"
          style={{
            animation: "fadeIn 0.8s ease-out 0.5s both"
          }}
        >
          Kimyo ilmini o'rganing
        </p>

        {/* Enter button */}
        {showButtons && (
          <Button
            onClick={handleEnterApp}
            size="lg"
            className="px-8 py-6 text-lg"
            style={{
              animation: "fadeIn 0.5s ease-out"
            }}
          >
            Ilovaga Kirish
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.2; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(56px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(56px) rotate(-360deg); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
