import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [showButtons, setShowButtons] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterApp = () => {
    setIsExiting(true);
    setTimeout(onComplete, 300);
  };

  if (isExiting) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
      }}
    >
      {/* Simple background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Main content */}
      <div className="relative text-center px-6">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div 
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)"
            }}
          >
            <span className="text-4xl">⚗️</span>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-white"
          style={{
            textShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
          }}
        >
          CHEMFLARE
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-blue-200 mb-12">
          Kimyo ilmini o'rganing
        </p>

        {/* Enter button */}
        {showButtons && (
          <Button
            onClick={handleEnterApp}
            size="lg"
            className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0"
          >
            Ilovaga Kirish
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntroAnimation;
