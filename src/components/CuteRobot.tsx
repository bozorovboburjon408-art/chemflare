import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const tips: Record<string, string[]> = {
  "/": [
    "Davriy jadvaldan elementlarni o'rganishingiz mumkin!",
    "Har bir element haqida batafsil ma'lumot olish uchun ustiga bosing.",
    "Kimyoni o'rganish qiziqarli!",
  ],
  "/quiz": [
    "AI yordamida test yarating!",
    "Rasmdan test yuklash ham mumkin.",
    "Bilimingizni sinab ko'ring!",
  ],
  "/calculator": [
    "Kimyoviy masalalarni yechishda yordam beraman!",
    "Molyar massa, pH, konsentratsiya hisoblash mumkin.",
    "Savolingizni yozing, javob topamiz!",
  ],
  "/library": [
    "Kimyo kitoblarini o'qing va o'rganing!",
    "Har bir bobda nazorat savollari bor.",
    "PDF formatda yuklab olish mumkin.",
  ],
  "/reactions": [
    "Kimyoviy reaksiyalarni o'rganing!",
    "100+ laboratoriya reaksiyalari mavjud.",
    "3D animatsiyalar bilan ko'ring!",
  ],
  "/experiments": [
    "Kimyoviy tajribalar videolarini ko'ring!",
    "Xavfsizlik qoidalariga rioya qiling.",
    "Tajribalarni uyda takrorlamang!",
  ],
  "/developers": [
    "Loyiha yaratuvchilari bilan tanishing!",
    "Fikr va takliflar uchun bog'laning.",
  ],
};

const CuteRobot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [showSpeech, setShowSpeech] = useState(true);
  const [isWaving, setIsWaving] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const location = useLocation();

  const currentTips = tips[location.pathname] || tips["/"];

  const getRandomPosition = useCallback(() => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 200;
    return {
      x: Math.max(20, Math.random() * maxX),
      y: Math.max(100, Math.random() * maxY),
    };
  }, []);

  const moveToRandomPosition = useCallback(() => {
    setIsMoving(true);
    const newPos = getRandomPosition();
    setPosition(newPos);
    setTimeout(() => setIsMoving(false), 2000);
  }, [getRandomPosition]);

  useEffect(() => {
    // Set initial position
    setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 180 });
  }, []);

  useEffect(() => {
    setCurrentTip(0);
    setShowSpeech(true);
    setIsWaving(true);
    
    const waveTimer = setTimeout(() => setIsWaving(false), 2000);
    
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % currentTips.length);
    }, 5000);

    // Move randomly every 8-15 seconds
    const moveInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        moveToRandomPosition();
      }
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(waveTimer);
      clearInterval(tipInterval);
      clearInterval(moveInterval);
    };
  }, [location.pathname, currentTips.length, moveToRandomPosition]);

  const handleClick = () => {
    setShowSpeech(!showSpeech);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1500);
  };

  const handleDoubleClick = () => {
    moveToRandomPosition();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15,
        x: { duration: 2, ease: "easeInOut" },
        y: { duration: 2, ease: "easeInOut" },
      }}
      className="fixed top-0 left-0 z-50 flex flex-col items-center gap-2"
      style={{ pointerEvents: "auto" }}
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeech && (
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="bg-card border border-border rounded-2xl p-3 max-w-[200px] shadow-lg relative"
          >
            <p className="text-sm text-foreground">{currentTips[currentTip]}</p>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot */}
      <div 
        className="relative cursor-pointer group" 
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <motion.div
          animate={isMoving ? {
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -5, 0, -5, 0],
          } : {
            y: [0, -8, 0],
          }}
          transition={isMoving ? {
            duration: 0.5,
            repeat: 3,
          } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.svg
            viewBox="0 0 100 140"
            className="w-20 h-28 md:w-24 md:h-32 drop-shadow-xl"
            animate={isWaving ? { rotate: [0, -5, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: isWaving ? 3 : 0 }}
          >
            {/* Definitions */}
            <defs>
              <linearGradient id="eveBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F8FCFF" />
                <stop offset="100%" stopColor="#E0F2F7" />
              </linearGradient>
              <linearGradient id="eveShine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
              </filter>
              <filter id="innerGlow">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Main body - single smooth egg shape like EVE */}
            <ellipse 
              cx="50" 
              cy="65" 
              rx="35" 
              ry="55" 
              fill="url(#eveBody)" 
              filter="url(#softShadow)"
            />
            
            {/* Subtle body shine/highlight */}
            <ellipse 
              cx="38" 
              cy="45" 
              rx="15" 
              ry="30" 
              fill="url(#eveShine)"
            />

            {/* Face screen - sleek black visor */}
            <ellipse 
              cx="50" 
              cy="45" 
              rx="28" 
              ry="18" 
              fill="#0D0D15"
            />
            
            {/* Eyes - glowing cyan oval eyes like EVE */}
            <motion.ellipse
              cx="38"
              cy="45"
              rx="9"
              ry="6"
              fill="#4DD0E1"
              filter="url(#glow)"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
            />
            <motion.ellipse
              cx="62"
              cy="45"
              rx="9"
              ry="6"
              fill="#4DD0E1"
              filter="url(#glow)"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
            />
            
            {/* Eye inner glow */}
            <ellipse cx="38" cy="44" rx="4" ry="2.5" fill="#7FEFFF" opacity="0.6" />
            <ellipse cx="62" cy="44" rx="4" ry="2.5" fill="#7FEFFF" opacity="0.6" />

            {/* Left arm - sleek floating arm */}
            <motion.g
              animate={isWaving ? { rotate: [0, -60, 40, -60, 0] } : { rotate: [0, 8, 0, -8, 0] }}
              transition={isWaving ? { duration: 0.5, repeat: 3 } : { duration: 3, repeat: Infinity }}
              style={{ transformOrigin: "20px 70px" }}
            >
              <ellipse 
                cx="8" 
                cy="70" 
                rx="8" 
                ry="20" 
                fill="url(#eveBody)" 
                filter="url(#softShadow)"
              />
            </motion.g>

            {/* Right arm - sleek floating arm */}
            <motion.g
              animate={isWaving ? { rotate: [0, 60, -40, 60, 0] } : { rotate: [0, -8, 0, 8, 0] }}
              transition={isWaving ? { duration: 0.5, repeat: 3 } : { duration: 3, repeat: Infinity, delay: 0.5 }}
              style={{ transformOrigin: "80px 70px" }}
            >
              <ellipse 
                cx="92" 
                cy="70" 
                rx="8" 
                ry="20" 
                fill="url(#eveBody)" 
                filter="url(#softShadow)"
              />
            </motion.g>

            {/* Bottom glow effect - hovering */}
            <ellipse 
              cx="50" 
              cy="130" 
              rx="20" 
              ry="5" 
              fill="#4DD0E1" 
              opacity="0.3"
              filter="url(#glow)"
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        2x bosing - harakatlaning
      </p>
    </motion.div>
  );
};

export default CuteRobot;
