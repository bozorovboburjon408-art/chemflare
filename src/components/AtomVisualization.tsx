import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

interface AtomVisualizationProps {
  atomicNumber: number;
  symbol: string;
  electrons: string;
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

// Electron shell component
const ElectronShell = ({ 
  radius, 
  electrons, 
  shellIndex 
}: { 
  radius: number; 
  electrons: number; 
  shellIndex: number;
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  return (
    <>
      {/* Shell ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, shellIndex * 0.3]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color="#666" transparent opacity={0.3} />
      </mesh>
      
      {/* Electrons */}
      {Array.from({ length: electrons }).map((_, i) => {
        const angle = (i / electrons) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <Sphere 
            key={`electron-${shellIndex}-${i}`} 
            args={[0.15, 16, 16]} 
            position={[x, 0, z]}
          >
            <meshStandardMaterial 
              color="#60a5fa" 
              emissive="#3b82f6"
              emissiveIntensity={0.5}
            />
          </Sphere>
        );
      })}
    </>
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

export const AtomVisualization = (props: AtomVisualizationProps) => {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <AtomScene {...props} />
      </Canvas>
    </div>
  );
};
