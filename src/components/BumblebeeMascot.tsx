import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Robot Head Component
const RobotHead = () => {
  return (
    <group position={[0, 1.2, 0]}>
      {/* Main head */}
      <mesh>
        <boxGeometry args={[0.6, 0.5, 0.5]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.15, 0.05, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.15, 0.05, 0.26]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={2} />
      </mesh>
      
      {/* Antenna horns */}
      <mesh position={[-0.2, 0.35, 0]}>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.35, 0]}>
        <coneGeometry args={[0.05, 0.2, 8]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Face plate */}
      <mesh position={[0, -0.1, 0.26]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Robot Body Component
const RobotBody = () => {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Chest */}
      <mesh>
        <boxGeometry args={[0.8, 0.7, 0.4]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Chest emblem */}
      <mesh position={[0, 0, 0.21]}>
        <circleGeometry args={[0.15, 16]} />
        <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={1} />
      </mesh>
      
      {/* Chest details */}
      <mesh position={[-0.25, 0.15, 0.21]}>
        <boxGeometry args={[0.1, 0.2, 0.02]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.25, 0.15, 0.21]}>
        <boxGeometry args={[0.1, 0.2, 0.02]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Animated Arm Component
const AnimatedArm = ({ side }: { side: "left" | "right" }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  
  const xPos = side === "left" ? -0.55 : 0.55;
  const waveDirection = side === "right" ? 1 : 0.3;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (armRef.current) {
      // Wave motion for right arm
      if (side === "right") {
        armRef.current.rotation.z = Math.sin(time * 3) * 0.4 - 0.8;
        armRef.current.rotation.x = Math.sin(time * 2) * 0.2;
      } else {
        armRef.current.rotation.z = Math.sin(time * 1.5 + 1) * 0.15 + 0.3;
      }
    }
    
    if (forearmRef.current) {
      if (side === "right") {
        forearmRef.current.rotation.x = Math.sin(time * 4) * 0.3 + 0.5;
      }
    }
    
    if (handRef.current) {
      if (side === "right") {
        // Waving hand gesture
        handRef.current.rotation.z = Math.sin(time * 6) * 0.5;
      }
    }
  });
  
  return (
    <group ref={armRef} position={[xPos, 0.6, 0]}>
      {/* Shoulder */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.4, 0]}>
        {/* Elbow */}
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Forearm */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.12]} />
          <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Hand group */}
        <group ref={handRef} position={[0, -0.4, 0]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.12, 0.1, 0.08]} />
            <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Fingers */}
          {[-0.04, 0, 0.04].map((offset, i) => (
            <mesh key={i} position={[offset, -0.08, 0]}>
              <boxGeometry args={[0.025, 0.06, 0.03]} />
              <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// Main Robot Component with animations
const AnimatedRobot = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Gentle floating motion
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.05;
      // Slight body rotation
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} scale={0.8}>
      <RobotHead />
      <RobotBody />
      <AnimatedArm side="left" />
      <AnimatedArm side="right" />
      
      {/* Lower body hint */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#f5c842" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const BumblebeeMascot = () => {
  return (
    <div 
      className="fixed top-20 right-4 z-40 pointer-events-none select-none"
      style={{ width: "100px", height: "120px" }}
    >
      <Canvas
        camera={{ position: [0, 0.5, 3], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 3, 5]} intensity={0.5} color="#00bfff" />
        <spotLight
          position={[0, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow
        />
        
        <AnimatedRobot />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
      
      {/* Glow effect behind robot */}
      <div 
        className="absolute inset-0 -z-10 rounded-full blur-xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)",
        }}
      />
    </div>
  );
};

export default BumblebeeMascot;
