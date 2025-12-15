import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

type Emotion = "normal" | "happy" | "surprised" | "sleeping" | "love" | "thinking";

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

const emotionEmojis: Record<Emotion, string> = {
  normal: "",
  happy: "😊",
  surprised: "😮",
  sleeping: "💤",
  love: "❤️",
  thinking: "🤔",
};

const CuteRobot = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const [showSpeech, setShowSpeech] = useState(true);
  const [isWaving, setIsWaving] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>("normal");
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const location = useLocation();

  const currentTips = tips[location.pathname] || tips["/"];

  // Preferred positions - corners and edges, away from center content
  const getSmartPosition = useCallback(() => {
    const padding = 100;
    const robotWidth = 100;
    const robotHeight = 150;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Define safe zones (corners and edges)
    const safeZones = [
      { x: padding, y: padding + 80 }, // top-left
      { x: screenW - robotWidth - padding, y: padding + 80 }, // top-right
      { x: padding, y: screenH - robotHeight - padding }, // bottom-left
      { x: screenW - robotWidth - padding, y: screenH - robotHeight - padding }, // bottom-right
      { x: screenW / 2 - robotWidth / 2, y: screenH - robotHeight - padding }, // bottom-center
    ];

    // Find the position furthest from mouse
    let bestPosition = safeZones[0];
    let maxDistance = 0;

    for (const zone of safeZones) {
      const distance = Math.sqrt(
        Math.pow(zone.x - mousePosition.x, 2) + Math.pow(zone.y - mousePosition.y, 2)
      );
      if (distance > maxDistance) {
        maxDistance = distance;
        bestPosition = zone;
      }
    }

    // Add small random offset to make it feel more natural
    return {
      x: bestPosition.x + (Math.random() - 0.5) * 40,
      y: bestPosition.y + (Math.random() - 0.5) * 40,
    };
  }, [mousePosition]);

  const moveToSafePosition = useCallback(() => {
    // Only move if mouse is too close (within 200px)
    const distance = Math.sqrt(
      Math.pow(position.x - mousePosition.x, 2) + Math.pow(position.y - mousePosition.y, 2)
    );
    
    if (distance < 200) {
      setIsMoving(true);
      setEmotion("surprised");
      const newPos = getSmartPosition();
      setPosition(newPos);
      setTimeout(() => {
        setIsMoving(false);
        setEmotion("normal");
      }, 1500);
    }
  }, [getSmartPosition, mousePosition, position]);

  // Track mouse position and user activity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setLastActivity(Date.now());
      if (emotion === "sleeping") {
        setEmotion("surprised");
        setTimeout(() => setEmotion("normal"), 1500);
      }
    };

    const handleActivity = () => {
      setLastActivity(Date.now());
      if (emotion === "sleeping") {
        setEmotion("surprised");
        setTimeout(() => setEmotion("normal"), 1500);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [emotion]);

  // Check for inactivity and set sleeping state
  useEffect(() => {
    const checkSleep = setInterval(() => {
      if (Date.now() - lastActivity > 30000 && emotion !== "sleeping") {
        setEmotion("sleeping");
        setShowSpeech(false);
      }
    }, 5000);

    return () => clearInterval(checkSleep);
  }, [lastActivity, emotion]);

  useEffect(() => {
    setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 180 });
  }, []);

  useEffect(() => {
    setCurrentTip(0);
    setShowSpeech(true);
    setIsWaving(true);
    setEmotion("happy");
    
    const waveTimer = setTimeout(() => {
      setIsWaving(false);
      setEmotion("normal");
    }, 2000);
    
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % currentTips.length);
    }, 5000);

    // Check if mouse is too close and move away
    const moveInterval = setInterval(() => {
      if (emotion !== "sleeping") {
        moveToSafePosition();
      }
    }, 3000);

    // Random emotion changes
    const emotionInterval = setInterval(() => {
      if (emotion !== "sleeping") {
        const randomEmotions: Emotion[] = ["normal", "happy", "thinking", "love"];
        const randomEmotion = randomEmotions[Math.floor(Math.random() * randomEmotions.length)];
        setEmotion(randomEmotion);
        setTimeout(() => setEmotion("normal"), 3000);
      }
    }, 15000);

    return () => {
      clearTimeout(waveTimer);
      clearInterval(tipInterval);
      clearInterval(moveInterval);
      clearInterval(emotionInterval);
    };
  }, [location.pathname, currentTips.length, moveToSafePosition, emotion]);

  const handleClick = () => {
    setLastActivity(Date.now());
    if (emotion === "sleeping") {
      setEmotion("surprised");
      setTimeout(() => setEmotion("happy"), 1000);
    } else {
      setShowSpeech(!showSpeech);
      setIsWaving(true);
      setEmotion("happy");
      setTimeout(() => {
        setIsWaving(false);
        setEmotion("normal");
      }, 1500);
    }
  };

  const handleDoubleClick = () => {
    setLastActivity(Date.now());
    setEmotion("happy");
    setIsMoving(true);
    const newPos = getSmartPosition();
    setPosition(newPos);
    setTimeout(() => {
      setIsMoving(false);
      setEmotion("normal");
    }, 1500);
  };

  // Eye rendering based on emotion
  const renderEyes = () => {
    switch (emotion) {
      case "happy":
        return (
          <>
            {/* Happy eyes - curved upward (^_^) */}
            <path d="M30 45 Q38 38 46 45" fill="none" stroke="#4DD0E1" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
            <path d="M54 45 Q62 38 70 45" fill="none" stroke="#4DD0E1" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
          </>
        );
      case "surprised":
        return (
          <>
            {/* Surprised eyes - big circles (O_O) */}
            <motion.circle
              cx="38"
              cy="45"
              r="10"
              fill="#4DD0E1"
              filter="url(#glow)"
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              cx="62"
              cy="45"
              r="10"
              fill="#4DD0E1"
              filter="url(#glow)"
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            />
            <circle cx="38" cy="45" r="4" fill="#0D0D15" />
            <circle cx="62" cy="45" r="4" fill="#0D0D15" />
          </>
        );
      case "sleeping":
        return (
          <>
            {/* Sleeping eyes - horizontal lines (-_-) */}
            <line x1="30" y1="45" x2="46" y2="45" stroke="#4DD0E1" strokeWidth="3" strokeLinecap="round" />
            <line x1="54" y1="45" x2="70" y2="45" stroke="#4DD0E1" strokeWidth="3" strokeLinecap="round" />
            {/* Z's */}
            <motion.text
              x="72"
              y="25"
              fill="#4DD0E1"
              fontSize="12"
              fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [25, 15, 5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Z
            </motion.text>
            <motion.text
              x="80"
              y="18"
              fill="#4DD0E1"
              fontSize="10"
              fontWeight="bold"
              animate={{ opacity: [0, 1, 0], y: [18, 10, 2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              z
            </motion.text>
          </>
        );
      case "love":
        return (
          <>
            {/* Love eyes - hearts */}
            <motion.path
              d="M32 42 C32 38 36 36 38 40 C40 36 44 38 44 42 C44 46 38 50 38 50 C38 50 32 46 32 42"
              fill="#FF6B9D"
              filter="url(#glow)"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.path
              d="M56 42 C56 38 60 36 62 40 C64 36 68 38 68 42 C68 46 62 50 62 50 C62 50 56 46 56 42"
              fill="#FF6B9D"
              filter="url(#glow)"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Thinking eyes - looking up and to side */}
            <ellipse cx="40" cy="43" rx="8" ry="6" fill="#4DD0E1" filter="url(#glow)" />
            <ellipse cx="64" cy="43" rx="8" ry="6" fill="#4DD0E1" filter="url(#glow)" />
            <circle cx="42" cy="42" r="2" fill="#7FEFFF" />
            <circle cx="66" cy="42" r="2" fill="#7FEFFF" />
          </>
        );
      default:
        return (
          <>
            {/* Normal eyes */}
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
            <ellipse cx="38" cy="44" rx="4" ry="2.5" fill="#7FEFFF" opacity="0.6" />
            <ellipse cx="62" cy="44" rx="4" ry="2.5" fill="#7FEFFF" opacity="0.6" />
          </>
        );
    }
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
      {/* Emotion indicator */}
      {emotionEmojis[emotion] && (
        <motion.div
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          className="text-2xl"
        >
          {emotionEmojis[emotion]}
        </motion.div>
      )}

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {showSpeech && emotion !== "sleeping" && (
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="bg-card border border-border rounded-2xl p-3 max-w-[200px] shadow-lg relative"
          >
            <p className="text-sm text-foreground">{currentTips[currentTip]}</p>
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
          animate={
            emotion === "sleeping" 
              ? { y: [0, -3, 0], rotate: [0, 2, 0, -2, 0] }
              : isMoving 
                ? { rotate: [0, -10, 10, -10, 10, 0], y: [0, -5, 0, -5, 0] }
                : { y: [0, -8, 0] }
          }
          transition={
            emotion === "sleeping"
              ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
              : isMoving
                ? { duration: 0.5, repeat: 3 }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
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
            
            {/* Dynamic eyes based on emotion */}
            {renderEyes()}

            {/* Left arm */}
            <motion.g
              animate={
                emotion === "sleeping"
                  ? { rotate: 0 }
                  : isWaving 
                    ? { rotate: [0, -60, 40, -60, 0] } 
                    : { rotate: [0, 8, 0, -8, 0] }
              }
              transition={
                emotion === "sleeping"
                  ? {}
                  : isWaving 
                    ? { duration: 0.5, repeat: 3 } 
                    : { duration: 3, repeat: Infinity }
              }
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

            {/* Right arm */}
            <motion.g
              animate={
                emotion === "sleeping"
                  ? { rotate: 0 }
                  : isWaving 
                    ? { rotate: [0, 60, -40, 60, 0] } 
                    : { rotate: [0, -8, 0, 8, 0] }
              }
              transition={
                emotion === "sleeping"
                  ? {}
                  : isWaving 
                    ? { duration: 0.5, repeat: 3 } 
                    : { duration: 3, repeat: Infinity, delay: 0.5 }
              }
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
            <motion.ellipse 
              cx="50" 
              cy="130" 
              rx="20" 
              ry="5" 
              fill={emotion === "love" ? "#FF6B9D" : "#4DD0E1"}
              opacity="0.3"
              filter="url(#glow)"
              animate={emotion === "sleeping" ? { opacity: [0.1, 0.3, 0.1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.svg>
        </motion.div>
      </div>

      {/* Hint text */}
      <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-center">
        {emotion === "sleeping" ? "Uyg'otish uchun bosing" : "2x bosing - harakatlaning"}
      </p>
    </motion.div>
  );
};

export default CuteRobot;
