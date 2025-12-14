import { useRef, useState, useEffect, useMemo, useCallback } from "react";
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

// Gesture types
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "clap" | "think" | "celebrate" | "salute";

// Page tips configuration
const pageTips: Record<string, string[]> = {
  "/": [
    "Bu yerda barcha kimyoviy elementlarni ko'rishingiz mumkin!",
    "Har bir elementni bosib, batafsil ma'lumot oling",
    "Davriy jadval - kimyoning asosi!",
    "Element ustiga bosing - atom tuzilishini ko'ring",
  ],
  "/reactions": [
    "Kimyoviy reaksiyalarni o'rganing!",
    "Reaksiya turlarini tanlang va kuzating",
    "3D molekulalar animatsiyasini tomosha qiling",
    "100+ laboratoriya reaksiyalari mavjud",
  ],
  "/learning": [
    "O'yin tarzida kimyoni o'rganing!",
    "Daraja oshirib, bilimingizni sinang",
    "Kitoblardan savollar ishlang",
    "AI yordamida test yarating",
  ],
  "/library": [
    "Kimyo kitoblarini o'qing!",
    "Har bir bob bo'yicha savollar mavjud",
    "PDF formatda yuklab oling",
    "Boshlang'ichdan murakkabgacha",
  ],
  "/quiz": [
    "Test rasmini yuklang - AI tahlil qiladi!",
    "Ko'p variantli savollar avtomatik yaratiladi",
    "Javoblaringizni tekshiring",
    "Natijalaringizni saqlang",
  ],
  "/calculator": [
    "Har qanday kimyoviy masalani yeching!",
    "Rasm yuklang - AI o'qiydi",
    "Molyar massa, pH, konsentratsiya...",
    "Batafsil yechim va tushuntirish",
  ],
  "/experiments": [
    "Kimyoviy tajribalar videolarini tomosha qiling!",
    "Xavfsiz laboratoriya tajribalari",
    "Qiziqarli reaksiyalar",
    "O'rganish uchun eng yaxshi usul!",
  ],
  "/developers": [
    "Ilova haqida ma'lumot",
    "Jamoa a'zolari bilan tanishing",
    "Bizning maqsadimiz - kimyoni osonlashtirish!",
  ],
};

// Gesture context to share between components
const GestureContext = {
  current: "idle" as GestureType,
  time: 0,
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
    const gesture = GestureContext.current;
    
    // Scale based on gesture
    const baseScale = gesture === "celebrate" ? 1.5 : gesture === "thumbsUp" ? 1.2 : 1;
    
    if (sphereRef.current) {
      const pulse = baseScale + Math.sin(time * 8) * 0.15;
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

// Detailed Bumblebee Head with gestures
const MovieBumblebeeHead = () => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const gesture = GestureContext.current;
    
    if (headRef.current) {
      // Different head movements based on gesture
      switch (gesture) {
        case "wave":
          headRef.current.rotation.y = Math.sin(time * 3) * 0.2;
          headRef.current.rotation.z = Math.sin(time * 2) * 0.1;
          break;
        case "think":
          headRef.current.rotation.y = 0.3;
          headRef.current.rotation.x = Math.sin(time * 0.5) * 0.1 - 0.15;
          break;
        case "celebrate":
          headRef.current.rotation.y = Math.sin(time * 4) * 0.25;
          headRef.current.rotation.z = Math.sin(time * 3) * 0.15;
          break;
        case "salute":
          headRef.current.rotation.y = 0;
          headRef.current.rotation.x = -0.15;
          break;
        case "point":
          headRef.current.rotation.y = -0.25;
          headRef.current.rotation.x = -0.1;
          break;
        default:
          headRef.current.rotation.y = Math.sin(time * 0.7) * 0.12;
          headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05 - 0.1;
      }
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

// Animated Arms with gesture support
const MovieBumblebeeArm = ({ side }: { side: "left" | "right" }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);

  const xPos = side === "left" ? -0.42 : 0.42;
  const mirror = side === "left" ? -1 : 1;
  const isLeft = side === "left";

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const gesture = GestureContext.current;
    
    if (!armRef.current || !forearmRef.current || !handRef.current) return;

    // Gesture-based arm animations
    switch (gesture) {
      case "wave":
        if (isLeft) {
          // Waving arm
          armRef.current.rotation.z = -1.2 + Math.sin(time * 8) * 0.3;
          armRef.current.rotation.x = -0.5;
          forearmRef.current.rotation.x = 0.4 + Math.sin(time * 10) * 0.2;
          handRef.current.rotation.z = Math.sin(time * 12) * 0.5;
        } else {
          // Relaxed arm
          armRef.current.rotation.z = -0.4;
          armRef.current.rotation.x = -0.2;
          forearmRef.current.rotation.x = 0.5;
        }
        break;
        
      case "point":
        if (isLeft) {
          // Pointing arm
          armRef.current.rotation.z = -0.8;
          armRef.current.rotation.x = -0.6;
          armRef.current.rotation.y = -0.3;
          forearmRef.current.rotation.x = 0.2;
          handRef.current.rotation.x = 0;
        } else {
          armRef.current.rotation.z = -0.4;
          armRef.current.rotation.x = -0.2;
          forearmRef.current.rotation.x = 0.5;
        }
        break;
        
      case "thumbsUp":
        if (!isLeft) {
          // Thumbs up arm
          armRef.current.rotation.z = -0.6;
          armRef.current.rotation.x = -0.8 + Math.sin(time * 2) * 0.1;
          forearmRef.current.rotation.x = 1.2;
          handRef.current.rotation.x = 0.5;
          handRef.current.rotation.z = 0.3;
        } else {
          armRef.current.rotation.z = 0.4;
          armRef.current.rotation.x = -0.2;
          forearmRef.current.rotation.x = 0.5;
        }
        break;
        
      case "clap":
        // Both arms come together for clapping
        const clapPhase = Math.sin(time * 8);
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (0.5 + clapPhase * 0.3);
        armRef.current.rotation.x = -0.7;
        forearmRef.current.rotation.x = 1 + clapPhase * 0.2;
        handRef.current.rotation.x = 0.3;
        break;
        
      case "think":
        if (!isLeft) {
          // Hand on chin thinking
          armRef.current.rotation.z = -0.3;
          armRef.current.rotation.x = -0.4;
          forearmRef.current.rotation.x = 1.8;
          handRef.current.rotation.x = 0.2;
        } else {
          armRef.current.rotation.z = 0.6;
          armRef.current.rotation.x = -0.4;
          forearmRef.current.rotation.x = 0.8;
        }
        break;
        
      case "celebrate":
        // Both arms up celebrating
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (-1.3 + Math.sin(time * 5 + (isLeft ? 0 : Math.PI)) * 0.2);
        armRef.current.rotation.x = -0.3 + Math.sin(time * 3) * 0.1;
        forearmRef.current.rotation.x = 0.3 + Math.sin(time * 6) * 0.2;
        handRef.current.rotation.z = Math.sin(time * 8 + (isLeft ? 0 : Math.PI)) * 0.3;
        break;
        
      case "salute":
        if (!isLeft) {
          // Saluting
          armRef.current.rotation.z = -0.7;
          armRef.current.rotation.x = -0.5;
          forearmRef.current.rotation.x = 2.2;
          handRef.current.rotation.x = 0;
        } else {
          armRef.current.rotation.z = 0.6;
          armRef.current.rotation.x = -0.4;
          forearmRef.current.rotation.x = 0.8;
        }
        break;
        
      default: // idle
        const armAngle = Math.sin(time * 2) * 0.08;
        armRef.current.rotation.z = (isLeft ? 0.6 : -0.6) + armAngle;
        armRef.current.rotation.x = -0.4 + Math.sin(time * 1.5) * 0.05;
        armRef.current.rotation.y = 0;
        forearmRef.current.rotation.x = 0.8 + Math.sin(time * 2.5) * 0.1;
        handRef.current.rotation.x = 0.3 + Math.sin(time * 3) * 0.15;
        handRef.current.rotation.z = 0;
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
const MovieBumblebeeRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    GestureContext.current = gesture;
    GestureContext.time = time;
    
    if (groupRef.current) {
      // Different body movements based on gesture
      switch (gesture) {
        case "celebrate":
          groupRef.current.position.y = Math.sin(time * 4) * 0.05;
          groupRef.current.rotation.y = Math.sin(time * 2) * 0.15;
          break;
        case "wave":
          groupRef.current.position.y = Math.sin(time * 2) * 0.02;
          groupRef.current.rotation.y = 0.1;
          break;
        case "think":
          groupRef.current.position.y = 0;
          groupRef.current.rotation.y = 0.15;
          break;
        default:
          groupRef.current.position.y = Math.sin(time * 1.5) * 0.025;
          groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.06;
      }
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
const SpeechBubble = ({ text, position }: { text: string; position: { x: number; y: number } }) => {
  // Determine bubble direction based on position
  const isOnRight = position.x > 50;
  const isOnBottom = position.y > 50;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="absolute pointer-events-auto"
      style={{
        [isOnRight ? 'right' : 'left']: '100%',
        [isOnRight ? 'marginRight' : 'marginLeft']: '12px',
        top: isOnBottom ? 'auto' : '50%',
        bottom: isOnBottom ? '50%' : 'auto',
        transform: `translateY(${isOnBottom ? '50%' : '-50%'})`,
      }}
    >
      <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
        text-primary-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-elegant border border-primary/30
        max-w-[160px] md:max-w-[200px]">
        <p className="leading-relaxed">{text}</p>
        
        {/* Speech bubble arrow */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 
            ${isOnRight 
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

// Random position generator
const generateRandomPosition = () => {
  // Keep robot within visible area with padding
  const padding = 15;
  const x = padding + Math.random() * (100 - 2 * padding);
  const y = padding + Math.random() * (100 - 2 * padding);
  return { x, y };
};

// List of gestures
const gestures: GestureType[] = ["idle", "wave", "point", "thumbsUp", "clap", "think", "celebrate", "salute"];

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [position, setPosition] = useState({ x: 85, y: 15 });
  const [targetPosition, setTargetPosition] = useState({ x: 85, y: 15 });
  const [isFlying, setIsFlying] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>("idle");
  const [rotation, setRotation] = useState(0);

  // Get current page tips
  const tips = pageTips[location.pathname] || pageTips["/"];

  // Random gesture selector
  const selectRandomGesture = useCallback(() => {
    const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
    setCurrentGesture(randomGesture);
    
    // Reset to idle after gesture duration
    setTimeout(() => {
      setCurrentGesture("idle");
    }, 3000);
  }, []);

  // Fly to random position
  const flyToRandomPosition = useCallback(() => {
    const newPos = generateRandomPosition();
    setTargetPosition(newPos);
    setIsFlying(true);
    
    // Calculate rotation based on direction
    const dx = newPos.x - position.x;
    const angle = dx > 0 ? 10 : -10;
    setRotation(angle);
    
    // Smooth transition
    setTimeout(() => {
      setPosition(newPos);
      setIsFlying(false);
      setRotation(0);
      selectRandomGesture();
    }, 1500);
  }, [position, selectRandomGesture]);

  // Main animation loop - fly around and change gestures
  useEffect(() => {
    // Initial delay
    const initialDelay = setTimeout(() => {
      flyToRandomPosition();
    }, 2000);

    // Regular flying interval
    const flyInterval = setInterval(() => {
      flyToRandomPosition();
    }, 8000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(flyInterval);
    };
  }, [flyToRandomPosition]);

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
  }, [tips.length]);

  // Reset tip index and fly when page changes
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(false);
    flyToRandomPosition();
    
    setTimeout(() => {
      setShowTip(true);
    }, 1500);
  }, [location.pathname]);

  return (
    <motion.div
      className="fixed z-30 select-none w-[100px] h-[130px] md:w-[110px] md:h-[140px]"
      animate={{ 
        left: `${position.x}%`,
        top: `${position.y}%`,
        x: "-50%",
        y: "-50%",
        rotate: rotation,
        scale: isFlying ? 1.1 : 1,
      }}
      transition={{ 
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1],
        scale: { duration: 0.3 }
      }}
    >
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showTip && !isFlying && (
          <SpeechBubble 
            text={tips[currentTipIndex]} 
            position={position}
          />
        )}
      </AnimatePresence>

      {/* Flying trail effect */}
      {isFlying && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/30"
              style={{
                width: `${20 - i * 3}px`,
                height: `${20 - i * 3}px`,
                left: `${50 - i * 10}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
        </motion.div>
      )}

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
          <MovieBumblebeeRobot gesture={currentGesture} />
        </Canvas>
      </div>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
};

export default BumblebeeMascot;
