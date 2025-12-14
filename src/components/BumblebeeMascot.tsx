import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Movie-accurate Bumblebee colors (Clean heroic style)
const YELLOW_MAIN = "#FFD700"; // Bright polished gold-yellow
const YELLOW_HIGHLIGHT = "#FFF44F"; // Highlight for shine
const BLACK_METAL = "#1a1a1a"; // Slightly lighter for visibility
const BLACK_ACCENT = "#2d2d2d"; // Secondary black
const CHROME = "#E8E8E8"; // Polished chrome
const CHROME_DARK = "#B8B8B8"; // Chrome shadow
const BLUE_ENERGY = "#00BFFF"; // Glowing blue eyes
const BLUE_CORE = "#4169E1"; // Core energy
const AUTOBOT_RED = "#E32636"; // Autobot insignia

// Optimus Prime colors (Red-Blue like in movies)
const OPTIMUS_RED = "#C41E3A"; // Classic Optimus red
const OPTIMUS_BLUE = "#1E3A8A"; // Classic Optimus blue
const OPTIMUS_CHROME = "#E8E8E8"; // Chrome details
const OPTIMUS_ENERGY = "#60A5FA"; // Blue energy glow

// Gesture types (expanded)
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "think" | "celebrate" | "listen" | "nod" | "raiseHand" | "salute" | "clap" | "walk";

// Bumblebee tips - foydali va tushunarli
const bumblebeeTips: Record<string, string[]> = {
  "/": [
    "Salom! Men Bumblebee - kimyo bo'yicha yordamchiman!",
    "Elementni bosing - proton, neytron, elektron sonini ko'ring",
    "Metalllar chap tomonda, metalmaslar o'ng tomonda joylashgan",
    "Davr raqami - elektron qavatlar sonini bildiradi",
    "Guruh raqami - tashqi qavatdagi elektronlar soni",
    "Lantanoidlar va aktinoidlar jadval ostida joylashgan",
    "Atom massasi - proton va neytronlar yig'indisi",
    "Elektromanfiylk - atomning elektron tortish qobiliyati",
  ],
  "/reactions": [
    "Reaksiya tenglamasini muvozanatlash uchun koeffitsientlar qo'ying",
    "Oksidlanish - elektron yo'qotish, qaytarilish - elektron olish",
    "Ekzotermik reaksiya - issiqlik ajratadi, endotermik - yutadi",
    "Katalizator - reaksiya tezligini oshiradi, o'zi sarf bo'lmaydi",
    "Neytrallanish: kislota + asos = tuz + suv",
    "Almashinuv reaksiyasi: AB + CD = AD + CB",
    "Birikish: A + B = AB, parchalanish: AB = A + B",
  ],
  "/learning": [
    "Har kuni 15 daqiqa o'qish - 1 oyda katta natija!",
    "Avval nazariyani o'qing, keyin test ishlang",
    "Xato javoblarni qayta ko'rib chiqing - bu eng muhim!",
    "Formulalarni yod oling - masalalar oson bo'ladi",
    "Darajangizni oshirib, yangi mavzularni oching",
    "AI testlar - sizning bilimingizga moslashtirilgan",
  ],
  "/library": [
    "Boshlang'ich kitobdan boshlang - poydevor muhim!",
    "Har bir bobni to'liq o'qib, keyin savollarga javob bering",
    "Murakkab mavzularni bir necha marta o'qing",
    "PDF yuklab oling - oflayn ham o'qishingiz mumkin",
    "Tushunmagan joylarni belgilab qo'ying",
  ],
  "/quiz": [
    "Test rasmini yuklang - 10 tagacha rasm",
    "AI savollarni avtomatik taniydi va formatlaydi",
    "Javoblar aralashtiriladi - yod olish emas, tushunish muhim!",
    "Xato javoblarni ko'rib chiqing - tushuntirishni o'qing",
    "Natijangiz saqlanadi - keyinroq qayta ishlashingiz mumkin",
  ],
  "/calculator": [
    "Molyar massa: M = m/n (g/mol)",
    "Konsentratsiya: C = n/V (mol/L)",
    "pH = -log[H⁺], pOH = -log[OH⁻]",
    "Ideal gaz: PV = nRT",
    "Faradey qonuni: m = (M·I·t)/(n·F)",
    "Masala rasmini yuklang - AI yechimni ko'rsatadi",
    "Bosqichma-bosqich yechim va tushuntirish beriladi",
  ],
  "/experiments": [
    "Videolarni diqqat bilan tomosha qiling",
    "Xavfsizlik qoidalariga amal qiling!",
    "Ko'zoynak va qo'lqop kiyish shart",
    "Kimyoviy moddalarni hid bilmang!",
    "Tajribadan keyin qo'llaringizni yuvmang",
  ],
  "/developers": [
    "ChemFlare - kimyoni oson o'rganish uchun yaratilgan",
    "Savollar bo'lsa - Telegram orqali bog'laning",
    "Ilovani baholang va fikringizni bildiring!",
  ],
};

// Optimus Prime tips - ko'proq ta'limiy ma'lumotlar
const optimusTips: Record<string, string[]> = {
  "/": [
    "Men Optimus Prime! Bilim - eng kuchli qurol!",
    "H - Vodorod, eng yengil element, atom massasi 1",
    "He - Geliy, inert gaz, shamlar uchun ishlatiladi",
    "Li - Litiy, eng yengil metall, batareyalarda ishlatiladi",
    "C - Uglerod, olmosda va grafitda mavjud",
    "N - Azot, havoning 78%, o'g'itlarda ishlatiladi",
    "O - Kislorod, nafas olish uchun zarur",
    "Na - Natriy, suv bilan portlaydi!",
    "Cl - Xlor, tuz tarkibida, NaCl",
    "Fe - Temir, qon tarkibida, magnit xususiyatli",
    "Au - Oltin, eng cho'ziluvchan metall",
    "Ag - Kumush, eng yaxshi elektr o'tkazuvchi",
    "Cu - Mis, simlar uchun ishlatiladi",
  ],
  "/reactions": [
    "2H₂ + O₂ → 2H₂O - suv hosil bo'lishi",
    "2Na + 2H₂O → 2NaOH + H₂↑ - natriy va suv",
    "CaCO₃ → CaO + CO₂↑ - ohak yonishi",
    "Zn + 2HCl → ZnCl₂ + H₂↑ - metall va kislota",
    "NaOH + HCl → NaCl + H₂O - neytrallanish",
    "Fe + CuSO₄ → FeSO₄ + Cu - o'rin olish",
    "2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑ - parchalanish",
    "CH₄ + 2O₂ → CO₂ + 2H₂O - metan yonishi",
  ],
  "/learning": [
    "Valentlik - atomning bog' hosil qilish qobiliyati",
    "Ion - zaryadlangan atom yoki molekula",
    "Kation (+) va anion (-) - ion turlari",
    "Molekula - atomlarning birikishi",
    "Kristall panjara - qattiq modda tuzilishi",
    "Elektrolitlar - eritma yoki suyuqlikda tok o'tkazadi",
    "Indikatorlar - muhit pH ini aniqlaydi",
    "Lakmus - kislotada qizil, asosda ko'k",
  ],
  "/library": [
    "Mendeleev 1869-yilda davriy jadvalni yaratdi",
    "Davriy qonun - xossalar atom massasiga bog'liq",
    "Atomning tuzilishi: yadro + elektronlar",
    "Proton (+), neytron (0), elektron (-)",
    "Izotoplar - proton soni bir xil, neytron farqli",
    "Atom radiusi - davrda kamayadi, guruhda ortadi",
  ],
  "/quiz": [
    "Savol: Suvning formulasi? Javob: H₂O",
    "Savol: Tuz formulasi? Javob: NaCl",
    "Savol: Vodorod atom massasi? Javob: 1",
    "Savol: Kislorod valentligi? Javob: 2",
    "Savol: Neytral muhit pH? Javob: 7",
    "Savol: Avogadro soni? Javob: 6.02×10²³",
  ],
  "/calculator": [
    "Massa ulushi: ω = m(element)/m(modda) × 100%",
    "Zichlik: ρ = m/V (g/ml yoki g/cm³)",
    "Hajm (gaz): V = n × 22.4 L (n.sh.)",
    "Issiqlik sig'imi: Q = m × c × ΔT",
    "Elektroliz: m = (M × I × t)/(n × 96500)",
  ],
  "/experiments": [
    "NaHCO₃ + CH₃COOH → vulqon tajribasi!",
    "Yod + kraxmal → ko'k rang hosil bo'ladi",
    "Magniy + olov → yorqin oq nur!",
    "Suv + kalsiy → vodorod gazi chiqadi",
    "Mis sulfat + temir → mis cho'kadi",
  ],
  "/developers": [
    "Transformerlar kabi - bilim bilan o'zgaramiz!",
    "Birga o'rganamiz, birga kuchli bo'lamiz!",
  ],
};

// Energy Sphere
const EnergySphere = ({ color = BLUE_ENERGY, coreColor = BLUE_CORE }: { color?: string; coreColor?: string }) => {
  const sphereRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

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
      const pulse = 1 + Math.sin(time * 8) * 0.15;
      sphereRef.current.scale.setScalar(pulse);
    }
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 3;
      coreRef.current.rotation.y = time * 4;
    }
  });

  return (
    <group ref={sphereRef} position={[0, 0.1, 0.35]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.08, 2]} />
        <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={4} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
      <points geometry={particleGeometry}>
        <pointsMaterial color={color} size={0.015} transparent opacity={0.8} sizeAttenuation />
      </points>
      <pointLight color={color} intensity={2} distance={1} />
    </group>
  );
};

// Bumblebee Head - Movie accurate heroic design with more gestures
const BumblebeeHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        // Attentive listening pose
        headRef.current.rotation.y = 0.15;
        headRef.current.rotation.x = 0.08;
      } else if (gesture === "nod") {
        // Nodding animation
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.2;
      } else if (gesture === "think") {
        // Thinking - head tilted
        headRef.current.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.05;
        headRef.current.rotation.x = 0.1;
        headRef.current.rotation.z = 0.1;
      } else if (gesture === "celebrate") {
        // Excited head movement
        headRef.current.rotation.y = Math.sin(time * 6) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.1 - 0.1;
      } else if (gesture === "salute") {
        // Firm salute pose
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = -0.05;
      } else if (gesture === "walk") {
        // Walking head bob
        headRef.current.rotation.y = Math.sin(time * 3) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 6) * 0.03;
      } else {
        // Default subtle focused movement
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 0.3) * 0.03;
        headRef.current.rotation.z = 0;
      }
    }
    // Pulsing eye glow
    if (eyeGlowRef.current) {
      const baseIntensity = gesture === "celebrate" ? 2.5 : 1.5;
      eyeGlowRef.current.intensity = baseIntensity + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.2, 0]}>
      {/* Main head - helmet shape */}
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Helmet crest */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.2]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Face plate - black visor area */}
      <mesh position={[0, -0.02, 0.18]}>
        <boxGeometry args={[0.32, 0.16, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Left eye - glowing blue */}
      <mesh position={[-0.08, 0.02, 0.23]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial 
          color={BLUE_ENERGY} 
          emissive={BLUE_ENERGY} 
          emissiveIntensity={6} 
          transparent 
          opacity={0.95}
        />
      </mesh>
      <mesh position={[-0.08, 0.02, 0.235]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Right eye - glowing blue */}
      <mesh position={[0.08, 0.02, 0.23]}>
        <sphereGeometry args={[0.035, 20, 20]} />
        <meshStandardMaterial 
          color={BLUE_ENERGY} 
          emissive={BLUE_ENERGY} 
          emissiveIntensity={6} 
          transparent 
          opacity={0.95}
        />
      </mesh>
      <mesh position={[0.08, 0.02, 0.235]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Side ear panels */}
      <mesh position={[-0.22, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.22, 0, 0]}>
        <boxGeometry args={[0.06, 0.15, 0.12]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Chin guard */}
      <mesh position={[0, -0.14, 0.1]}>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Eye glow light */}
      <pointLight ref={eyeGlowRef} position={[0, 0.02, 0.3]} color={BLUE_ENERGY} intensity={1.5} distance={0.8} />
    </group>
  );
};

// Bumblebee Chest - with Autobot insignia
const BumblebeeChest = () => (
  <group position={[0, 0.6, 0]}>
    {/* Main chest plate */}
    <mesh>
      <boxGeometry args={[0.6, 0.5, 0.3]} />
      <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Upper chest detail */}
    <mesh position={[0, 0.15, 0.16]}>
      <boxGeometry args={[0.5, 0.15, 0.02]} />
      <meshStandardMaterial color={BLACK_METAL} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Central chest plate (metal plate for insignia) */}
    <mesh position={[0, 0, 0.16]}>
      <boxGeometry args={[0.35, 0.3, 0.02]} />
      <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Autobot Insignia - Red face shape */}
    <mesh position={[0, 0.02, 0.175]}>
      <circleGeometry args={[0.08, 6]} />
      <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[0, 0.02, 0.178]}>
      <circleGeometry args={[0.05, 6]} />
      <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Side chest vents */}
    <mesh position={[-0.25, 0, 0.1]}>
      <boxGeometry args={[0.08, 0.35, 0.15]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh position={[0.25, 0, 0.1]}>
      <boxGeometry args={[0.08, 0.35, 0.15]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    
    {/* Lower chest - waist connection */}
    <mesh position={[0, -0.28, 0]}>
      <boxGeometry args={[0.4, 0.1, 0.25]} />
      <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
    </mesh>
  </group>
);

// Bumblebee Arm - Polished mechanical design with more gestures
const BumblebeeArm = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.45 : 0.45;
  const mirror = isLeft ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!armRef.current || !forearmRef.current) return;

    if (gesture === "wave" && isLeft) {
      // Waving animation
      armRef.current.rotation.z = -1.4 + Math.sin(time * 6) * 0.3;
      armRef.current.rotation.x = -0.3;
      forearmRef.current.rotation.x = 0.2 + Math.sin(time * 8) * 0.2;
    } else if (gesture === "raiseHand" && isLeft) {
      // Raising hand high
      armRef.current.rotation.z = -2.5;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3 + Math.sin(time * 2) * 0.1;
    } else if (gesture === "salute" && !isLeft) {
      // Salute with right hand
      armRef.current.rotation.z = -1.8;
      armRef.current.rotation.x = -0.4;
      forearmRef.current.rotation.x = 1.2;
    } else if (gesture === "thumbsUp" && !isLeft) {
      // Thumbs up with right hand
      armRef.current.rotation.z = -0.8;
      armRef.current.rotation.x = -0.6;
      forearmRef.current.rotation.x = 0.8;
    } else if (gesture === "point" && !isLeft) {
      // Pointing forward
      armRef.current.rotation.z = -0.3;
      armRef.current.rotation.x = -1.2;
      forearmRef.current.rotation.x = 0.2;
    } else if (gesture === "clap") {
      // Clapping animation
      const clapAngle = Math.sin(time * 10) * 0.4;
      armRef.current.rotation.z = (isLeft ? -0.6 : 0.6) + (isLeft ? -clapAngle : clapAngle);
      armRef.current.rotation.x = -0.8;
      forearmRef.current.rotation.x = 0.6;
    } else if (gesture === "celebrate") {
      // Both arms up celebrating
      const bounce = Math.sin(time * 6) * 0.2;
      armRef.current.rotation.z = (isLeft ? -2.2 : 2.2) + bounce;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3 + Math.sin(time * 8) * 0.15;
    } else if (gesture === "think" && !isLeft) {
      // Hand on chin thinking
      armRef.current.rotation.z = -0.6;
      armRef.current.rotation.x = -0.9;
      forearmRef.current.rotation.x = 1.4;
    } else if (gesture === "walk") {
      // Walking arm swing
      const walkSwing = Math.sin(time * 6 + (isLeft ? 0 : Math.PI)) * 0.5;
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = walkSwing;
      forearmRef.current.rotation.x = 0.4 + Math.abs(walkSwing) * 0.3;
    } else if (gesture === "listen") {
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = -0.15;
      forearmRef.current.rotation.x = 0.5;
    } else {
      // Standing at attention - subtle idle motion
      const armAngle = Math.sin(time * 1.5) * 0.04;
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4) + armAngle;
      armRef.current.rotation.x = -0.2 + Math.sin(time * 1) * 0.02;
      forearmRef.current.rotation.x = 0.6 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.8, 0]}>
      {/* Shoulder joint */}
      <mesh position={[mirror * 0.02, 0, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[mirror * 0.02, -0.12, 0]}>
        <boxGeometry args={[0.1, 0.22, 0.1]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper arm detail stripe */}
      <mesh position={[mirror * 0.02, -0.12, 0.052]}>
        <boxGeometry args={[0.04, 0.18, 0.01]} />
        <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Elbow joint */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.3, 0]}>
        {/* Forearm */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[0.09, 0.2, 0.09]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Forearm detail */}
        <mesh position={[0, -0.1, 0.048]}>
          <boxGeometry args={[0.035, 0.16, 0.01]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Wrist */}
        <mesh position={[0, -0.22, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Hand */}
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.04]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Bumblebee Legs with walking animation
const BumblebeeLeg = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const legRef = useRef<THREE.Group>(null);
  const lowerLegRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.15 : 0.15;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!legRef.current || !lowerLegRef.current) return;

    if (gesture === "walk") {
      // Walking animation - legs alternate
      const walkPhase = time * 6 + (isLeft ? 0 : Math.PI);
      const legSwing = Math.sin(walkPhase) * 0.5;
      const kneeAngle = Math.max(0, Math.sin(walkPhase + 0.5)) * 0.6;
      
      legRef.current.rotation.x = legSwing;
      lowerLegRef.current.rotation.x = kneeAngle;
    } else if (gesture === "celebrate") {
      // Jumping/bouncing legs
      const bounce = Math.sin(time * 8) * 0.15;
      legRef.current.rotation.x = bounce;
      lowerLegRef.current.rotation.x = Math.abs(bounce) * 0.5;
    } else {
      // Standing still
      legRef.current.rotation.x = 0;
      lowerLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={legRef} position={[xPos, 0.05, 0]}>
      {/* Hip joint */}
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper leg */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.1, 0.25, 0.1]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Knee */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Lower leg group */}
      <group ref={lowerLegRef} position={[0, -0.3, 0]}>
        {/* Lower leg */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.09, 0.25, 0.09]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Lower leg stripe */}
        <mesh position={[0, -0.15, 0.048]}>
          <boxGeometry args={[0.04, 0.2, 0.01]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Foot */}
        <mesh position={[0, -0.32, 0.02]}>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Bumblebee Robot - Full body, heroic pose, facing forward
const BumblebeeRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      if (gesture === "walk") {
        // Walking body movement
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.03;
        groupRef.current.rotation.z = Math.sin(time * 6) * 0.02;
      } else if (gesture === "celebrate") {
        // Bouncing celebration
        groupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.1;
      } else {
        // Subtle heroic idle - very slight motion
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.015;
        groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.03;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0]}>
      <BumblebeeHead gesture={gesture} />
      <BumblebeeChest />
      <BumblebeeArm side="left" gesture={gesture} />
      <BumblebeeArm side="right" gesture={gesture} />
      <BumblebeeLeg side="left" gesture={gesture} />
      <BumblebeeLeg side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} />
    </group>
  );
};

// Optimus Prime Head - Round heroic design
const OptimusHead = ({ gesture }: { gesture: GestureType }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        headRef.current.rotation.y = -0.2;
        headRef.current.rotation.x = 0.1;
      } else if (gesture === "nod") {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = Math.sin(time * 5) * 0.25;
      } else if (gesture === "think") {
        headRef.current.rotation.y = 0.2;
        headRef.current.rotation.x = 0.15;
        headRef.current.rotation.z = -0.1;
      } else if (gesture === "celebrate") {
        headRef.current.rotation.y = Math.sin(time * 7) * 0.2;
        headRef.current.rotation.x = Math.sin(time * 5) * 0.15;
      } else if (gesture === "walk") {
        headRef.current.rotation.y = Math.sin(time * 4) * 0.08;
        headRef.current.rotation.x = Math.sin(time * 8) * 0.05;
      } else {
        headRef.current.rotation.y = Math.sin(time * 1.2) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 0.8) * 0.08;
      }
    }
    if (eyeGlowRef.current) {
      eyeGlowRef.current.intensity = 1.5 + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <group ref={headRef} position={[0, 1.0, 0]}>
      {/* Main round head - blue */}
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Helmet crest */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.06, 0.1, 0.15]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Face plate - silver */}
      <mesh position={[0, -0.02, 0.16]}>
        <boxGeometry args={[0.28, 0.14, 0.08]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Left eye - glowing blue */}
      <mesh position={[-0.07, 0.02, 0.21]}>
        <sphereGeometry args={[0.032, 20, 20]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={6} transparent opacity={0.95} />
      </mesh>
      <mesh position={[-0.07, 0.02, 0.22]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Right eye - glowing blue */}
      <mesh position={[0.07, 0.02, 0.21]}>
        <sphereGeometry args={[0.032, 20, 20]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={6} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.07, 0.02, 0.22]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
      </mesh>
      
      {/* Side panels - red */}
      <mesh position={[-0.2, 0, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.1]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.1]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
      </mesh>
      
      <pointLight ref={eyeGlowRef} position={[0, 0, 0.25]} color={OPTIMUS_ENERGY} intensity={1.5} distance={0.8} />
    </group>
  );
};

// Optimus Prime Chest
const OptimusChest = () => (
  <group position={[0, 0.5, 0]}>
    {/* Main chest - red */}
    <mesh>
      <boxGeometry args={[0.5, 0.4, 0.25]} />
      <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Window panels - blue */}
    <mesh position={[-0.1, 0.05, 0.13]}>
      <boxGeometry args={[0.1, 0.15, 0.02]} />
      <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={1} transparent opacity={0.8} />
    </mesh>
    <mesh position={[0.1, 0.05, 0.13]}>
      <boxGeometry args={[0.1, 0.15, 0.02]} />
      <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={1} transparent opacity={0.8} />
    </mesh>
    
    {/* Autobot insignia */}
    <mesh position={[0, -0.08, 0.13]}>
      <circleGeometry args={[0.06, 6]} />
      <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.5} />
    </mesh>
    
    {/* Waist - blue */}
    <mesh position={[0, -0.22, 0]}>
      <boxGeometry args={[0.35, 0.08, 0.2]} />
      <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
    </mesh>
  </group>
);

// Optimus Prime Arm
const OptimusArm = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.38 : 0.38;
  const mirror = isLeft ? -1 : 1;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!armRef.current || !forearmRef.current) return;

    if (gesture === "wave" && isLeft) {
      armRef.current.rotation.z = -1.4 + Math.sin(time * 6) * 0.3;
      armRef.current.rotation.x = -0.3;
      forearmRef.current.rotation.x = 0.2 + Math.sin(time * 8) * 0.2;
    } else if (gesture === "raiseHand" && isLeft) {
      armRef.current.rotation.z = -2.5;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "celebrate") {
      const bounce = Math.sin(time * 6) * 0.2;
      armRef.current.rotation.z = (isLeft ? -2.2 : 2.2) + bounce;
      armRef.current.rotation.x = 0;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "walk") {
      const walkSwing = Math.sin(time * 6 + (isLeft ? 0 : Math.PI)) * 0.5;
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = walkSwing;
      forearmRef.current.rotation.x = 0.4;
    } else if (gesture === "listen") {
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = -0.15;
      forearmRef.current.rotation.x = 0.5;
    } else {
      const armAngle = Math.sin(time * 1.5) * 0.04;
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4) + armAngle;
      armRef.current.rotation.x = -0.2;
      forearmRef.current.rotation.x = 0.6;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.65, 0]}>
      {/* Shoulder - chrome */}
      <mesh position={[mirror * 0.02, 0, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Upper arm - blue */}
      <mesh position={[mirror * 0.02, -0.1, 0]}>
        <boxGeometry args={[0.08, 0.18, 0.08]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Elbow - chrome */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Forearm - red */}
      <group ref={forearmRef} position={[0, -0.25, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.07, 0.15, 0.07]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Hand - chrome */}
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.05, 0.06, 0.035]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Optimus Prime Leg
const OptimusLeg = ({ side, gesture }: { side: "left" | "right"; gesture: GestureType }) => {
  const legRef = useRef<THREE.Group>(null);
  const lowerLegRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  const xPos = isLeft ? -0.12 : 0.12;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!legRef.current || !lowerLegRef.current) return;

    if (gesture === "walk") {
      const walkPhase = time * 6 + (isLeft ? 0 : Math.PI);
      const legSwing = Math.sin(walkPhase) * 0.5;
      const kneeAngle = Math.max(0, Math.sin(walkPhase + 0.5)) * 0.6;
      
      legRef.current.rotation.x = legSwing;
      lowerLegRef.current.rotation.x = kneeAngle;
    } else if (gesture === "celebrate") {
      const bounce = Math.sin(time * 8) * 0.15;
      legRef.current.rotation.x = bounce;
      lowerLegRef.current.rotation.x = Math.abs(bounce) * 0.5;
    } else {
      legRef.current.rotation.x = 0;
      lowerLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={legRef} position={[xPos, 0.05, 0]}>
      {/* Hip - blue */}
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper leg - blue */}
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Knee - chrome */}
      <mesh position={[0, -0.24, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Lower leg - blue */}
      <group ref={lowerLegRef} position={[0, -0.24, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.07, 0.2, 0.07]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Foot - red */}
        <mesh position={[0, -0.26, 0.02]}>
          <boxGeometry args={[0.06, 0.05, 0.1]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Optimus Prime Robot - Full body
const OptimusRobot = ({ gesture }: { gesture: GestureType }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      if (gesture === "walk") {
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.04;
        groupRef.current.rotation.z = Math.sin(time * 6) * 0.02;
      } else if (gesture === "celebrate") {
        groupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 5) * 0.12;
      } else {
        groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.06;
        groupRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0]}>
      <OptimusHead gesture={gesture} />
      <OptimusChest />
      <OptimusArm side="left" gesture={gesture} />
      <OptimusArm side="right" gesture={gesture} />
      <OptimusLeg side="left" gesture={gesture} />
      <OptimusLeg side="right" gesture={gesture} />
      <EnergySphere color={OPTIMUS_ENERGY} coreColor={OPTIMUS_BLUE} />
    </group>
  );
};

// Speech Bubble
const SpeechBubble = ({ text, isRight }: { text: string; isRight: boolean }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.3 }}
    className="absolute pointer-events-auto"
    style={{
      [isRight ? 'right' : 'left']: '100%',
      [isRight ? 'marginRight' : 'marginLeft']: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
    }}
  >
    <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
      text-primary-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-elegant border border-primary/30
      max-w-[180px] md:max-w-[220px]">
      <p className="leading-relaxed">{text}</p>
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 
          ${isRight 
            ? "right-0 translate-x-full border-l-8 border-l-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent" 
            : "left-0 -translate-x-full border-r-8 border-r-primary/90 border-t-6 border-t-transparent border-b-6 border-b-transparent"
          }`}
        style={{ borderTopWidth: "6px", borderBottomWidth: "6px" }}
      />
    </div>
  </motion.div>
);

const BumblebeeMascot = () => {
  const location = useLocation();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [bumblebeePos, setBumblebeePos] = useState({ x: 85, y: 20 });
  const [birdPos, setBirdPos] = useState({ x: 15, y: 25 });
  const [bumblebeeGesture, setBumblebeeGesture] = useState<GestureType>("idle");
  const [birdGesture, setBirdGesture] = useState<GestureType>("listen");
  const [showBird, setShowBird] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<"bumblebee" | "bird">("bumblebee");
  
  const [bumblebeeTarget, setBumblebeeTarget] = useState({ x: 85, y: 20 });
  const [birdTarget, setBirdTarget] = useState({ x: 15, y: 25 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get tips for current page
  const currentBumblebeeTips = bumblebeeTips[location.pathname] || bumblebeeTips["/"];
  const currentOptimusTips = optimusTips[location.pathname] || optimusTips["/"];

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setIsUserActive(true);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = setTimeout(() => {
        setIsUserActive(false);
      }, 3000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, handleActivity));
    
    activityTimeoutRef.current = setTimeout(() => setIsUserActive(false), 3000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, []);

  // Show bird after delay
  useEffect(() => {
    if (isUserActive || isHidden) return;
    const timer = setTimeout(() => setShowBird(true), 4000);
    return () => clearTimeout(timer);
  }, [isUserActive, isHidden]);

  // Speaker gestures variety
  const speakerGestures: GestureType[] = ["wave", "point", "thumbsUp", "nod", "celebrate", "raiseHand", "salute"];
  const getRandomSpeakerGesture = useCallback(() => {
    return speakerGestures[Math.floor(Math.random() * speakerGestures.length)];
  }, []);

  // Alternate speakers and change tips with varied gestures
  useEffect(() => {
    if (isUserActive) return;

    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        // Switch speaker
        setCurrentSpeaker(prev => prev === "bumblebee" ? "bird" : "bumblebee");
        
        // Update gestures - speaker gets random gesture, listener listens
        const newGesture = getRandomSpeakerGesture();
        if (currentSpeaker === "bumblebee") {
          setBumblebeeGesture("listen");
          setBirdGesture(newGesture);
        } else {
          setBumblebeeGesture(newGesture);
          setBirdGesture("listen");
        }
        
        // Change tip index
        setCurrentTipIndex(prev => {
          const tips = currentSpeaker === "bumblebee" ? currentOptimusTips : currentBumblebeeTips;
          return (prev + 1) % tips.length;
        });
        
        setShowTip(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserActive, currentSpeaker, currentBumblebeeTips, currentOptimusTips, getRandomSpeakerGesture]);

  // Smooth flying
  useEffect(() => {
    if (isUserActive || isHidden) return;

    const flyInterval = setInterval(() => {
      setBumblebeeTarget({ x: 60 + Math.random() * 30, y: 15 + Math.random() * 40 });
      if (showBird) {
        setBirdTarget({ x: 10 + Math.random() * 30, y: 15 + Math.random() * 40 });
      }
    }, 8000);

    return () => clearInterval(flyInterval);
  }, [showBird, isUserActive, isHidden]);

  // Smooth position update
  useEffect(() => {
    if (isUserActive) return;
    
    const animationInterval = setInterval(() => {
      setBumblebeePos(prev => ({
        x: prev.x + (bumblebeeTarget.x - prev.x) * 0.02,
        y: prev.y + (bumblebeeTarget.y - prev.y) * 0.02
      }));
      setBirdPos(prev => ({
        x: prev.x + (birdTarget.x - prev.x) * 0.02,
        y: prev.y + (birdTarget.y - prev.y) * 0.02
      }));
    }, 50);

    return () => clearInterval(animationInterval);
  }, [bumblebeeTarget, birdTarget, isUserActive]);

  // Handle click
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        setBumblebeeTarget({ x: 60 + Math.random() * 30, y: 15 + Math.random() * 40 });
        if (showBird) setBirdTarget({ x: 10 + Math.random() * 30, y: 15 + Math.random() * 40 });
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 1) {
      clearTimeout(clickTimerRef.current!);
      setIsHidden(true);
      setClickCount(0);
    }
  }, [clickCount, showBird]);

  // Reset on page change
  useEffect(() => {
    setCurrentTipIndex(0);
    setShowTip(true);
    setCurrentSpeaker("bumblebee");
    setBumblebeeGesture("wave");
    setBirdGesture("listen");
  }, [location.pathname]);

  if (isHidden) return null;

  const currentTip = currentSpeaker === "bumblebee" 
    ? currentBumblebeeTips[currentTipIndex % currentBumblebeeTips.length]
    : currentOptimusTips[currentTipIndex % currentOptimusTips.length];

  return (
    <AnimatePresence>
      {!isUserActive && (
        <>
          {/* Bumblebee */}
          <motion.div
            className="fixed z-30 select-none w-[220px] h-[260px] cursor-pointer"
            onClick={handleClick}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              left: `${bumblebeePos.x}%`,
              top: `${bumblebeePos.y}%`,
              x: "-50%",
              y: "-50%",
            }}
            exit={{ opacity: 0, scale: 1, transition: { duration: 0.5 } }}
            transition={{ 
              duration: 0.5,
              left: { duration: 2, ease: "linear" },
              top: { duration: 2, ease: "linear" },
            }}
          >
            <AnimatePresence mode="wait">
              {showTip && currentSpeaker === "bumblebee" && (
                <SpeechBubble text={currentTip} isRight={bumblebeePos.x > 50} />
              )}
            </AnimatePresence>

            <div className="w-full h-full pointer-events-none">
              <Canvas
                camera={{ position: [0, 0.3, 2.8], fov: 45 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
              >
                {/* Bright even studio lighting */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 4, 3]} intensity={1.5} />
                <directionalLight position={[-2, 3, 2]} intensity={0.8} />
                <pointLight position={[0, 0, 2]} intensity={0.6} color="#FFFFFF" />
                <BumblebeeRobot gesture={bumblebeeGesture} />
              </Canvas>
            </div>
            
            <div 
              className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, ${BLUE_ENERGY} 0%, transparent 70%)` }}
            />
          </motion.div>

          {/* Bird Robot */}
          <AnimatePresence>
            {showBird && (
              <motion.div
                className="fixed z-30 select-none w-[220px] h-[260px] cursor-pointer"
                onClick={handleClick}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  left: `${birdPos.x}%`,
                  top: `${birdPos.y}%`,
                  x: "-50%",
                  y: "-50%",
                }}
                exit={{ opacity: 0, scale: 1, transition: { duration: 0.5 } }}
                transition={{ 
                  duration: 0.5,
                  left: { duration: 2, ease: "linear" },
                  top: { duration: 2, ease: "linear" },
                }}
              >
                <AnimatePresence mode="wait">
                  {showTip && currentSpeaker === "bird" && (
                    <SpeechBubble text={currentTip} isRight={birdPos.x > 50} />
                  )}
                </AnimatePresence>

                <div className="w-full h-full pointer-events-none">
                  <Canvas
                    camera={{ position: [0, 0.3, 2.8], fov: 45 }}
                    style={{ background: "transparent" }}
                    gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                  >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[2, 4, 3]} intensity={1.5} />
                    <directionalLight position={[-2, 3, 2]} intensity={0.8} />
                    <pointLight position={[0, 0, 2]} intensity={0.6} color="#FFFFFF" />
                    <OptimusRobot gesture={birdGesture} />
                  </Canvas>
                </div>
                
                <div 
                  className="absolute inset-0 -z-10 rounded-full blur-3xl opacity-25"
                  style={{ background: `radial-gradient(circle, ${OPTIMUS_ENERGY} 0%, transparent 70%)` }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default BumblebeeMascot;
