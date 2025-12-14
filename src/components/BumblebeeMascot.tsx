import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Bumblebee style colors
const YELLOW = "#FFD700";
const DARK_YELLOW = "#DAA520";
const BLACK = "#1a1a1a";
const BLUE_GLOW = "#00BFFF";
const METAL_GRAY = "#4a4a4a";

// Robot Head - Bumblebee style with helmet and antennas
const BumblebeeHead = () => {
  const headRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (headRef.current) {
      // Subtle head movement
      headRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
      headRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.4, 0]}>
      {/* Main helmet */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={YELLOW} metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Face plate - darker section */}
      <mesh position={[0, -0.05, 0.2]}>
        <boxGeometry args={[0.4, 0.25, 0.2]} />
        <meshStandardMaterial color={BLACK} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Eyes - bright blue glow */}
      <mesh position={[-0.1, 0.02, 0.32]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={BLUE_GLOW} emissive={BLUE_GLOW} emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.1, 0.02, 0.32]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={BLUE_GLOW} emissive={BLUE_GLOW} emissiveIntensity={3} />
      </mesh>
      
      {/* Eye rings */}
      <mesh position={[-0.1, 0.02, 0.3]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 0.02, 0.3]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Antenna horns */}
      <mesh position={[-0.18, 0.32, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.04, 0.18, 8]} />
        <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0.18, 0.32, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.04, 0.18, 8]} />
        <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Antenna tips */}
      <mesh position={[-0.22, 0.42, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={BLUE_GLOW} emissive={BLUE_GLOW} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.22, 0.42, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={BLUE_GLOW} emissive={BLUE_GLOW} emissiveIntensity={2} />
      </mesh>
      
      {/* Helmet side panels */}
      <mesh position={[-0.32, 0.05, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.08, 0.25, 0.2]} />
        <meshStandardMaterial color={DARK_YELLOW} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.32, 0.05, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.08, 0.25, 0.2]} />
        <meshStandardMaterial color={DARK_YELLOW} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Robot Body - Bumblebee chest with Autobot emblem area
const BumblebeeBody = () => {
  return (
    <group position={[0, 0.65, 0]}>
      {/* Main chest */}
      <mesh>
        <boxGeometry args={[0.7, 0.6, 0.35]} />
        <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Chest center - dark panel */}
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[0.35, 0.4, 0.02]} />
        <meshStandardMaterial color={BLACK} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Autobot emblem glow */}
      <mesh position={[0, 0.05, 0.2]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color={BLUE_GLOW} emissive={BLUE_GLOW} emissiveIntensity={1.5} />
      </mesh>
      
      {/* Side panels */}
      <mesh position={[-0.38, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.35, 0.25]} />
        <meshStandardMaterial color={DARK_YELLOW} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.38, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.35, 0.25]} />
        <meshStandardMaterial color={DARK_YELLOW} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Shoulder joints */}
      <mesh position={[-0.42, 0.25, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0.42, 0.25, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Lower torso */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.3]} />
        <meshStandardMaterial color={BLACK} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Animated Arm with waving gesture
const BumblebeeArm = ({ side }: { side: "left" | "right" }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  
  const xPos = side === "left" ? -0.55 : 0.55;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (armRef.current) {
      if (side === "right") {
        // Right arm waves enthusiastically
        armRef.current.rotation.z = Math.sin(time * 4) * 0.5 - 1.2;
        armRef.current.rotation.x = Math.sin(time * 2.5) * 0.15 - 0.2;
      } else {
        // Left arm gentle movement
        armRef.current.rotation.z = Math.sin(time * 1.2) * 0.1 + 0.4;
      }
    }
    
    if (forearmRef.current && side === "right") {
      forearmRef.current.rotation.x = Math.sin(time * 5) * 0.25 + 0.6;
    }
    
    if (handRef.current && side === "right") {
      handRef.current.rotation.z = Math.sin(time * 7) * 0.6;
      handRef.current.rotation.x = Math.sin(time * 4) * 0.2;
    }
  });
  
  return (
    <group ref={armRef} position={[xPos, 0.85, 0]}>
      {/* Shoulder plate */}
      <mesh>
        <boxGeometry args={[0.15, 0.12, 0.15]} />
        <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.15} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.2} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.35, 0]}>
        {/* Elbow joint */}
        <mesh>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.1, 0.22, 0.1]} />
          <meshStandardMaterial color={YELLOW} metalness={0.85} roughness={0.2} />
        </mesh>
        
        {/* Hand group */}
        <group ref={handRef} position={[0, -0.32, 0]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.1, 0.08, 0.06]} />
            <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
          </mesh>
          
          {/* Fingers */}
          {[-0.035, 0, 0.035].map((offset, i) => (
            <mesh key={i} position={[offset, -0.06, 0]}>
              <boxGeometry args={[0.02, 0.05, 0.025]} />
              <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
            </mesh>
          ))}
          
          {/* Thumb */}
          <mesh position={[side === "right" ? -0.055 : 0.055, -0.02, 0]} rotation={[0, 0, side === "right" ? 0.5 : -0.5]}>
            <boxGeometry args={[0.02, 0.04, 0.025]} />
            <meshStandardMaterial color={METAL_GRAY} metalness={0.9} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Main Bumblebee Robot with floating animation
const BumblebeeRobot = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Floating hover effect
      groupRef.current.position.y = Math.sin(time * 1.8) * 0.04;
      // Gentle body sway
      groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.08 + 0.1;
    }
  });
  
  return (
    <group ref={groupRef} scale={0.65} position={[0, -0.3, 0]}>
      <BumblebeeHead />
      <BumblebeeBody />
      <BumblebeeArm side="left" />
      <BumblebeeArm side="right" />
    </group>
  );
};

const BumblebeeMascot = () => {
  return (
    <div className="fixed top-20 right-2 z-30 pointer-events-none select-none w-[90px] h-[110px] md:w-[100px] md:h-[120px]">
      <Canvas
        camera={{ position: [0, 0.3, 2.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-2, 2, 3]} intensity={0.5} color={BLUE_GLOW} />
        <spotLight
          position={[0, 4, 4]}
          angle={0.4}
          penumbra={0.8}
          intensity={0.6}
          castShadow
        />
        
        <BumblebeeRobot />
      </Canvas>
      
      {/* Glow effect */}
      <div 
        className="absolute inset-0 -z-10 rounded-full blur-2xl opacity-20"
        style={{
          background: `radial-gradient(circle, ${BLUE_GLOW} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default BumblebeeMascot;
