import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Girl Robot 3D (Nano - Pink with Iroqi Doppi)
const GirlRobot3D = ({ 
  isWaving = false, 
  isTalking = false 
}: { 
  isWaving?: boolean; 
  isTalking?: boolean;
}) => {
  const armRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Waving animation
    if (armRef.current && isWaving) {
      armRef.current.rotation.z = Math.sin(time * 5) * 0.5 + 0.3;
    }
    
    // Talking animation - mouth
    if (mouthRef.current && isTalking) {
      mouthRef.current.scale.y = 0.5 + Math.sin(time * 10) * 0.3;
    }
    
    // Eye blink
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(time * 0.5) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  return (
    <group>
      {/* Iroqi Doppi - Square traditional cap */}
      <group position={[0, 1.3, 0]}>
        {/* Main square dome */}
        <mesh>
          <boxGeometry args={[0.9, 0.35, 0.9]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Center black pattern */}
        <mesh position={[0, 0.01, 0.46]}>
          <boxGeometry args={[0.08, 0.3, 0.02]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        {/* Red flower decorations */}
        <mesh position={[-0.25, 0.05, 0.46]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#C41E3A" />
        </mesh>
        <mesh position={[0.25, 0.05, 0.46]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#C41E3A" />
        </mesh>
        {/* Yellow centers */}
        <mesh position={[-0.25, 0.05, 0.5]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[0.25, 0.05, 0.5]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        {/* Bottom border */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.92, 0.05, 0.92]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
      </group>

      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFE4EC" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Face screen */}
      <mesh position={[0, 0.9, 0.35]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#1A1A2E" />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.12, 0.95, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.12, 0.95, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FF1493" emissive="#FF1493" emissiveIntensity={0.5} />
      </mesh>

      {/* Eyelashes */}
      {[-0.12, 0.12].map((x, i) => (
        <group key={i} position={[x, 1.05, 0.38]}>
          <mesh rotation={[0, 0, x < 0 ? -0.3 : 0.3]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          <mesh rotation={[0, 0, x < 0 ? 0.3 : -0.3]}>
            <cylinderGeometry args={[0.01, 0.01, 0.08, 8]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
        </group>
      ))}

      {/* Blush */}
      <mesh position={[-0.3, 0.85, 0.35]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.3, 0.85, 0.35]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#FFB6C1" transparent opacity={0.6} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.78, 0.4]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#FF1493" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.35, 0.5, 16, 32]} />
        <meshStandardMaterial color="#FFE4EC" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Dress accent */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.45, 0.4, 32]} />
        <meshStandardMaterial color="#FF69B4" transparent opacity={0.8} />
      </mesh>

      {/* Heart on chest */}
      <mesh position={[0, 0.25, 0.35]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.08, 0.12, 32]} />
        <meshStandardMaterial color="#FF1493" />
      </mesh>

      {/* Left Arm (waving) */}
      <group ref={armRef} position={[-0.45, 0.2, 0]}>
        <mesh>
          <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
          <meshStandardMaterial color="#FFE4EC" />
        </mesh>
      </group>

      {/* Right Arm */}
      <mesh position={[0.45, 0.2, 0]}>
        <capsuleGeometry args={[0.08, 0.25, 8, 16]} />
        <meshStandardMaterial color="#FFE4EC" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.15, -0.45, 0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFE4EC" />
      </mesh>
      <mesh position={[0.15, -0.45, 0.05]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFE4EC" />
      </mesh>
    </group>
  );
};

// Boy Robot 3D (Piko - Green with Uzbek Doppi)
const BoyRobot3D = ({ 
  isWaving = false, 
  isTalking = false 
}: { 
  isWaving?: boolean; 
  isTalking?: boolean;
}) => {
  const armRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (armRef.current && isWaving) {
      armRef.current.rotation.z = Math.sin(time * 5) * 0.5 + 0.3;
    }
    
    if (mouthRef.current && isTalking) {
      mouthRef.current.scale.y = 0.5 + Math.sin(time * 10) * 0.3;
    }
    
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(time * 0.5) > 0.95 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  return (
    <group>
      {/* Uzbek Doppi - Traditional round cap */}
      <group position={[0, 1.35, 0]}>
        {/* Main dome */}
        <mesh>
          <sphereGeometry args={[0.45, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        {/* Bottom rim */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.1, 32]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        {/* White decorative patterns */}
        <mesh position={[0, 0.2, 0.35]}>
          <torusGeometry args={[0.12, 0.02, 8, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.25, 0.25]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* White lines pattern */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.44, 0.015, 8, 32]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        {/* Rectangle patterns */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 0.35, -0.02, Math.sin(i * Math.PI / 3) * 0.35]} rotation={[0, -i * Math.PI / 3, 0]}>
            <boxGeometry args={[0.12, 0.06, 0.02]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>

      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.6]} />
        <meshStandardMaterial color="#E8F5E9" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Face screen */}
      <mesh position={[0, 0.9, 0.31]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#1A1A2E" />
      </mesh>

      {/* Eyes */}
      <mesh ref={eyeLeftRef} position={[-0.12, 0.95, 0.35]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={eyeRightRef} position={[0.12, 0.95, 0.35]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshStandardMaterial color="#81C784" emissive="#81C784" emissiveIntensity={0.5} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 0.78, 0.35]}>
        <boxGeometry args={[0.15, 0.04, 0.02]} />
        <meshStandardMaterial color="#81C784" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.7, 0.8, 0.5]} />
        <meshStandardMaterial color="#E8F5E9" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Shirt accent */}
      <mesh position={[0, 0.15, 0.26]}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
        <meshStandardMaterial color="#4CAF50" transparent opacity={0.8} />
      </mesh>

      {/* Buttons */}
      <mesh position={[0, 0.25, 0.28]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, 0.1, 0.28]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Left Arm (waving) */}
      <group ref={armRef} position={[-0.5, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial color="#E8F5E9" />
        </mesh>
      </group>

      {/* Right Arm */}
      <mesh position={[0.5, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.35, 0.15]} />
        <meshStandardMaterial color="#E8F5E9" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.18, -0.45, 0.05]}>
        <boxGeometry args={[0.2, 0.15, 0.25]} />
        <meshStandardMaterial color="#E8F5E9" />
      </mesh>
      <mesh position={[0.18, -0.45, 0.05]}>
        <boxGeometry args={[0.2, 0.15, 0.25]} />
        <meshStandardMaterial color="#E8F5E9" />
      </mesh>
    </group>
  );
};

// Canvas wrapper components
export const GirlRobot3DCanvas = ({ 
  isWaving = false, 
  isTalking = false 
}: { 
  isWaving?: boolean; 
  isTalking?: boolean;
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#FF69B4" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <GirlRobot3D isWaving={isWaving} isTalking={isTalking} />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export const BoyRobot3DCanvas = ({ 
  isWaving = false, 
  isTalking = false 
}: { 
  isWaving?: boolean; 
  isTalking?: boolean;
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#4CAF50" />
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
          <BoyRobot3D isWaving={isWaving} isTalking={isTalking} />
        </Float>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
