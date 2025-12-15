import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, Line } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Light pastel colors for electron orbits
const orbitColors = [
  "#ff9999", // Light red
  "#99ff99", // Light green
  "#9999ff", // Light blue
  "#ffff99", // Light yellow
  "#ff99ff", // Light magenta
  "#99ffff", // Light cyan
  "#ffcc99", // Light orange
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

// Calculate neutrons from atomic mass
const calculateNeutrons = (atomicMass: string, protons: number): number => {
  const mass = parseFloat(atomicMass.replace(/[()]/g, ''));
  if (isNaN(mass)) return protons; // Fallback for unstable elements
  return Math.round(mass) - protons;
};

// Nucleus component with protons and neutrons
const Nucleus = ({ protons, color }: { protons: number; color: string }) => {
  return (
    <Sphere args={[0.8, 32, 32]} position={[0, 0, 0]}>
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </Sphere>
  );
};

// Detailed nucleus with individual protons and neutrons
const DetailedNucleus = ({ 
  protons, 
  neutrons 
}: { 
  protons: number; 
  neutrons: number;
}) => {
  // Generate positions for nucleons using sphere packing algorithm
  const nucleonPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const total = protons + neutrons;
    const radius = Math.max(0.8, Math.pow(total, 1/3) * 0.4); // Scale nucleus size
    
    // Fibonacci sphere algorithm for even distribution
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
      {/* Protons - red */}
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
      
      {/* Neutrons - blue */}
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
      
      {/* Nucleus glow effect */}
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

// Electron with animated orbit trail
const AnimatedElectron = ({ 
  shellRadius, 
  electronIndex, 
  totalElectrons, 
  shellIndex,
  color
}: { 
  shellRadius: number; 
  electronIndex: number; 
  totalElectrons: number; 
  shellIndex: number;
  color: string;
}) => {
  const electronRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Line>(null);
  
  // Different rotation speeds and tilts for each electron
  const speed = 0.5 + shellIndex * 0.2;
  const tiltX = (electronIndex / totalElectrons) * Math.PI;
  const tiltY = (electronIndex / totalElectrons) * Math.PI * 0.5;
  const startOffset = (electronIndex / totalElectrons) * Math.PI * 2;
  
  // Generate 3D orbital path (elliptical with varying tilts)
  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      
      // Create slightly elliptical orbit
      const a = shellRadius;
      const b = shellRadius * (0.8 + Math.random() * 0.2);
      
      const x = a * Math.cos(angle);
      const y = b * Math.sin(angle) * Math.cos(tiltX);
      const z = b * Math.sin(angle) * Math.sin(tiltX);
      
      // Apply secondary rotation
      const rotatedX = x * Math.cos(tiltY) - z * Math.sin(tiltY);
      const rotatedZ = x * Math.sin(tiltY) + z * Math.cos(tiltY);
      
      points.push(new THREE.Vector3(rotatedX, y, rotatedZ));
    }
    
    return points;
  }, [shellRadius, tiltX, tiltY]);
  
  useFrame((state) => {
    if (electronRef.current) {
      const time = state.clock.elapsedTime * speed + startOffset;
      const angle = time % (Math.PI * 2);
      
      const a = shellRadius;
      const b = shellRadius * 0.9;
      
      const x = a * Math.cos(angle);
      const y = b * Math.sin(angle) * Math.cos(tiltX);
      const z = b * Math.sin(angle) * Math.sin(tiltX);
      
      const rotatedX = x * Math.cos(tiltY) - z * Math.sin(tiltY);
      const rotatedZ = x * Math.sin(tiltY) + z * Math.cos(tiltY);
      
      electronRef.current.position.set(rotatedX, y, rotatedZ);
    }
  });
  
  return (
    <>
      {/* Orbital path line */}
      <Line
        points={orbitPoints}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      
      {/* Electron sphere */}
      <group ref={electronRef}>
        <Sphere args={[0.12, 16, 16]}>
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
        {/* Electron glow */}
        <Sphere args={[0.2, 16, 16]}>
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.3}
          />
        </Sphere>
      </group>
    </>
  );
};

// Electron shell component with realistic orbits
const ElectronShell = ({ 
  radius, 
  electrons, 
  shellIndex 
}: { 
  radius: number; 
  electrons: number; 
  shellIndex: number;
}) => {
  const shellColor = orbitColors[shellIndex % orbitColors.length];
  
  return (
    <group>
      {/* Electrons with individual orbits */}
      {Array.from({ length: electrons }).map((_, i) => (
        <AnimatedElectron
          key={`electron-${shellIndex}-${i}`}
          shellRadius={radius}
          electronIndex={i}
          totalElectrons={electrons}
          shellIndex={shellIndex}
          color={shellColor}
        />
      ))}
    </group>
  );
};

// Main atom scene
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
      
      {/* Electron shells */}
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
      
      {/* Detailed nucleus */}
      <DetailedNucleus protons={atomicNumber} neutrons={neutrons} />
      
      {/* Symbol label */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
      
      {/* Legend */}
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
