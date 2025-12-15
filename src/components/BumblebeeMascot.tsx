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
      
      {/* Iroqi Do'ppi - Square traditional Uzbek cap */}
      {/* Main square dome shape */}
      <rect x="28" y="6" width="44" height="18" rx="3" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="0.5"/>
      
      {/* Center zigzag/chevron spine pattern */}
      <path d="M50 6 L52 9 L50 12 L52 15 L50 18 L52 21 L50 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
      <path d="M50 6 L48 9 L50 12 L48 15 L50 18 L48 21 L50 24" fill="none" stroke="#1A1A1A" strokeWidth="1.5"/>
      
      {/* Left side floral patterns */}
      <circle cx="36" cy="12" r="3" fill="#C41E3A"/>
      <circle cx="36" cy="12" r="1.5" fill="#FFD700"/>
      <circle cx="32" cy="16" r="2" fill="#C41E3A"/>
      <circle cx="40" cy="16" r="2" fill="#C41E3A"/>
      <rect x="34" y="18" width="4" height="3" fill="#1A1A1A"/>
      
      {/* Right side floral patterns */}
      <circle cx="64" cy="12" r="3" fill="#C41E3A"/>
      <circle cx="64" cy="12" r="1.5" fill="#FFD700"/>
      <circle cx="60" cy="16" r="2" fill="#C41E3A"/>
      <circle cx="68" cy="16" r="2" fill="#C41E3A"/>
      <rect x="62" y="18" width="4" height="3" fill="#1A1A1A"/>
      
      {/* Small decorative dots */}
      <circle cx="44" cy="10" r="0.8" fill="#1A1A1A"/>
      <circle cx="56" cy="10" r="0.8" fill="#1A1A1A"/>
      <circle cx="44" cy="18" r="0.8" fill="#1A1A1A"/>
      <circle cx="56" cy="18" r="0.8" fill="#1A1A1A"/>
      
      {/* Bottom edge */}
      <line x1="28" y1="24" x2="72" y2="24" stroke="#1A1A1A" strokeWidth="1"/>
      
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

// Boy Robot SVG Component (Piko - Young boy with Uzbek doppi)
const BoyRobot = ({ 
  isWaving = false, 
  isTalking = false,
  name = "Piko"
}: { 
  isWaving?: boolean;
  isTalking?: boolean;
  name?: string;
}) => {
  const primaryColor = "#4CAF50"; // Green
  const glowColor = "#81C784"; // Light green
  
  return (
    <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-lg">
      {/* Glow effect */}
      <defs>
        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="bodyGrad-boy" cx="30%" cy="30%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#E8F5E9"/>
        </radialGradient>
      </defs>
      
      {/* Uzbek Doppi - Realistic Traditional Cap */}
      {/* Main dome shape */}
      <path d="M26 28 Q26 6 50 4 Q74 6 74 28" fill="#1A1A1A"/>
      <ellipse cx="50" cy="28" rx="24" ry="5" fill="#1A1A1A"/>
      
      {/* Top decorative swirl pattern */}
      <path d="M40 12 Q50 8 60 12" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round"/>
      <path d="M42 10 Q50 14 58 10" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="50" cy="8" r="1.5" fill="#FFFFFF"/>
      <circle cx="44" cy="11" r="0.8" fill="#FFFFFF"/>
      <circle cx="56" cy="11" r="0.8" fill="#FFFFFF"/>
      
      {/* Middle decorative band with geometric patterns */}
      <rect x="28" y="18" width="44" height="8" fill="#1A1A1A"/>
      <line x1="28" y1="18" x2="72" y2="18" stroke="#FFFFFF" strokeWidth="0.5"/>
      <line x1="28" y1="26" x2="72" y2="26" stroke="#FFFFFF" strokeWidth="0.5"/>
      
      {/* Geometric rectangle patterns in the band */}
      <rect x="30" y="20" width="6" height="4" fill="none" stroke="#FFFFFF" strokeWidth="0.6" rx="0.5"/>
      <rect x="38" y="20" width="6" height="4" fill="none" stroke="#FFFFFF" strokeWidth="0.6" rx="0.5"/>
      <rect x="46" y="20" width="8" height="4" fill="none" stroke="#FFFFFF" strokeWidth="0.6" rx="0.5"/>
      <rect x="56" y="20" width="6" height="4" fill="none" stroke="#FFFFFF" strokeWidth="0.6" rx="0.5"/>
      <rect x="64" y="20" width="6" height="4" fill="none" stroke="#FFFFFF" strokeWidth="0.6" rx="0.5"/>
      
      {/* Small dots between rectangles */}
      <circle cx="37" cy="22" r="0.6" fill="#FFFFFF"/>
      <circle cx="45" cy="22" r="0.6" fill="#FFFFFF"/>
      <circle cx="55" cy="22" r="0.6" fill="#FFFFFF"/>
      <circle cx="63" cy="22" r="0.6" fill="#FFFFFF"/>
      
      {/* Bottom border with zigzag/wave pattern */}
      <path d="M28 27 L30 25 L32 27 L34 25 L36 27 L38 25 L40 27 L42 25 L44 27 L46 25 L48 27 L50 25 L52 27 L54 25 L56 27 L58 25 L60 27 L62 25 L64 27 L66 25 L68 27 L70 25 L72 27" 
        fill="none" stroke="#FFFFFF" strokeWidth="0.6"/>
      
      {/* Head - rounded rectangle shape */}
      <rect x="28" y="32" width="44" height="28" rx="12" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
      
      {/* Face screen */}
      <rect x="32" y="36" width="36" height="20" rx="8" fill="#1A1A2E"/>
      
      {/* Eyes - cute round eyes */}
      <motion.ellipse 
        cx="42" cy="46" rx="5" ry={isTalking ? 4 : 5}
        fill={glowColor} 
        filter="url(#glow-green)"
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
        cx="58" cy="46" rx="5" ry={isTalking ? 4 : 5}
        fill={glowColor} 
        filter="url(#glow-green)"
        animate={{ 
          scaleY: isTalking ? [1, 0.7, 1] : 1,
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: isTalking ? 0.3 : 2,
          repeat: Infinity
        }}
      />
      
      {/* Smile */}
      {isTalking ? (
        <motion.path 
          d="M44 52 Q50 56 56 52" 
          fill="none" 
          stroke={glowColor} 
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ d: ["M44 52 Q50 56 56 52", "M44 52 Q50 54 56 52", "M44 52 Q50 56 56 52"] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
      ) : (
        <path d="M44 51 Q50 55 56 51" fill="none" stroke={glowColor} strokeWidth="2" strokeLinecap="round"/>
      )}
      
      {/* Body - rounded rectangle, not egg shape */}
      <rect x="32" y="62" width="36" height="44" rx="10" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
      
      {/* Body accent - shirt */}
      <path d="M36 65 Q50 62 64 65 L62 90 Q50 94 38 90 Z" fill={primaryColor} opacity="0.7"/>
      
      {/* Buttons */}
      <circle cx="50" cy="75" r="2" fill="#FFFFFF"/>
      <circle cx="50" cy="83" r="2" fill="#FFFFFF"/>
      
      {/* Arms */}
      <motion.g
        animate={isWaving ? { rotate: [0, -30, 0] } : {}}
        transition={{ duration: 0.5, repeat: isWaving ? Infinity : 0, repeatDelay: 0.4 }}
        style={{ transformOrigin: "32px 78px" }}
      >
        <rect x="20" y="70" width="12" height="18" rx="5" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
        <rect x="22" y="74" width="8" height="10" rx="3" fill={primaryColor} opacity="0.4"/>
      </motion.g>
      
      <rect x="68" y="70" width="12" height="18" rx="5" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
      <rect x="70" y="74" width="8" height="10" rx="3" fill={primaryColor} opacity="0.4"/>
      
      {/* Feet */}
      <rect x="36" y="106" width="12" height="8" rx="4" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
      <rect x="52" y="106" width="12" height="8" rx="4" fill="url(#bodyGrad-boy)" stroke="#C8E6C9" strokeWidth="1"/>
      
      {/* Name tag */}
      <text x="50" y="100" textAnchor="middle" fontSize="5" fill="#666666" fontFamily="Arial">{name}</text>
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
