import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { molecules } from "./MoleculeViewer";
import { Button } from "./ui/button";
import { Play, RotateCcw } from "lucide-react";

interface AnimatedReactionViewerProps {
  reactants: string[];
  products: string[];
}

interface AtomAnimationData {
  element: string;
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  color: string;
  radius: number;
}

interface BondAnimationData {
  start: [number, number, number];
  end: [number, number, number];
  phase: "breaking" | "forming";
  delay: number;
}

const AnimatedAtom = ({ 
  data, 
  progress 
}: { 
  data: AtomAnimationData; 
  progress: number;
}) => {
  const position = useMemo(() => {
    const t = progress;
    return [
      data.startPosition[0] + (data.endPosition[0] - data.startPosition[0]) * t,
      data.startPosition[1] + (data.endPosition[1] - data.startPosition[1]) * t,
      data.startPosition[2] + (data.endPosition[2] - data.startPosition[2]) * t,
    ] as [number, number, number];
  }, [data, progress]);

  return (
    <Sphere args={[data.radius, 32, 32]} position={position}>
      <meshStandardMaterial color={data.color} />
    </Sphere>
  );
};

const AnimatedBond = ({ 
  data, 
  progress 
}: { 
  data: BondAnimationData;
  progress: number;
}) => {
  const adjustedProgress = Math.max(0, Math.min(1, (progress - data.delay) / (1 - data.delay)));
  
  const opacity = useMemo(() => {
    if (data.phase === "breaking") {
      return 1 - adjustedProgress;
    } else {
      return adjustedProgress;
    }
  }, [data.phase, adjustedProgress]);

  const position = useMemo(() => {
    return [
      (data.start[0] + data.end[0]) / 2,
      (data.start[1] + data.end[1]) / 2,
      (data.start[2] + data.end[2]) / 2,
    ] as [number, number, number];
  }, [data.start, data.end]);

  const length = useMemo(() => {
    return Math.sqrt(
      Math.pow(data.end[0] - data.start[0], 2) +
      Math.pow(data.end[1] - data.start[1], 2) +
      Math.pow(data.end[2] - data.start[2], 2)
    );
  }, [data.start, data.end]);

  const rotation = useMemo(() => {
    const direction = new THREE.Vector3(
      data.end[0] - data.start[0],
      data.end[1] - data.start[1],
      data.end[2] - data.start[2]
    ).normalize();
    
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [data.start, data.end]);

  if (opacity <= 0) return null;

  return (
    <Cylinder
      args={[0.08, 0.08, length, 8]}
      position={position}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <meshStandardMaterial 
        color="#d0d0d0" 
        transparent 
        opacity={opacity}
      />
    </Cylinder>
  );
};

const AnimatedMoleculeScene = ({ 
  atoms, 
  bonds, 
  progress,
  isRotating 
}: { 
  atoms: AtomAnimationData[];
  bonds: BondAnimationData[];
  progress: number;
  isRotating: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {atoms.map((atom, idx) => (
        <AnimatedAtom key={`atom-${idx}`} data={atom} progress={progress} />
      ))}
      {bonds.map((bond, idx) => (
        <AnimatedBond key={`bond-${idx}`} data={bond} progress={progress} />
      ))}
    </group>
  );
};

const AnimatedReactionViewer = ({ reactants, products }: AnimatedReactionViewerProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Prepare animation data
  const { atoms, bonds } = useMemo(() => {
    const reactantMolecules = reactants.map(r => molecules[r] || molecules.COMPLEX);
    const productMolecules = products.map(p => molecules[p] || molecules.COMPLEX);

    // Get all atoms from reactants
    const allReactantAtoms = reactantMolecules.flatMap((mol, molIdx) => 
      mol.atoms.map((atom, atomIdx) => ({
        ...atom,
        position: [
          atom.position[0] - molIdx * 1.5,
          atom.position[1],
          atom.position[2]
        ] as [number, number, number]
      }))
    );

    // Get all atoms from products
    const allProductAtoms = productMolecules.flatMap((mol, molIdx) => 
      mol.atoms.map((atom, atomIdx) => ({
        ...atom,
        position: [
          atom.position[0] + molIdx * 1.5,
          atom.position[1],
          atom.position[2]
        ] as [number, number, number]
      }))
    );

    // Create atom animation data (match atoms by element or create new ones)
    const atomAnimations: AtomAnimationData[] = [];
    const maxAtoms = Math.max(allReactantAtoms.length, allProductAtoms.length);

    for (let i = 0; i < maxAtoms; i++) {
      const reactantAtom = allReactantAtoms[i] || allReactantAtoms[0];
      const productAtom = allProductAtoms[i] || allProductAtoms[0];

      atomAnimations.push({
        element: reactantAtom?.element || "X",
        startPosition: reactantAtom?.position || [0, 0, 0],
        endPosition: productAtom?.position || [0, 0, 0],
        color: reactantAtom?.color || "#808080",
        radius: reactantAtom?.radius || 0.3,
      });
    }

    // Create bond animations
    const breakingBonds: BondAnimationData[] = reactantMolecules.flatMap((mol, molIdx) =>
      mol.bonds.map(bond => ({
        start: [
          bond.start[0] - molIdx * 1.5,
          bond.start[1],
          bond.start[2]
        ] as [number, number, number],
        end: [
          bond.end[0] - molIdx * 1.5,
          bond.end[1],
          bond.end[2]
        ] as [number, number, number],
        phase: "breaking" as const,
        delay: 0,
      }))
    );

    const formingBonds: BondAnimationData[] = productMolecules.flatMap((mol, molIdx) =>
      mol.bonds.map(bond => ({
        start: [
          bond.start[0] + molIdx * 1.5,
          bond.start[1],
          bond.start[2]
        ] as [number, number, number],
        end: [
          bond.end[0] + molIdx * 1.5,
          bond.end[1],
          bond.end[2]
        ] as [number, number, number],
        phase: "forming" as const,
        delay: 0.5,
      }))
    );

    return {
      atoms: atomAnimations,
      bonds: [...breakingBonds, ...formingBonds],
    };
  }, [reactants, products]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animate();
  }, [isPlaying]);

  const handlePlay = () => {
    setAnimationProgress(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setAnimationProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        <Button
          onClick={handlePlay}
          disabled={isPlaying}
          size="sm"
          variant="default"
        >
          <Play className="w-4 h-4 mr-2" />
          Animatsiyani boshlash
        </Button>
        <Button
          onClick={handleReset}
          disabled={isPlaying}
          size="sm"
          variant="outline"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Qaytadan
        </Button>
        <Button
          onClick={() => setIsRotating(!isRotating)}
          size="sm"
          variant="outline"
        >
          {isRotating ? "Aylanishni to'xtatish" : "Aylanishni boshlash"}
        </Button>
      </div>

      <div className="relative w-full h-96 bg-background rounded-lg border border-border overflow-hidden">
        <div className="absolute top-2 left-2 z-10 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md">
          <p className="text-xs text-muted-foreground">
            Reaksiya jarayoni: {Math.round(animationProgress * 100)}%
          </p>
          <div className="w-40 h-1 bg-muted rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${animationProgress * 100}%` }}
            />
          </div>
        </div>

        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <AnimatedMoleculeScene 
            atoms={atoms} 
            bonds={bonds} 
            progress={animationProgress}
            isRotating={isRotating}
          />
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={12}
          />
        </Canvas>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {animationProgress === 0 && "Animatsiyani boshlash uchun tugmani bosing"}
          {animationProgress > 0 && animationProgress < 0.5 && "Kimyoviy bog'lar uzilyapti..."}
          {animationProgress >= 0.5 && animationProgress < 1 && "Yangi bog'lar hosil bo'lyapti..."}
          {animationProgress === 1 && "Reaksiya tugadi!"}
        </p>
      </div>
    </div>
  );
};

export default AnimatedReactionViewer;
