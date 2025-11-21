import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

interface Atom {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface Bond {
  start: [number, number, number];
  end: [number, number, number];
}

interface MoleculeData {
  atoms: Atom[];
  bonds: Bond[];
}

// Molecule definitions
export const molecules: { [key: string]: MoleculeData } = {
  // Simple molecules
  H2O: {
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#ff0000", radius: 0.4 },
      { element: "H", position: [-0.76, 0.59, 0], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [0.76, 0.59, 0], color: "#ffffff", radius: 0.25 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [-0.76, 0.59, 0] },
      { start: [0, 0, 0], end: [0.76, 0.59, 0] },
    ],
  },
  
  H2: {
    atoms: [
      { element: "H", position: [-0.4, 0, 0], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [0.4, 0, 0], color: "#ffffff", radius: 0.25 },
    ],
    bonds: [{ start: [-0.4, 0, 0], end: [0.4, 0, 0] }],
  },
  
  O2: {
    atoms: [
      { element: "O", position: [-0.5, 0, 0], color: "#ff0000", radius: 0.4 },
      { element: "O", position: [0.5, 0, 0], color: "#ff0000", radius: 0.4 },
    ],
    bonds: [{ start: [-0.5, 0, 0], end: [0.5, 0, 0] }],
  },
  
  CO2: {
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#404040", radius: 0.35 },
      { element: "O", position: [-1, 0, 0], color: "#ff0000", radius: 0.4 },
      { element: "O", position: [1, 0, 0], color: "#ff0000", radius: 0.4 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [-1, 0, 0] },
      { start: [0, 0, 0], end: [1, 0, 0] },
    ],
  },
  
  HCl: {
    atoms: [
      { element: "H", position: [-0.6, 0, 0], color: "#ffffff", radius: 0.25 },
      { element: "Cl", position: [0.6, 0, 0], color: "#1eff00", radius: 0.45 },
    ],
    bonds: [{ start: [-0.6, 0, 0], end: [0.6, 0, 0] }],
  },
  
  NaCl: {
    atoms: [
      { element: "Na", position: [-0.7, 0, 0], color: "#ab5cf2", radius: 0.5 },
      { element: "Cl", position: [0.7, 0, 0], color: "#1eff00", radius: 0.45 },
    ],
    bonds: [{ start: [-0.7, 0, 0], end: [0.7, 0, 0] }],
  },
  
  CH4: {
    atoms: [
      { element: "C", position: [0, 0, 0], color: "#404040", radius: 0.35 },
      { element: "H", position: [0.63, 0.63, 0.63], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [-0.63, -0.63, 0.63], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [-0.63, 0.63, -0.63], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [0.63, -0.63, -0.63], color: "#ffffff", radius: 0.25 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.63, 0.63, 0.63] },
      { start: [0, 0, 0], end: [-0.63, -0.63, 0.63] },
      { start: [0, 0, 0], end: [-0.63, 0.63, -0.63] },
      { start: [0, 0, 0], end: [0.63, -0.63, -0.63] },
    ],
  },
  
  NH3: {
    atoms: [
      { element: "N", position: [0, 0, 0], color: "#3050f8", radius: 0.38 },
      { element: "H", position: [0, 0.8, 0.4], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [-0.7, -0.4, 0.4], color: "#ffffff", radius: 0.25 },
      { element: "H", position: [0.7, -0.4, 0.4], color: "#ffffff", radius: 0.25 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0, 0.8, 0.4] },
      { start: [0, 0, 0], end: [-0.7, -0.4, 0.4] },
      { start: [0, 0, 0], end: [0.7, -0.4, 0.4] },
    ],
  },
  
  // Ions and simple compounds
  NaOH: {
    atoms: [
      { element: "Na", position: [-1.2, 0, 0], color: "#ab5cf2", radius: 0.5 },
      { element: "O", position: [0, 0, 0], color: "#ff0000", radius: 0.4 },
      { element: "H", position: [0.76, 0.59, 0], color: "#ffffff", radius: 0.25 },
    ],
    bonds: [
      { start: [-1.2, 0, 0], end: [0, 0, 0] },
      { start: [0, 0, 0], end: [0.76, 0.59, 0] },
    ],
  },
  
  // Generic molecule for complex compounds
  COMPLEX: {
    atoms: [
      { element: "X", position: [0, 0, 0], color: "#808080", radius: 0.4 },
      { element: "X", position: [0.8, 0, 0], color: "#606060", radius: 0.35 },
      { element: "X", position: [-0.8, 0, 0], color: "#606060", radius: 0.35 },
      { element: "X", position: [0, 0.8, 0], color: "#606060", radius: 0.35 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0.8, 0, 0] },
      { start: [0, 0, 0], end: [-0.8, 0, 0] },
      { start: [0, 0, 0], end: [0, 0.8, 0] },
    ],
  },
};

const Bond = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
  const position = useMemo(() => {
    return [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2,
    ] as [number, number, number];
  }, [start, end]);

  const length = useMemo(() => {
    return Math.sqrt(
      Math.pow(end[0] - start[0], 2) +
      Math.pow(end[1] - start[1], 2) +
      Math.pow(end[2] - start[2], 2)
    );
  }, [start, end]);

  const rotation = useMemo(() => {
    const direction = new THREE.Vector3(
      end[0] - start[0],
      end[1] - start[1],
      end[2] - start[2]
    ).normalize();
    
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [start, end]);

  return (
    <Cylinder
      args={[0.08, 0.08, length, 8]}
      position={position}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <meshStandardMaterial color="#d0d0d0" />
    </Cylinder>
  );
};

const RotatingMolecule = ({ moleculeData }: { moleculeData: MoleculeData }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {moleculeData.atoms.map((atom, idx) => (
        <Sphere key={`atom-${idx}`} args={[atom.radius, 32, 32]} position={atom.position}>
          <meshStandardMaterial color={atom.color} />
        </Sphere>
      ))}
      
      {/* Render bonds */}
      {moleculeData.bonds.map((bond, idx) => (
        <Bond key={`bond-${idx}`} start={bond.start} end={bond.end} />
      ))}
    </group>
  );
};

interface MoleculeViewerProps {
  formula: string;
  label?: string;
}

const MoleculeViewer = ({ formula, label }: MoleculeViewerProps) => {
  // Clean formula and get molecule data
  const cleanFormula = formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
    const subscripts = "₀₁₂₃₄₅₆₇₈₉";
    return subscripts.indexOf(match).toString();
  }).replace(/\(|\)/g, "");

  const moleculeData = molecules[cleanFormula] || molecules.COMPLEX;

  return (
    <div className="relative w-full h-64 bg-background rounded-lg border border-border overflow-hidden">
      {label && (
        <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground font-mono">{formula}</p>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <RotatingMolecule moleculeData={moleculeData} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
};

export default MoleculeViewer;