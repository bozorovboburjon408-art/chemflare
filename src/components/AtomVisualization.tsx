import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, Line } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Electron blue color
const ELECTRON_COLOR = "#3b82f6";

// Light pastel colors for orbit rings
const ORBIT_COLORS = [
  "#ff9999", // Light red/pink
  "#99ff99", // Light green
  "#99ccff", // Light blue
  "#ffcc99", // Light orange
  "#cc99ff", // Light purple
  "#99ffcc", // Light mint
  "#ffff99", // Light yellow
];

interface AtomVisualizationProps {
  atomicNumber: number;
  symbol: string;
  electrons: string;
  atomicMass: string;
}

// Parse electron configuration
const parseElectrons = (electronStr: string): number[] => {
  return electronStr.split(",").map(n => parseInt(n));
};

// Atom colors based on category
const getAtomColor = (atomicNumber: number): string => {
  if (atomicNumber <= 2) return "#4299e1"; // H, He - blue
  if (atomicNumber <= 10) return "#48bb78"; // Period 2 - green
  if (atomicNumber <= 18) return "#ed8936"; // Period 3 - orange
  if (atomicNumber <= 36) return "#9f7aea"; // Period 4 - purple
  if (atomicNumber <= 54) return "#f56565"; // Period 5 - red
  if (atomicNumber <= 86) return "#ed64a6"; // Period 6 - pink
  return "#ecc94b"; // Period 7 - yellow
};

// Nucleus component
const Nucleus = ({ protons, color }: { protons: number; color: string }) => {
  return (
    <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </Sphere>
  );
};

// Animated rotating orbit ring with color
const AnimatedOrbitRing = ({ 
  radius, 
  color, 
  rotationAxis, 
  rotationSpeed,
  initialRotation
}: { 
  radius: number; 
  color: string;
  rotationAxis: 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz';
  rotationSpeed: number;
  initialRotation: [number, number, number];
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      ));
    }
    return pts;
  }, [radius]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime * rotationSpeed;
      
      if (rotationAxis === 'x') {
        groupRef.current.rotation.x = initialRotation[0] + time;
      } else if (rotationAxis === 'y') {
        groupRef.current.rotation.y = initialRotation[1] + time;
      } else if (rotationAxis === 'z') {
        groupRef.current.rotation.z = initialRotation[2] + time;
      } else if (rotationAxis === 'xy') {
        groupRef.current.rotation.x = initialRotation[0] + time * 0.7;
        groupRef.current.rotation.y = initialRotation[1] + time;
      } else if (rotationAxis === 'xz') {
        groupRef.current.rotation.x = initialRotation[0] + time;
        groupRef.current.rotation.z = initialRotation[2] + time * 0.5;
      } else if (rotationAxis === 'yz') {
        groupRef.current.rotation.y = initialRotation[1] + time * 0.8;
        groupRef.current.rotation.z = initialRotation[2] + time;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={initialRotation}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
    </group>
  );
};

// Single electron that moves on circular orbit
const Electron = ({ 
  shellRadius, 
  electronIndex, 
  totalElectrons, 
  shellIndex 
}: { 
  shellRadius: number; 
  electronIndex: number; 
  totalElectrons: number; 
  shellIndex: number;
}) => {
  const electronRef = useRef<THREE.Group>(null);
  
  // Different rotation speeds for each shell
  const speed = 0.8 - shellIndex * 0.1;
  const startOffset = (electronIndex / totalElectrons) * Math.PI * 2;
  // Tilt orbit based on electron index for 3D distribution
  const tiltAngle = (electronIndex / totalElectrons) * Math.PI;
  
  useFrame((state) => {
    if (electronRef.current) {
      const time = state.clock.elapsedTime * speed + startOffset;
      
      // Circular motion
      const x = shellRadius * Math.cos(time);
      const z = shellRadius * Math.sin(time);
      
      // Apply tilt for 3D effect
      const y = z * Math.sin(tiltAngle) * 0.5;
      const newZ = z * Math.cos(tiltAngle);
      
      electronRef.current.position.set(x, y, newZ);
    }
  });
  
  return (
    <group ref={electronRef}>
      {/* Electron sphere - blue */}
      <Sphere args={[0.15, 16, 16]}>
        <meshStandardMaterial 
          color={ELECTRON_COLOR}
          emissive={ELECTRON_COLOR}
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.2}
        />
      </Sphere>
      {/* Electron glow */}
      <Sphere args={[0.25, 16, 16]}>
        <meshBasicMaterial 
          color={ELECTRON_COLOR}
          transparent
          opacity={0.25}
        />
      </Sphere>
    </group>
  );
};

// Electron shell with multiple colorful rotating orbit rings
const ElectronShell = ({ 
  radius, 
  electrons, 
  shellIndex 
}: { 
  radius: number; 
  electrons: number; 
  shellIndex: number;
}) => {
  // Get 3 different colors for this shell's orbits
  const color1 = ORBIT_COLORS[shellIndex % ORBIT_COLORS.length];
  const color2 = ORBIT_COLORS[(shellIndex + 2) % ORBIT_COLORS.length];
  const color3 = ORBIT_COLORS[(shellIndex + 4) % ORBIT_COLORS.length];
  
  // Different rotation speeds and axes for variety
  const rotationConfigs: Array<{
    axis: 'x' | 'y' | 'z' | 'xy' | 'xz' | 'yz';
    speed: number;
    initial: [number, number, number];
  }> = [
    { axis: 'x', speed: 0.3 + shellIndex * 0.1, initial: [0, 0, 0] },
    { axis: 'yz', speed: 0.2 + shellIndex * 0.05, initial: [Math.PI / 3, 0, Math.PI / 4] },
    { axis: 'xy', speed: 0.25 + shellIndex * 0.08, initial: [Math.PI / 2, Math.PI / 3, 0] },
  ];

  return (
    <group>
      {/* Three colorful rotating orbit rings */}
      <AnimatedOrbitRing 
        radius={radius} 
        color={color1}
        rotationAxis={rotationConfigs[0].axis}
        rotationSpeed={rotationConfigs[0].speed}
        initialRotation={rotationConfigs[0].initial}
      />
      <AnimatedOrbitRing 
        radius={radius} 
        color={color2}
        rotationAxis={rotationConfigs[1].axis}
        rotationSpeed={rotationConfigs[1].speed}
        initialRotation={rotationConfigs[1].initial}
      />
      <AnimatedOrbitRing 
        radius={radius} 
        color={color3}
        rotationAxis={rotationConfigs[2].axis}
        rotationSpeed={rotationConfigs[2].speed}
        initialRotation={rotationConfigs[2].initial}
      />
      
      {/* Blue electrons */}
      {Array.from({ length: electrons }).map((_, i) => (
        <Electron
          key={`electron-${shellIndex}-${i}`}
          shellRadius={radius}
          electronIndex={i}
          totalElectrons={electrons}
          shellIndex={shellIndex}
        />
      ))}
    </group>
  );
};

// Main atom scene - simplified realistic model
const AtomScene = ({ atomicNumber, symbol, electrons }: AtomVisualizationProps) => {
  const shellElectrons = parseElectrons(electrons);
  const atomColor = getAtomColor(atomicNumber);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Nucleus */}
      <Nucleus protons={atomicNumber} color={atomColor} />
      
      {/* Nucleus label */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
      
      {/* Electron shells with animated blue electrons */}
      {shellElectrons.map((numElectrons, index) => (
        <ElectronShell
          key={`shell-${index}`}
          radius={1.5 + index * 1.2}
          electrons={numElectrons}
          shellIndex={index}
        />
      ))}
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Calculate neutrons from atomic mass
const calculateNeutrons = (atomicMass: string, protons: number): number => {
  const mass = parseFloat(atomicMass.replace(/[()]/g, ''));
  if (isNaN(mass)) return protons;
  return Math.round(mass) - protons;
};

// Detailed nucleus with individual protons and neutrons
const DetailedNucleus = ({ 
  protons, 
  neutrons 
}: { 
  protons: number; 
  neutrons: number;
}) => {
  const nucleonPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const total = protons + neutrons;
    const radius = Math.max(0.8, Math.pow(total, 1/3) * 0.4);
    
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < total; i++) {
      const theta = 2 * Math.PI * i / goldenRatio;
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push([x, y, z]);
    }
    
    return { positions, radius };
  }, [protons, neutrons]);

  return (
    <group>
      {nucleonPositions.positions.slice(0, protons).map((pos, i) => (
        <Sphere key={`proton-${i}`} args={[0.18, 16, 16]} position={pos}>
          <meshStandardMaterial 
            color="#ef4444" 
            emissive="#dc2626"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
          />
        </Sphere>
      ))}
      
      {nucleonPositions.positions.slice(protons).map((pos, i) => (
        <Sphere key={`neutron-${i}`} args={[0.18, 16, 16]} position={pos}>
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#2563eb"
            emissiveIntensity={0.3}
            metalness={0.6}
            roughness={0.3}
          />
        </Sphere>
      ))}
      
      <Sphere args={[nucleonPositions.radius * 1.1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
};

// Nucleus-only scene for detailed view
const NucleusScene = ({ 
  atomicNumber, 
  symbol, 
  atomicMass 
}: AtomVisualizationProps) => {
  const neutrons = calculateNeutrons(atomicMass, atomicNumber);
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#fbbf24" />
      
      <DetailedNucleus protons={atomicNumber} neutrons={neutrons} />
      
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
      
      <group position={[-4, 3, 0]}>
        <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.4} />
        </Sphere>
        <Text
          position={[0.5, 0, 0]}
          fontSize={0.3}
          color="white"
          anchorX="left"
          anchorY="middle"
        >
          Proton (+)
        </Text>
      </group>
      
      <group position={[-4, 2.3, 0]}>
        <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.3} />
        </Sphere>
        <Text
          position={[0.5, 0, 0]}
          fontSize={0.3}
          color="white"
          anchorX="left"
          anchorY="middle"
        >
          Neutron (0)
        </Text>
      </group>
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={1}
      />
    </>
  );
};

export const AtomVisualization = (props: AtomVisualizationProps) => {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <AtomScene {...props} />
      </Canvas>
    </div>
  );
};

export const NucleusVisualization = (props: AtomVisualizationProps) => {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <NucleusScene {...props} />
      </Canvas>
    </div>
  );
};
