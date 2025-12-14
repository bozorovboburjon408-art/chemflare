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

// Aggressive Bird Robot colors (Red-Blue)
const RED_MAIN = "#DC143C";
const RED_DARK = "#8B0000";
const PURPLE_ENERGY = "#9400D3";
const PURPLE_CORE = "#4B0082";

// Gesture types
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "clap" | "think" | "celebrate" | "salute" | "fight" | "shoot" | "dodge" | "sad" | "victory";

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

// App intro tips when user is idle
const appIntroTips = [
  "ChemFlare - kimyoni o'rganish uchun eng yaxshi ilova!",
  "Bu yerda davriy jadval, kalkulyator, testlar va ko'p narsalar bor!",
  "Men Bumblebee - sizning kimyo yordamchingizman!",
  "Har qanday savolingizga javob topasiz!",
  "Tajribalar bo'limida qiziqarli videolar bor!",
  "Kitobxonada kimyo darsliklarini o'qing!",
];

// Energy Sphere with plasma effect
const EnergySphere = ({ color = BLUE_ENERGY, coreColor = BLUE_CORE, gesture }: { color?: string; coreColor?: string; gesture: GestureType }) => {
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
    let baseScale = 1;
    
    switch (gesture) {
      case "celebrate":
      case "victory":
        baseScale = 1.8;
        break;
      case "fight":
      case "shoot":
        baseScale = 1.5;
        break;
      case "sad":
        baseScale = 0.5;
        break;
    }
    
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
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={gesture === "sad" ? 1 : 4} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={gesture === "sad" ? 0.5 : 2} transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.14, 0.008, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.16, 0.006, 8, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color={color} size={0.015} transparent opacity={0.8} sizeAttenuation />
      </points>
      <pointLight color={color} intensity={gesture === "sad" ? 0.5 : 2} distance={1} />
    </group>
  );
};

// Detailed Bumblebee Head with gestures
const MovieBumblebeeHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (headRef.current) {
      switch (gesture) {
        case "wave":
          headRef.current.rotation.y = Math.sin(time * 3) * 0.2;
          headRef.current.rotation.z = Math.sin(time * 2) * 0.1;
          break;
        case "fight":
        case "shoot":
          headRef.current.rotation.y = Math.sin(time * 5) * 0.3;
          headRef.current.rotation.x = -0.2;
          break;
        case "dodge":
          headRef.current.rotation.y = Math.sin(time * 8) * 0.4;
          headRef.current.rotation.z = Math.cos(time * 6) * 0.2;
          break;
        case "sad":
          headRef.current.rotation.x = 0.4; // Looking down
          headRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
          headRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
          break;
        case "victory":
        case "celebrate":
          headRef.current.rotation.y = Math.sin(time * 5) * 0.3;
          headRef.current.rotation.z = Math.sin(time * 4) * 0.2;
          headRef.current.rotation.x = -0.2;
          break;
        default:
          headRef.current.rotation.y = Math.sin(time * 0.7) * 0.12;
          headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05 - 0.1;
          headRef.current.rotation.z = 0;
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
        <meshStandardMaterial color={gesture === "sad" ? "#666666" : BLUE_ENERGY} emissive={gesture === "sad" ? "#333333" : BLUE_ENERGY} emissiveIntensity={gesture === "sad" ? 1 : 5} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.22]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={gesture === "sad" ? "#666666" : BLUE_ENERGY} emissive={gesture === "sad" ? "#333333" : BLUE_ENERGY} emissiveIntensity={gesture === "sad" ? 1 : 5} />
      </mesh>
      <pointLight position={[-0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={gesture === "sad" ? 0.1 : 0.5} distance={0.5} />
      <pointLight position={[0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={gesture === "sad" ? 0.1 : 0.5} distance={0.5} />
      <group position={[-0.12, 0.22, 0]} rotation={[0.2, 0, 0.25]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.025, 0.12, 8]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
      <group position={[0.12, 0.22, 0]} rotation={[0.2, 0, -0.25]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.025, 0.12, 8]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
      <mesh position={[0, -0.12, 0.12]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Chest
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
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.22]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};

// Animated Arms with gesture support
const MovieBumblebeeArm = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);

  const xPos = side === "left" ? -0.42 : 0.42;
  const mirror = side === "left" ? -1 : 1;
  const isLeft = side === "left";

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (!armRef.current || !forearmRef.current || !handRef.current) return;

    switch (gesture) {
      case "wave":
        if (isLeft) {
          armRef.current.rotation.z = -1.2 + Math.sin(time * 8) * 0.3;
          armRef.current.rotation.x = -0.5;
          forearmRef.current.rotation.x = 0.4 + Math.sin(time * 10) * 0.2;
          handRef.current.rotation.z = Math.sin(time * 12) * 0.5;
        } else {
          armRef.current.rotation.z = -0.4;
          forearmRef.current.rotation.x = 0.5;
        }
        break;
        
      case "fight":
      case "shoot":
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (-0.8 + Math.sin(time * 6) * 0.3);
        armRef.current.rotation.x = -0.9 + Math.sin(time * 8) * 0.2;
        forearmRef.current.rotation.x = 1.5 + Math.sin(time * 10) * 0.3;
        handRef.current.rotation.x = Math.sin(time * 12) * 0.4;
        break;
        
      case "dodge":
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (0.8 + Math.sin(time * 10) * 0.4);
        armRef.current.rotation.x = -0.3;
        forearmRef.current.rotation.x = 0.5;
        break;
        
      case "sad":
        // Arms hanging down sadly
        armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
        armRef.current.rotation.x = 0.2;
        forearmRef.current.rotation.x = 0.2;
        handRef.current.rotation.x = 0;
        break;
        
      case "victory":
      case "celebrate":
        // Victory pose - arms up celebrating
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (-1.5 + Math.sin(time * 6 + (isLeft ? 0 : Math.PI)) * 0.3);
        armRef.current.rotation.x = -0.4 + Math.sin(time * 4) * 0.15;
        forearmRef.current.rotation.x = 0.2 + Math.sin(time * 8) * 0.25;
        handRef.current.rotation.z = Math.sin(time * 10 + (isLeft ? 0 : Math.PI)) * 0.4;
        break;
        
      case "thumbsUp":
        if (!isLeft) {
          armRef.current.rotation.z = -0.6;
          armRef.current.rotation.x = -0.8 + Math.sin(time * 2) * 0.1;
          forearmRef.current.rotation.x = 1.2;
          handRef.current.rotation.x = 0.5;
        } else {
          armRef.current.rotation.z = 0.4;
          forearmRef.current.rotation.x = 0.5;
        }
        break;
        
      default:
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

// Bumblebee Robot
const MovieBumblebeeRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      switch (gesture) {
        case "fight":
        case "shoot":
          groupRef.current.position.y = Math.sin(time * 6) * 0.05;
          groupRef.current.rotation.y = Math.sin(time * 4) * 0.2;
          break;
        case "dodge":
          groupRef.current.position.y = Math.sin(time * 8) * 0.08;
          groupRef.current.position.x = Math.sin(time * 6) * 0.05;
          break;
        case "sad":
          groupRef.current.position.y = -0.05 + Math.sin(time * 0.5) * 0.01;
          groupRef.current.rotation.y = 0;
          groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
          break;
        case "victory":
        case "celebrate":
          groupRef.current.position.y = Math.sin(time * 5) * 0.08;
          groupRef.current.rotation.y = Math.sin(time * 3) * 0.2;
          groupRef.current.rotation.z = Math.sin(time * 4) * 0.05;
          break;
        default:
          groupRef.current.position.y = Math.sin(time * 1.5) * 0.025;
          groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.06;
          groupRef.current.position.x = 0;
          groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, -0.15, 0]}>
      <MovieBumblebeeHead gesture={gesture} />
      <MovieBumblebeeChest />
      <MovieBumblebeeArm side="left" gesture={gesture} />
      <MovieBumblebeeArm side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} gesture={gesture} />
    </group>
  );
};

// Aggressive Bird Robot Head
const BirdRobotHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (headRef.current) {
      switch (gesture) {
        case "fight":
        case "shoot":
          headRef.current.rotation.y = Math.sin(time * 6) * 0.4;
          headRef.current.rotation.x = -0.3 + Math.sin(time * 8) * 0.2;
          break;
        case "dodge":
          headRef.current.rotation.y = Math.sin(time * 10) * 0.5;
          headRef.current.rotation.z = Math.cos(time * 8) * 0.3;
          break;
        case "sad":
          headRef.current.rotation.x = 0.5;
          headRef.current.rotation.y = Math.sin(time * 0.3) * 0.03;
          break;
        case "victory":
        case "celebrate":
          headRef.current.rotation.y = Math.sin(time * 6) * 0.4;
          headRef.current.rotation.x = -0.25;
          headRef.current.rotation.z = Math.sin(time * 5) * 0.15;
          break;
        default:
          headRef.current.rotation.y = Math.sin(time * 1.2) * 0.15;
          headRef.current.rotation.x = Math.sin(time * 0.8) * 0.08;
          headRef.current.rotation.z = 0;
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
        <meshStandardMaterial color={gesture === "sad" ? "#444444" : PURPLE_ENERGY} emissive={gesture === "sad" ? "#222222" : PURPLE_ENERGY} emissiveIntensity={gesture === "sad" ? 1 : 6} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={gesture === "sad" ? "#444444" : PURPLE_ENERGY} emissive={gesture === "sad" ? "#222222" : PURPLE_ENERGY} emissiveIntensity={gesture === "sad" ? 1 : 6} />
      </mesh>
      <pointLight position={[0, 0, 0.2]} color={PURPLE_ENERGY} intensity={gesture === "sad" ? 0.2 : 1} distance={0.5} />
      <mesh position={[0, 0.2, -0.05]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.04, 0.15, 0.08]} />
        <meshStandardMaterial color={PURPLE_CORE} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Bird Robot Body
const BirdRobotBody = () => {
  return (
    <group position={[0, 0.35, 0]}>
      <mesh>
        <boxGeometry args={[0.4, 0.35, 0.25]} />
        <meshStandardMaterial color={RED_MAIN} metalness={0.9} roughness={0.12} />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[0.25, 0.28, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.03, 0.15]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={3} />
      </mesh>
    </group>
  );
};

// Bird Robot Wings
const BirdRobotWing = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const wingRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.25 : 0.25;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (wingRef.current) {
      switch (gesture) {
        case "fight":
        case "shoot":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.8 + Math.sin(time * 12) * 0.5);
          wingRef.current.rotation.x = Math.sin(time * 10) * 0.3;
          break;
        case "dodge":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (1.2 + Math.sin(time * 15) * 0.4);
          break;
        case "sad":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * 0.2;
          wingRef.current.rotation.x = 0.3;
          break;
        case "victory":
        case "celebrate":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (1.0 + Math.sin(time * 10) * 0.6);
          wingRef.current.rotation.x = Math.sin(time * 8) * 0.2;
          break;
        default:
          const baseFlap = Math.sin(time * 8) * 0.3;
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.5 + baseFlap);
          wingRef.current.rotation.x = 0;
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

// Aggressive Bird Robot
const AggressiveBirdRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      switch (gesture) {
        case "fight":
        case "shoot":
          groupRef.current.position.y = Math.sin(time * 8) * 0.06;
          groupRef.current.rotation.y = Math.sin(time * 5) * 0.25;
          groupRef.current.rotation.z = Math.sin(time * 6) * 0.1;
          break;
        case "dodge":
          groupRef.current.position.y = Math.sin(time * 10) * 0.08;
          groupRef.current.position.x = Math.sin(time * 8) * 0.06;
          break;
        case "sad":
          groupRef.current.position.y = -0.08 + Math.sin(time * 0.4) * 0.01;
          groupRef.current.rotation.z = 0.1;
          break;
        case "victory":
        case "celebrate":
          groupRef.current.position.y = Math.sin(time * 6) * 0.08;
          groupRef.current.rotation.y = Math.sin(time * 4) * 0.25;
          groupRef.current.rotation.z = Math.sin(time * 5) * 0.08;
          break;
        default:
          groupRef.current.position.y = Math.sin(time * 2) * 0.03;
          groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
          groupRef.current.position.x = 0;
          groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.6} position={[0, -0.1, 0]}>
      <BirdRobotHead gesture={gesture} />
      <BirdRobotBody />
      <BirdRobotWing side="left" gesture={gesture} />
      <BirdRobotWing side="right" gesture={gesture} />
      <EnergySphere color={PURPLE_ENERGY} coreColor={PURPLE_CORE} gesture={gesture} />
    </group>
  );
};

// Weapon types
type WeaponType = "laser" | "rocket" | "plasma";

// Explosion Effect Component
const Explosion = ({ position, color, onComplete }: { position: { x: number; y: number }; color: string; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      style={{ left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 0, scale: 3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Main explosion */}
      <div 
        className="w-16 h-16 rounded-full"
        style={{ 
          background: `radial-gradient(circle, white 0%, ${color} 30%, transparent 70%)`,
          boxShadow: `0 0 30px ${color}, 0 0 60px ${color}, 0 0 90px ${color}`
        }} 
      />
      {/* Explosion particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{ 
            background: color,
            left: '50%',
            top: '50%',
            boxShadow: `0 0 10px ${color}`
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ 
            x: Math.cos(i * Math.PI / 4) * 50,
            y: Math.sin(i * Math.PI / 4) * 50,
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
};

// Projectile Component with different weapon types
const Projectile = ({ 
  from, 
  to, 
  color, 
  weaponType,
  onComplete,
  onHit
}: { 
  from: { x: number; y: number }; 
  to: { x: number; y: number }; 
  color: string;
  weaponType: WeaponType;
  onComplete: () => void;
  onHit: (position: { x: number; y: number }) => void;
}) => {
  const duration = weaponType === "laser" ? 0.3 : weaponType === "rocket" ? 1.2 : 0.6;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onHit(to);
      onComplete();
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [onComplete, onHit, to, duration]);

  // Laser beam
  if (weaponType === "laser") {
    const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
    
    return (
      <motion.div
        className="fixed z-40 pointer-events-none origin-left"
        style={{ 
          left: `${from.x}%`, 
          top: `${from.y}%`,
          transform: `rotate(${angle}deg)`,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, white, ${color})`,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          borderRadius: '2px'
        }}
        initial={{ width: 0, opacity: 1 }}
        animate={{ width: `${distance}vw`, opacity: [1, 1, 0] }}
        transition={{ duration, ease: "easeOut" }}
      />
    );
  }

  // Rocket
  if (weaponType === "rocket") {
    return (
      <motion.div
        className="fixed z-40 pointer-events-none"
        initial={{ left: `${from.x}%`, top: `${from.y}%`, opacity: 1, scale: 1, rotate: 0 }}
        animate={{ 
          left: `${to.x}%`, 
          top: `${to.y}%`, 
          opacity: 1, 
          scale: 1.2,
          rotate: [0, 10, -10, 5, -5, 0]
        }}
        transition={{ duration, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* Rocket body */}
          <div 
            className="w-6 h-3 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${color}, white)`,
              boxShadow: `0 0 15px ${color}`
            }} 
          />
          {/* Rocket trail */}
          <motion.div
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-2"
            style={{ 
              background: `linear-gradient(90deg, transparent, orange, yellow)`,
              filter: 'blur(2px)'
            }}
            animate={{ opacity: [0.5, 1, 0.5], scaleX: [0.8, 1.2, 0.8] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    );
  }

  // Plasma ball (default)
  return (
    <motion.div
      className="fixed z-40 pointer-events-none"
      initial={{ left: `${from.x}%`, top: `${from.y}%`, opacity: 1, scale: 0.5 }}
      animate={{ left: `${to.x}%`, top: `${to.y}%`, opacity: 1, scale: 1 }}
      transition={{ duration, ease: "easeOut" }}
    >
      <motion.div 
        className="w-6 h-6 rounded-full"
        style={{ 
          background: `radial-gradient(circle, white 0%, ${color} 40%, transparent 70%)`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
        transition={{ duration: 0.2, repeat: Infinity }}
      />
    </motion.div>
  );
};

// Speech Bubble Component
const SpeechBubble = ({ text, position }: { text: string; position: { x: number; y: number } }) => {
  const isOnRight = position.x > 50;
  
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
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
        text-primary-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-elegant border border-primary/30
        max-w-[160px] md:max-w-[200px]">
        <p className="leading-relaxed">{text}</p>
        <div 
          className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 
            ${isOnRight 
              ? "right-0 translate-x-full border-l-8 border-l-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent" 
              : "left-0 -translate-x-full border-r-8 border-r-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent"
            }`}
          style={{ borderTopWidth: "6px", borderBottomWidth: "6px" }}
        />
      </div>
    </motion.div>
  );
};

const gestures: GestureType[] = ["idle", "wave", "point", "thumbsUp", "clap", "think", "celebrate", "salute"];
const fightGestures: GestureType[] = ["fight", "shoot", "dodge"];

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [bumblebeePos, setBumblebeePos] = useState({ x: 85, y: 15 });
  const [birdPos, setBirdPos] = useState({ x: 15, y: 25 });
  const [bumblebeeGesture, setBumblebeeGesture] = useState<GestureType>("idle");
  const [birdGesture, setBirdGesture] = useState<GestureType>("idle");
  const [showBird, setShowBird] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [projectiles, setProjectiles] = useState<Array<{ id: number; from: { x: number; y: number }; to: { x: number; y: number }; color: string; weaponType: WeaponType }>>([]);
  const [explosions, setExplosions] = useState<Array<{ id: number; position: { x: number; y: number }; color: string }>>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [isIntroMode, setIsIntroMode] = useState(false);
  const [winner, setWinner] = useState<"bumblebee" | "bird" | null>(null);
  
  // Smooth flying positions
  const [bumblebeeTarget, setBumblebeeTarget] = useState({ x: 85, y: 15 });
  const [birdTarget, setBirdTarget] = useState({ x: 15, y: 25 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const projectileIdRef = useRef(0);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current page tips
  const tips = isIntroMode ? appIntroTips : (pageTips[location.pathname] || pageTips["/"]);

  // Track user activity - hide when active, show after 3 seconds of inactivity
  useEffect(() => {
    const handleActivity = () => {
      // User is active - hide robots
      setIsUserActive(true);
      
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      
      // After 3 seconds of inactivity, show robots again
      activityTimeoutRef.current = setTimeout(() => {
        setIsUserActive(false);
        setIsIntroMode(true);
      }, 3000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    // Initial state - show robots after 3 seconds
    activityTimeoutRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, 3000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // Show bird after initial delay when robots are visible
  useEffect(() => {
    if (isUserActive || isHidden) return;
    
    const timer = setTimeout(() => {
      setShowBird(true);
    }, 4500);
    
    return () => clearTimeout(timer);
  }, [isUserActive, isHidden]);

  // Smooth continuous flying animation
  useEffect(() => {
    if (isUserActive || isHidden) return;

    const flyInterval = setInterval(() => {
      if (!isFighting) {
        // Generate new targets for smooth flying
        const newBumblebeeTarget = {
          x: 15 + Math.random() * 70,
          y: 10 + Math.random() * 70
        };
        const newBirdTarget = {
          x: 15 + Math.random() * 70,
          y: 10 + Math.random() * 70
        };
        
        setBumblebeeTarget(newBumblebeeTarget);
        if (showBird) {
          setBirdTarget(newBirdTarget);
        }
        
        // Random gesture for Bumblebee
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        setBumblebeeGesture(randomGesture);
        setTimeout(() => {
          if (!isFighting) setBumblebeeGesture("idle");
        }, 3000);
      }
    }, 6000);

    return () => clearInterval(flyInterval);
  }, [showBird, isFighting, isUserActive, isHidden]);

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

  // Random fighting - every 30 seconds to 2 minutes
  useEffect(() => {
    if (!showBird || isHidden || isUserActive) return;

    // Random interval between 30 seconds and 2 minutes
    const getRandomFightInterval = () => 30000 + Math.random() * 90000;
    
    let fightTimeout: NodeJS.Timeout;
    
    const scheduleFight = () => {
      fightTimeout = setTimeout(() => {
        if (!isFighting) {
          startFight();
        }
        scheduleFight();
      }, getRandomFightInterval());
    };
    
    scheduleFight();

    return () => clearTimeout(fightTimeout);
  }, [showBird, isHidden, isUserActive, isFighting]);

  const startFight = useCallback(() => {
    setIsFighting(true);
    setWinner(null);
    
    // Random fight gestures
    setBumblebeeGesture("fight");
    setBirdGesture("fight");
    
    // Random weapon types
    const weapons: WeaponType[] = ["laser", "rocket", "plasma"];
    
    // Shoot projectiles - both shoot at the same time with random weapons
    // Projectiles start from current robot position (center) toward enemy
    const shootProjectiles = () => {
      const bumblebeeWeapon = weapons[Math.floor(Math.random() * weapons.length)];
      const birdWeapon = weapons[Math.floor(Math.random() * weapons.length)];
      
      // Get current positions at the moment of shooting
      const currentBumblebeePos = { ...bumblebeePos };
      const currentBirdPos = { ...birdPos };
      
      setProjectiles(prev => [
        ...prev,
        {
          id: projectileIdRef.current++,
          from: currentBumblebeePos,
          to: currentBirdPos,
          color: BLUE_ENERGY,
          weaponType: bumblebeeWeapon
        },
        {
          id: projectileIdRef.current++,
          from: currentBirdPos,
          to: currentBumblebeePos,
          color: PURPLE_ENERGY,
          weaponType: birdWeapon
        }
      ]);
    };

    shootProjectiles();
    setTimeout(shootProjectiles, 1200);
    setTimeout(shootProjectiles, 2400);

    // Determine winner and end fight
    setTimeout(() => {
      const bumblebeeWins = Math.random() > 0.5;
      setWinner(bumblebeeWins ? "bumblebee" : "bird");
      
      // Winner celebrates, loser gets sad
      if (bumblebeeWins) {
        setBumblebeeGesture("victory");
        setBirdGesture("sad");
      } else {
        setBumblebeeGesture("sad");
        setBirdGesture("victory");
      }
      
      // Reset after celebration
      setTimeout(() => {
        setIsFighting(false);
        setBumblebeeGesture("idle");
        setBirdGesture("idle");
        setWinner(null);
      }, 3000);
    }, 3500);
  }, [bumblebeePos, birdPos]);

  const removeProjectile = useCallback((id: number) => {
    setProjectiles(prev => prev.filter(p => p.id !== id));
  }, []);

  const addExplosion = useCallback((position: { x: number; y: number }, color: string) => {
    const id = Date.now();
    setExplosions(prev => [...prev, { id, position, color }]);
  }, []);

  const removeExplosion = useCallback((id: number) => {
    setExplosions(prev => prev.filter(e => e.id !== id));
  }, []);

  // Handle click - single click = fly away, double click = hide permanently
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - fly to new random position
        setBumblebeeTarget({
          x: 15 + Math.random() * 70,
          y: 10 + Math.random() * 70
        });
        if (showBird) {
          setBirdTarget({
            x: 15 + Math.random() * 70,
            y: 10 + Math.random() * 70
          });
        }
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 1) {
      // Double click - hide permanently
      clearTimeout(clickTimerRef.current!);
      setIsHidden(true);
      setClickCount(0);
    }
  }, [clickCount, showBird]);

  // Change tip periodically
  useEffect(() => {
    if (isUserActive) return;
    
    const interval = setInterval(() => {
      setShowTip(false);
      setTimeout(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        setShowTip(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, [tips.length, isUserActive]);

  // Reset on page change
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(true);
  }, [location.pathname]);

  // Don't render if hidden or user is active
  if (isHidden) return null;

  return (
    <AnimatePresence>
      {!isUserActive && (
        <>
          {/* Explosions */}
          {explosions.map(e => (
            <Explosion
              key={e.id}
              position={e.position}
              color={e.color}
              onComplete={() => removeExplosion(e.id)}
            />
          ))}

          {/* Projectiles */}
          {projectiles.map(p => (
            <Projectile 
              key={p.id} 
              from={p.from} 
              to={p.to} 
              color={p.color}
              weaponType={p.weaponType}
              onComplete={() => removeProjectile(p.id)}
              onHit={(position) => addExplosion(position, p.color)}
            />
          ))}

          {/* Bumblebee */}
          <motion.div
            className="fixed z-30 select-none w-[180px] h-[220px] md:w-[220px] md:h-[280px] cursor-pointer"
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              left: `${bumblebeePos.x}%`,
              top: `${bumblebeePos.y}%`,
              x: "-50%",
              y: "-50%",
              rotate: isFighting && !winner ? [0, 5, -5, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              left: { duration: 2, ease: "linear" },
              top: { duration: 2, ease: "linear" },
            }}
          >
            <AnimatePresence mode="wait">
              {showTip && !isFighting && (
                <SpeechBubble text={tips[currentTipIndex]} position={bumblebeePos} />
              )}
            </AnimatePresence>

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
                <spotLight position={[0, 3, 3]} angle={0.5} penumbra={0.8} intensity={1} />
                <MovieBumblebeeRobot gesture={bumblebeeGesture} />
              </Canvas>
            </div>
            
            <div 
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 70%)` }}
            />
            
            {/* Winner crown effect */}
            {winner === "bumblebee" && (
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                👑
              </motion.div>
            )}
          </motion.div>

          {/* Aggressive Bird Robot */}
          <AnimatePresence>
            {showBird && (
              <motion.div
                className="fixed z-30 select-none w-[180px] h-[220px] md:w-[220px] md:h-[280px] cursor-pointer"
                onClick={handleClick}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  left: `${birdPos.x}%`,
                  top: `${birdPos.y}%`,
                  x: "-50%",
                  y: "-50%",
                  rotate: isFighting && !winner ? [0, -8, 8, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.5 } }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut",
                  left: { duration: 2, ease: "linear" },
                  top: { duration: 2, ease: "linear" },
                }}
              >
                <div className="w-full h-full pointer-events-none">
                  <Canvas
                    camera={{ position: [0, 0.2, 2.2], fov: 50 }}
                    style={{ background: "transparent" }}
                    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                  >
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[3, 5, 2]} intensity={1.2} color="#ffffff" />
                    <directionalLight position={[-3, 2, 4]} intensity={0.6} color={PURPLE_ENERGY} />
                    <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFB6C1" />
                    <spotLight position={[0, 3, 3]} angle={0.5} penumbra={0.8} intensity={1} />
                    <AggressiveBirdRobot gesture={birdGesture} />
                  </Canvas>
                </div>
                
                <div 
                  className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25"
                  style={{ background: `radial-gradient(circle, ${PURPLE_ENERGY} 0%, transparent 70%)` }}
                />
                
                {/* Winner crown effect */}
                {winner === "bird" && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    👑
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fight explosion effect */}
          <AnimatePresence>
            {isFighting && !winner && (
              <motion.div
                className="fixed inset-0 pointer-events-none z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div 
                  className="absolute w-20 h-20 rounded-full blur-2xl"
                  style={{
                    left: `${(bumblebeePos.x + birdPos.x) / 2}%`,
                    top: `${(bumblebeePos.y + birdPos.y) / 2}%`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
                    animation: 'pulse 0.5s ease-in-out infinite'
                  }}
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
