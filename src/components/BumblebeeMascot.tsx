import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Movie-accurate Bumblebee colors (Yellow)
const YELLOW_MAIN = "#E8B923";
const YELLOW_DARK = "#B8860B";
const BLACK_METAL = "#0a0a0a";
const CHROME = "#C0C0C0";
const BLUE_ENERGY = "#00BFFF";
const BLUE_CORE = "#4169E1";

// Bird Robot colors (Red-Purple)
const RED_MAIN = "#DC143C";
const RED_DARK = "#8B0000";
const PURPLE_ENERGY = "#9400D3";
const PURPLE_CORE = "#4B0082";

// Gesture types (no fighting)
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "think" | "celebrate" | "listen";

// Bumblebee tips
const bumblebeeTips: Record<string, string[]> = {
  "/": [
    "Salom! Men Bumblebee - sizning kimyo yordamchingizman!",
    "Bu yerda davriy jadvalni ko'rishingiz mumkin!",
    "Har bir elementni bosib, batafsil ma'lumot oling",
    "Davriy jadval - kimyoning asosi!",
  ],
  "/reactions": [
    "Kimyoviy reaksiyalarni o'rganing!",
    "3D molekulalar animatsiyasini tomosha qiling",
    "100+ laboratoriya reaksiyalari mavjud",
  ],
  "/learning": [
    "O'yin tarzida kimyoni o'rganing!",
    "Daraja oshirib, bilimingizni sinang",
    "AI yordamida test yarating",
  ],
  "/library": [
    "Kimyo kitoblarini o'qing!",
    "Har bir bob bo'yicha savollar mavjud",
    "PDF formatda yuklab oling",
  ],
  "/quiz": [
    "Test rasmini yuklang - AI tahlil qiladi!",
    "Ko'p variantli savollar avtomatik yaratiladi",
    "Natijalaringizni saqlang",
  ],
  "/calculator": [
    "Har qanday kimyoviy masalani yeching!",
    "Rasm yuklang - AI o'qiydi",
    "Batafsil yechim va tushuntirish",
  ],
  "/experiments": [
    "Kimyoviy tajribalar videolarini tomosha qiling!",
    "Xavfsiz laboratoriya tajribalari",
    "O'rganish uchun eng yaxshi usul!",
  ],
  "/developers": [
    "Ilova haqida ma'lumot",
    "Jamoa a'zolari bilan tanishing",
  ],
};

// Bird robot tips (sherik)
const birdTips: Record<string, string[]> = {
  "/": [
    "Men Sparky - Bumblebee'ning sherigi!",
    "Element ustiga bosing - atom tuzilishini ko'ring",
    "Kimyo juda qiziqarli fan!",
    "Birga o'rganamiz!",
  ],
  "/reactions": [
    "Reaksiya turlarini tanlang va kuzating",
    "Kimyoviy tenglamalarni yodlang!",
    "Amaliyot - eng yaxshi o'qituvchi!",
  ],
  "/learning": [
    "Kitoblardan savollar ishlang",
    "Har kuni biroz o'rganing!",
    "Bilim - kuch!",
  ],
  "/library": [
    "Boshlang'ichdan murakkabgacha kitoblar",
    "O'qish - aql ozuqasi!",
    "Yangi bilimlar kashf qiling!",
  ],
  "/quiz": [
    "Javoblaringizni tekshiring",
    "Xatolardan o'rganing!",
    "Har safar yaxshiroq bo'ling!",
  ],
  "/calculator": [
    "Molyar massa, pH, konsentratsiya...",
    "Formulalarni yodda saqlang!",
    "Amaliyot qiling!",
  ],
  "/experiments": [
    "Qiziqarli reaksiyalar",
    "Xavfsizlikni unutmang!",
    "Tajriba qiling va o'rganing!",
  ],
  "/developers": [
    "Bizning maqsadimiz - kimyoni osonlashtirish!",
    "Sizga yordam berishdan xursandmiz!",
  ],
};

// Energy Sphere
const EnergySphere = ({ color = BLUE_ENERGY, coreColor = BLUE_CORE }: { color?: string; coreColor?: string }) => {
  const sphereRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

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
  });

  return (
    <group ref={sphereRef} position={[0, 0.1, 0.35]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.08, 2]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
      <points geometry={particleGeometry}>
        <pointsMaterial color={color} size={0.015} transparent opacity={0.8} sizeAttenuation />
      </points>
      <pointLight color={color} intensity={2} distance={1} />
    </group>
  );
};

// Bumblebee Head
const BumblebeeHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        headRef.current.rotation.y = 0.2;
        headRef.current.rotation.x = 0.1;
      } else {
        headRef.current.rotation.y = Math.sin(time * 0.7) * 0.15;
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
      <pointLight position={[0, 0, 0.25]} color={BLUE_ENERGY} intensity={0.5} distance={0.5} />
    </group>
  );
};

// Bumblebee Chest
const BumblebeeChest = () => (
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
  </group>
);

// Bumblebee Arm
const BumblebeeArm = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.42 : 0.42;
  const mirror = isLeft ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!armRef.current || !forearmRef.current) return;

    if (gesture === "wave" && isLeft) {
      armRef.current.rotation.z = -1.2 + Math.sin(time * 8) * 0.3;
      armRef.current.rotation.x = -0.5;
      forearmRef.current.rotation.x = 0.4 + Math.sin(time * 10) * 0.2;
    } else if (gesture === "listen") {
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4);
      armRef.current.rotation.x = -0.2;
      forearmRef.current.rotation.x = 0.6;
    } else {
      const armAngle = Math.sin(time * 2) * 0.08;
      armRef.current.rotation.z = (isLeft ? 0.6 : -0.6) + armAngle;
      armRef.current.rotation.x = -0.4 + Math.sin(time * 1.5) * 0.05;
      forearmRef.current.rotation.x = 0.8 + Math.sin(time * 2.5) * 0.1;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.75, 0]}>
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
      </group>
    </group>
  );
};

// Bumblebee Robot
const BumblebeeRobot = ({ gesture }: { gesture: GestureType }) => {
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
      <BumblebeeHead gesture={gesture} />
      <BumblebeeChest />
      <BumblebeeArm side="left" gesture={gesture} />
      <BumblebeeArm side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} />
    </group>
  );
};

// Bird Robot Head
const BirdHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        headRef.current.rotation.y = -0.2;
        headRef.current.rotation.x = 0.1;
      } else {
        headRef.current.rotation.y = Math.sin(time * 1.2) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 0.8) * 0.08;
      }
    }
  });

  return (
    <group ref={headRef} position={[0, 0.8, 0]}>
      <mesh>
        <coneGeometry args={[0.18, 0.3, 6]} />
        <meshStandardMaterial color={RED_MAIN} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.05, 0.2]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 4]} />
        <meshStandardMaterial color={RED_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[-0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={6} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={6} />
      </mesh>
      <pointLight position={[0, 0, 0.2]} color={PURPLE_ENERGY} intensity={1} distance={0.5} />
    </group>
  );
};

// Bird Robot Body
const BirdBody = () => (
  <group position={[0, 0.35, 0]}>
    <mesh>
      <boxGeometry args={[0.4, 0.35, 0.25]} />
      <meshStandardMaterial color={RED_MAIN} metalness={0.9} roughness={0.12} />
    </mesh>
    <mesh position={[0, 0.03, 0.15]}>
      <circleGeometry args={[0.06, 32]} />
      <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={3} />
    </mesh>
  </group>
);

// Bird Robot Wings
const BirdWing = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const wingRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.25 : 0.25;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (wingRef.current) {
      if (gesture === "listen") {
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * 0.3;
      } else {
        const baseFlap = Math.sin(time * 8) * 0.3;
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.5 + baseFlap);
      }
    }
  });

  return (
    <group ref={wingRef} position={[xPos, 0.5, 0]}>
      <mesh rotation={[0, 0, isLeft ? 0.5 : -0.5]}>
        <boxGeometry args={[0.3, 0.08, 0.15]} />
        <meshStandardMaterial color={RED_DARK} metalness={0.85} roughness={0.15} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(isLeft ? -1 : 1) * (0.12 + i * 0.08), 0, 0]} rotation={[0, 0, (isLeft ? 1 : -1) * 0.3]}>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
          <meshStandardMaterial color={PURPLE_CORE} metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// Bird Robot
const BirdRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 2) * 0.03;
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={0.6} position={[0, -0.1, 0]}>
      <BirdHead gesture={gesture} />
      <BirdBody />
      <BirdWing side="left" gesture={gesture} />
      <BirdWing side="right" gesture={gesture} />
      <EnergySphere color={PURPLE_ENERGY} coreColor={PURPLE_CORE} />
    </group>
  );
};

// Speech Bubble
const SpeechBubble = ({ text, isRight }: { text: string; isRight: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="absolute pointer-events-auto"
    style={{
      [isRight ? 'right' : 'left']: '100%',
      [isRight ? 'marginRight' : 'marginLeft']: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
    }}
  >
    <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
      text-primary-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-elegant border border-primary/30
      max-w-[180px] md:max-w-[220px]">
      <p className="leading-relaxed">{text}</p>
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 
          ${isRight 
            ? "right-0 translate-x-full border-l-8 border-l-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent" 
            : "left-0 -translate-x-full border-r-8 border-r-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent"
          }`}
        style={{ borderTopWidth: "6px", borderBottomWidth: "6px" }}
      />
    </div>
  </motion.div>
);

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [bumblebeePos, setBumblebeePos] = useState({ x: 85, y: 20 });
  const [birdPos, setBirdPos] = useState({ x: 15, y: 25 });
  const [bumblebeeGesture, setBumblebeeGesture] = useState<GestureType>("idle");
  const [birdGesture, setBirdGesture] = useState<GestureType>("listen");
  const [showBird, setShowBird] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<"bumblebee" | "bird">("bumblebee");
  
  const [bumblebeeTarget, setBumblebeeTarget] = useState({ x: 85, y: 20 });
  const [birdTarget, setBirdTarget] = useState({ x: 15, y: 25 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get tips for current page
  const currentBumblebeeTips = bumblebeeTips[location.pathname] || bumblebeeTips["/"];
  const currentBirdTips = birdTips[location.pathname] || birdTips["/"];

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

  // Show bird after delay
  useEffect(() => {
    if (isUserActive || isHidden) return;
    const timer = setTimeout(() => setShowBird(true), 4000);
    return () => clearTimeout(timer);
  }, [isUserActive, isHidden]);

  // Alternate speakers and change tips
  useEffect(() => {
    if (isUserActive) return;

    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        // Switch speaker
        setCurrentSpeaker(prev => prev === "bumblebee" ? "bird" : "bumblebee");
        
        // Update gestures - speaker waves, listener listens
        if (currentSpeaker === "bumblebee") {
          setBumblebeeGesture("listen");
          setBirdGesture("wave");
        } else {
          setBumblebeeGesture("wave");
          setBirdGesture("listen");
        }
        
        // Change tip index
        setCurrentTipIndex(prev => {
          const tips = currentSpeaker === "bumblebee" ? currentBirdTips : currentBumblebeeTips;
          return (prev + 1) % tips.length;
        });
        
        setShowTip(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserActive, currentSpeaker, currentBumblebeeTips, currentBirdTips]);

  // Smooth flying
  useEffect(() => {
    if (isUserActive || isHidden) return;

    const flyInterval = setInterval(() => {
      setBumblebeeTarget({ x: 60 + Math.random() * 30, y: 15 + Math.random() * 40 });
      if (showBird) {
        setBirdTarget({ x: 10 + Math.random() * 30, y: 15 + Math.random() * 40 });
      }
    }, 8000);

    return () => clearInterval(flyInterval);
  }, [showBird, isUserActive, isHidden]);

  // Smooth position update
  useEffect(() => {
    if (isUserActive) return;
    
    const animationInterval = setInterval(() => {
      setBumblebeePos(prev => ({
        x: prev.x + (bumblebeeTarget.x - prev.x) * 0.02,
        y: prev.y + (bumblebeeTarget.y - prev.y) * 0.02
      }));
      setBirdPos(prev => ({
        x: prev.x + (birdTarget.x - prev.x) * 0.02,
        y: prev.y + (birdTarget.y - prev.y) * 0.02
      }));
    }, 50);

    return () => clearInterval(animationInterval);
  }, [bumblebeeTarget, birdTarget, isUserActive]);

  // Handle click
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        setBumblebeeTarget({ x: 60 + Math.random() * 30, y: 15 + Math.random() * 40 });
        if (showBird) setBirdTarget({ x: 10 + Math.random() * 30, y: 15 + Math.random() * 40 });
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 1) {
      clearTimeout(clickTimerRef.current!);
      setIsHidden(true);
      setClickCount(0);
    }
  }, [clickCount, showBird]);

  // Reset on page change
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(true);
    setCurrentSpeaker("bumblebee");
    setBumblebeeGesture("wave");
    setBirdGesture("listen");
  }, [location.pathname]);

  if (isHidden) return null;

  const currentTip = currentSpeaker === "bumblebee" 
    ? currentBumblebeeTips[currentTipIndex % currentBumblebeeTips.length]
    : currentBirdTips[currentTipIndex % currentBirdTips.length];

  return (
    <AnimatePresence>
      {!isUserActive && (
        <>
          {/* Bumblebee */}
          <motion.div
            className="fixed z-30 select-none w-[220px] h-[260px] cursor-pointer"
            onClick={handleClick}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              left: `${bumblebeePos.x}%`,
              top: `${bumblebeePos.y}%`,
              x: "-50%",
              y: "-50%",
            }}
            exit={{ opacity: 0, scale: 1, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 0.5,
              left: { duration: 2, ease: "linear" },
              top: { duration: 2, ease: "linear" },
            }}
          >
            <AnimatePresence mode="wait">
              {showTip && currentSpeaker === "bumblebee" && (
                <SpeechBubble text={currentTip} isRight={bumblebeePos.x > 50} />
              )}
            </AnimatePresence>

            <div className="w-full h-full pointer-events-none">
              <Canvas
                camera={{ position: [0, 0.2, 2.2], fov: 50 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              >
                <ambientLight intensity={0.3} />
                <directionalLight position={[3, 5, 2]} intensity={1.2} />
                <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFE4B5" />
                <BumblebeeRobot gesture={bumblebeeGesture} />
              </Canvas>
            </div>
            
            <div 
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 70%)` }}
            />
          </motion.div>

          {/* Bird Robot */}
          <AnimatePresence>
            {showBird && (
              <motion.div
                className="fixed z-30 select-none w-[220px] h-[260px] cursor-pointer"
                onClick={handleClick}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  left: `${birdPos.x}%`,
                  top: `${birdPos.y}%`,
                  x: "-50%",
                  y: "-50%",
                }}
                exit={{ opacity: 0, scale: 1, transition: { duration: 0.5 } }}
                transition={{ 
                  duration: 0.5,
                  left: { duration: 2, ease: "linear" },
                  top: { duration: 2, ease: "linear" },
                }}
              >
                <AnimatePresence mode="wait">
                  {showTip && currentSpeaker === "bird" && (
                    <SpeechBubble text={currentTip} isRight={birdPos.x > 50} />
                  )}
                </AnimatePresence>

                <div className="w-full h-full pointer-events-none">
                  <Canvas
                    camera={{ position: [0, 0.2, 2.2], fov: 50 }}
                    style={{ background: "transparent" }}
                    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                  >
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[3, 5, 2]} intensity={1.2} />
                    <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFB6C1" />
                    <BirdRobot gesture={birdGesture} />
                  </Canvas>
                </div>
                
                <div 
                  className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25"
                  style={{ background: `radial-gradient(circle, ${PURPLE_ENERGY} 0%, transparent 70%)` }}
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
