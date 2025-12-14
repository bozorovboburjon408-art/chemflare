import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate floating molecules
  const molecules = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: 0.3 + Math.random() * 0.4,
    duration: 15 + Math.random() * 10,
  }));

  // Periodic table elements floating
  const elements = [
    { symbol: "H", name: "Vodorod", number: 1, color: "#00d4ff" },
    { symbol: "O", name: "Kislorod", number: 8, color: "#ff6b6b" },
    { symbol: "C", name: "Uglerod", number: 6, color: "#4ade80" },
    { symbol: "N", name: "Azot", number: 7, color: "#a78bfa" },
    { symbol: "Fe", name: "Temir", number: 26, color: "#fbbf24" },
    { symbol: "Au", name: "Oltin", number: 79, color: "#f59e0b" },
  ];

  // DNA helix points
  const helixPoints = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    y: i * 15,
    delay: i * 0.05,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 30% 20%, #0f172a 0%, #020617 50%, #000 100%)",
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

          {/* Floating molecules in background */}
          {molecules.map((mol) => (
            <motion.div
              key={mol.id}
              className="absolute pointer-events-none"
              style={{
                left: `${mol.x}%`,
                top: `${mol.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0.3, 0],
                scale: mol.scale,
                x: [0, 50, -30, 0],
                y: [0, -30, 20, 0],
              }}
              transition={{
                duration: mol.duration,
                repeat: Infinity,
                delay: mol.id * 0.3,
              }}
            >
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="20" r="8" fill="rgba(0, 212, 255, 0.4)" />
                <circle cx="20" cy="40" r="6" fill="rgba(255, 107, 107, 0.4)" />
                <circle cx="40" cy="40" r="6" fill="rgba(255, 107, 107, 0.4)" />
                <line x1="30" y1="20" x2="20" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="30" y1="20" x2="40" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              </svg>
            </motion.div>
          ))}

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
                const angle = (i * 60 - 90) * (Math.PI / 180);
                const radius = 130;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={el.symbol}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ x, y }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                    }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
                  >
                    <motion.div
                      className="w-12 h-14 md:w-14 md:h-16 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${el.color}20, ${el.color}10)`,
                        border: `1px solid ${el.color}50`,
                        boxShadow: `0 0 20px ${el.color}30`,
                      }}
                      animate={{ 
                        y: [0, -5, 0],
                        boxShadow: [
                          `0 0 20px ${el.color}30`,
                          `0 0 30px ${el.color}50`,
                          `0 0 20px ${el.color}30`,
                        ]
                      }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      <span className="text-[10px] text-white/50">{el.number}</span>
                      <span 
                        className="text-lg md:text-xl font-bold"
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
                  {[...Array(8)].map((_, i) => (
                    <motion.circle
                      key={i}
                      cx={40 + Math.random() * 40}
                      cy={120}
                      r={2 + Math.random() * 3}
                      fill="rgba(255, 255, 255, 0.7)"
                      initial={{ cy: 120, opacity: 0 }}
                      animate={{ 
                        cy: [120, 70],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 1.5 + Math.random(),
                        delay: i * 0.2,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                  
                  {/* Steam/vapor from top */}
                  {[...Array(3)].map((_, i) => (
                    <motion.path
                      key={`steam-${i}`}
                      d={`M${55 + i * 5} 8 Q${50 + i * 5} -5 ${55 + i * 5} -15`}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ opacity: 0, pathLength: 0 }}
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        pathLength: [0, 1],
                        y: [0, -10],
                      }}
                      transition={{
                        duration: 2,
                        delay: 1.5 + i * 0.3,
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

            {/* Loading bar */}
            <motion.div
              className="mt-8 w-48 h-1 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.1)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #00d4ff, #a78bfa, #ff6b6b)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 2, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Atom particles around loading */}
            <div className="relative mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i === 0 ? "#00d4ff" : i === 1 ? "#a78bfa" : "#ff6b6b",
                    boxShadow: `0 0 10px ${i === 0 ? "#00d4ff" : i === 1 ? "#a78bfa" : "#ff6b6b"}`,
                    left: `${i * 20 - 20}px`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
