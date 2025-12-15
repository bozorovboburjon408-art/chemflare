import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Robot names - chemistry themed
const ROBOT_1_NAME = "Nano"; // Nanometr
const ROBOT_2_NAME = "Piko"; // Pikometr

// Intro sequences - SHORT
const robot1Intro = [
  `Salom! Men ${ROBOT_1_NAME}!`,
  "Kimyo o'rganamiz!",
];

const robot2Intro = [
  `Men ${ROBOT_2_NAME}!`,
  "Birga o'rganamiz!",
];

// Knowledge base - SHORTENED tips
const knowledgeBase: string[] = [
  // Elements - short
  "H - Vodorod, eng yengil",
  "He - Geliy, sharlar uchun",
  "Li - Litiy, batareyalarda",
  "C - Uglerod, hayot asosi",
  "N - Azot, havo 78%",
  "O - Kislorod, nafas olish",
  "Na - Natriy, tuzda NaCl",
  "Mg - Magniy, yorqin yonadi",
  "Al - Alyuminiy, yengil metall",
  "Si - Kremniy, chiplar asosi",
  "S - Oltingugurt, sariq rangli",
  "Cl - Xlor, dezinfeksiya",
  "K - Kaliy, o'simliklar uchun",
  "Ca - Kalsiy, suyaklarda",
  "Fe - Temir, qonda mavjud",
  "Cu - Mis, simlar uchun",
  "Zn - Rux, immunitet uchun",
  "Ag - Kumush, eng yaxshi o'tkazgich",
  "Au - Oltin, cho'ziluvchan",
  "Hg - Simob, suyuq metall",
  
  // Formulas - short
  "H₂O - Suv formulasi",
  "CO₂ - Karbonat angidrid",
  "NaCl - Osh tuzi",
  "H₂SO₄ - Sulfat kislota",
  "NaOH - Natriy gidroksid",
  "CaCO₃ - Ohaktosh",
  "NH₃ - Ammiak",
  "CH₄ - Metan gazi",
  
  // Laws - short
  "pH = -log[H⁺]",
  "PV = nRT - gaz qonuni",
  "m = M × n - massa",
  "V = n × 22.4 L",
  "C = n/V - konsentratsiya",
  
  // Tips - short
  "Kislota + Ishqor = Tuz + Suv",
  "Oksidlanish = e⁻ yo'qotish",
  "Qaytarilish = e⁻ olish",
  "Mol = 6.022×10²³ zarracha",
  "STP: 0°C, 1 atm",
  
  // Fun facts - short
  "Olmos va grafit - uglerod!",
  "Qon qizil = temir",
  "O'simlik yashil = magniy",
  "Oltin zanglamaydi",
  "Simob suyuq metall",
];

// Page-specific tips - SHORT
const pageTips: Record<string, string[]> = {
  "/": [
    "Bosh sahifaga xush kelibsiz!",
    "Kimyoni birga o'rganamiz!",
    "Menyudan bo'lim tanlang",
  ],
  "/periodic-table": [
    "Davriy jadval - 118 element",
    "Elementni bosing - ma'lumot",
    "Ranglar - element turlari",
  ],
  "/calculator": [
    "Masalani yozing, yeching",
    "Formulalar bilan ishlang",
    "Rasm ham yuklash mumkin",
  ],
  "/learning": [
    "O'rganish - 10 daraja",
    "Testlarni yeching",
    "Ball to'plang!",
  ],
  "/library": [
    "Kimyo kitoblari",
    "PDF yuklang, o'qing",
    "Boblar va savollar",
  ],
  "/quiz": [
    "Test yuklab yeching",
    "To'g'ri javobni toping",
    "Natijangizni ko'ring",
  ],
  "/experiments": [
    "Kimyo tajribalari",
    "Videolarni ko'ring",
    "Xavfsizlik muhim!",
  ],
  "/reactions": [
    "Reaksiyalar kutubxonasi",
    "100+ reaksiya mavjud",
    "Qidiruv orqali toping",
  ],
  "/developers": [
    "Jamoa haqida ma'lumot",
    "Loyiha yaratuvchilari",
    "Telegram orqali bog'laning",
  ],
};

// Girl Robot SVG Component (Nano - Pink/Purple)
const GirlRobot = ({ 
  isWaving = false, 
  isTalking = false,
  name = "Nano"
}: { 
  isWaving?: boolean;
  isTalking?: boolean;
  name?: string;
}) => {
  const primaryColor = "#FF69B4"; // Hot pink
  const glowColor = "#FF1493"; // Deep pink
  const accentColor = "#9B59B6"; // Purple
  
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-lg">
      {/* Glow effect */}
      <defs>
        <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="bodyGrad-pink" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#FFE4EC"/>
        </radialGradient>
      </defs>
      
      {/* Bow on head */}
      <g transform="translate(50, 8)">
        <ellipse cx="-12" cy="0" rx="8" ry="5" fill={primaryColor}/>
        <ellipse cx="12" cy="0" rx="8" ry="5" fill={primaryColor}/>
        <circle cx="0" cy="0" r="4" fill={glowColor}/>
      </g>
      
      {/* Antenna with heart */}
      <line x1="50" y1="12" x2="50" y2="22" stroke="#FFCCDD" strokeWidth="2"/>
      <path d="M50 8 C47 5, 44 8, 50 14 C56 8, 53 5, 50 8" fill={glowColor}/>
      
      {/* Head - slightly rounder */}
      <ellipse cx="50" cy="40" rx="26" ry="22" fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
      
      {/* Face screen */}
      <ellipse cx="50" cy="42" rx="20" ry="15" fill="#1A1A2E"/>
      
      {/* Eyes with eyelashes */}
      <motion.g
        animate={{ 
          scaleY: isTalking ? [1, 0.7, 1] : 1
        }}
        transition={{ 
          duration: isTalking ? 0.3 : 2,
          repeat: Infinity
        }}
      >
        {/* Left eye */}
        <ellipse cx="40" cy="42" rx="5" ry="5" fill={glowColor} filter="url(#glow-pink)"/>
        {/* Left eyelashes */}
        <line x1="36" y1="35" x2="34" y2="32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="40" y1="34" x2="40" y2="30" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="44" y1="35" x2="46" y2="32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
        
        {/* Right eye */}
        <ellipse cx="60" cy="42" rx="5" ry="5" fill={glowColor} filter="url(#glow-pink)"/>
        {/* Right eyelashes */}
        <line x1="56" y1="35" x2="54" y2="32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="60" y1="34" x2="60" y2="30" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="64" y1="35" x2="66" y2="32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round"/>
      </motion.g>
      
      {/* Blush circles */}
      <circle cx="32" cy="46" r="4" fill="#FFB6C1" opacity="0.6"/>
      <circle cx="68" cy="46" r="4" fill="#FFB6C1" opacity="0.6"/>
      
      {/* Smile */}
      {isTalking ? (
        <motion.ellipse 
          cx="50" cy="51" rx="6" ry="3"
          fill={glowColor}
          animate={{ ry: [3, 2, 3] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      ) : (
        <path d="M44 50 Q50 54 56 50" fill="none" stroke={glowColor} strokeWidth="2" strokeLinecap="round"/>
      )}
      
      {/* Body - hourglass shape */}
      <path d="M30 65 Q28 90 35 115 L65 115 Q72 90 70 65 Q60 72 50 72 Q40 72 30 65 Z" 
        fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
      
      {/* Body accent - dress style */}
      <path d="M35 70 Q50 75 65 70 L62 95 Q50 100 38 95 Z" fill={primaryColor} opacity="0.7"/>
      
      {/* Heart on chest */}
      <path d="M50 80 C47 77, 43 80, 50 88 C57 80, 53 77, 50 80" fill={glowColor}/>
      
      {/* Arms */}
      <motion.g
        animate={isWaving ? { rotate: [0, -35, 0] } : {}}
        transition={{ duration: 0.5, repeat: isWaving ? Infinity : 0, repeatDelay: 0.4 }}
        style={{ transformOrigin: "28px 78px" }}
      >
        <ellipse cx="22" cy="82" rx="7" ry="10" fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
        <ellipse cx="22" cy="82" rx="4" ry="6" fill={primaryColor} opacity="0.4"/>
      </motion.g>
      
      <ellipse cx="78" cy="82" rx="7" ry="10" fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
      <ellipse cx="78" cy="82" rx="4" ry="6" fill={primaryColor} opacity="0.4"/>
      
      {/* Skirt detail */}
      <path d="M35 100 Q50 105 65 100 L68 115 Q50 120 32 115 Z" fill={accentColor} opacity="0.5"/>
      
      {/* Feet - with small heels */}
      <ellipse cx="40" cy="120" rx="9" ry="5" fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
      <ellipse cx="60" cy="120" rx="9" ry="5" fill="url(#bodyGrad-pink)" stroke="#FFDDEE" strokeWidth="1"/>
      <rect x="36" y="120" width="8" height="3" fill={primaryColor} rx="1"/>
      <rect x="56" y="120" width="8" height="3" fill={primaryColor} rx="1"/>
      
      {/* Name tag */}
      <text x="50" y="108" textAnchor="middle" fontSize="5" fill="#666666" fontFamily="Arial">{name}</text>
    </svg>
  );
};

// Boy Robot SVG Component (Piko - Cyan/Blue)
const BoyRobot = ({ 
  isWaving = false, 
  isTalking = false,
  name = "Piko"
}: { 
  isWaving?: boolean;
  isTalking?: boolean;
  name?: string;
}) => {
  const primaryColor = "#00BCD4";
  const glowColor = "#00E5FF";
  
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-lg">
      {/* Glow effect */}
      <defs>
        <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="bodyGrad-cyan" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E8E8E8"/>
        </radialGradient>
      </defs>
      
      {/* Antenna */}
      <ellipse cx="50" cy="12" rx="8" ry="4" fill={primaryColor}/>
      <line x1="50" y1="16" x2="50" y2="25" stroke="#CCCCCC" strokeWidth="3"/>
      
      {/* Head */}
      <ellipse cx="50" cy="40" rx="28" ry="22" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
      
      {/* Face screen */}
      <ellipse cx="50" cy="42" rx="22" ry="16" fill="#1A1A2E"/>
      
      {/* Eyes */}
      <motion.ellipse 
        cx="40" cy="42" rx="6" ry={isTalking ? 4 : 5} 
        fill={glowColor} 
        filter="url(#glow-cyan)"
        animate={{ 
          scaleY: isTalking ? [1, 0.7, 1] : 1,
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: isTalking ? 0.3 : 2,
          repeat: Infinity
        }}
      />
      <motion.ellipse 
        cx="60" cy="42" rx="6" ry={isTalking ? 4 : 5} 
        fill={glowColor} 
        filter="url(#glow-cyan)"
        animate={{ 
          scaleY: isTalking ? [1, 0.7, 1] : 1,
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: isTalking ? 0.3 : 2,
          repeat: Infinity
        }}
      />
      
      {/* Smile when talking */}
      {isTalking && (
        <motion.path 
          d="M42 50 Q50 55 58 50" 
          fill="none" 
          stroke={glowColor} 
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ d: ["M42 50 Q50 55 58 50", "M42 50 Q50 52 58 50", "M42 50 Q50 55 58 50"] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      )}
      
      {/* Body */}
      <ellipse cx="50" cy="90" rx="22" ry="28" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
      
      {/* Body accent */}
      <path d="M38 75 Q50 70 62 75 L60 95 Q50 100 40 95 Z" fill={primaryColor} opacity="0.8"/>
      
      {/* Chest circle */}
      <circle cx="50" cy="85" r="6" fill={primaryColor} stroke="#FFFFFF" strokeWidth="1"/>
      <circle cx="50" cy="85" r="3" fill={glowColor}>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      
      {/* Arms */}
      <motion.g
        animate={isWaving ? { rotate: [0, -30, 0] } : {}}
        transition={{ duration: 0.6, repeat: isWaving ? Infinity : 0, repeatDelay: 0.5 }}
        style={{ transformOrigin: "30px 80px" }}
      >
        <ellipse cx="22" cy="85" rx="8" ry="12" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
        <ellipse cx="22" cy="85" rx="5" ry="8" fill={primaryColor} opacity="0.5"/>
      </motion.g>
      
      <ellipse cx="78" cy="85" rx="8" ry="12" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
      <ellipse cx="78" cy="85" rx="5" ry="8" fill={primaryColor} opacity="0.5"/>
      
      {/* Feet */}
      <ellipse cx="40" cy="118" rx="10" ry="6" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
      <ellipse cx="60" cy="118" rx="10" ry="6" fill="url(#bodyGrad-cyan)" stroke="#DDDDDD" strokeWidth="1"/>
      
      {/* Name tag */}
      <text x="50" y="105" textAnchor="middle" fontSize="6" fill="#666666" fontFamily="Arial">{name}</text>
    </svg>
  );
};

// Speech Bubble Component - COMPACT
const SpeechBubble = ({ text, isRight }: { text: string; isRight: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 10 }}
    transition={{ duration: 0.2 }}
    className={`absolute ${isRight ? 'right-full mr-2' : 'left-full ml-2'} top-1/4 z-50`}
  >
    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-gray-200 max-w-[160px] sm:max-w-[180px]">
      <p className="text-xs sm:text-sm text-gray-800 font-medium leading-tight">{text}</p>
      <div 
        className={`absolute top-4 ${isRight ? '-right-2' : '-left-2'} w-0 h-0 
          border-t-[6px] border-t-transparent 
          border-b-[6px] border-b-transparent 
          ${isRight ? 'border-l-[8px] border-l-white' : 'border-r-[8px] border-r-white'}`}
      />
    </div>
  </motion.div>
);

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [robot1Pos, setRobot1Pos] = useState({ x: 110, y: 60 });
  const [robot2Pos, setRobot2Pos] = useState({ x: -10, y: 60 });
  const [showRobot2, setShowRobot2] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<"robot1" | "robot2">("robot1");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [shuffledTips, setShuffledTips] = useState<string[]>([]);
  const [hasLanded, setHasLanded] = useState(false);
  
  const [robot1Target, setRobot1Target] = useState({ x: 80, y: 60 });
  const [robot2Target, setRobot2Target] = useState({ x: 20, y: 60 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setIsUserActive(true);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 3000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    activityTimeoutRef.current = setTimeout(() => setIsUserActive(false), 3000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, []);

  // Show second robot after delay
  useEffect(() => {
    if (isUserActive || isHidden) return;
    const timer = setTimeout(() => setShowRobot2(true), 3000);
    return () => clearTimeout(timer);
  }, [isUserActive, isHidden]);

  // Get page-specific tips
  useEffect(() => {
    const path = location.pathname;
    const tips = pageTips[path] || pageTips["/"];
    const combined = [...tips, ...knowledgeBase.slice(0, 20)].sort(() => Math.random() - 0.5);
    setShuffledTips(combined);
    setCurrentTipIndex(0);
    setIsFirstMessage(true);
    setIntroStep(0);
    setCurrentSpeaker("robot1");
    setShowTip(false);
    setHasLanded(false);
    
    // Reset positions
    setRobot1Pos({ x: 110, y: 60 });
    setRobot2Pos({ x: -10, y: 60 });
    setRobot1Target({ x: 80, y: 60 });
    setRobot2Target({ x: 20, y: 60 });
  }, [location.pathname]);

  // Robots enter from sides, land, then speak
  useEffect(() => {
    if (isUserActive || isHidden) return;

    setRobot1Target({ x: 80, y: 60 });
    if (showRobot2) {
      setRobot2Target({ x: 20, y: 60 });
    }

    const landingTimer = setTimeout(() => {
      setHasLanded(true);
      setShowTip(true);
    }, 2000);

    return () => clearTimeout(landingTimer);
  }, [showRobot2, isUserActive, isHidden]);

  // Smooth position update
  useEffect(() => {
    if (isUserActive) return;
    
    const animationInterval = setInterval(() => {
      const speed = hasLanded ? 0.02 : 0.06;
      setRobot1Pos(prev => ({
        x: prev.x + (robot1Target.x - prev.x) * speed,
        y: prev.y + (robot1Target.y - prev.y) * speed
      }));
      setRobot2Pos(prev => ({
        x: prev.x + (robot2Target.x - prev.x) * speed,
        y: prev.y + (robot2Target.y - prev.y) * speed
      }));
    }, 50);

    return () => clearInterval(animationInterval);
  }, [robot1Target, robot2Target, isUserActive, hasLanded]);

  // Alternate speakers
  useEffect(() => {
    if (isUserActive || !hasLanded) return;

    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        if (isFirstMessage) {
          const nextStep = introStep + 1;
          
          if (currentSpeaker === "robot1") {
            if (nextStep >= robot1Intro.length) {
              setCurrentSpeaker("robot2");
              setIntroStep(0);
            } else {
              setIntroStep(nextStep);
            }
          } else {
            if (nextStep >= robot2Intro.length) {
              setIsFirstMessage(false);
              setIntroStep(0);
              setCurrentSpeaker("robot1");
            } else {
              setIntroStep(nextStep);
            }
          }
        } else {
          setCurrentSpeaker(prev => prev === "robot1" ? "robot2" : "robot1");
          setCurrentTipIndex(prev => (prev + 1) % shuffledTips.length);
        }
        
        setShowTip(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [isUserActive, currentSpeaker, shuffledTips.length, isFirstMessage, introStep, hasLanded]);

  // Current tip text
  const displayTip = useMemo(() => {
    if (isFirstMessage) {
      if (currentSpeaker === "robot1") {
        return robot1Intro[introStep] || robot1Intro[0];
      } else {
        return robot2Intro[introStep] || robot2Intro[0];
      }
    }
    if (shuffledTips.length === 0) return knowledgeBase[0];
    return shuffledTips[currentTipIndex % shuffledTips.length];
  }, [isFirstMessage, currentSpeaker, introStep, shuffledTips, currentTipIndex]);

  // Handle click
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - move to random position
        setRobot1Target({ x: 70 + Math.random() * 20, y: 50 + Math.random() * 20 });
        if (showRobot2) {
          setRobot2Target({ x: 10 + Math.random() * 20, y: 50 + Math.random() * 20 });
        }
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 1) {
      clearTimeout(clickTimerRef.current!);
      setIsHidden(true);
      setClickCount(0);
    }
  }, [clickCount, showRobot2]);

  if (isHidden) return null;

  return (
    <AnimatePresence>
      {!isUserActive && (
        <>
          {/* Robot 1 - Kimchi (Cyan) */}
          <motion.div
            className="fixed z-30 select-none w-[80px] h-[110px] sm:w-[100px] sm:h-[140px] cursor-pointer"
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              left: `${robot1Pos.x}%`,
              top: `${robot1Pos.y}%`,
              x: "-50%",
              y: "-50%",
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ 
              duration: 0.3,
              left: { duration: 1, ease: "easeOut" },
              top: { duration: 1, ease: "easeOut" },
            }}
          >
            <AnimatePresence mode="wait">
              {showTip && currentSpeaker === "robot1" && (
                <SpeechBubble text={displayTip} isRight={robot1Pos.x > 50} />
              )}
            </AnimatePresence>

            <GirlRobot 
              isWaving={showTip && currentSpeaker === "robot1"} 
              isTalking={showTip && currentSpeaker === "robot1"}
              name={ROBOT_1_NAME}
            />
          </motion.div>

          {/* Robot 2 - Atomik (Mint) */}
          <AnimatePresence>
            {showRobot2 && (
              <motion.div
                className="fixed z-30 select-none w-[80px] h-[110px] sm:w-[100px] sm:h-[140px] cursor-pointer"
                onClick={handleClick}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  left: `${robot2Pos.x}%`,
                  top: `${robot2Pos.y}%`,
                  x: "-50%",
                  y: "-50%",
                }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ 
                  duration: 0.3,
                  left: { duration: 1, ease: "easeOut" },
                  top: { duration: 1, ease: "easeOut" },
                }}
              >
                <AnimatePresence mode="wait">
                  {showTip && currentSpeaker === "robot2" && (
                    <SpeechBubble text={displayTip} isRight={robot2Pos.x > 50} />
                  )}
                </AnimatePresence>

                <BoyRobot 
                  isWaving={showTip && currentSpeaker === "robot2"} 
                  isTalking={showTip && currentSpeaker === "robot2"}
                  name={ROBOT_2_NAME}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default BumblebeeMascot;
