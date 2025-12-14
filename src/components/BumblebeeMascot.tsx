import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Movie-accurate Bumblebee colors (Clean heroic style)
const YELLOW_MAIN = "#FFD700"; // Bright polished gold-yellow
const YELLOW_HIGHLIGHT = "#FFF44F"; // Highlight for shine
const BLACK_METAL = "#1a1a1a"; // Slightly lighter for visibility
const BLACK_ACCENT = "#2d2d2d"; // Secondary black
const CHROME = "#E8E8E8"; // Polished chrome
const CHROME_DARK = "#B8B8B8"; // Chrome shadow
const BLUE_ENERGY = "#00BFFF"; // Glowing blue eyes
const BLUE_CORE = "#4169E1"; // Core energy
const AUTOBOT_RED = "#E32636"; // Autobot insignia

// Bird Robot colors (Red-Purple)
const RED_MAIN = "#DC143C";
const RED_DARK = "#8B0000";
const PURPLE_ENERGY = "#9400D3";
const PURPLE_CORE = "#4B0082";

// Gesture types (expanded)
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "think" | "celebrate" | "listen" | "nod" | "raiseHand" | "salute" | "clap" | "walk";

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

// Bumblebee Head - Movie accurate heroic design with more gestures
const BumblebeeHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        // Attentive listening pose
        headRef.current.rotation.y = 0.15;
        headRef.current.rotation.x = 0.08;
      } else if (gesture === "nod") {
        // Nodding animation
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.2;
      } else if (gesture === "think") {
        // Thinking - head tilted
        headRef.current.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.05;
        headRef.current.rotation.x = 0.1;
        headRef.current.rotation.z = 0.1;
      } else if (gesture === "celebrate") {
        // Excited head movement
        headRef.current.rotation.y = Math.sin(time * 6) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.1 - 0.1;
      } else if (gesture === "salute") {
        // Firm salute pose
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = -0.05;
      } else if (gesture === "walk") {
        // Walking head bob
        headRef.current.rotation.y = Math.sin(time * 3) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 6) * 0.03;
      } else {
        // Default subtle focused movement
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.03;
        headRef.current.rotation.z = 0;
      }
    }
    // Pulsing eye glow
    if (eyeGlowRef.current) {
      const baseIntensity = gesture === "celebrate" ? 2.5 : 1.5;
      eyeGlowRef.current.intensity = baseIntensity + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.2, 0]}>
      {/* Main head - helmet shape */}
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Helmet crest */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.2]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Face plate - black visor area */}
      <mesh position={[0, -0.02, 0.18]}>
        <boxGeometry args={[0.32, 0.16, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Left eye - glowing blue */}
      <mesh position={[-0.08, 0.02, 0.23]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial 
          color={BLUE_ENERGY} 
          emissive={BLUE_ENERGY} 
          emissiveIntensity={6} 
          transparent 
          opacity={0.95}
        />
      </mesh>
      <mesh position={[-0.08, 0.02, 0.235]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Right eye - glowing blue */}
      <mesh position={[0.08, 0.02, 0.23]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial 
          color={BLUE_ENERGY} 
          emissive={BLUE_ENERGY} 
          emissiveIntensity={6} 
          transparent 
          opacity={0.95}
        />
      </mesh>
      <mesh position={[0.08, 0.02, 0.235]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Side ear panels */}
      <mesh position={[-0.22, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.22, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Chin guard */}
      <mesh position={[0, -0.14, 0.1]}>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Eye glow light */}
      <pointLight ref={eyeGlowRef} position={[0, 0.02, 0.3]} color={BLUE_ENERGY} intensity={1.5} distance={0.8} />
    </group>
  );
};

// Bumblebee Chest - with Autobot insignia
const BumblebeeChest = () => (
  <group position={[0, 0.6, 0]}>
    {/* Main chest plate */}
    <mesh>
      <boxGeometry args={[0.6, 0.5, 0.3]} />
      <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Upper chest detail */}
    <mesh position={[0, 0.15, 0.16]}>
      <boxGeometry args={[0.5, 0.15, 0.02]} />
      <meshStandardMaterial color={BLACK_METAL} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Central chest plate (metal plate for insignia) */}
    <mesh position={[0, 0, 0.16]}>
      <boxGeometry args={[0.35, 0.3, 0.02]} />
      <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Autobot Insignia - Red face shape */}
    <mesh position={[0, 0.02, 0.175]}>
      <circleGeometry args={[0.08, 6]} />
      <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[0, 0.02, 0.178]}>
      <circleGeometry args={[0.05, 6]} />
      <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Side chest vents */}
    <mesh position={[-0.25, 0, 0.1]}>
      <boxGeometry args={[0.08, 0.35, 0.15]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh position={[0.25, 0, 0.1]}>
      <boxGeometry args={[0.08, 0.35, 0.15]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    
    {/* Lower chest - waist connection */}
    <mesh position={[0, -0.28, 0]}>
      <boxGeometry args={[0.4, 0.1, 0.25]} />
      <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
    </mesh>
  </group>
);

// Bumblebee Arm - Polished mechanical design with more gestures
const BumblebeeArm = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.45 : 0.45;
  const mirror = isLeft ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!armRef.current || !forearmRef.current) return;

    if (gesture === "wave" && isLeft) {
      // Waving animation
      armRef.current.rotation.z = -1.4 + Math.sin(time * 6) * 0.3;
      armRef.current.rotation.x = -0.3;
      forearmRef.current.rotation.x = 0.2 + Math.sin(time * 8) * 0.2;
    } else if (gesture === "raiseHand" && isLeft) {
      // Raising hand high
      armRef.current.rotation.z = -2.5;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3 + Math.sin(time * 2) * 0.1;
    } else if (gesture === "salute" && !isLeft) {
      // Salute with right hand
      armRef.current.rotation.z = -1.8;
      armRef.current.rotation.x = -0.4;
      forearmRef.current.rotation.x = 1.2;
    } else if (gesture === "thumbsUp" && !isLeft) {
      // Thumbs up with right hand
      armRef.current.rotation.z = -0.8;
      armRef.current.rotation.x = -0.6;
      forearmRef.current.rotation.x = 0.8;
    } else if (gesture === "point" && !isLeft) {
      // Pointing forward
      armRef.current.rotation.z = -0.3;
      armRef.current.rotation.x = -1.2;
      forearmRef.current.rotation.x = 0.2;
    } else if (gesture === "clap") {
      // Clapping animation
      const clapAngle = Math.sin(time * 10) * 0.4;
      armRef.current.rotation.z = (isLeft ? -0.6 : 0.6) + (isLeft ? -clapAngle : clapAngle);
      armRef.current.rotation.x = -0.8;
      forearmRef.current.rotation.x = 0.6;
    } else if (gesture === "celebrate") {
      // Both arms up celebrating
      const bounce = Math.sin(time * 6) * 0.2;
      armRef.current.rotation.z = (isLeft ? -2.2 : 2.2) + bounce;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3 + Math.sin(time * 8) * 0.15;
    } else if (gesture === "think" && !isLeft) {
      // Hand on chin thinking
      armRef.current.rotation.z = -0.6;
      armRef.current.rotation.x = -0.9;
      forearmRef.current.rotation.x = 1.4;
    } else if (gesture === "walk") {
      // Walking arm swing
      const walkSwing = Math.sin(time * 6 + (isLeft ? 0 : Math.PI)) * 0.5;
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = walkSwing;
      forearmRef.current.rotation.x = 0.4 + Math.abs(walkSwing) * 0.3;
    } else if (gesture === "listen") {
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = -0.15;
      forearmRef.current.rotation.x = 0.5;
    } else {
      // Standing at attention - subtle idle motion
      const armAngle = Math.sin(time * 1.5) * 0.04;
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4) + armAngle;
      armRef.current.rotation.x = -0.2 + Math.sin(time * 1) * 0.02;
      forearmRef.current.rotation.x = 0.6 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.8, 0]}>
      {/* Shoulder joint */}
      <mesh position={[mirror * 0.02, 0, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[mirror * 0.02, -0.12, 0]}>
        <boxGeometry args={[0.1, 0.22, 0.1]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper arm detail stripe */}
      <mesh position={[mirror * 0.02, -0.12, 0.052]}>
        <boxGeometry args={[0.04, 0.18, 0.01]} />
        <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Elbow joint */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.3, 0]}>
        {/* Forearm */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.09, 0.2, 0.09]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Forearm detail */}
        <mesh position={[0, -0.1, 0.048]}>
          <boxGeometry args={[0.035, 0.16, 0.01]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Wrist */}
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Hand */}
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.04]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Bumblebee Legs with walking animation
const BumblebeeLeg = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const legRef = useRef<THREE.Group>(null);
  const lowerLegRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.15 : 0.15;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!legRef.current || !lowerLegRef.current) return;

    if (gesture === "walk") {
      // Walking animation - legs alternate
      const walkPhase = time * 6 + (isLeft ? 0 : Math.PI);
      const legSwing = Math.sin(walkPhase) * 0.5;
      const kneeAngle = Math.max(0, Math.sin(walkPhase + 0.5)) * 0.6;
      
      legRef.current.rotation.x = legSwing;
      lowerLegRef.current.rotation.x = kneeAngle;
    } else if (gesture === "celebrate") {
      // Jumping/bouncing legs
      const bounce = Math.sin(time * 8) * 0.15;
      legRef.current.rotation.x = bounce;
      lowerLegRef.current.rotation.x = Math.abs(bounce) * 0.5;
    } else {
      // Standing still
      legRef.current.rotation.x = 0;
      lowerLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={legRef} position={[xPos, 0.05, 0]}>
      {/* Hip joint */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper leg */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.1, 0.25, 0.1]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Knee */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Lower leg group */}
      <group ref={lowerLegRef} position={[0, -0.3, 0]}>
        {/* Lower leg */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.25, 0.09]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Lower leg stripe */}
        <mesh position={[0, -0.15, 0.048]}>
          <boxGeometry args={[0.04, 0.2, 0.01]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Foot */}
        <mesh position={[0, -0.32, 0.02]}>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Bumblebee Robot - Full body, heroic pose, facing forward
const BumblebeeRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      if (gesture === "walk") {
        // Walking body movement
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.03;
        groupRef.current.rotation.z = Math.sin(time * 6) * 0.02;
      } else if (gesture === "celebrate") {
        // Bouncing celebration
        groupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.1;
      } else {
        // Subtle heroic idle - very slight motion
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.015;
        groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.03;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0]}>
      <BumblebeeHead gesture={gesture} />
      <BumblebeeChest />
      <BumblebeeArm side="left" gesture={gesture} />
      <BumblebeeArm side="right" gesture={gesture} />
      <BumblebeeLeg side="left" gesture={gesture} />
      <BumblebeeLeg side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} />
    </group>
  );
};

// Bird Robot Head with more gestures
const BirdHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        headRef.current.rotation.y = -0.2;
        headRef.current.rotation.x = 0.1;
      } else if (gesture === "nod") {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = Math.sin(time * 5) * 0.25;
      } else if (gesture === "think") {
        headRef.current.rotation.y = 0.2;
        headRef.current.rotation.x = 0.15;
        headRef.current.rotation.z = -0.1;
      } else if (gesture === "celebrate") {
        headRef.current.rotation.y = Math.sin(time * 7) * 0.2;
        headRef.current.rotation.x = Math.sin(time * 5) * 0.15;
      } else if (gesture === "walk") {
        headRef.current.rotation.y = Math.sin(time * 4) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 8) * 0.05;
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

// Bird Robot Wings with more gestures
const BirdWing = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const wingRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.25 : 0.25;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (wingRef.current) {
      if (gesture === "listen") {
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * 0.3;
      } else if (gesture === "celebrate") {
        const bounce = Math.sin(time * 10) * 0.4;
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.8 + bounce);
      } else if (gesture === "clap") {
        const clapAngle = Math.sin(time * 12) * 0.5;
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.5 + clapAngle);
      } else if (gesture === "walk") {
        const walkFlap = Math.sin(time * 8 + (isLeft ? 0 : Math.PI)) * 0.3;
        wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.6 + walkFlap);
      } else if (gesture === "raiseHand" && isLeft) {
        wingRef.current.rotation.z = 1.8;
      } else if (gesture === "wave" && isLeft) {
        const waveAngle = Math.sin(time * 8) * 0.4;
        wingRef.current.rotation.z = 1.5 + waveAngle;
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

// Bird Robot with walking support
const BirdRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      if (gesture === "walk") {
        groupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.025;
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.06;
      } else if (gesture === "celebrate") {
        groupRef.current.position.y = Math.abs(Math.sin(time * 10)) * 0.035;
        groupRef.current.rotation.y = Math.sin(time * 5) * 0.12;
      } else {
        groupRef.current.position.y = Math.sin(time * 2) * 0.03;
        groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      }
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

  // Speaker gestures variety
  const speakerGestures: GestureType[] = ["wave", "point", "thumbsUp", "nod", "celebrate", "raiseHand", "salute"];
  const getRandomSpeakerGesture = useCallback(() => {
    return speakerGestures[Math.floor(Math.random() * speakerGestures.length)];
  }, []);

  // Alternate speakers and change tips with varied gestures
  useEffect(() => {
    if (isUserActive) return;

    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        // Switch speaker
        setCurrentSpeaker(prev => prev === "bumblebee" ? "bird" : "bumblebee");
        
        // Update gestures - speaker gets random gesture, listener listens
        const newGesture = getRandomSpeakerGesture();
        if (currentSpeaker === "bumblebee") {
          setBumblebeeGesture("listen");
          setBirdGesture(newGesture);
        } else {
          setBumblebeeGesture(newGesture);
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
  }, [isUserActive, currentSpeaker, currentBumblebeeTips, currentBirdTips, getRandomSpeakerGesture]);

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
                camera={{ position: [0, 0.3, 2.8], fov: 45 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              >
                {/* Bright even studio lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 4, 3]} intensity={1.5} />
                <directionalLight position={[-2, 3, 2]} intensity={0.8} />
                <pointLight position={[0, 0, 2]} intensity={0.6} color="#FFFFFF" />
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
