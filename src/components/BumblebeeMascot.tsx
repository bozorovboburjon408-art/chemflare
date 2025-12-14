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
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "clap" | "think" | "celebrate" | "salute" | "fight" | "shoot" | "dodge";

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

// Gesture context to share between components
const GestureContext = {
  current: "idle" as GestureType,
  time: 0,
};

// Energy Sphere with plasma effect
const EnergySphere = ({ color = BLUE_ENERGY, coreColor = BLUE_CORE }: { color?: string; coreColor?: string }) => {
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
    const baseScale = gesture === "celebrate" || gesture === "fight" ? 1.5 : gesture === "shoot" ? 2 : 1;
    
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
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.4} />
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
      <pointLight color={color} intensity={2} distance={1} />
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
        case "think":
          headRef.current.rotation.y = 0.3;
          headRef.current.rotation.x = Math.sin(time * 0.5) * 0.1 - 0.15;
          break;
        case "celebrate":
          headRef.current.rotation.y = Math.sin(time * 4) * 0.25;
          headRef.current.rotation.z = Math.sin(time * 3) * 0.15;
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
        // Fighting stance - both arms up for attack
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
        
      case "celebrate":
        armRef.current.rotation.z = (isLeft ? 1 : -1) * (-1.3 + Math.sin(time * 5 + (isLeft ? 0 : Math.PI)) * 0.2);
        armRef.current.rotation.x = -0.3 + Math.sin(time * 3) * 0.1;
        forearmRef.current.rotation.x = 0.3 + Math.sin(time * 6) * 0.2;
        handRef.current.rotation.z = Math.sin(time * 8 + (isLeft ? 0 : Math.PI)) * 0.3;
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
    GestureContext.current = gesture;
    
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
        case "celebrate":
          groupRef.current.position.y = Math.sin(time * 4) * 0.05;
          groupRef.current.rotation.y = Math.sin(time * 2) * 0.15;
          break;
        default:
          groupRef.current.position.y = Math.sin(time * 1.5) * 0.025;
          groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.06;
          groupRef.current.position.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, -0.15, 0]}>
      <MovieBumblebeeHead gesture={gesture} />
      <MovieBumblebeeChest />
      <MovieBumblebeeArm side="left" gesture={gesture} />
      <MovieBumblebeeArm side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} />
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
        default:
          headRef.current.rotation.y = Math.sin(time * 1.2) * 0.15;
          headRef.current.rotation.x = Math.sin(time * 0.8) * 0.08;
      }
    }
  });

  return (
    <group ref={headRef} position={[0, 0.8, 0]}>
      {/* Bird-like head shape */}
      <mesh>
        <coneGeometry args={[0.18, 0.3, 6]} />
        <meshStandardMaterial color={RED_MAIN} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, -0.05, 0.2]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.06, 0.2, 4]} />
        <meshStandardMaterial color={RED_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Angry eyes */}
      <mesh position={[-0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={6} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.12]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color={PURPLE_ENERGY} emissive={PURPLE_ENERGY} emissiveIntensity={6} />
      </mesh>
      <pointLight position={[0, 0, 0.2]} color={PURPLE_ENERGY} intensity={1} distance={0.5} />
      {/* Crest */}
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
      const baseFlap = Math.sin(time * 8) * 0.3;
      switch (gesture) {
        case "fight":
        case "shoot":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (0.8 + Math.sin(time * 12) * 0.5);
          wingRef.current.rotation.x = Math.sin(time * 10) * 0.3;
          break;
        case "dodge":
          wingRef.current.rotation.z = (isLeft ? 1 : -1) * (1.2 + Math.sin(time * 15) * 0.4);
          break;
        default:
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
      {/* Wing feathers */}
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
        default:
          groupRef.current.position.y = Math.sin(time * 2) * 0.03;
          groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.6} position={[0, -0.1, 0]}>
      <BirdRobotHead gesture={gesture} />
      <BirdRobotBody />
      <BirdRobotWing side="left" gesture={gesture} />
      <BirdRobotWing side="right" gesture={gesture} />
      <EnergySphere color={PURPLE_ENERGY} coreColor={PURPLE_CORE} />
    </group>
  );
};

// Projectile/Arrow component
const Projectile = ({ from, to, color, onComplete }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed z-40 pointer-events-none"
      initial={{ left: `${from.x}%`, top: `${from.y}%`, opacity: 1, scale: 1 }}
      animate={{ left: `${to.x}%`, top: `${to.y}%`, opacity: 0, scale: 0.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div 
        className="w-4 h-4 rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`
        }} 
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

// Random position generator
const generateRandomPosition = () => {
  const padding = 15;
  const x = padding + Math.random() * (100 - 2 * padding);
  const y = padding + Math.random() * (100 - 2 * padding);
  return { x, y };
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
  const [projectiles, setProjectiles] = useState<Array<{ id: number; from: { x: number; y: number }; to: { x: number; y: number }; color: string }>>([]);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [isIntroMode, setIsIntroMode] = useState(false);
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const projectileIdRef = useRef(0);

  // Get current page tips
  const tips = isIntroMode ? appIntroTips : (pageTips[location.pathname] || pageTips["/"]);

  // Track user activity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetActivity = () => {
      setIsUserActive(true);
      setIsIntroMode(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsUserActive(false);
        setIsIntroMode(true);
      }, 10000); // 10 seconds of inactivity
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetActivity));
    
    resetActivity();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetActivity));
      clearTimeout(timeout);
    };
  }, []);

  // Show bird after 4-5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHidden) {
        setShowBird(true);
      }
    }, 4500);
    return () => clearTimeout(timer);
  }, [isHidden]);

  // Random fighting
  useEffect(() => {
    if (!showBird || isHidden) return;

    const fightInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        startFight();
      }
    }, 12000);

    return () => clearInterval(fightInterval);
  }, [showBird, isHidden]);

  const startFight = useCallback(() => {
    setIsFighting(true);
    
    // Random fight gestures
    const randomFightGesture = fightGestures[Math.floor(Math.random() * fightGestures.length)];
    setBumblebeeGesture(randomFightGesture);
    setBirdGesture(fightGestures[Math.floor(Math.random() * fightGestures.length)]);
    
    // Shoot projectiles
    const shootProjectiles = () => {
      // Bumblebee shoots
      setProjectiles(prev => [...prev, {
        id: projectileIdRef.current++,
        from: bumblebeePos,
        to: birdPos,
        color: BLUE_ENERGY
      }]);
      
      // Bird shoots back after delay
      setTimeout(() => {
        setProjectiles(prev => [...prev, {
          id: projectileIdRef.current++,
          from: birdPos,
          to: bumblebeePos,
          color: PURPLE_ENERGY
        }]);
      }, 400);
    };

    shootProjectiles();
    setTimeout(shootProjectiles, 1000);
    setTimeout(shootProjectiles, 2000);

    // End fight
    setTimeout(() => {
      setIsFighting(false);
      setBumblebeeGesture("idle");
      setBirdGesture("idle");
    }, 3500);
  }, [bumblebeePos, birdPos]);

  const removeProjectile = useCallback((id: number) => {
    setProjectiles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Handle click - single click = fly away, double click = hide permanently
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        // Single click - fly to new position
        setBumblebeePos(generateRandomPosition());
        if (showBird) {
          setBirdPos(generateRandomPosition());
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

  // Flying animation
  useEffect(() => {
    if (isHidden) return;

    const flyInterval = setInterval(() => {
      if (!isFighting) {
        setBumblebeePos(generateRandomPosition());
        if (showBird) {
          setBirdPos(generateRandomPosition());
        }
        
        // Random gesture for Bumblebee
        const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
        setBumblebeeGesture(randomGesture);
        setTimeout(() => setBumblebeeGesture("idle"), 3000);
      }
    }, 8000);

    return () => clearInterval(flyInterval);
  }, [showBird, isFighting, isHidden]);

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

  // Reset on page change
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(true);
  }, [location.pathname]);

  if (isHidden) return null;

  return (
    <>
      {/* Projectiles */}
      {projectiles.map(p => (
        <Projectile 
          key={p.id} 
          from={p.from} 
          to={p.to} 
          color={p.color} 
          onComplete={() => removeProjectile(p.id)} 
        />
      ))}

      {/* Bumblebee */}
      <motion.div
        className="fixed z-30 select-none w-[90px] h-[120px] md:w-[100px] md:h-[130px] cursor-pointer"
        onClick={handleClick}
        animate={{ 
          left: `${bumblebeePos.x}%`,
          top: `${bumblebeePos.y}%`,
          x: "-50%",
          y: "-50%",
          rotate: isFighting ? [0, 5, -5, 0] : 0,
          scale: isFighting ? 1.1 : 1,
        }}
        transition={{ 
          duration: 1.5,
          ease: [0.25, 0.1, 0.25, 1],
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
      </motion.div>

      {/* Aggressive Bird Robot */}
      <AnimatePresence>
        {showBird && (
          <motion.div
            className="fixed z-30 select-none w-[80px] h-[100px] md:w-[90px] md:h-[110px] cursor-pointer"
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              left: `${birdPos.x}%`,
              top: `${birdPos.y}%`,
              x: "-50%",
              y: "-50%",
              rotate: isFighting ? [0, -8, 8, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: 1.5,
              ease: [0.25, 0.1, 0.25, 1],
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fight explosion effect */}
      <AnimatePresence>
        {isFighting && (
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
  );
};

export default BumblebeeMascot;
