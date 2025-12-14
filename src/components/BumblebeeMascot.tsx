import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Movie-accurate Bumblebee colors
const YELLOW_MAIN = "#E8B923";
const YELLOW_DARK = "#B8860B";
const BLACK_METAL = "#0a0a0a";
const CHROME = "#C0C0C0";
const BLUE_ENERGY = "#00BFFF";
const BLUE_CORE = "#4169E1";

// Page tips configuration
const pageTips: Record<string, { tips: string[]; position: "left" | "right" }> = {
  "/": {
    tips: [
      "Bu yerda barcha kimyoviy elementlarni ko'rishingiz mumkin!",
      "Har bir elementni bosib, batafsil ma'lumot oling",
      "Davriy jadval - kimyoning asosi!",
      "Element ustiga bosing - atom tuzilishini ko'ring",
    ],
    position: "right"
  },
  "/reactions": {
    tips: [
      "Kimyoviy reaksiyalarni o'rganing!",
      "Reaksiya turlarini tanlang va kuzating",
      "3D molekulalar animatsiyasini tomosha qiling",
      "100+ laboratoriya reaksiyalari mavjud",
    ],
    position: "left"
  },
  "/learning": {
    tips: [
      "O'yin tarzida kimyoni o'rganing!",
      "Daraja oshirib, bilimingizni sinang",
      "Kitoblardan savollar ishlang",
      "AI yordamida test yarating",
    ],
    position: "right"
  },
  "/library": {
    tips: [
      "Kimyo kitoblarini o'qing!",
      "Har bir bob bo'yicha savollar mavjud",
      "PDF formatda yuklab oling",
      "Boshlang'ichdan murakkabgacha",
    ],
    position: "left"
  },
  "/quiz": {
    tips: [
      "Test rasmini yuklang - AI tahlil qiladi!",
      "Ko'p variantli savollar avtomatik yaratiladi",
      "Javoblaringizni tekshiring",
      "Natijalaringizni saqlang",
    ],
    position: "right"
  },
  "/calculator": {
    tips: [
      "Har qanday kimyoviy masalani yeching!",
      "Rasm yuklang - AI o'qiydi",
      "Molyar massa, pH, konsentratsiya...",
      "Batafsil yechim va tushuntirish",
    ],
    position: "left"
  },
  "/experiments": {
    tips: [
      "Kimyoviy tajribalar videolarini tomosha qiling!",
      "Xavfsiz laboratoriya tajribalari",
      "Qiziqarli reaksiyalar",
      "O'rganish uchun eng yaxshi usul!",
    ],
    position: "right"
  },
  "/developers": {
    tips: [
      "Ilova haqida ma'lumot",
      "Jamoa a'zolari bilan tanishing",
      "Bizning maqsadimiz - kimyoni osonlashtirish!",
    ],
    position: "left"
  },
};

// Energy Sphere with plasma effect
const EnergySphere = () => {
  const sphereRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.15 + Math.random() * 0.1;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (sphereRef.current) {
      const pulse = 1 + Math.sin(time * 8) * 0.15;
      sphereRef.current.scale.setScalar(pulse);
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 3;
      coreRef.current.rotation.y = time * 4;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 5;
      ring1Ref.current.rotation.z = time * 3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = time * 4;
      ring2Ref.current.rotation.x = time * -2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 2;
      particlesRef.current.rotation.x = time * 1.5;
    }
  });

  return (
    <group ref={sphereRef} position={[0, 0.1, 0.35]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.08, 2]} />
        <meshStandardMaterial color={BLUE_CORE} emissive={BLUE_CORE} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.14, 0.008, 8, 32]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.16, 0.006, 8, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color={BLUE_ENERGY} size={0.015} transparent opacity={0.8} sizeAttenuation />
      </points>
      <pointLight color={BLUE_ENERGY} intensity={2} distance={1} />
    </group>
  );
};

// Detailed Bumblebee Head
const MovieBumblebeeHead = () => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.12;
      headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05 - 0.1;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.15, 0]}>
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.3]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.02, 0.15]}>
        <boxGeometry args={[0.28, 0.18, 0.12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[-0.07, 0.03, 0.22]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.22]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={5} />
      </mesh>
      <pointLight position={[-0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={0.5} distance={0.5} />
      <pointLight position={[0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={0.5} distance={0.5} />
      <group position={[-0.12, 0.22, 0]} rotation={[0.2, 0, 0.25]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.025, 0.12, 8]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} />
        </mesh>
      </group>
      <group position={[0.12, 0.22, 0]} rotation={[0.2, 0, -0.25]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.025, 0.12, 8]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} />
        </mesh>
      </group>
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.18, 0.15]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.04, 0.18, 0.15]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.12, 0.12]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Chest with Autobot emblem
const MovieBumblebeeChest = () => {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh>
        <boxGeometry args={[0.55, 0.45, 0.28]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.145]}>
        <boxGeometry args={[0.3, 0.35, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.05, 0.16]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.3, 0.08, 0.05]}>
        <boxGeometry args={[0.06, 0.3, 0.2]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0.3, 0.08, 0.05]}>
        <boxGeometry args={[0.06, 0.3, 0.2]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[-0.32, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.32, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.22]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};

// Animated Arms
const MovieBumblebeeArm = ({ side }: { side: "left" | "right" }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);

  const xPos = side === "left" ? -0.42 : 0.42;
  const mirror = side === "left" ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (armRef.current) {
      const armAngle = Math.sin(time * 2) * 0.08;
      armRef.current.rotation.z = (side === "left" ? 0.6 : -0.6) + armAngle;
      armRef.current.rotation.x = -0.4 + Math.sin(time * 1.5) * 0.05;
    }
    if (forearmRef.current) {
      forearmRef.current.rotation.x = 0.8 + Math.sin(time * 2.5) * 0.1;
    }
    if (handRef.current) {
      const openClose = Math.sin(time * 3) * 0.15;
      handRef.current.rotation.x = 0.3 + openClose;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.75, 0]}>
      <mesh position={[mirror * 0.05, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[mirror * 0.02, -0.12, 0]}>
        <boxGeometry args={[0.09, 0.2, 0.09]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.88} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.24, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.08} />
      </mesh>
      <group ref={forearmRef} position={[0, -0.28, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.08, 0.18, 0.08]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.88} roughness={0.15} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
        </mesh>
        <group ref={handRef} position={[0, -0.28, 0.02]}>
          <mesh>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
            <meshStandardMaterial color={CHROME} metalness={0.92} roughness={0.12} />
          </mesh>
          {[-0.025, 0, 0.025].map((offset, i) => (
            <group key={i} position={[offset, -0.05, 0]}>
              <mesh>
                <boxGeometry args={[0.018, 0.035, 0.02]} />
                <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};

// Main Robot Assembly
const MovieBumblebeeRobot = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.025;
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.06;
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, -0.15, 0]}>
      <MovieBumblebeeHead />
      <MovieBumblebeeChest />
      <MovieBumblebeeArm side="left" />
      <MovieBumblebeeArm side="right" />
      <EnergySphere />
    </group>
  );
};

// Speech Bubble Component
const SpeechBubble = ({ text, position }: { text: string; position: "left" | "right" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`absolute ${position === "right" ? "right-full mr-3" : "left-full ml-3"} top-1/2 -translate-y-1/2 
        max-w-[180px] md:max-w-[220px] pointer-events-auto`}
    >
      <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
        text-primary-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-elegant border border-primary/30">
        <p className="leading-relaxed">{text}</p>
        
        {/* Speech bubble arrow */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 
            ${position === "right" 
              ? "right-0 translate-x-full border-l-8 border-l-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent" 
              : "left-0 -translate-x-full border-r-8 border-r-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent"
            }`}
          style={{
            borderTopWidth: "6px",
            borderBottomWidth: "6px",
          }}
        />
      </div>
    </motion.div>
  );
};

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [isFlying, setIsFlying] = useState(false);
  const [targetPosition, setTargetPosition] = useState<"left" | "right">("right");

  // Get current page tips
  const currentPageTips = pageTips[location.pathname] || pageTips["/"];
  const tips = currentPageTips.tips;
  const tipPosition = currentPageTips.position;

  // Change tip periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setShowTip(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [tips.length, location.pathname]);

  // Reset tip index when page changes and trigger fly animation
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(false);
    setIsFlying(true);
    setTargetPosition(tipPosition);
    
    setTimeout(() => {
      setIsFlying(false);
      setShowTip(true);
    }, 800);
  }, [location.pathname, tipPosition]);

  // Calculate position based on tip position
  const positionStyles = targetPosition === "right" 
    ? { right: "8px", left: "auto" }
    : { left: "8px", right: "auto" };

  return (
    <motion.div
      className="fixed top-24 z-30 select-none w-[100px] h-[130px] md:w-[110px] md:h-[140px]"
      style={positionStyles}
      initial={{ opacity: 0, y: -50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: isFlying ? (targetPosition === "right" ? [0, 50, 0] : [0, -50, 0]) : 0,
        rotate: isFlying ? [0, 5, -5, 0] : 0,
      }}
      transition={{ 
        duration: isFlying ? 0.8 : 0.5,
        ease: "easeInOut"
      }}
    >
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showTip && !isFlying && (
          <SpeechBubble 
            text={tips[currentTipIndex]} 
            position={targetPosition === "right" ? "left" : "right"} 
          />
        )}
      </AnimatePresence>

      {/* 3D Robot Canvas */}
      <div className="w-full h-full pointer-events-none">
        <Canvas
          camera={{ position: [0, 0.2, 2.2], fov: 50 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 5, 2]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-3, 2, 4]} intensity={0.6} color={BLUE_ENERGY} />
          <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFE4B5" />
          <spotLight position={[0, 3, 3]} angle={0.5} penumbra={0.8} intensity={1} castShadow />
          <MovieBumblebeeRobot />
        </Canvas>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 60%)` }}
      />
    </motion.div>
  );
};

export default BumblebeeMascot;
