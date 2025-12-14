import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Bumblebee colors - YORQIN va OCHIQ
const YELLOW_MAIN = "#FFEB3B"; // Yorqin sariq
const YELLOW_HIGHLIGHT = "#FFF59D"; // Ochiq sariq
const BLACK_METAL = "#455A64"; // Kulrang-ko'k (qora emas)
const BLACK_ACCENT = "#607D8B"; // Ochiq kulrang
const CHROME = "#F5F5F5"; // Yorqin oq-kumush
const CHROME_DARK = "#CFD8DC"; // Ochiq kumush
const BLUE_ENERGY = "#4FC3F7"; // Yorqin ko'k
const BLUE_CORE = "#29B6F6"; // Ochiq ko'k
const AUTOBOT_RED = "#EF5350"; // Yorqin qizil

// Optimus Prime colors - YORQIN va OCHIQ
const OPTIMUS_RED = "#EF5350"; // Yorqin qizil
const OPTIMUS_BLUE = "#42A5F5"; // Yorqin ko'k
const OPTIMUS_CHROME = "#FAFAFA"; // Juda yorqin kumush
const OPTIMUS_ENERGY = "#81D4FA"; // Yorqin moviy

// Gesture types (expanded)
type GestureType = "idle" | "wave" | "point" | "thumbsUp" | "think" | "celebrate" | "listen" | "nod" | "raiseHand" | "salute" | "clap" | "walk" | "dance" | "jump" | "stretch" | "punch" | "flex";

// Bumblebee - faqat kirishda tanishadi
const bumblebeeIntro = "Salom! Men Bumblebee! Avtobotlarning eng sodiq jangchisiman!";

// Optimus Prime - faqat kirishda tanishadi  
const optimusIntro = "Men Optimus Prime! Avtobotlar lideri! Bilim - eng kuchli qurolimiz!";

// Umumiy bilimlar bazasi - barcha sahifalar uchun aralashtiriladi
const knowledgeBase: string[] = [
  // Elementlar
  "H - Vodorod, eng yengil element, atom massasi 1",
  "He - Geliy, inert gaz, shamlar uchun ishlatiladi",
  "Li - Litiy, eng yengil metall, batareyalarda",
  "C - Uglerod, olmos va grafitda mavjud",
  "N - Azot, havoning 78 foizi",
  "O - Kislorod, nafas olish uchun zarur",
  "Na - Natriy, suv bilan portlaydi!",
  "Cl - Xlor, tuz tarkibida NaCl",
  "Fe - Temir, qon tarkibida, magnit xususiyatli",
  "Au - Oltin, eng choziluvchan metall",
  "Ag - Kumush, eng yaxshi elektr otkazuvchi",
  "Cu - Mis, simlar uchun ishlatiladi",
  "Ca - Kalsiy, suyaklar tarkibida",
  "K - Kaliy, osimliklar uchun zarur",
  "Mg - Magniy, xlorofil tarkibida",
  "S - Oltingugurt, vulqonlarda topiladi",
  "P - Fosfor, gugurt ishlab chiqarishda",
  "Zn - Rux, korroziyadan himoya",
  "Al - Alyuminiy, samolyotlarda ishlatiladi",
  "Si - Kremniy, kompyuter chiplari asosi",
  
  // Formulalar va qonunlar
  "Molyar massa: M = m/n (g/mol)",
  "Konsentratsiya: C = n/V (mol/L)",
  "pH = -log[H+], pOH = -log[OH-]",
  "Ideal gaz: PV = nRT",
  "Faradey qonuni: m = (M·I·t)/(n·F)",
  "Massa ulushi: w = m(element)/m(modda)",
  "Zichlik: p = m/V (g/ml)",
  "Hajm (gaz): V = n × 22.4 L",
  "Issiqlik: Q = m × c × dT",
  "Avogadro soni: 6.02×10 darajada 23",
  
  // Reaksiyalar
  "2H2 + O2 = 2H2O - suv hosil bolishi",
  "2Na + 2H2O = 2NaOH + H2 - natriy va suv",
  "CaCO3 = CaO + CO2 - ohak yonishi",
  "Zn + 2HCl = ZnCl2 + H2 - metall va kislota",
  "NaOH + HCl = NaCl + H2O - neytrallanish",
  "Fe + CuSO4 = FeSO4 + Cu - orin olish",
  "CH4 + 2O2 = CO2 + 2H2O - metan yonishi",
  "2KMnO4 = K2MnO4 + MnO2 + O2",
  
  // Tushunchalar
  "Valentlik - atomning bog hosil qilish qobiliyati",
  "Ion - zaryadlangan atom yoki molekula",
  "Kation (+) va anion (-) - ion turlari",
  "Molekula - atomlarning birikishi",
  "Kristall panjara - qattiq modda tuzilishi",
  "Elektrolitlar - eritma tok otkazadi",
  "Indikatorlar - muhit pH ini aniqlaydi",
  "Lakmus - kislotada qizil, asosda kok",
  "Fenolftalein - asosda pushti rang",
  "Metil oranj - kislotada qizil",
  
  // Qiziqarli faktlar
  "Mendeleev 1869-yilda davriy jadvalni yaratdi",
  "Olmos va grafit bir xil element - uglerod!",
  "Suv 0°C da muzlaydi, 100°C da qaynaydi",
  "Oltingugurt yonganida kok olov chiqadi",
  "Magniy yonganida yorqin oq nur hosil boladi",
  "Natriy xlorid - oddiy osh tuzi",
  "Vodorod - Quyosh asosiy elementi",
  "Kislorod havoning 21 foizi",
  "Azot havoning 78 foizi",
  "Argon - havoda 3-chi koplik element",
  
  // Amaliy bilimlar
  "Soda + sirka = vulqon tajribasi!",
  "Yod + kraxmal = kok rang hosil boladi",
  "Mis sulfat + temir = mis chokadi",
  "Limon kislotasi - tabiiy kislota",
  "Sut - kolloid eritma misoli",
  "Tuz suvda eriganda ion hosil boladi",
  "Muzlash - ekzotermik jarayon",
  "Buglanish - endotermik jarayon",
  
  // Xavfsizlik
  "Laboratoriyada kozoynak kiyish shart!",
  "Kimyoviy moddalarni tatib korib bulmaydi!",
  "Kislotalarni suv ustiga quyish kerak",
  "Tajribadan keyin qollarni yuvish zarur",
  "Isitish vaqtida probirkani yuzga qaratmang",
  
  // Maslahatlar
  "Har kuni 15 daqiqa oqish - katta natija!",
  "Avval nazariyani oqing, keyin test ishlang",
  "Xato javoblarni qayta korib chiqing",
  "Formulalarni yod oling - oson boladi",
  "Davriy jadvalni yodlashdan boshlang",
  "Kimyoviy tenglamalarni muvozanatlashni organing",
];

// Optimus Prime tips - avval o'zini tanishtiradi
const optimusTips: Record<string, string[]> = {
  "/": [
    "Men Optimus Prime! Avtobotlar lideri! Bilim - eng kuchli qurolimiz! Sizni himoya qilish va o'rgatish mening vazifam!",
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
  ],
  "/reactions": [
    "Optimus Prime! Reaksiyalar sirlarini ochamiz!",
    "2H₂ + O₂ → 2H₂O - suv hosil bo'lishi",
    "2Na + 2H₂O → 2NaOH + H₂↑ - natriy va suv",
    "CaCO₃ → CaO + CO₂↑ - ohak yonishi",
    "Zn + 2HCl → ZnCl₂ + H₂↑ - metall va kislota",
    "NaOH + HCl → NaCl + H₂O - neytrallanish",
  ],
  "/learning": [
    "Optimus Prime o'rganishda sizga yo'l ko'rsatadi!",
    "Valentlik - atomning bog' hosil qilish qobiliyati",
    "Ion - zaryadlangan atom yoki molekula",
    "Kation (+) va anion (-) - ion turlari",
    "Molekula - atomlarning birikishi",
    "Kristall panjara - qattiq modda tuzilishi",
  ],
  "/library": [
    "Optimus Prime bilim xazinasiga xush kelibsiz deydi!",
    "Mendeleev 1869-yilda davriy jadvalni yaratdi",
    "Davriy qonun - xossalar atom massasiga bog'liq",
    "Atomning tuzilishi: yadro + elektronlar",
    "Proton (+), neytron (0), elektron (-)",
  ],
  "/quiz": [
    "Optimus Prime test yechishda kuch beradi!",
    "Savol: Suvning formulasi? Javob: H₂O",
    "Savol: Tuz formulasi? Javob: NaCl",
    "Savol: Vodorod atom massasi? Javob: 1",
    "Savol: Kislorod valentligi? Javob: 2",
  ],
  "/calculator": [
    "Optimus Prime hisoblashda yordam beradi!",
    "Massa ulushi: ω = m(element)/m(modda) × 100%",
    "Zichlik: ρ = m/V (g/ml yoki g/cm³)",
    "Hajm (gaz): V = n × 22.4 L (n.sh.)",
    "Issiqlik sig'imi: Q = m × c × ΔT",
  ],
  "/experiments": [
    "Optimus Prime tajribalar sirlari bilan tanishtiryapti!",
    "NaHCO₃ + CH₃COOH → vulqon tajribasi!",
    "Yod + kraxmal → ko'k rang hosil bo'ladi",
    "Magniy + olov → yorqin oq nur!",
    "Suv + kalsiy → vodorod gazi chiqadi",
  ],
  "/developers": [
    "Optimus Prime ChemFlare jamoasini qo'llab-quvvatlaydi!",
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

// Bumblebee Head - Movie accurate heroic design with ears and talking mouth
const BumblebeeHead = ({ gesture, isTalking }: { gesture: GestureType; isTalking?: boolean }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEarRef = useRef<THREE.Group>(null);
  const rightEarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (headRef.current) {
      if (gesture === "listen") {
        headRef.current.rotation.y = 0.15;
        headRef.current.rotation.x = 0.08;
      } else if (gesture === "nod") {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.2;
      } else if (gesture === "think") {
        headRef.current.rotation.y = -0.2 + Math.sin(time * 0.5) * 0.05;
        headRef.current.rotation.x = 0.1;
        headRef.current.rotation.z = 0.1;
      } else if (gesture === "celebrate") {
        headRef.current.rotation.y = Math.sin(time * 6) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 4) * 0.1 - 0.1;
      } else if (gesture === "salute") {
        headRef.current.rotation.y = 0;
        headRef.current.rotation.x = -0.05;
      } else if (gesture === "walk") {
        headRef.current.rotation.y = Math.sin(time * 3) * 0.05;
        headRef.current.rotation.x = Math.sin(time * 6) * 0.03;
      } else {
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
    // Talking mouth animation
    if (mouthRef.current && isTalking) {
      const mouthOpen = Math.abs(Math.sin(time * 12)) * 0.03 + 0.01;
      mouthRef.current.scale.y = 1 + mouthOpen * 8;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
    }
    // Ear antenna movement when talking or listening
    if (leftEarRef.current && rightEarRef.current) {
      const earMove = isTalking ? Math.sin(time * 8) * 0.1 : Math.sin(time * 2) * 0.05;
      leftEarRef.current.rotation.z = earMove;
      rightEarRef.current.rotation.z = -earMove;
      if (gesture === "listen") {
        leftEarRef.current.rotation.x = 0.15;
        rightEarRef.current.rotation.x = 0.15;
      } else {
        leftEarRef.current.rotation.x = 0;
        rightEarRef.current.rotation.x = 0;
      }
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
      
      {/* Mouth - animated when talking */}
      <mesh ref={mouthRef} position={[0, -0.08, 0.22]}>
        <boxGeometry args={[0.12, 0.02, 0.02]} />
        <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={2} />
      </mesh>
      
      {/* LEFT EAR - Transformers style antenna */}
      <group ref={leftEarRef} position={[-0.24, 0.08, 0]}>
        {/* Ear base panel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.18, 0.12]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear antenna fin - tall */}
        <mesh position={[-0.02, 0.12, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.08]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Ear tip glow */}
        <mesh position={[-0.02, 0.2, 0]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={3} />
        </mesh>
        {/* Inner ear detail */}
        <mesh position={[0.02, 0, 0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      {/* RIGHT EAR - Transformers style antenna */}
      <group ref={rightEarRef} position={[0.24, 0.08, 0]}>
        {/* Ear base panel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.18, 0.12]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear antenna fin - tall */}
        <mesh position={[0.02, 0.12, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.08]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Ear tip glow */}
        <mesh position={[0.02, 0.2, 0]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color={BLUE_ENERGY} emissive={BLUE_ENERGY} emissiveIntensity={3} />
        </mesh>
        {/* Inner ear detail */}
        <mesh position={[-0.02, 0, 0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 8]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
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

// Bumblebee Chest - with Autobot insignia (BAQUVAT - kattaroq)
const BumblebeeChest = () => (
  <group position={[0, 0.55, 0]}>
    {/* NECK - bo'yin qismi */}
    <group position={[0, 0.38, 0]}>
      {/* Neck cylinder */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.1, 0.18, 12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      {/* Neck joint ball - bosh ulash joyi */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Neck detail rings */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.085, 0.015, 8, 16]} />
        <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
      </mesh>
    </group>
    
    {/* Main chest plate - kattaroq */}
    <mesh>
      <boxGeometry args={[0.75, 0.6, 0.4]} />
      <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Upper chest detail */}
    <mesh position={[0, 0.2, 0.21]}>
      <boxGeometry args={[0.6, 0.18, 0.03]} />
      <meshStandardMaterial color={BLACK_METAL} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Central chest plate (metal plate for insignia) */}
    <mesh position={[0, 0, 0.21]}>
      <boxGeometry args={[0.42, 0.35, 0.03]} />
      <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
    </mesh>
    
    {/* Autobot Insignia - Red face shape */}
    <mesh position={[0, 0.02, 0.23]}>
      <circleGeometry args={[0.1, 6]} />
      <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.5} />
    </mesh>
    <mesh position={[0, 0.02, 0.235]}>
      <circleGeometry args={[0.065, 6]} />
      <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Side chest armor - kuchli yelka */}
    <mesh position={[-0.32, 0.05, 0.12]}>
      <boxGeometry args={[0.12, 0.45, 0.2]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    <mesh position={[0.32, 0.05, 0.12]}>
      <boxGeometry args={[0.12, 0.45, 0.2]} />
      <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
    </mesh>
    
    {/* Lower chest - waist connection */}
    <mesh position={[0, -0.35, 0]}>
      <boxGeometry args={[0.5, 0.12, 0.32]} />
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
    } else if (gesture === "dance") {
      // Dance animation - funky moves
      const dancePhase = time * 8;
      armRef.current.rotation.z = (isLeft ? -1.2 : 1.2) + Math.sin(dancePhase + (isLeft ? 0 : Math.PI)) * 0.6;
      armRef.current.rotation.x = Math.sin(dancePhase * 0.5) * 0.4;
      forearmRef.current.rotation.x = 0.5 + Math.sin(dancePhase * 1.5) * 0.4;
    } else if (gesture === "jump") {
      // Jump animation - arms swing up
      const jumpPhase = Math.sin(time * 5);
      armRef.current.rotation.z = (isLeft ? -1.8 : 1.8) + jumpPhase * 0.3;
      armRef.current.rotation.x = -0.2;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "stretch") {
      // Stretching animation
      armRef.current.rotation.z = isLeft ? -2.8 : 2.8;
      armRef.current.rotation.x = 0 + Math.sin(time * 2) * 0.1;
      forearmRef.current.rotation.x = 0.2 + Math.sin(time * 3) * 0.15;
    } else if (gesture === "punch" && !isLeft) {
      // Punching animation (right arm only)
      const punchPhase = Math.sin(time * 12);
      armRef.current.rotation.z = -0.2;
      armRef.current.rotation.x = -1.4 + punchPhase * 0.3;
      forearmRef.current.rotation.x = 0.1;
    } else if (gesture === "flex") {
      // Flexing muscles animation
      armRef.current.rotation.z = (isLeft ? -1.6 : 1.6);
      armRef.current.rotation.x = -0.3 + Math.sin(time * 4) * 0.1;
      forearmRef.current.rotation.x = 1.4 + Math.sin(time * 5) * 0.1;
    } else {
      // Standing at attention - subtle idle motion
      const armAngle = Math.sin(time * 1.5) * 0.04;
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4) + armAngle;
      armRef.current.rotation.x = -0.2 + Math.sin(time * 1) * 0.02;
      forearmRef.current.rotation.x = 0.6 + Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.85, 0]}>
      {/* Shoulder ball joint - dumaloq ulash joyi */}
      <mesh position={[mirror * 0.03, 0.02, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Shoulder joint ring */}
      <mesh position={[mirror * 0.03, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.1, 0.02, 8, 16]} />
        <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper arm - qalin */}
      <mesh position={[mirror * 0.03, -0.15, 0]}>
        <boxGeometry args={[0.14, 0.28, 0.14]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper arm detail stripe */}
      <mesh position={[mirror * 0.03, -0.15, 0.072]}>
        <boxGeometry args={[0.06, 0.22, 0.015]} />
        <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Elbow joint - kattaroq */}
      <mesh position={[0, -0.32, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Forearm group */}
      <group ref={forearmRef} position={[0, -0.38, 0]}>
        {/* Forearm - qalin */}
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.12, 0.25, 0.12]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Forearm detail */}
        <mesh position={[0, -0.12, 0.065]}>
          <boxGeometry args={[0.05, 0.2, 0.015]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Wrist ball joint */}
        <mesh position={[0, -0.28, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Palm - kaft */}
        <mesh position={[0, -0.36, 0]}>
          <boxGeometry args={[0.1, 0.08, 0.05]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Fingers - barmoqlar */}
        {/* Index finger */}
        <group position={[-0.035, -0.42, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.018, 0.06, 0.02]} />
            <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Middle finger */}
        <group position={[-0.012, -0.43, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.018, 0.065, 0.02]} />
            <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.038, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Ring finger */}
        <group position={[0.012, -0.43, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.018, 0.065, 0.02]} />
            <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.038, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Pinky finger */}
        <group position={[0.035, -0.42, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.016, 0.05, 0.018]} />
            <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Thumb */}
        <group position={[0.05, -0.36, 0.015]} rotation={[0, 0, -0.5]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.02, 0.02]} />
            <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0.025, 0, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
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
    } else if (gesture === "dance") {
      // Dancing legs - funky moves
      const dancePhase = time * 8;
      const legMove = Math.sin(dancePhase + (isLeft ? 0 : Math.PI)) * 0.4;
      legRef.current.rotation.x = legMove;
      legRef.current.rotation.z = Math.sin(dancePhase * 0.5) * 0.15;
      lowerLegRef.current.rotation.x = Math.abs(legMove) * 0.6;
    } else if (gesture === "jump") {
      // Jump animation - legs tucked
      const jumpPhase = Math.abs(Math.sin(time * 5));
      legRef.current.rotation.x = -0.4 - jumpPhase * 0.3;
      lowerLegRef.current.rotation.x = 0.6 + jumpPhase * 0.4;
    } else if (gesture === "stretch") {
      // Stretching - slight bend
      legRef.current.rotation.x = isLeft ? 0.3 : -0.1;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "punch") {
      // Stable stance for punch
      legRef.current.rotation.x = isLeft ? 0.3 : -0.2;
      legRef.current.rotation.z = isLeft ? -0.15 : 0.15;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "flex") {
      // Power stance for flexing
      legRef.current.rotation.z = isLeft ? -0.2 : 0.2;
      lowerLegRef.current.rotation.x = 0.15;
    } else {
      // Standing still
      legRef.current.rotation.x = 0;
      legRef.current.rotation.z = 0;
      lowerLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={legRef} position={[xPos, 0, 0]}>
      {/* Hip ball joint - dumaloq ulash joyi */}
      <mesh>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Hip joint ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.018, 8, 16]} />
        <meshStandardMaterial color={CHROME_DARK} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper leg - qalin muskulli */}
      <mesh position={[0, -0.18, 0]}>
        <boxGeometry args={[0.14, 0.32, 0.14]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Knee - katta */}
      <mesh position={[0, -0.38, 0]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Lower leg group */}
      <group ref={lowerLegRef} position={[0, -0.38, 0]}>
        {/* Lower leg - qalin */}
        <mesh position={[0, -0.18, 0]}>
          <boxGeometry args={[0.12, 0.32, 0.12]} />
          <meshStandardMaterial color={YELLOW_MAIN} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Lower leg stripe */}
        <mesh position={[0, -0.18, 0.065]}>
          <boxGeometry args={[0.06, 0.26, 0.015]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.95} roughness={0.1} />
        </mesh>
        
        {/* Ankle ball joint */}
        <mesh position={[0, -0.36, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Foot base - oyoq kaft */}
        <mesh position={[0, -0.42, 0.03]}>
          <boxGeometry args={[0.12, 0.06, 0.16]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Toes - barmoqlar */}
        {/* Big toe */}
        <mesh position={[-0.035, -0.44, 0.1]}>
          <boxGeometry args={[0.03, 0.03, 0.04]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Middle toes */}
        <mesh position={[0, -0.44, 0.1]}>
          <boxGeometry args={[0.025, 0.028, 0.035]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0.03, -0.44, 0.1]}>
          <boxGeometry args={[0.025, 0.026, 0.03]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Small toe */}
        <mesh position={[0.055, -0.44, 0.09]}>
          <boxGeometry args={[0.02, 0.024, 0.025]} />
          <meshStandardMaterial color={BLACK_ACCENT} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Bumblebee Robot - Full body, heroic pose, facing forward
const BumblebeeRobot = ({ gesture, isTalking }: { gesture: GestureType; isTalking?: boolean }) => {
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
      } else if (isTalking) {
        // Talking body movement - slight forward lean and energy
        groupRef.current.position.y = Math.sin(time * 3) * 0.01;
        groupRef.current.rotation.y = Math.sin(time * 2) * 0.05;
        groupRef.current.rotation.x = -0.05 + Math.sin(time * 4) * 0.02;
      } else {
        // Subtle heroic idle - very slight motion
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.015;
        groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.03;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0]}>
      <BumblebeeHead gesture={gesture} isTalking={isTalking} />
      <BumblebeeChest />
      <BumblebeeArm side="left" gesture={gesture} />
      <BumblebeeArm side="right" gesture={gesture} />
      <BumblebeeLeg side="left" gesture={gesture} />
      <BumblebeeLeg side="right" gesture={gesture} />
      <EnergySphere color={BLUE_ENERGY} coreColor={BLUE_CORE} />
    </group>
  );
};

// Optimus Prime Head - Round heroic design with ears and talking mouth
const OptimusHead = ({ gesture, isTalking }: { gesture: GestureType; isTalking?: boolean }) => {
  const headRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEarRef = useRef<THREE.Group>(null);
  const rightEarRef = useRef<THREE.Group>(null);

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
    // Talking mouth animation
    if (mouthRef.current && isTalking) {
      const mouthOpen = Math.abs(Math.sin(time * 10)) * 0.025 + 0.01;
      mouthRef.current.scale.y = 1 + mouthOpen * 6;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = 1;
    }
    // Ear antenna movement
    if (leftEarRef.current && rightEarRef.current) {
      const earMove = isTalking ? Math.sin(time * 7) * 0.08 : Math.sin(time * 1.5) * 0.04;
      leftEarRef.current.rotation.z = earMove;
      rightEarRef.current.rotation.z = -earMove;
      if (gesture === "listen") {
        leftEarRef.current.rotation.x = 0.12;
        rightEarRef.current.rotation.x = 0.12;
      } else {
        leftEarRef.current.rotation.x = 0;
        rightEarRef.current.rotation.x = 0;
      }
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
      
      {/* Mouth - animated when talking */}
      <mesh ref={mouthRef} position={[0, -0.07, 0.2]}>
        <boxGeometry args={[0.1, 0.015, 0.02]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={2} />
      </mesh>
      
      {/* LEFT EAR - Optimus style audio receptor */}
      <group ref={leftEarRef} position={[-0.22, 0.06, 0]}>
        {/* Ear base - red */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.1]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear antenna - tall fin */}
        <mesh position={[-0.02, 0.1, 0]}>
          <boxGeometry args={[0.025, 0.12, 0.06]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear tip */}
        <mesh position={[-0.02, 0.18, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={3} />
        </mesh>
        {/* Audio receptor detail */}
        <mesh position={[0.015, 0, 0.04]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      {/* RIGHT EAR - Optimus style audio receptor */}
      <group ref={rightEarRef} position={[0.22, 0.06, 0]}>
        {/* Ear base - red */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.1]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear antenna - tall fin */}
        <mesh position={[0.02, 0.1, 0]}>
          <boxGeometry args={[0.025, 0.12, 0.06]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Ear tip */}
        <mesh position={[0.02, 0.18, 0]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={3} />
        </mesh>
        {/* Audio receptor detail */}
        <mesh position={[-0.015, 0, 0.04]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      <pointLight ref={eyeGlowRef} position={[0, 0, 0.25]} color={OPTIMUS_ENERGY} intensity={1.5} distance={0.8} />
    </group>
  );
};

// Optimus Prime Chest - BAQUVAT
const OptimusChest = () => (
  <group position={[0, 0.45, 0]}>
    {/* NECK - bo'yin qismi */}
    <group position={[0, 0.32, 0]}>
      {/* Neck cylinder */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.09, 0.16, 12]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      {/* Neck joint ball - bosh ulash joyi */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Neck detail rings */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.075, 0.012, 8, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
      </mesh>
    </group>
    
    {/* Main chest - red - kattaroq */}
    <mesh>
      <boxGeometry args={[0.7, 0.55, 0.35]} />
      <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Window panels - blue - kattaroq */}
    <mesh position={[-0.12, 0.08, 0.18]}>
      <boxGeometry args={[0.14, 0.2, 0.03]} />
      <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={1} transparent opacity={0.8} />
    </mesh>
    <mesh position={[0.12, 0.08, 0.18]}>
      <boxGeometry args={[0.14, 0.2, 0.03]} />
      <meshStandardMaterial color={OPTIMUS_ENERGY} emissive={OPTIMUS_ENERGY} emissiveIntensity={1} transparent opacity={0.8} />
    </mesh>
    
    {/* Side armor - kuchli */}
    <mesh position={[-0.3, 0, 0.1]}>
      <boxGeometry args={[0.1, 0.4, 0.18]} />
      <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
    </mesh>
    <mesh position={[0.3, 0, 0.1]}>
      <boxGeometry args={[0.1, 0.4, 0.18]} />
      <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
    </mesh>
    
    {/* Autobot insignia - kattaroq */}
    <mesh position={[0, -0.1, 0.18]}>
      <circleGeometry args={[0.08, 6]} />
      <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.5} />
    </mesh>
    
    {/* Waist - blue - qalin */}
    <mesh position={[0, -0.32, 0]}>
      <boxGeometry args={[0.48, 0.12, 0.28]} />
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
    } else if (gesture === "dance") {
      const dancePhase = time * 8;
      armRef.current.rotation.z = (isLeft ? -1.2 : 1.2) + Math.sin(dancePhase + (isLeft ? 0 : Math.PI)) * 0.6;
      armRef.current.rotation.x = Math.sin(dancePhase * 0.5) * 0.4;
      forearmRef.current.rotation.x = 0.5 + Math.sin(dancePhase * 1.5) * 0.4;
    } else if (gesture === "jump") {
      const jumpPhase = Math.sin(time * 5);
      armRef.current.rotation.z = (isLeft ? -1.8 : 1.8) + jumpPhase * 0.3;
      armRef.current.rotation.x = -0.2;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "stretch") {
      armRef.current.rotation.z = isLeft ? -2.8 : 2.8;
      armRef.current.rotation.x = 0 + Math.sin(time * 2) * 0.1;
      forearmRef.current.rotation.x = 0.2 + Math.sin(time * 3) * 0.15;
    } else if (gesture === "punch" && !isLeft) {
      const punchPhase = Math.sin(time * 12);
      armRef.current.rotation.z = -0.2;
      armRef.current.rotation.x = -1.4 + punchPhase * 0.3;
      forearmRef.current.rotation.x = 0.1;
    } else if (gesture === "flex") {
      armRef.current.rotation.z = (isLeft ? -1.6 : 1.6);
      armRef.current.rotation.x = -0.3 + Math.sin(time * 4) * 0.1;
      forearmRef.current.rotation.x = 1.4 + Math.sin(time * 5) * 0.1;
    } else {
      const armAngle = Math.sin(time * 1.5) * 0.04;
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4) + armAngle;
      armRef.current.rotation.x = -0.2;
      forearmRef.current.rotation.x = 0.6;
    }
  });

  return (
    <group ref={armRef} position={[xPos, 0.7, 0]}>
      {/* Shoulder ball joint - dumaloq ulash joyi */}
      <mesh position={[mirror * 0.03, 0.02, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Shoulder joint ring */}
      <mesh position={[mirror * 0.03, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.09, 0.018, 8, 16]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper arm - blue - qalin */}
      <mesh position={[mirror * 0.03, -0.14, 0]}>
        <boxGeometry args={[0.12, 0.25, 0.12]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Elbow - chrome - katta */}
      <mesh position={[0, -0.28, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Forearm - red - qalin */}
      <group ref={forearmRef} position={[0, -0.34, 0]}>
        <mesh position={[0, -0.12, 0]}>
          <boxGeometry args={[0.1, 0.22, 0.1]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Wrist ball joint */}
        <mesh position={[0, -0.26, 0]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Palm - kaft */}
        <mesh position={[0, -0.33, 0]}>
          <boxGeometry args={[0.085, 0.07, 0.045]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Fingers - barmoqlar */}
        {/* Index finger */}
        <group position={[-0.028, -0.38, 0]}>
          <mesh><boxGeometry args={[0.016, 0.05, 0.018]} />
            <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.03, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Middle finger */}
        <group position={[-0.01, -0.385, 0]}>
          <mesh><boxGeometry args={[0.016, 0.055, 0.018]} />
            <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.032, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Ring finger */}
        <group position={[0.01, -0.385, 0]}>
          <mesh><boxGeometry args={[0.016, 0.055, 0.018]} />
            <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.032, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Pinky finger */}
        <group position={[0.028, -0.38, 0]}>
          <mesh><boxGeometry args={[0.014, 0.045, 0.016]} />
            <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0, -0.028, 0]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
        {/* Thumb */}
        <group position={[0.042, -0.33, 0.012]} rotation={[0, 0, -0.5]}>
          <mesh><boxGeometry args={[0.035, 0.018, 0.018]} />
            <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
          </mesh>
          <mesh position={[0.022, 0, 0]}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
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
    } else if (gesture === "dance") {
      const dancePhase = time * 8;
      const legMove = Math.sin(dancePhase + (isLeft ? 0 : Math.PI)) * 0.4;
      legRef.current.rotation.x = legMove;
      legRef.current.rotation.z = Math.sin(dancePhase * 0.5) * 0.15;
      lowerLegRef.current.rotation.x = Math.abs(legMove) * 0.6;
    } else if (gesture === "jump") {
      const jumpPhase = Math.abs(Math.sin(time * 5));
      legRef.current.rotation.x = -0.4 - jumpPhase * 0.3;
      lowerLegRef.current.rotation.x = 0.6 + jumpPhase * 0.4;
    } else if (gesture === "stretch") {
      legRef.current.rotation.x = isLeft ? 0.3 : -0.1;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "punch") {
      legRef.current.rotation.x = isLeft ? 0.3 : -0.2;
      legRef.current.rotation.z = isLeft ? -0.15 : 0.15;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "flex") {
      legRef.current.rotation.z = isLeft ? -0.2 : 0.2;
      lowerLegRef.current.rotation.x = 0.15;
    } else {
      legRef.current.rotation.x = 0;
      legRef.current.rotation.z = 0;
      lowerLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={legRef} position={[xPos, -0.02, 0]}>
      {/* Hip ball joint - dumaloq ulash joyi */}
      <mesh>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Hip joint ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Upper leg - blue - qalin muskulli */}
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[0.12, 0.28, 0.12]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* Knee - chrome - katta */}
      <mesh position={[0, -0.34, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* Lower leg - blue - qalin */}
      <group ref={lowerLegRef} position={[0, -0.34, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.1, 0.28, 0.1]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Ankle ball joint */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        
        {/* Foot base - oyoq kaft */}
        <mesh position={[0, -0.37, 0.03]}>
          <boxGeometry args={[0.1, 0.05, 0.14]} />
          <meshStandardMaterial color={OPTIMUS_RED} metalness={0.98} roughness={0.05} />
        </mesh>
        
        {/* Toes - barmoqlar */}
        <mesh position={[-0.03, -0.38, 0.09]}>
          <boxGeometry args={[0.025, 0.025, 0.035]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0, -0.38, 0.09]}>
          <boxGeometry args={[0.022, 0.023, 0.03]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0.025, -0.38, 0.085]}>
          <boxGeometry args={[0.02, 0.022, 0.025]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh position={[0.045, -0.38, 0.08]}>
          <boxGeometry args={[0.016, 0.02, 0.022]} />
          <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
    </group>
  );
};

// Optimus Prime Robot - Full body
const OptimusRobot = ({ gesture, isTalking }: { gesture: GestureType; isTalking?: boolean }) => {
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
      } else if (isTalking) {
        // Talking body movement - authoritative stance
        groupRef.current.position.y = Math.sin(time * 2.5) * 0.01;
        groupRef.current.rotation.y = Math.sin(time * 1.8) * 0.04;
        groupRef.current.rotation.x = -0.03 + Math.sin(time * 3) * 0.015;
      } else {
        groupRef.current.position.y = Math.sin(time * 1.5) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.06;
        groupRef.current.rotation.z = 0;
        groupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, 0, 0]}>
      <OptimusHead gesture={gesture} isTalking={isTalking} />
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
  const [bumblebeeGesture, setBumblebeeGesture] = useState<GestureType>("wave");
  const [birdGesture, setBirdGesture] = useState<GestureType>("listen");
  const [showBird, setShowBird] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isUserActive, setIsUserActive] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<"bumblebee" | "bird">("bumblebee");
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [shuffledKnowledge, setShuffledKnowledge] = useState<string[]>([]);
  
  const [bumblebeeTarget, setBumblebeeTarget] = useState({ x: 85, y: 20 });
  const [birdTarget, setBirdTarget] = useState({ x: 15, y: 25 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle knowledge base on mount and page change
  useEffect(() => {
    const shuffled = [...knowledgeBase].sort(() => Math.random() - 0.5);
    setShuffledKnowledge(shuffled);
    setCurrentTipIndex(0);
    setIsFirstMessage(true);
    setCurrentSpeaker("bumblebee");
    setBumblebeeGesture("wave");
    setBirdGesture("listen");
    setShowTip(true);
  }, [location.pathname]);

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
        const nextSpeaker = currentSpeaker === "bumblebee" ? "bird" : "bumblebee";
        setCurrentSpeaker(nextSpeaker);
        
        // If switching to bird for first time, keep isFirstMessage true for bird's intro
        // Only set isFirstMessage to false after both have introduced
        if (isFirstMessage && nextSpeaker === "bird") {
          // Keep isFirstMessage true so bird can introduce
        } else if (isFirstMessage && nextSpeaker === "bumblebee") {
          setIsFirstMessage(false);
        } else {
          setIsFirstMessage(false);
        }
        
        // Update gestures - speaker gets random gesture, listener listens
        const newGesture = getRandomSpeakerGesture();
        if (nextSpeaker === "bird") {
          setBumblebeeGesture("listen");
          setBirdGesture(newGesture);
        } else {
          setBumblebeeGesture(newGesture);
          setBirdGesture("listen");
        }
        
        // Change tip index - use shuffled knowledge
        if (!isFirstMessage || (isFirstMessage && nextSpeaker === "bumblebee")) {
          setCurrentTipIndex(prev => (prev + 1) % shuffledKnowledge.length);
        }
        
        setShowTip(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserActive, currentSpeaker, shuffledKnowledge.length, getRandomSpeakerGesture, isFirstMessage]);

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

  if (isHidden) return null;

  // Get current tip - intro on first message for each robot, then shuffled knowledge
  const getCurrentTip = () => {
    if (isFirstMessage) {
      return currentSpeaker === "bumblebee" ? bumblebeeIntro : optimusIntro;
    }
    if (shuffledKnowledge.length === 0) return knowledgeBase[0];
    return shuffledKnowledge[currentTipIndex % shuffledKnowledge.length];
  };

  const currentTip = getCurrentTip();

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
                <BumblebeeRobot gesture={bumblebeeGesture} isTalking={showTip && currentSpeaker === "bumblebee"} />
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
                    <OptimusRobot gesture={birdGesture} isTalking={showTip && currentSpeaker === "bird"} />
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
