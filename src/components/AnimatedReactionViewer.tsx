import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Cylinder, Text } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "./ui/button";
import { Play, RotateCcw, Pause } from "lucide-react";

interface MoleculeAtom {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface MoleculeBond {
  from: number;
  to: number;
  order: number;
}

interface MoleculeData {
  formula: string;
  name: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

interface AnimationStep {
  phase: string;
  description: string;
}

interface MolecularAnimationData {
  reactants: MoleculeData[];
  products: MoleculeData[];
  animationSteps: AnimationStep[];
}

interface AnimatedReactionViewerProps {
  animationData?: MolecularAnimationData;
  reactants?: string[];
  products?: string[];
}

// Default molecules for fallback
const defaultMolecules: Record<string, MoleculeData> = {
  H2O: {
    formula: "H₂O",
    name: "Suv",
    atoms: [
      { element: "O", position: [0, 0, 0], color: "#FF0D0D", radius: 0.35 },
      { element: "H", position: [-0.8, 0.6, 0], color: "#FFFFFF", radius: 0.25 },
      { element: "H", position: [0.8, 0.6, 0], color: "#FFFFFF", radius: 0.25 },
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
    ],
  },
  NaCl: {
    formula: "NaCl",
    name: "Osh tuzi",
    atoms: [
      { element: "Na", position: [-0.5, 0, 0], color: "#AB5CF2", radius: 0.6 },
      { element: "Cl", position: [0.8, 0, 0], color: "#1FF01F", radius: 0.45 },
    ],
    bonds: [{ from: 0, to: 1, order: 1 }],
  },
};

const AnimatedAtom = ({
  atom,
  progress,
  startOffset,
  endOffset,
  phase,
}: {
  atom: MoleculeAtom;
  progress: number;
  startOffset: [number, number, number];
  endOffset: [number, number, number];
  phase: "reactant" | "product";
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    const t = Math.min(1, Math.max(0, progress));
    
    if (phase === "reactant") {
      // Reactants move from start position toward center, then fade
      const moveProgress = Math.min(1, t * 2);
      const fadeProgress = Math.max(0, (t - 0.4) * 2.5);
      
      return [
        atom.position[0] + startOffset[0] * (1 - moveProgress * 0.5),
        atom.position[1] + startOffset[1] + Math.sin(t * Math.PI) * 0.3,
        atom.position[2] + startOffset[2] * (1 - moveProgress * 0.5),
      ] as [number, number, number];
    } else {
      // Products appear from center and move outward
      const appearProgress = Math.max(0, (t - 0.5) * 2);
      
      return [
        atom.position[0] + endOffset[0] * appearProgress * 0.5,
        atom.position[1] + endOffset[1] + Math.sin((t - 0.5) * Math.PI) * 0.2,
        atom.position[2] + endOffset[2] * appearProgress * 0.5,
      ] as [number, number, number];
    }
  }, [atom, progress, startOffset, endOffset, phase]);

  const opacity = useMemo(() => {
    if (phase === "reactant") {
      return Math.max(0, 1 - (progress - 0.3) * 2);
    } else {
      return Math.min(1, Math.max(0, (progress - 0.4) * 2.5));
    }
  }, [progress, phase]);

  const scale = useMemo(() => {
    if (phase === "reactant") {
      return 1 - Math.max(0, (progress - 0.5) * 1.5);
    } else {
      return Math.min(1, Math.max(0, (progress - 0.4) * 2));
    }
  }, [progress, phase]);

  if (opacity <= 0 || scale <= 0) return null;

  return (
    <Sphere
      ref={meshRef}
      args={[atom.radius * scale, 32, 32]}
      position={position}
    >
      <meshStandardMaterial
        color={atom.color}
        transparent
        opacity={opacity}
        metalness={0.3}
        roughness={0.4}
      />
    </Sphere>
  );
};

const AnimatedBond = ({
  fromAtom,
  toAtom,
  order,
  progress,
  startOffset,
  endOffset,
  phase,
}: {
  fromAtom: MoleculeAtom;
  toAtom: MoleculeAtom;
  order: number;
  progress: number;
  startOffset: [number, number, number];
  endOffset: [number, number, number];
  phase: "reactant" | "product";
}) => {
  const opacity = useMemo(() => {
    if (phase === "reactant") {
      return Math.max(0, 1 - (progress - 0.2) * 2.5);
    } else {
      return Math.min(1, Math.max(0, (progress - 0.5) * 2.5));
    }
  }, [progress, phase]);

  const offset = phase === "reactant" ? startOffset : endOffset;
  const moveProgress = phase === "reactant" 
    ? Math.min(1, progress * 2) * 0.5
    : Math.max(0, (progress - 0.5) * 2) * 0.5;

  const start = useMemo(() => [
    fromAtom.position[0] + offset[0] * (phase === "reactant" ? (1 - moveProgress) : moveProgress),
    fromAtom.position[1] + offset[1],
    fromAtom.position[2] + offset[2] * (phase === "reactant" ? (1 - moveProgress) : moveProgress),
  ] as [number, number, number], [fromAtom, offset, moveProgress, phase]);

  const end = useMemo(() => [
    toAtom.position[0] + offset[0] * (phase === "reactant" ? (1 - moveProgress) : moveProgress),
    toAtom.position[1] + offset[1],
    toAtom.position[2] + offset[2] * (phase === "reactant" ? (1 - moveProgress) : moveProgress),
  ] as [number, number, number], [toAtom, offset, moveProgress, phase]);

  const position = useMemo(() => [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ] as [number, number, number], [start, end]);

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

  if (opacity <= 0 || length < 0.1) return null;

  return (
    <group>
      {Array.from({ length: order }).map((_, i) => (
        <Cylinder
          key={i}
          args={[0.06, 0.06, length, 8]}
          position={[
            position[0] + (order > 1 ? (i - (order - 1) / 2) * 0.12 : 0),
            position[1],
            position[2],
          ]}
          rotation={[rotation.x, rotation.y, rotation.z]}
        >
          <meshStandardMaterial
            color="#b0b0b0"
            transparent
            opacity={opacity * 0.8}
            metalness={0.2}
            roughness={0.6}
          />
        </Cylinder>
      ))}
    </group>
  );
};

const MoleculeGroup = ({
  molecule,
  progress,
  offset,
  phase,
}: {
  molecule: MoleculeData;
  progress: number;
  offset: [number, number, number];
  phase: "reactant" | "product";
}) => {
  return (
    <group>
      {molecule.atoms.map((atom, idx) => (
        <AnimatedAtom
          key={`atom-${idx}`}
          atom={atom}
          progress={progress}
          startOffset={offset}
          endOffset={offset}
          phase={phase}
        />
      ))}
      {molecule.bonds.map((bond, idx) => (
        <AnimatedBond
          key={`bond-${idx}`}
          fromAtom={molecule.atoms[bond.from]}
          toAtom={molecule.atoms[bond.to]}
          order={bond.order}
          progress={progress}
          startOffset={offset}
          endOffset={offset}
          phase={phase}
        />
      ))}
    </group>
  );
};

const ReactionScene = ({
  reactants,
  products,
  progress,
  isRotating,
}: {
  reactants: MoleculeData[];
  products: MoleculeData[];
  progress: number;
  isRotating: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // Calculate offsets for each molecule
  const reactantOffsets = useMemo(() => {
    return reactants.map((_, idx) => {
      const angle = (idx / reactants.length) * Math.PI * 2;
      return [
        Math.cos(angle) * 3 - 2,
        0,
        Math.sin(angle) * 1.5,
      ] as [number, number, number];
    });
  }, [reactants]);

  const productOffsets = useMemo(() => {
    return products.map((_, idx) => {
      const angle = (idx / products.length) * Math.PI * 2 + Math.PI;
      return [
        Math.cos(angle) * 3 + 2,
        0,
        Math.sin(angle) * 1.5,
      ] as [number, number, number];
    });
  }, [products]);

  return (
    <group ref={groupRef}>
      {/* Reactants */}
      {reactants.map((molecule, idx) => (
        <MoleculeGroup
          key={`reactant-${idx}`}
          molecule={molecule}
          progress={progress}
          offset={reactantOffsets[idx]}
          phase="reactant"
        />
      ))}
      
      {/* Products */}
      {products.map((molecule, idx) => (
        <MoleculeGroup
          key={`product-${idx}`}
          molecule={molecule}
          progress={progress}
          offset={productOffsets[idx]}
          phase="product"
        />
      ))}

      {/* Reaction center glow */}
      {progress > 0.3 && progress < 0.7 && (
        <Sphere args={[0.5 + Math.sin(progress * Math.PI * 2) * 0.3, 16, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#ffd700"
            transparent
            opacity={(1 - Math.abs(progress - 0.5) * 4) * 0.4}
            emissive="#ffd700"
            emissiveIntensity={0.5}
          />
        </Sphere>
      )}
    </group>
  );
};

const AnimatedReactionViewer = ({ animationData, reactants: legacyReactants, products: legacyProducts }: AnimatedReactionViewerProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [currentPhase, setCurrentPhase] = useState(0);

  // Use animation data if provided, otherwise use legacy props with defaults
  const { reactants, products, steps } = useMemo(() => {
    if (animationData) {
      return {
        reactants: animationData.reactants,
        products: animationData.products,
        steps: animationData.animationSteps,
      };
    }

    // Fallback to legacy behavior
    const defaultReactants = (legacyReactants || ["H2O"]).map(
      (r) => defaultMolecules[r.toUpperCase().replace(/[₂₃₄]/g, (m) => ({ "₂": "2", "₃": "3", "₄": "4" }[m] || m))] || defaultMolecules.H2O
    );
    const defaultProducts = (legacyProducts || ["NaCl"]).map(
      (p) => defaultMolecules[p.toUpperCase().replace(/[₂₃₄]/g, (m) => ({ "₂": "2", "₃": "3", "₄": "4" }[m] || m))] || defaultMolecules.NaCl
    );

    return {
      reactants: defaultReactants,
      products: defaultProducts,
      steps: [
        { phase: "approaching", description: "Moddalar yaqinlashmoqda" },
        { phase: "collision", description: "To'qnashuv" },
        { phase: "bondBreaking", description: "Bog'lar uzilmoqda" },
        { phase: "bondForming", description: "Yangi bog'lar hosil bo'lmoqda" },
        { phase: "separating", description: "Mahsulotlar ajralmoqda" },
      ],
    };
  }, [animationData, legacyReactants, legacyProducts]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);
      setCurrentPhase(Math.min(steps.length - 1, Math.floor(progress * steps.length)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    animate();
  }, [isPlaying, steps.length]);

  const handlePlay = () => {
    setAnimationProgress(0);
    setCurrentPhase(0);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setAnimationProgress(0);
    setCurrentPhase(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {!isPlaying ? (
          <Button onClick={handlePlay} size="sm" variant="default">
            <Play className="w-4 h-4 mr-2" />
            Animatsiyani boshlash
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="default">
            <Pause className="w-4 h-4 mr-2" />
            To'xtatish
          </Button>
        )}
        <Button onClick={handleReset} disabled={isPlaying} size="sm" variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Qaytadan
        </Button>
        <Button onClick={() => setIsRotating(!isRotating)} size="sm" variant="outline">
          {isRotating ? "Aylanishni to'xtatish" : "Aylantirish"}
        </Button>
      </div>

      <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Progress indicator */}
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/80 font-medium">
                {steps[currentPhase]?.description || "Tayyor"}
              </p>
              <p className="text-xs text-white/60">
                {Math.round(animationProgress * 100)}%
              </p>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-100"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Molecule labels */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between">
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <p className="text-xs text-cyan-400 font-medium">Reagentlar</p>
            <p className="text-[10px] text-white/60">
              {reactants.map((r) => r.formula).join(" + ")}
            </p>
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <p className="text-xs text-purple-400 font-medium">Mahsulotlar</p>
            <p className="text-[10px] text-white/60">
              {products.map((p) => p.formula).join(" + ")}
            </p>
          </div>
        </div>

        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} color="#fbbf24" />
          
          <ReactionScene
            reactants={reactants}
            products={products}
            progress={animationProgress}
            isRotating={isRotating}
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default AnimatedReactionViewer;