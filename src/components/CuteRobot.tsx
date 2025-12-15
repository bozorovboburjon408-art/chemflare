import { useState, useEffect } from "react";
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
  const location = useLocation();

  const currentTips = tips[location.pathname] || tips["/"];

  useEffect(() => {
    setCurrentTip(0);
    setShowSpeech(true);
    setIsWaving(true);
    
    const waveTimer = setTimeout(() => setIsWaving(false), 2000);
    
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % currentTips.length);
    }, 5000);

    return () => {
      clearTimeout(waveTimer);
      clearInterval(tipInterval);
    };
  }, [location.pathname, currentTips.length]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeech && (
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="bg-card border border-border rounded-2xl rounded-br-sm p-3 max-w-[220px] shadow-lg"
          >
            <p className="text-sm text-foreground">{currentTips[currentTip]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot */}
      <div className="relative cursor-pointer group" onClick={() => setShowSpeech(!showSpeech)}>
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

        <motion.svg
          viewBox="0 0 120 160"
          className="w-24 h-32 drop-shadow-xl"
          animate={isWaving ? { rotate: [0, -5, 5, -5, 0] } : {}}
          transition={{ duration: 0.5, repeat: isWaving ? 3 : 0 }}
        >
          {/* Definitions */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E8F4FC" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4DD0E1" />
              <stop offset="100%" stopColor="#26C6DA" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Head - rounded egg shape */}
          <ellipse cx="60" cy="45" rx="35" ry="40" fill="url(#bodyGradient)" filter="url(#shadow)" />
          
          {/* Head accent - top curve */}
          <path d="M35 25 Q60 5 85 25" fill="url(#accentGradient)" />
          
          {/* Face screen */}
          <ellipse cx="60" cy="50" rx="28" ry="25" fill="#1A1A2E" />
          
          {/* Eyes - glowing cyan */}
          <motion.ellipse
            cx="48"
            cy="48"
            rx="8"
            ry="10"
            fill="#4DD0E1"
            filter="url(#glow)"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.ellipse
            cx="72"
            cy="48"
            rx="8"
            ry="10"
            fill="#4DD0E1"
            filter="url(#glow)"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          
          {/* Eye highlights */}
          <circle cx="45" cy="45" r="2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="69" cy="45" r="2" fill="#FFFFFF" opacity="0.8" />
          
          {/* Smile - when not blinking */}
          <path d="M50 60 Q60 66 70 60" fill="none" stroke="#4DD0E1" strokeWidth="2" strokeLinecap="round" />

          {/* Body - egg/oval shape */}
          <ellipse cx="60" cy="115" rx="30" ry="35" fill="url(#bodyGradient)" filter="url(#shadow)" />
          
          {/* Body accent stripes */}
          <path d="M35 100 Q60 95 85 100" fill="none" stroke="url(#accentGradient)" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 112 Q60 107 82 112" fill="none" stroke="url(#accentGradient)" strokeWidth="3" strokeLinecap="round" />
          
          {/* Neck connector */}
          <rect x="50" y="82" width="20" height="10" rx="3" fill="url(#accentGradient)" />

          {/* Left arm */}
          <motion.g
            animate={isWaving ? { rotate: [0, -30, 20, -30, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isWaving ? 3 : 0 }}
            style={{ transformOrigin: "35px 100px" }}
          >
            <ellipse cx="25" cy="100" rx="8" ry="12" fill="url(#accentGradient)" />
            <circle cx="22" cy="108" r="6" fill="url(#bodyGradient)" stroke="#4DD0E1" strokeWidth="1" />
          </motion.g>

          {/* Right arm */}
          <motion.g
            animate={isWaving ? { rotate: [0, 30, -20, 30, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isWaving ? 3 : 0 }}
            style={{ transformOrigin: "85px 100px" }}
          >
            <ellipse cx="95" cy="100" rx="8" ry="12" fill="url(#accentGradient)" />
            <circle cx="98" cy="108" r="6" fill="url(#bodyGradient)" stroke="#4DD0E1" strokeWidth="1" />
          </motion.g>

          {/* Feet */}
          <ellipse cx="48" cy="148" rx="10" ry="6" fill="url(#accentGradient)" />
          <ellipse cx="72" cy="148" rx="10" ry="6" fill="url(#accentGradient)" />
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default CuteRobot;
