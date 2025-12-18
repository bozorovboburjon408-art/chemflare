import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    // Show buttons quickly - don't make users wait
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleEnterApp = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  // Generate floating molecules - reduced for performance
  const molecules = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: 15 + (i * 20),
    y: 20 + (i * 15),
    scale: 0.35 + (i * 0.05),
    duration: 18 + (i * 2),
  })), []);

  // Shooting stars - reduced
  const shootingStars = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i,
    startX: 10 + i * 30,
    startY: 10 + i * 15,
    delay: i * 2,
  })), []);

  // Floating particles - significantly reduced for mobile
  const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + i * 12,
    y: 10 + i * 11,
    size: 3 + (i % 3),
    duration: 4 + i * 0.5,
    delay: i * 0.3,
  })), []);

  // Glowing orbs - reduced
  const orbs = useMemo(() => Array.from({ length: 3 }, (_, i) => ({
    id: i,
    x: 25 + i * 25,
    y: 35 + (i % 2) * 30,
    color: ["#00d4ff", "#a78bfa", "#ff6b6b"][i],
    size: 100 + i * 20,
  })), []);

  // Periodic table elements floating - reduced
  const elements = [
    { symbol: "H", name: "Vodorod", number: 1, color: "#00d4ff" },
    { symbol: "O", name: "Kislorod", number: 8, color: "#ff6b6b" },
    { symbol: "C", name: "Uglerod", number: 6, color: "#4ade80" },
    { symbol: "N", name: "Azot", number: 7, color: "#a78bfa" },
  ];

  // DNA helix points - reduced
  const helixPoints = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
    id: i,
    y: i * 25,
    delay: i * 0.1,
  })), []);

  // Stable bubble positions - reduced
  const bubblePositions = useMemo(() => [45, 55, 65, 50], []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 30% 20%, #0f172a 0%, #020617 50%, #000 100%)",
            zIndex: 9999,
          }}
        >
          {/* Animated grid background */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Glowing orbs - hidden on mobile for performance */}
          <div className="hidden md:block">
            {orbs.map((orb) => (
              <motion.div
                key={`orb-${orb.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${orb.x}%`,
                  top: `${orb.y}%`,
                  width: orb.size,
                  height: orb.size,
                  background: `radial-gradient(circle, ${orb.color}25 0%, transparent 70%)`,
                  filter: "blur(30px)",
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5 + orb.id,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>

          {/* Shooting stars - hidden on mobile */}
          <div className="hidden md:block">
            {shootingStars.map((star) => (
              <motion.div
                key={`star-${star.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: `${star.startX}%`,
                  top: `${star.startY}%`,
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: [0, 200],
                  y: [0, 100],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 4,
                  delay: star.delay,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #fff, transparent)",
                    borderRadius: 2,
                    transform: "rotate(45deg)",
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Floating particles - hidden on mobile */}
          <div className="hidden md:block">
            {particles.map((particle) => (
              <motion.div
                key={`particle-${particle.id}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  background: particle.id % 2 === 0 ? "#00d4ff" : "#a78bfa",
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>

          {/* Rotating atom orbits */}
          <motion.div
            className="absolute top-1/4 left-1/4 pointer-events-none hidden md:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120">
              <ellipse cx="60" cy="60" rx="55" ry="20" fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="1" />
              <motion.circle
                cx="115"
                cy="60"
                r="4"
                fill="#00d4ff"
                style={{ filter: "drop-shadow(0 0 6px #00d4ff)" }}
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-1/4 right-1/4 pointer-events-none hidden md:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <svg width="100" height="100" viewBox="0 0 100 100">
              <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="rgba(167, 139, 250, 0.3)" strokeWidth="1" transform="rotate(60 50 50)" />
              <motion.circle
                cx="95"
                cy="50"
                r="3"
                fill="#a78bfa"
                style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
              />
            </svg>
          </motion.div>

          {/* Hexagonal patterns */}
          <motion.div
            className="absolute top-10 right-10 pointer-events-none opacity-30 hidden lg:block"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 0.3, rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              {[0, 1, 2].map((ring) => (
                <polygon
                  key={ring}
                  points="100,10 180,55 180,145 100,190 20,145 20,55"
                  fill="none"
                  stroke={`rgba(0, 212, 255, ${0.3 - ring * 0.1})`}
                  strokeWidth="1"
                  transform={`scale(${1 - ring * 0.25}) translate(${ring * 33}, ${ring * 33})`}
                />
              ))}
            </svg>
          </motion.div>

          {/* Chemical bonds animation */}
          <motion.div
            className="absolute bottom-20 left-10 pointer-events-none hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <svg width="150" height="100" viewBox="0 0 150 100">
              <motion.line
                x1="20" y1="50" x2="60" y2="50"
                stroke="#00d4ff"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              />
              <motion.line
                x1="60" y1="50" x2="90" y2="20"
                stroke="#a78bfa"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 2 }}
              />
              <motion.line
                x1="60" y1="50" x2="90" y2="80"
                stroke="#ff6b6b"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              />
              <motion.circle cx="20" cy="50" r="8" fill="#00d4ff" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} style={{ filter: "drop-shadow(0 0 6px #00d4ff)" }} />
              <motion.circle cx="60" cy="50" r="10" fill="#4ade80" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} style={{ filter: "drop-shadow(0 0 6px #4ade80)" }} />
              <motion.circle cx="90" cy="20" r="6" fill="#a78bfa" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }} />
              <motion.circle cx="90" cy="80" r="6" fill="#ff6b6b" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} style={{ filter: "drop-shadow(0 0 6px #ff6b6b)" }} />
            </svg>
          </motion.div>


          {/* Floating molecules - hidden on mobile */}
          <div className="hidden lg:block">
            {molecules.map((mol) => (
              <motion.div
                key={mol.id}
                className="absolute pointer-events-none"
                style={{
                  left: `${mol.x}%`,
                  top: `${mol.y}%`,
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.25, 0],
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: mol.duration,
                  repeat: Infinity,
                  delay: mol.id * 0.5,
                }}
              >
                <svg width="50" height="50" viewBox="0 0 60 60">
                  <circle cx="30" cy="20" r="7" fill="rgba(0, 212, 255, 0.4)" />
                  <circle cx="20" cy="40" r="5" fill="rgba(255, 107, 107, 0.4)" />
                  <circle cx="40" cy="40" r="5" fill="rgba(255, 107, 107, 0.4)" />
                  <line x1="30" y1="20" x2="20" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <line x1="30" y1="20" x2="40" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* DNA Helix on left side */}
          <motion.div
            className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <svg width="80" height="350" viewBox="0 0 80 350">
              {helixPoints.map((point) => (
                <g key={point.id}>
                  <motion.circle
                    cx={40 + Math.sin(point.id * 0.5) * 25}
                    cy={point.y + 25}
                    r="4"
                    fill="#00d4ff"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, delay: point.delay, repeat: Infinity }}
                    style={{ filter: "drop-shadow(0 0 6px #00d4ff)" }}
                  />
                  <motion.circle
                    cx={40 - Math.sin(point.id * 0.5) * 25}
                    cy={point.y + 25}
                    r="4"
                    fill="#a78bfa"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, delay: point.delay + 0.1, repeat: Infinity }}
                    style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
                  />
                  {point.id % 2 === 0 && (
                    <motion.line
                      x1={40 + Math.sin(point.id * 0.5) * 25}
                      y1={point.y + 25}
                      x2={40 - Math.sin(point.id * 0.5) * 25}
                      y2={point.y + 25}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: point.delay }}
                    />
                  )}
                </g>
              ))}
            </svg>
          </motion.div>

          {/* Chemical formulas floating on right */}
          <motion.div
            className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block space-y-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {["H₂O", "CO₂", "NaCl", "H₂SO₄", "C₆H₁₂O₆"].map((formula, i) => (
              <motion.div
                key={formula}
                className="text-xl font-mono"
                style={{
                  color: "rgba(0, 212, 255, 0.6)",
                  textShadow: "0 0 10px rgba(0, 212, 255, 0.4)",
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: [0, 0.7, 0.7, 0], x: 0 }}
                transition={{ duration: 3, delay: 1 + i * 0.3, repeat: Infinity, repeatDelay: 2 }}
              >
                {formula}
              </motion.div>
            ))}
          </motion.div>

          {/* Main content */}
          <div className="relative flex flex-col items-center z-10">
            
            {/* Rotating periodic elements circle */}
            <motion.div
              className="relative w-72 h-72 md:w-96 md:h-96"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Outer glowing ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(0, 212, 255, 0.3)",
                  boxShadow: "0 0 30px rgba(0, 212, 255, 0.2), inset 0 0 30px rgba(0, 212, 255, 0.1)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Second ring */}
              <motion.div
                className="absolute inset-6 md:inset-8 rounded-full"
                style={{
                  border: "1px solid rgba(167, 139, 250, 0.3)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Floating elements around circle */}
              {elements.map((el, i) => {
                const angle = (i * 90 - 90) * (Math.PI / 180);
                const radius = 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={el.symbol}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ x, y }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-10 h-12 md:w-12 md:h-14 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${el.color}20, ${el.color}10)`,
                        border: `1px solid ${el.color}40`,
                      }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
                    >
                      <span className="text-[9px] text-white/50">{el.number}</span>
                      <span 
                        className="text-base md:text-lg font-bold"
                        style={{ color: el.color }}
                      >
                        {el.symbol}
                      </span>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Center flask with reaction */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <svg width="120" height="150" viewBox="0 0 120 150" className="drop-shadow-[0_0_30px_rgba(0,212,255,0.6)]">
                  {/* Flask body */}
                  <path
                    d="M45 20 L45 55 L20 120 Q15 140 35 140 L85 140 Q105 140 100 120 L75 55 L75 20"
                    fill="none"
                    stroke="rgba(0, 212, 255, 0.8)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Flask neck */}
                  <rect x="42" y="10" width="36" height="12" rx="3" fill="none" stroke="rgba(0, 212, 255, 0.8)" strokeWidth="2" />
                  
                  {/* Liquid with gradient */}
                  <defs>
                    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0, 212, 255, 0.9)" />
                      <stop offset="50%" stopColor="rgba(167, 139, 250, 0.7)" />
                      <stop offset="100%" stopColor="rgba(255, 107, 107, 0.6)" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  <motion.path
                    d="M25 115 Q20 135 40 135 L80 135 Q100 135 95 115 L75 60 L45 60 Z"
                    fill="url(#liquidGrad)"
                    filter="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Bubbles inside flask */}
                  {bubblePositions.map((xPos, i) => (
                    <motion.circle
                      key={i}
                      cx={xPos}
                      cy={120}
                      r={2 + (i % 3)}
                      fill="rgba(255, 255, 255, 0.7)"
                      initial={{ cy: 120, opacity: 0 }}
                      animate={{ 
                        cy: [120, 70],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 1.5 + (i * 0.1),
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                  
                  {/* Steam/vapor from top */}
                  {[0, 1].map((i) => (
                    <motion.path
                      key={`steam-${i}`}
                      d={`M${55 + i * 8} 8 Q${50 + i * 8} -5 ${55 + i * 8} -12`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 0.4, 0],
                        y: [0, -8],
                      }}
                      transition={{
                        duration: 2.5,
                        delay: 1.5 + i * 0.4,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </svg>
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-5xl md:text-7xl font-black tracking-wider mt-6"
              style={{
                background: "linear-gradient(135deg, #00d4ff 0%, #a78bfa 50%, #ff6b6b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.5))",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              CHEMFLARE
            </motion.h1>

            {/* Subtitle with typing effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mt-4 flex items-center gap-2"
            >
              <motion.div
                className="h-[2px] bg-gradient-to-r from-transparent to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              />
              <p 
                className="text-base md:text-lg tracking-[0.25em] uppercase"
                style={{
                  color: "rgba(167, 139, 250, 0.9)",
                  textShadow: "0 0 20px rgba(167, 139, 250, 0.5)",
                }}
              >
                Kimyo ilmini o'rganing
              </p>
              <motion.div
                className="h-[2px] bg-gradient-to-l from-transparent to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              />
            </motion.div>

            {/* Enter App Button and Telegram Link */}
            <AnimatePresence>
              {showButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-10 flex flex-col items-center gap-4"
                >
                  {/* Enter App Button */}
                  <motion.button
                    onClick={handleEnterApp}
                    className="group relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(167, 139, 250, 0.2))",
                      border: "2px solid rgba(0, 212, 255, 0.5)",
                      color: "#fff",
                      boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)",
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 50px rgba(0, 212, 255, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(0, 212, 255, 0.4), rgba(167, 139, 250, 0.4))",
                      }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative flex items-center gap-2">
                      Ilovaga Kirish
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
