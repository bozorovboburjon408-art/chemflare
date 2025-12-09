import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
      setTimeout(() => onComplete(), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a1a 0%, #0d1829 50%, #0a0a1a 100%)",
        }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Glow effects background */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(0,200,255,0.3) 0%, transparent 70%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col items-center">
          {/* Flask and Atom Container */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Atom orbits */}
            {phase >= 1 && (
              <>
                <motion.div
                  className="absolute w-64 h-64 border border-cyan-400/30 rounded-full"
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: 360 }}
                  transition={{ duration: 1.5, rotate: { duration: 8, repeat: Infinity, ease: "linear" } }}
                  style={{ boxShadow: "0 0 20px rgba(0,200,255,0.2)" }}
                >
                  <motion.div
                    className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                    style={{ 
                      top: "50%", 
                      left: "-6px",
                      boxShadow: "0 0 15px 5px rgba(0,200,255,0.8)",
                    }}
                  />
                </motion.div>

                <motion.div
                  className="absolute w-48 h-48 border border-cyan-400/30 rounded-full"
                  style={{ transform: "rotateX(60deg)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: -360 }}
                  transition={{ duration: 1.2, rotate: { duration: 6, repeat: Infinity, ease: "linear" } }}
                >
                  <motion.div
                    className="absolute w-2.5 h-2.5 bg-cyan-300 rounded-full"
                    style={{ 
                      top: "-5px", 
                      left: "50%",
                      boxShadow: "0 0 12px 4px rgba(0,200,255,0.8)",
                    }}
                  />
                </motion.div>

                <motion.div
                  className="absolute w-56 h-56 border border-cyan-400/30 rounded-full"
                  style={{ transform: "rotateY(60deg)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: 360 }}
                  transition={{ duration: 1.3, rotate: { duration: 10, repeat: Infinity, ease: "linear" } }}
                >
                  <motion.div
                    className="absolute w-2 h-2 bg-cyan-200 rounded-full"
                    style={{ 
                      bottom: "-4px", 
                      left: "50%",
                      boxShadow: "0 0 10px 3px rgba(0,200,255,0.8)",
                    }}
                  />
                </motion.div>
              </>
            )}

            {/* Central Flask */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <svg width="120" height="160" viewBox="0 0 120 160" className="drop-shadow-2xl">
                {/* Flask outline */}
                <defs>
                  <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0,200,255,0.1)" />
                    <stop offset="100%" stopColor="rgba(0,200,255,0.3)" />
                  </linearGradient>
                  <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="50%" stopColor="#0099ff" />
                    <stop offset="100%" stopColor="#0066cc" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Flask body */}
                <path
                  d="M45 10 L45 60 L15 130 Q10 145 25 150 L95 150 Q110 145 105 130 L75 60 L75 10 Z"
                  fill="url(#flaskGradient)"
                  stroke="rgba(0,200,255,0.6)"
                  strokeWidth="2"
                  filter="url(#glow)"
                />
                
                {/* Flask neck */}
                <rect x="42" y="5" width="36" height="15" rx="3" 
                  fill="transparent" 
                  stroke="rgba(0,200,255,0.6)" 
                  strokeWidth="2"
                  filter="url(#glow)"
                />
                
                {/* Liquid */}
                <motion.path
                  d="M20 120 Q30 110 45 115 Q60 120 75 115 Q90 110 100 120 L105 130 Q108 142 95 147 L25 147 Q12 142 15 130 Z"
                  fill="url(#liquidGradient)"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Bubbles */}
                {[...Array(6)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={35 + i * 10}
                    cy={140}
                    r={2 + Math.random() * 2}
                    fill="rgba(0,200,255,0.8)"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ 
                      y: [-20 - i * 15, -60 - i * 10],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ 
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </svg>

              {/* Nucleus glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-400"
                style={{ boxShadow: "0 0 30px 15px rgba(0,200,255,0.6)" }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            {/* Digital lines emanating from atom */}
            {phase >= 2 && (
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"
                    style={{
                      width: 60 + i * 20,
                      top: -20 + i * 12,
                      right: -80,
                      boxShadow: "0 0 10px rgba(0,200,255,0.5)",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: [0, 1, 0.5] }}
                    transition={{ 
                      duration: 0.6, 
                      delay: i * 0.1,
                      opacity: { duration: 2, repeat: Infinity }
                    }}
                  />
                ))}
                {/* Digital dots */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`dot-${i}`}
                    className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
                    style={{
                      right: -100 - i * 25,
                      top: 5 + i * 8,
                      boxShadow: "0 0 8px rgba(0,200,255,0.8)",
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* XIMIYA Text */}
          {phase >= 3 && (
            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-6xl md:text-7xl font-bold tracking-wider"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#00d4ff",
                  textShadow: `
                    0 0 10px rgba(0,200,255,0.8),
                    0 0 20px rgba(0,200,255,0.6),
                    0 0 40px rgba(0,200,255,0.4),
                    0 0 80px rgba(0,200,255,0.2)
                  `,
                }}
                animate={{
                  textShadow: [
                    "0 0 10px rgba(0,200,255,0.8), 0 0 20px rgba(0,200,255,0.6), 0 0 40px rgba(0,200,255,0.4)",
                    "0 0 15px rgba(0,200,255,1), 0 0 30px rgba(0,200,255,0.8), 0 0 60px rgba(0,200,255,0.6)",
                    "0 0 10px rgba(0,200,255,0.8), 0 0 20px rgba(0,200,255,0.6), 0 0 40px rgba(0,200,255,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                XIMIYA
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                className="text-center mt-4 text-cyan-300/70 text-lg tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                CHEMFLARE
              </motion.p>
            </motion.div>
          )}

          {/* Loading indicator */}
          {phase >= 4 && (
            <motion.div
              className="mt-12 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-cyan-400 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  style={{ boxShadow: "0 0 10px rgba(0,200,255,0.8)" }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroAnimation;
