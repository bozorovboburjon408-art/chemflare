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
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate bubbles
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 15 + Math.random() * 20,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 1,
    size: 2 + Math.random() * 4,
  }));

  // Electron orbit positions
  const electrons = [
    { angle: 0, orbitSize: 35, speed: 2 },
    { angle: 120, orbitSize: 50, speed: 3 },
    { angle: 240, orbitSize: 65, speed: 2.5 },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at center, #0a1628 0%, #030712 100%)",
          }}
        >
          {/* Noise texture overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Main visual container */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* Flask */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-8 bottom-16"
              >
                <svg width="100" height="140" viewBox="0 0 100 140" className="drop-shadow-[0_0_20px_rgba(0,200,255,0.8)]">
                  {/* Flask outline */}
                  <path
                    d="M35 10 L35 50 L10 120 Q5 135 20 135 L80 135 Q95 135 90 120 L65 50 L65 10"
                    fill="none"
                    stroke="rgba(0, 200, 255, 0.8)"
                    strokeWidth="2"
                  />
                  {/* Flask neck */}
                  <rect x="33" y="5" width="34" height="8" rx="2" fill="none" stroke="rgba(0, 200, 255, 0.8)" strokeWidth="2" />
                  
                  {/* Liquid inside */}
                  <motion.path
                    d="M15 115 Q10 130 25 130 L75 130 Q90 130 85 115 L65 55 L35 55 Z"
                    fill="url(#liquidGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0, 200, 255, 0.9)" />
                      <stop offset="100%" stopColor="rgba(0, 100, 200, 0.7)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Bubbles */}
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    className="absolute rounded-full"
                    style={{
                      left: bubble.x,
                      bottom: 30,
                      width: bubble.size,
                      height: bubble.size,
                      background: "rgba(0, 200, 255, 0.8)",
                      boxShadow: "0 0 6px rgba(0, 200, 255, 0.8)",
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: [-80, -120],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: bubble.duration,
                      delay: bubble.delay,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ))}

                {/* Sparks */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`spark-${i}`}
                    className="absolute"
                    style={{
                      left: 20 + Math.random() * 30,
                      bottom: 40,
                      width: 2,
                      height: 2,
                      background: "#fff",
                      boxShadow: "0 0 8px rgba(255, 255, 255, 0.9)",
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: [-60, -100],
                      x: [0, (Math.random() - 0.5) * 20],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 0.5,
                      delay: i * 0.4,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>

              {/* Atom with orbiting electrons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute right-4 top-12"
              >
                <div className="relative w-36 h-36">
                  {/* Nucleus */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(0, 200, 255, 1) 0%, rgba(0, 150, 200, 0.8) 100%)",
                      boxShadow: "0 0 20px rgba(0, 200, 255, 0.9), 0 0 40px rgba(0, 200, 255, 0.5)",
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Orbits and electrons */}
                  {electrons.map((electron, i) => (
                    <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {/* Orbit ring */}
                      <motion.div
                        className="absolute rounded-full border"
                        style={{
                          width: electron.orbitSize * 2,
                          height: electron.orbitSize * 2,
                          top: -electron.orbitSize,
                          left: -electron.orbitSize,
                          borderColor: "rgba(0, 200, 255, 0.3)",
                          transform: `rotate(${30 * i}deg) rotateX(60deg)`,
                        }}
                      />
                      
                      {/* Electron */}
                      <motion.div
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          background: "#00c8ff",
                          boxShadow: "0 0 10px rgba(0, 200, 255, 1), 0 0 20px rgba(0, 200, 255, 0.6)",
                          transformOrigin: `${-electron.orbitSize + 6}px 0`,
                        }}
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: electron.speed,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Digital/Tech lines */}
                <motion.div
                  className="absolute -right-16 top-1/2 -translate-y-1/2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  {[0, 8, 16, 24, 32].map((y, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: y - 16,
                        left: 0,
                        height: 2,
                        background: "linear-gradient(90deg, rgba(0, 200, 255, 0.8) 0%, transparent 100%)",
                        boxShadow: "0 0 6px rgba(0, 200, 255, 0.6)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: 40 + Math.random() * 30 }}
                      transition={{ duration: 0.5, delay: 1.2 + i * 0.1 }}
                    />
                  ))}
                  
                  {/* Data nodes */}
                  {[0, 16, 32].map((y, i) => (
                    <motion.div
                      key={`node-${i}`}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        top: y - 16 - 1,
                        left: 50 + i * 15,
                        background: "#00c8ff",
                        boxShadow: "0 0 8px rgba(0, 200, 255, 0.8)",
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
                      transition={{ duration: 0.3, delay: 1.5 + i * 0.15, repeat: Infinity, repeatDelay: 2 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* KIMYO Text */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-6xl md:text-7xl font-bold tracking-wider mt-4"
              style={{
                color: "#00c8ff",
                textShadow: "0 0 20px rgba(0, 200, 255, 0.8), 0 0 40px rgba(0, 200, 255, 0.5), 0 0 60px rgba(0, 200, 255, 0.3)",
                fontFamily: "'Inter', 'Arial', sans-serif",
              }}
            >
              CHEMFLARE
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-lg md:text-xl tracking-[0.3em] mt-4 uppercase"
              style={{
                color: "rgba(0, 200, 255, 0.7)",
                textShadow: "0 0 10px rgba(0, 200, 255, 0.5)",
              }}
            >
              Kimyo ilmini o'rganing
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 flex items-center gap-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: "#00c8ff",
                    boxShadow: "0 0 8px rgba(0, 200, 255, 0.8)",
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
