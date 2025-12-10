import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Cylinder, Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "./ui/button";
import { Play, RotateCcw, Pause, Zap } from "lucide-react";

interface AtomData {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface BondData {
  from: number;
  to: number;
}

interface MoleculeConfig {
  atoms: AtomData[];
  bonds: BondData[];
}

// Element colors based on CPK coloring
const elementColors: Record<string, string> = {
  H: "#FFFFFF",
  O: "#FF0D0D",
  N: "#3050F8",
  C: "#909090",
  S: "#FFFF30",
  P: "#FF8000",
  Cl: "#1FF01F",
  Na: "#AB5CF2",
  K: "#8F40D4",
  Ca: "#3DFF00",
  Mg: "#8AFF00",
  Fe: "#E06633",
  Cu: "#C88033",
  Zn: "#7D80B0",
  Al: "#BFA6A6",
  Ag: "#C0C0C0",
  Au: "#FFD123",
  Br: "#A62929",
  I: "#940094",
  F: "#90E050",
  Li: "#CC80FF",
  Ba: "#00C900",
  Mn: "#9C7AC7",
  Cr: "#8A99C7",
  Ni: "#50D050",
  Co: "#F090A0",
  Pb: "#575961",
  Sn: "#668080",
  default: "#808080",
};

// Get molecule configuration from formula
const getMoleculeConfig = (formula: string): MoleculeConfig => {
  const normalized = formula.replace(/[₂₃₄₅₆₇₈₉]/g, (m) => {
    const map: Record<string, string> = { "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
    return map[m] || m;
  }).replace(/↑|↓|\(.*?\)/g, "").trim();

  const configs: Record<string, MoleculeConfig> = {
    // Water
    H2O: {
      atoms: [
        { element: "O", position: [0, 0, 0], color: elementColors.O, radius: 0.4 },
        { element: "H", position: [-0.7, 0.5, 0], color: elementColors.H, radius: 0.25 },
        { element: "H", position: [0.7, 0.5, 0], color: elementColors.H, radius: 0.25 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Hydrogen
    H2: {
      atoms: [
        { element: "H", position: [-0.3, 0, 0], color: elementColors.H, radius: 0.25 },
        { element: "H", position: [0.3, 0, 0], color: elementColors.H, radius: 0.25 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    // Hydrochloric acid
    HCl: {
      atoms: [
        { element: "H", position: [-0.5, 0, 0], color: elementColors.H, radius: 0.25 },
        { element: "Cl", position: [0.5, 0, 0], color: elementColors.Cl, radius: 0.45 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    // Sodium chloride
    NaCl: {
      atoms: [
        { element: "Na", position: [-0.6, 0, 0], color: elementColors.Na, radius: 0.5 },
        { element: "Cl", position: [0.6, 0, 0], color: elementColors.Cl, radius: 0.45 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    // Zinc chloride
    ZnCl2: {
      atoms: [
        { element: "Zn", position: [0, 0, 0], color: elementColors.Zn, radius: 0.45 },
        { element: "Cl", position: [-0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
        { element: "Cl", position: [0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Sulfuric acid
    H2SO4: {
      atoms: [
        { element: "S", position: [0, 0, 0], color: elementColors.S, radius: 0.4 },
        { element: "O", position: [-0.5, 0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0.5, 0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [-0.5, -0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0.5, -0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "H", position: [-1, -0.5, 0], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [1, -0.5, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 6 }],
    },
    // Nitric acid
    HNO3: {
      atoms: [
        { element: "N", position: [0, 0, 0], color: elementColors.N, radius: 0.35 },
        { element: "O", position: [-0.5, 0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0.5, 0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0, -0.5, 0], color: elementColors.O, radius: 0.35 },
        { element: "H", position: [-0.5, -0.7, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 3, to: 4 }],
    },
    // Copper sulfate
    CuSO4: {
      atoms: [
        { element: "Cu", position: [-0.8, 0, 0], color: elementColors.Cu, radius: 0.4 },
        { element: "S", position: [0.3, 0, 0], color: elementColors.S, radius: 0.35 },
        { element: "O", position: [0.8, 0.5, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.8, -0.5, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.3, 0.6, 0.5], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.3, -0.6, -0.5], color: elementColors.O, radius: 0.3 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 }],
    },
    // Carbon dioxide
    CO2: {
      atoms: [
        { element: "C", position: [0, 0, 0], color: elementColors.C, radius: 0.35 },
        { element: "O", position: [-0.7, 0, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0.7, 0, 0], color: elementColors.O, radius: 0.35 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Sodium hydroxide
    NaOH: {
      atoms: [
        { element: "Na", position: [-0.7, 0, 0], color: elementColors.Na, radius: 0.5 },
        { element: "O", position: [0.2, 0, 0], color: elementColors.O, radius: 0.35 },
        { element: "H", position: [0.7, 0.3, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }],
    },
    // Calcium hydroxide
    "Ca(OH)2": {
      atoms: [
        { element: "Ca", position: [0, 0, 0], color: elementColors.Ca, radius: 0.5 },
        { element: "O", position: [-0.6, 0.4, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.6, 0.4, 0], color: elementColors.O, radius: 0.3 },
        { element: "H", position: [-0.9, 0.7, 0], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [0.9, 0.7, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }],
    },
    // Iron chloride
    FeCl2: {
      atoms: [
        { element: "Fe", position: [0, 0, 0], color: elementColors.Fe, radius: 0.45 },
        { element: "Cl", position: [-0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
        { element: "Cl", position: [0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    FeCl3: {
      atoms: [
        { element: "Fe", position: [0, 0, 0], color: elementColors.Fe, radius: 0.45 },
        { element: "Cl", position: [-0.7, 0.4, 0], color: elementColors.Cl, radius: 0.35 },
        { element: "Cl", position: [0.7, 0.4, 0], color: elementColors.Cl, radius: 0.35 },
        { element: "Cl", position: [0, -0.6, 0], color: elementColors.Cl, radius: 0.35 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
    },
    // Magnesium chloride
    MgCl2: {
      atoms: [
        { element: "Mg", position: [0, 0, 0], color: elementColors.Mg, radius: 0.45 },
        { element: "Cl", position: [-0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
        { element: "Cl", position: [0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Aluminum chloride
    AlCl3: {
      atoms: [
        { element: "Al", position: [0, 0, 0], color: elementColors.Al, radius: 0.4 },
        { element: "Cl", position: [-0.7, 0.4, 0], color: elementColors.Cl, radius: 0.35 },
        { element: "Cl", position: [0.7, 0.4, 0], color: elementColors.Cl, radius: 0.35 },
        { element: "Cl", position: [0, -0.6, 0], color: elementColors.Cl, radius: 0.35 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
    },
    // Copper nitrate
    "Cu(NO3)2": {
      atoms: [
        { element: "Cu", position: [0, 0, 0], color: elementColors.Cu, radius: 0.45 },
        { element: "N", position: [-0.7, 0.3, 0], color: elementColors.N, radius: 0.3 },
        { element: "N", position: [0.7, 0.3, 0], color: elementColors.N, radius: 0.3 },
        { element: "O", position: [-1, 0.6, 0], color: elementColors.O, radius: 0.25 },
        { element: "O", position: [1, 0.6, 0], color: elementColors.O, radius: 0.25 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }],
    },
    // NO gas
    NO: {
      atoms: [
        { element: "N", position: [-0.3, 0, 0], color: elementColors.N, radius: 0.35 },
        { element: "O", position: [0.3, 0, 0], color: elementColors.O, radius: 0.35 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    NO2: {
      atoms: [
        { element: "N", position: [0, 0, 0], color: elementColors.N, radius: 0.35 },
        { element: "O", position: [-0.5, 0.3, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.5, 0.3, 0], color: elementColors.O, radius: 0.3 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // SO2 gas
    SO2: {
      atoms: [
        { element: "S", position: [0, 0, 0], color: elementColors.S, radius: 0.38 },
        { element: "O", position: [-0.6, 0.3, 0], color: elementColors.O, radius: 0.32 },
        { element: "O", position: [0.6, 0.3, 0], color: elementColors.O, radius: 0.32 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Silver nitrate
    AgNO3: {
      atoms: [
        { element: "Ag", position: [-0.5, 0, 0], color: elementColors.Ag, radius: 0.45 },
        { element: "N", position: [0.3, 0, 0], color: elementColors.N, radius: 0.3 },
        { element: "O", position: [0.7, 0.4, 0], color: elementColors.O, radius: 0.25 },
        { element: "O", position: [0.7, -0.4, 0], color: elementColors.O, radius: 0.25 },
        { element: "O", position: [0.3, 0.5, 0.4], color: elementColors.O, radius: 0.25 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }],
    },
    // Calcium carbonate
    CaCO3: {
      atoms: [
        { element: "Ca", position: [-0.7, 0, 0], color: elementColors.Ca, radius: 0.5 },
        { element: "C", position: [0.3, 0, 0], color: elementColors.C, radius: 0.3 },
        { element: "O", position: [0.8, 0.4, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.8, -0.4, 0], color: elementColors.O, radius: 0.3 },
        { element: "O", position: [0.3, 0, 0.5], color: elementColors.O, radius: 0.3 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }],
    },
    CaCl2: {
      atoms: [
        { element: "Ca", position: [0, 0, 0], color: elementColors.Ca, radius: 0.5 },
        { element: "Cl", position: [-0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
        { element: "Cl", position: [0.8, 0, 0], color: elementColors.Cl, radius: 0.4 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
    },
    // Potassium
    KCl: {
      atoms: [
        { element: "K", position: [-0.6, 0, 0], color: elementColors.K, radius: 0.55 },
        { element: "Cl", position: [0.6, 0, 0], color: elementColors.Cl, radius: 0.45 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    KOH: {
      atoms: [
        { element: "K", position: [-0.7, 0, 0], color: elementColors.K, radius: 0.55 },
        { element: "O", position: [0.2, 0, 0], color: elementColors.O, radius: 0.35 },
        { element: "H", position: [0.7, 0.3, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }],
    },
    // Metals
    Zn: {
      atoms: [{ element: "Zn", position: [0, 0, 0], color: elementColors.Zn, radius: 0.5 }],
      bonds: [],
    },
    Fe: {
      atoms: [{ element: "Fe", position: [0, 0, 0], color: elementColors.Fe, radius: 0.5 }],
      bonds: [],
    },
    Cu: {
      atoms: [{ element: "Cu", position: [0, 0, 0], color: elementColors.Cu, radius: 0.5 }],
      bonds: [],
    },
    Mg: {
      atoms: [{ element: "Mg", position: [0, 0, 0], color: elementColors.Mg, radius: 0.5 }],
      bonds: [],
    },
    Al: {
      atoms: [{ element: "Al", position: [0, 0, 0], color: elementColors.Al, radius: 0.5 }],
      bonds: [],
    },
    Ca: {
      atoms: [{ element: "Ca", position: [0, 0, 0], color: elementColors.Ca, radius: 0.55 }],
      bonds: [],
    },
    Na: {
      atoms: [{ element: "Na", position: [0, 0, 0], color: elementColors.Na, radius: 0.55 }],
      bonds: [],
    },
    Ag: {
      atoms: [{ element: "Ag", position: [0, 0, 0], color: elementColors.Ag, radius: 0.5 }],
      bonds: [],
    },
    // Oxygen
    O2: {
      atoms: [
        { element: "O", position: [-0.3, 0, 0], color: elementColors.O, radius: 0.35 },
        { element: "O", position: [0.3, 0, 0], color: elementColors.O, radius: 0.35 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    // Chlorine
    Cl2: {
      atoms: [
        { element: "Cl", position: [-0.4, 0, 0], color: elementColors.Cl, radius: 0.4 },
        { element: "Cl", position: [0.4, 0, 0], color: elementColors.Cl, radius: 0.4 },
      ],
      bonds: [{ from: 0, to: 1 }],
    },
    // Methane
    CH4: {
      atoms: [
        { element: "C", position: [0, 0, 0], color: elementColors.C, radius: 0.35 },
        { element: "H", position: [0.5, 0.5, 0.3], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [-0.5, 0.5, -0.3], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [0.5, -0.5, -0.3], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [-0.5, -0.5, 0.3], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }],
    },
    // Ammonia
    NH3: {
      atoms: [
        { element: "N", position: [0, 0, 0], color: elementColors.N, radius: 0.35 },
        { element: "H", position: [-0.5, 0.4, 0], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [0.5, 0.4, 0], color: elementColors.H, radius: 0.2 },
        { element: "H", position: [0, -0.5, 0], color: elementColors.H, radius: 0.2 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
    },
    // Zinc sulfate
    ZnSO4: {
      atoms: [
        { element: "Zn", position: [-0.8, 0, 0], color: elementColors.Zn, radius: 0.45 },
        { element: "S", position: [0.3, 0, 0], color: elementColors.S, radius: 0.35 },
        { element: "O", position: [0.7, 0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.7, -0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, 0.5], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, -0.5], color: elementColors.O, radius: 0.28 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 }],
    },
    MgSO4: {
      atoms: [
        { element: "Mg", position: [-0.8, 0, 0], color: elementColors.Mg, radius: 0.45 },
        { element: "S", position: [0.3, 0, 0], color: elementColors.S, radius: 0.35 },
        { element: "O", position: [0.7, 0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.7, -0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, 0.5], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, -0.5], color: elementColors.O, radius: 0.28 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 }],
    },
    FeSO4: {
      atoms: [
        { element: "Fe", position: [-0.8, 0, 0], color: elementColors.Fe, radius: 0.45 },
        { element: "S", position: [0.3, 0, 0], color: elementColors.S, radius: 0.35 },
        { element: "O", position: [0.7, 0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.7, -0.4, 0], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, 0.5], color: elementColors.O, radius: 0.28 },
        { element: "O", position: [0.3, 0, -0.5], color: elementColors.O, radius: 0.28 },
      ],
      bonds: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }, { from: 1, to: 5 }],
    },
  };

  // Try to find exact match first
  if (configs[normalized]) return configs[normalized];

  // Try uppercase
  const upper = normalized.toUpperCase();
  for (const key of Object.keys(configs)) {
    if (key.toUpperCase() === upper) return configs[key];
  }

  // Generate a generic molecule
  const color = elementColors[normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()] || elementColors.default;
  return {
    atoms: [{ element: normalized, position: [0, 0, 0], color, radius: 0.5 }],
    bonds: [],
  };
};

// Animated atom component with glow effect
const GlowingAtom = ({
  atom,
  position,
  opacity,
  scale,
  phase,
}: {
  atom: AtomData;
  position: [number, number, number];
  opacity: number;
  scale: number;
  phase: "reactant" | "transition" | "product";
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
      meshRef.current.scale.setScalar((atom.radius * scale) + pulse);
    }
    if (glowRef.current && phase === "transition") {
      glowRef.current.scale.setScalar((atom.radius * scale * 1.5) + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    }
  });

  if (opacity <= 0.01 || scale <= 0.01) return null;

  return (
    <group position={position}>
      {/* Glow effect during transition */}
      {phase === "transition" && (
        <Sphere ref={glowRef} args={[atom.radius * scale * 1.3, 16, 16]}>
          <meshBasicMaterial color={atom.color} transparent opacity={opacity * 0.3} />
        </Sphere>
      )}
      {/* Main atom */}
      <Sphere ref={meshRef} args={[atom.radius * scale, 32, 32]}>
        <meshStandardMaterial
          color={atom.color}
          transparent
          opacity={opacity}
          metalness={0.4}
          roughness={0.3}
          emissive={atom.color}
          emissiveIntensity={phase === "transition" ? 0.5 : 0.1}
        />
      </Sphere>
    </group>
  );
};

// Animated bond component
const AnimatedBond = ({
  from,
  to,
  opacity,
}: {
  from: [number, number, number];
  to: [number, number, number];
  opacity: number;
}) => {
  const position = useMemo((): [number, number, number] => [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ], [from, to]);

  const length = useMemo(() => {
    return Math.sqrt(
      Math.pow(to[0] - from[0], 2) +
      Math.pow(to[1] - from[1], 2) +
      Math.pow(to[2] - from[2], 2)
    );
  }, [from, to]);

  const rotation = useMemo(() => {
    const direction = new THREE.Vector3(
      to[0] - from[0],
      to[1] - from[1],
      to[2] - from[2]
    ).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);
    return new THREE.Euler().setFromQuaternion(quaternion);
  }, [from, to]);

  if (opacity <= 0.01 || length < 0.1) return null;

  return (
    <Cylinder
      args={[0.08, 0.08, length, 12]}
      position={position}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <meshStandardMaterial
        color="#a0a0a0"
        transparent
        opacity={opacity * 0.9}
        metalness={0.3}
        roughness={0.5}
      />
    </Cylinder>
  );
};

// Molecule group component
const MoleculeGroup = ({
  config,
  offset,
  progress,
  phase,
}: {
  config: MoleculeConfig;
  offset: [number, number, number];
  progress: number;
  phase: "reactant" | "product";
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate animation values
  const animValues = useMemo(() => {
    if (phase === "reactant") {
      const moveProgress = Math.min(1, progress * 2);
      const fadeStart = 0.35;
      const opacity = progress < fadeStart ? 1 : Math.max(0, 1 - ((progress - fadeStart) / 0.35));
      const scale = progress < fadeStart ? 1 : Math.max(0.1, 1 - ((progress - fadeStart) / 0.5));
      return { moveProgress, opacity, scale };
    } else {
      const appearStart = 0.5;
      const appearProgress = Math.max(0, (progress - appearStart) / 0.5);
      const opacity = Math.min(1, appearProgress * 1.5);
      const scale = Math.min(1, appearProgress * 1.2);
      return { moveProgress: appearProgress, opacity, scale };
    }
  }, [progress, phase]);

  const currentPhase = useMemo(() => {
    if (progress > 0.35 && progress < 0.65) return "transition";
    return phase;
  }, [progress, phase]);

  // Calculate positions with animation
  const positions = useMemo(() => {
    return config.atoms.map((atom) => {
      const x = atom.position[0] + offset[0] * (phase === "reactant" ? (1 - animValues.moveProgress * 0.6) : animValues.moveProgress * 0.6);
      const y = atom.position[1] + offset[1] + Math.sin(progress * Math.PI) * (phase === "reactant" ? 0.3 : 0.2);
      const z = atom.position[2] + offset[2] * (phase === "reactant" ? (1 - animValues.moveProgress * 0.6) : animValues.moveProgress * 0.6);
      return [x, y, z] as [number, number, number];
    });
  }, [config.atoms, offset, animValues.moveProgress, progress, phase]);

  return (
    <group ref={groupRef}>
      {config.atoms.map((atom, idx) => (
        <GlowingAtom
          key={`atom-${idx}`}
          atom={atom}
          position={positions[idx]}
          opacity={animValues.opacity}
          scale={animValues.scale}
          phase={currentPhase}
        />
      ))}
      {config.bonds.map((bond, idx) => (
        <AnimatedBond
          key={`bond-${idx}`}
          from={positions[bond.from]}
          to={positions[bond.to]}
          opacity={animValues.opacity * 0.8}
        />
      ))}
    </group>
  );
};

// Reaction energy burst effect
const EnergyBurst = ({ progress }: { progress: number }) => {
  const show = progress > 0.35 && progress < 0.7;
  const intensity = show ? Math.sin((progress - 0.35) / 0.35 * Math.PI) : 0;

  if (!show) return null;

  return (
    <group>
      <Sparkles
        count={50}
        scale={4}
        size={3}
        speed={2}
        opacity={intensity * 0.8}
        color="#ffd700"
      />
      <Sphere args={[0.8 * intensity, 16, 16]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#ffd700"
          transparent
          opacity={intensity * 0.4}
          distort={0.4}
          speed={3}
        />
      </Sphere>
    </group>
  );
};

// Main scene component
const ReactionScene = ({
  reactantConfigs,
  productConfigs,
  progress,
  isRotating,
}: {
  reactantConfigs: MoleculeConfig[];
  productConfigs: MoleculeConfig[];
  progress: number;
  isRotating: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // Calculate offsets for molecules
  const reactantOffsets = useMemo(() => {
    const count = reactantConfigs.length;
    return reactantConfigs.map((_, idx) => {
      const angle = (idx / Math.max(count, 1)) * Math.PI - Math.PI / 2;
      return [
        Math.cos(angle) * 2.5 - 2,
        Math.sin(angle) * 0.5,
        idx * 0.3 - (count - 1) * 0.15,
      ] as [number, number, number];
    });
  }, [reactantConfigs]);

  const productOffsets = useMemo(() => {
    const count = productConfigs.length;
    return productConfigs.map((_, idx) => {
      const angle = (idx / Math.max(count, 1)) * Math.PI - Math.PI / 2;
      return [
        Math.cos(angle) * 2.5 + 2,
        Math.sin(angle) * 0.5,
        idx * 0.3 - (count - 1) * 0.15,
      ] as [number, number, number];
    });
  }, [productConfigs]);

  return (
    <group ref={groupRef}>
      {/* Reactants */}
      {reactantConfigs.map((config, idx) => (
        <MoleculeGroup
          key={`reactant-${idx}`}
          config={config}
          offset={reactantOffsets[idx]}
          progress={progress}
          phase="reactant"
        />
      ))}

      {/* Products */}
      {productConfigs.map((config, idx) => (
        <MoleculeGroup
          key={`product-${idx}`}
          config={config}
          offset={productOffsets[idx]}
          progress={progress}
          phase="product"
        />
      ))}

      {/* Energy burst effect */}
      <EnergyBurst progress={progress} />
    </group>
  );
};

interface ReactionAnimation3DProps {
  reactants: string[];
  products: string[];
  equation?: string;
}

const ReactionAnimation3D = ({ reactants, products, equation }: ReactionAnimation3DProps) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Parse molecules
  const reactantConfigs = useMemo(() => {
    return reactants.slice(0, 4).map((r) => getMoleculeConfig(r));
  }, [reactants]);

  const productConfigs = useMemo(() => {
    return products.slice(0, 4).map((p) => getMoleculeConfig(p));
  }, [products]);

  // Animation steps
  const steps = [
    { name: "Yaqinlashish", icon: "→" },
    { name: "To'qnashuv", icon: "⚡" },
    { name: "Bog'lar uzilishi", icon: "✂️" },
    { name: "Yangi bog'lar", icon: "🔗" },
    { name: "Mahsulotlar", icon: "✨" },
  ];

  const currentStep = Math.min(steps.length - 1, Math.floor(progress * steps.length));

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const duration = 4500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isPlaying]);

  const handlePlay = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        {!isPlaying ? (
          <Button onClick={handlePlay} size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
            <Play className="w-4 h-4 mr-2" />
            Boshlash
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="secondary">
            <Pause className="w-4 h-4 mr-2" />
            To'xtatish
          </Button>
        )}
        <Button onClick={handleReset} disabled={isPlaying && progress === 0} size="sm" variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Qayta
        </Button>
        <Button onClick={() => setIsRotating(!isRotating)} size="sm" variant="outline">
          <Zap className="w-4 h-4 mr-1" />
          {isRotating ? "To'xtat" : "Aylantir"}
        </Button>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-72 md:h-80 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-xl border border-slate-700/50 overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="absolute top-3 left-3 right-3 z-10">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{steps[currentStep]?.icon}</span>
                <span className="text-xs text-white/90 font-medium">
                  {steps[currentStep]?.name}
                </span>
              </div>
              <span className="text-xs text-white/60">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-100 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Equation display */}
        {equation && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <p className="text-xs md:text-sm font-mono text-white/90 text-center">{equation}</p>
            </div>
          </div>
        )}

        {/* Labels */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-cyan-500/20 backdrop-blur-md px-3 py-1 rounded-lg border border-cyan-400/30">
            <p className="text-[10px] text-cyan-400 font-medium">Reagentlar</p>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          <div className="bg-purple-500/20 backdrop-blur-md px-3 py-1 rounded-lg border border-purple-400/30">
            <p className="text-[10px] text-purple-400 font-medium">Mahsulotlar</p>
          </div>
        </div>

        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[0, 5, 0]} intensity={0.3} color="#06b6d4" />
          
          <ReactionScene
            reactantConfigs={reactantConfigs}
            productConfigs={productConfigs}
            progress={progress}
            isRotating={isRotating}
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={4}
            maxDistance={15}
            autoRotate={false}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default ReactionAnimation3D;
