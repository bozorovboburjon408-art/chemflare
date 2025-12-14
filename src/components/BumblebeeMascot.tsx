import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Movie-accurate Bumblebee colors
const YELLOW_MAIN = "#E8B923";
const YELLOW_DARK = "#B8860B";
const YELLOW_LIGHT = "#FFD700";
const BLACK_METAL = "#0a0a0a";
const CHROME = "#C0C0C0";
const BLUE_ENERGY = "#00BFFF";
const BLUE_CORE = "#4169E1";

// Energy Sphere with plasma effect
const EnergySphere = () => {
  const sphereRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create particle geometry for energy effect
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
      // Pulsing scale
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
      {/* Core energy ball */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.08, 2]} />
        <meshStandardMaterial
          color={BLUE_CORE}
          emissive={BLUE_CORE}
          emissiveIntensity={4}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial
          color={BLUE_ENERGY}
          emissive={BLUE_ENERGY}
          emissiveIntensity={2}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Energy rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.14, 0.008, 8, 32]} />
        <meshStandardMaterial
          color={BLUE_ENERGY}
          emissive={BLUE_ENERGY}
          emissiveIntensity={3}
        />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.16, 0.006, 8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Energy particles */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          color={BLUE_ENERGY}
          size={0.015}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Point light for glow effect */}
      <pointLight color={BLUE_ENERGY} intensity={2} distance={1} />
    </group>
  );
};

// Detailed Bumblebee Head
const MovieBumblebeeHead = () => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<number>(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.12;
      headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05 - 0.1;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.15, 0]}>
      {/* Main helmet - layered construction */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Helmet top crest */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.3]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Face plate */}
      <mesh position={[0, -0.02, 0.15]}>
        <boxGeometry args={[0.28, 0.18, 0.12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Eye sockets */}
      <mesh position={[-0.07, 0.03, 0.2]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.2]}>
        <boxGeometry args={[0.08, 0.06, 0.06]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Glowing eyes */}
      <mesh position={[-0.07, 0.03, 0.22]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.22]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={5} />
      </mesh>
      
      {/* Eye point lights */}
      <pointLight position={[-0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={0.5} distance={0.5} />
      <pointLight position={[0.07, 0.03, 0.25]} color={BLUE_ENERGY} intensity={0.5} distance={0.5} />
      
      {/* Antenna horns */}
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
      
      {/* Side panels (door wings) */}
      <mesh position={[-0.22, 0, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.18, 0.15]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.22, 0, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.04, 0.18, 0.15]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
      
      {/* Chin/mouth area */}
      <mesh position={[0, -0.12, 0.12]}>
        <boxGeometry args={[0.18, 0.08, 0.08]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Detailed Chest with Autobot emblem
const MovieBumblebeeChest = () => {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Main chest block */}
      <mesh>
        <boxGeometry args={[0.55, 0.45, 0.28]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.12} />
      </mesh>
      
      {/* Chest center panel */}
      <mesh position={[0, 0, 0.145]}>
        <boxGeometry args={[0.3, 0.35, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.08} />
      </mesh>
      
      {/* Autobot emblem area - glowing */}
      <mesh position={[0, 0.05, 0.16]}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 0.05, 0.155]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Chest vents */}
      {[-0.12, -0.04, 0.04, 0.12].map((y, i) => (
        <mesh key={i} position={[0, y - 0.08, 0.155]}>
          <boxGeometry args={[0.25, 0.015, 0.01]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
      
      {/* Side chest panels */}
      <mesh position={[-0.3, 0.08, 0.05]}>
        <boxGeometry args={[0.06, 0.3, 0.2]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh position={[0.3, 0.08, 0.05]}>
        <boxGeometry args={[0.06, 0.3, 0.2]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.18} />
      </mesh>
      
      {/* Shoulder armor mounts */}
      <mesh position={[-0.32, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.32, 0.2, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Lower torso */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.4, 0.12, 0.22]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.15} />
      </mesh>
      
      {/* Waist details */}
      <mesh position={[0, -0.35, 0.08]}>
        <boxGeometry args={[0.35, 0.06, 0.12]} />
        <meshStandardMaterial color={YELLOW_DARK} metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Dynamic Arms with hands charging energy
const MovieBumblebeeArm = ({ side }: { side: "left" | "right" }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  const fingersRef = useRef<THREE.Group[]>([]);

  const xPos = side === "left" ? -0.42 : 0.42;
  const mirror = side === "left" ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (armRef.current) {
      // Arms moving to hold energy sphere
      const armAngle = Math.sin(time * 2) * 0.08;
      armRef.current.rotation.z = (side === "left" ? 0.6 : -0.6) + armAngle;
      armRef.current.rotation.x = -0.4 + Math.sin(time * 1.5) * 0.05;
    }

    if (forearmRef.current) {
      forearmRef.current.rotation.x = 0.8 + Math.sin(time * 2.5) * 0.1;
    }

    if (handRef.current) {
      // Hands opening and closing around energy
      const openClose = Math.sin(time * 3) * 0.15;
      handRef.current.rotation.x = 0.3 + openClose;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.75, 0]}>
      {/* Shoulder armor */}
      <mesh position={[mirror * 0.05, 0.05, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.9} roughness={0.12} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[mirror * 0.02, -0.12, 0]}>
        <boxGeometry args={[0.09, 0.2, 0.09]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.88} roughness={0.15} />
      </mesh>
      
      {/* Upper arm details */}
      <mesh position={[mirror * 0.06, -0.1, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.12} />
      </mesh>
      
      {/* Elbow joint */}
      <mesh position={[0, -0.24, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.08} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.28, 0]}>
        {/* Forearm */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.08, 0.18, 0.08]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.88} roughness={0.15} />
        </mesh>
        
        {/* Forearm hydraulics */}
        <mesh position={[mirror * 0.045, -0.08, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Wrist */}
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={CHROME} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Hand group */}
        <group ref={handRef} position={[0, -0.28, 0.02]}>
          {/* Palm */}
          <mesh>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
            <meshStandardMaterial color={CHROME} metalness={0.92} roughness={0.12} />
          </mesh>
          
          {/* Fingers */}
          {[-0.025, 0, 0.025].map((offset, i) => (
            <group key={i} position={[offset, -0.05, 0]}>
              {/* Finger segment 1 */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.018, 0.035, 0.02]} />
                <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
              </mesh>
              {/* Finger segment 2 */}
              <mesh position={[0, -0.035, 0.008]}>
                <boxGeometry args={[0.015, 0.03, 0.018]} />
                <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.12} />
              </mesh>
            </group>
          ))}
          
          {/* Thumb */}
          <mesh position={[mirror * -0.045, -0.02, 0]} rotation={[0, 0, mirror * 0.5]}>
            <boxGeometry args={[0.015, 0.035, 0.018]} />
            <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
          </mesh>
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
      // Floating effect
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.025;
      // Subtle body rotation
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

const BumblebeeMascot = () => {
  return (
    <div className="fixed top-20 right-2 z-30 pointer-events-none select-none w-[100px] h-[130px] md:w-[110px] md:h-[140px]">
      <Canvas
        camera={{ position: [0, 0.2, 2.2], fov: 50 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        {/* Dramatic cinematic lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, 2, 4]} intensity={0.6} color={BLUE_ENERGY} />
        <pointLight position={[0, 0, 2]} intensity={0.8} color="#FFE4B5" />
        <spotLight
          position={[0, 3, 3]}
          angle={0.5}
          penumbra={0.8}
          intensity={1}
          color="#ffffff"
          castShadow
        />
        
        <MovieBumblebeeRobot />
      </Canvas>
      
      {/* Glow effect behind robot */}
      <div 
        className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25"
        style={{
          background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 60%)`,
        }}
      />
    </div>
  );
};

export default BumblebeeMascot;
