// MASALALAR BAZASI - HAR QANDAY KIMYOVIY MASALANI YECHISH

import {
  elements,
  compounds,
  parseFormula,
  calculateMolarMass,
} from './chemistryKnowledge';

// ==================== MASALA SHABLONLARI ====================
interface ProblemTemplate {
  id: string;
  patterns: RegExp[];
  type: string;
  solve: (question: string, matches: RegExpMatchArray | null) => string;
}

// Sonlarni ajratib olish (birliklar bilan)
function extractNumberWithUnit(text: string, unitPatterns: string[]): { value: number; unit: string } | null {
  for (const unit of unitPatterns) {
    const regex = new RegExp(`(\\d+[.,]?\\d*)\\s*${unit}`, 'i');
    const match = text.match(regex);
    if (match) {
      return { value: parseFloat(match[1].replace(',', '.')), unit };
    }
  }
  return null;
}

// Formulani topish
function findFormula(text: string): string | null {
  // Keng tarqalgan formulalar
  const commonFormulas = [
    'H2O', 'H2', 'O2', 'N2', 'CO2', 'CO', 'HCl', 'H2SO4', 'HNO3', 'H3PO4',
    'NaOH', 'KOH', 'Ca(OH)2', 'NH3', 'NaCl', 'KCl', 'CaCl2', 'MgCl2',
    'FeCl2', 'FeCl3', 'ZnCl2', 'AlCl3', 'CuCl2', 'Na2SO4', 'K2SO4',
    'CaSO4', 'MgSO4', 'FeSO4', 'ZnSO4', 'CuSO4', 'Al2(SO4)3', 'BaSO4',
    'Na2CO3', 'NaHCO3', 'K2CO3', 'CaCO3', 'MgCO3', 'NaNO3', 'KNO3',
    'Ca(NO3)2', 'AgNO3', 'Cu(NO3)2', 'Pb(NO3)2', 'Na3PO4', 'Ca3(PO4)2',
    'CaO', 'MgO', 'Na2O', 'K2O', 'Al2O3', 'Fe2O3', 'FeO', 'Fe3O4',
    'CuO', 'Cu2O', 'ZnO', 'PbO', 'SO2', 'SO3', 'NO', 'NO2', 'N2O', 'N2O5',
    'P2O5', 'Cl2', 'Br2', 'I2', 'CH4', 'C2H6', 'C3H8', 'C4H10', 'C2H4',
    'C3H6', 'C2H2', 'C6H6', 'CH3OH', 'C2H5OH', 'HCHO', 'CH3CHO', 'HCOOH',
    'CH3COOH', 'C6H12O6', 'C12H22O11', 'AgCl', 'AgBr', 'AgI', 'PbCl2',
    'PbI2', 'KMnO4', 'K2Cr2O7', 'H2O2', 'H2S', 'NH4Cl', '(NH4)2SO4',
    'NH4NO3', 'KI', 'KBr', 'NaBr', 'NaI', 'BaCl2', 'Fe(OH)2', 'Fe(OH)3',
    'Cu(OH)2', 'Zn(OH)2', 'Al(OH)3', 'Mg(OH)2', 'Ba(OH)2'
  ];
  
  const textUpper = text.toUpperCase();
  
  // Qavsli formulalarni tekshirish
  const bracketMatch = text.match(/([A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\)\d*)?(?:[A-Z][a-z]?\d*)*)/g);
  if (bracketMatch) {
    for (const formula of bracketMatch) {
      if (formula.length > 1) {
        const cleanFormula = formula.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => {
          const map: Record<string, string> = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
          return map[m] || m;
        });
        const { mass } = calculateMolarMass(cleanFormula);
        if (mass > 0) return cleanFormula;
      }
    }
  }
  
  // Keng tarqalgan formulalarni tekshirish
  for (const formula of commonFormulas) {
    if (textUpper.includes(formula.toUpperCase())) {
      return formula;
    }
  }
  
  return null;
}

// Barcha sonlarni ajratib olish
function extractAllNumbers(text: string): number[] {
  const numbers: number[] = [];
  const regex = /(\d+[.,]?\d*)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const num = parseFloat(match[1].replace(',', '.'));
    if (!isNaN(num)) numbers.push(num);
  }
  return numbers;
}

// ==================== MASALA YECHIMLARI ====================

// 1. Molyar massa hisoblash
function solveMolarMass(question: string): string {
  const formula = findFormula(question);
  
  if (!formula) {
    return formatAnswer({
      given: "Formula aniqlanmadi",
      find: "Molyar massa (M)",
      solution: `Molyar massani hisoblash uchun modda formulasini kiriting.

📝 MOLYAR MASSA FORMULASI:
M = n₁×Ar₁ + n₂×Ar₂ + ...

Har bir element uchun: atom soni × atom massasi

🔬 MISOLLAR:
• M(H₂O) = 2×1 + 16 = 18 g/mol
• M(NaCl) = 23 + 35.5 = 58.5 g/mol
• M(H₂SO₄) = 2×1 + 32 + 4×16 = 98 g/mol`,
      answer: "Formula kiriting"
    });
  }
  
  const { mass, breakdown } = calculateMolarMass(formula);
  const parsed = parseFormula(formula);
  
  let detailedCalc = "Har bir element uchun:\n";
  for (const [el, count] of Object.entries(parsed)) {
    if (elements[el]) {
      detailedCalc += `• ${el}: ${count} × ${elements[el].mass} = ${(count * elements[el].mass).toFixed(3)} g/mol\n`;
    }
  }
  
  return formatAnswer({
    given: `Modda: ${formula}`,
    find: "Molyar massa M = ?",
    solution: `📊 FORMULADAGI ELEMENTLAR:
${detailedCalc}
━━━━━━━━━━━━━━━━━━━━━━━━
Jami: M = ${mass} g/mol`,
    answer: `M(${formula}) = ${mass} g/mol`,
    note: "Molyar massa = formuladagi barcha atomlar massalari yig'indisi"
  });
}

// 2. Massadan mol hisoblash
function solveMassToMoles(question: string): string {
  const formula = findFormula(question);
  const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'gr', 'kg', 'mg']);
  
  if (!formula || !massMatch) {
    return formatAnswer({
      given: question,
      find: "Mol soni (n)",
      solution: `📝 MOL SONINI HISOBLASH:

n = m / M

• m - massa (g)
• M - molyar massa (g/mol)
• n - mol soni

Masala: "10 g NaCl da necha mol bor?"
Yechim: n = 10 / 58.5 = 0.171 mol`,
      answer: "Massa va formulani kiriting"
    });
  }
  
  let mass = massMatch.value;
  if (massMatch.unit === 'kg') mass *= 1000;
  if (massMatch.unit === 'mg') mass /= 1000;
  
  const { mass: molarMass } = calculateMolarMass(formula);
  const moles = mass / molarMass;
  const particles = moles * 6.022e23;
  
  return formatAnswer({
    given: `m(${formula}) = ${mass} g`,
    find: "n (mol soni) = ?",
    solution: `1️⃣ MOLYAR MASSANI HISOBLAYMIZ:
M(${formula}) = ${molarMass} g/mol

2️⃣ MOL SONINI HISOBLAYMIZ:
n = m / M
n = ${mass} / ${molarMass}
n = ${moles.toFixed(6)} mol

3️⃣ ZARRACHALAR SONI:
N = n × Nₐ = ${moles.toFixed(4)} × 6.022×10²³
N = ${particles.toExponential(3)} ta`,
    answer: `n(${formula}) = ${moles.toFixed(4)} mol ≈ ${moles.toFixed(2)} mol`,
    note: `${mass} g ${formula} da ${moles.toFixed(4)} mol yoki ${particles.toExponential(2)} ta molekula bor`
  });
}

// 3. Moldan massa hisoblash
function solveMolesToMass(question: string): string {
  const formula = findFormula(question);
  const numbers = extractAllNumbers(question);
  const molMatch = question.toLowerCase().match(/(\d+[.,]?\d*)\s*mol/);
  
  if (!formula || !molMatch) {
    return formatAnswer({
      given: question,
      find: "Massa (m)",
      solution: `📝 MASSANI HISOBLASH:

m = n × M

• n - mol soni
• M - molyar massa (g/mol)
• m - massa (g)

Masala: "2 mol H₂O ning massasi qancha?"
Yechim: m = 2 × 18 = 36 g`,
      answer: "Mol soni va formulani kiriting"
    });
  }
  
  const moles = parseFloat(molMatch[1].replace(',', '.'));
  const { mass: molarMass } = calculateMolarMass(formula);
  const mass = moles * molarMass;
  
  return formatAnswer({
    given: `n(${formula}) = ${moles} mol`,
    find: "m (massa) = ?",
    solution: `1️⃣ MOLYAR MASSANI HISOBLAYMIZ:
M(${formula}) = ${molarMass} g/mol

2️⃣ MASSANI HISOBLAYMIZ:
m = n × M
m = ${moles} × ${molarMass}
m = ${mass.toFixed(3)} g`,
    answer: `m(${formula}) = ${mass.toFixed(3)} g`,
    note: `${moles} mol ${formula} ning massasi ${mass.toFixed(2)} gramm`
  });
}

// 4. Gaz hajmi hisoblash
function solveGasVolume(question: string): string {
  const formula = findFormula(question);
  const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'gr', 'kg']);
  const molMatch = question.toLowerCase().match(/(\d+[.,]?\d*)\s*mol/);
  
  // Massadan hajm
  if (formula && massMatch) {
    let mass = massMatch.value;
    if (massMatch.unit === 'kg') mass *= 1000;
    
    const { mass: molarMass } = calculateMolarMass(formula);
    const moles = mass / molarMass;
    const volume = moles * 22.4;
    
    return formatAnswer({
      given: `m(${formula}) = ${mass} g`,
      find: "V (hajm, n.sh.) = ?",
      solution: `1️⃣ MOLYAR MASSA:
M(${formula}) = ${molarMass} g/mol

2️⃣ MOL SONI:
n = m / M = ${mass} / ${molarMass} = ${moles.toFixed(4)} mol

3️⃣ HAJM (normal sharoitda):
V = n × Vₘ = ${moles.toFixed(4)} × 22.4
V = ${volume.toFixed(3)} L`,
      answer: `V(${formula}) = ${volume.toFixed(2)} L (n.sh.)`,
      note: "Normal sharoit: 0°C (273 K), 1 atm. Vₘ = 22.4 L/mol"
    });
  }
  
  // Moldan hajm
  if (molMatch) {
    const moles = parseFloat(molMatch[1].replace(',', '.'));
    const volume = moles * 22.4;
    
    return formatAnswer({
      given: `n = ${moles} mol`,
      find: "V (hajm, n.sh.) = ?",
      solution: `Normal sharoitda 1 mol gazning hajmi Vₘ = 22.4 L

V = n × Vₘ
V = ${moles} × 22.4
V = ${volume.toFixed(2)} L`,
      answer: `V = ${volume.toFixed(2)} L`,
      note: "Vₘ = 22.4 L/mol (normal sharoitda)"
    });
  }
  
  return formatAnswer({
    given: question,
    find: "Gaz hajmi",
    solution: `📝 GAZ HAJMI FORMULALARI:

🔹 Normal sharoit (0°C, 1 atm):
V = n × 22.4 L

🔹 Ideal gaz tenglamasi:
PV = nRT
V = nRT/P

R = 8.314 J/(mol·K)`,
    answer: "Mol soni yoki massani kiriting"
  });
}

// 5. Hajmdan mol/massa
function solveVolumeToMoles(question: string): string {
  const formula = findFormula(question);
  const volMatch = extractNumberWithUnit(question, ['l', 'litr', 'L', 'ml', 'mL']);
  
  if (!volMatch) {
    return formatAnswer({
      given: question,
      find: "Mol soni",
      solution: `📝 HAJMDAN MOL HISOBLASH:

n = V / Vₘ = V / 22.4

• V - hajm (L)
• Vₘ = 22.4 L/mol (n.sh.)`,
      answer: "Hajmni kiriting (L)"
    });
  }
  
  let volume = volMatch.value;
  if (volMatch.unit.toLowerCase() === 'ml') volume /= 1000;
  
  const moles = volume / 22.4;
  
  let result = `1️⃣ MOL SONINI HISOBLAYMIZ:
n = V / Vₘ = ${volume} / 22.4 = ${moles.toFixed(4)} mol`;

  if (formula) {
    const { mass: molarMass } = calculateMolarMass(formula);
    const mass = moles * molarMass;
    result += `

2️⃣ MASSANI HISOBLAYMIZ:
M(${formula}) = ${molarMass} g/mol
m = n × M = ${moles.toFixed(4)} × ${molarMass} = ${mass.toFixed(3)} g`;
    
    return formatAnswer({
      given: `V(${formula}) = ${volume} L (n.sh.)`,
      find: "n = ?, m = ?",
      solution: result,
      answer: `n = ${moles.toFixed(4)} mol, m = ${mass.toFixed(2)} g`
    });
  }
  
  return formatAnswer({
    given: `V = ${volume} L (n.sh.)`,
    find: "n (mol soni) = ?",
    solution: result,
    answer: `n = ${moles.toFixed(4)} mol`
  });
}

// 6. pH hisoblash
function solvePH(question: string): string {
  const numbers = extractAllNumbers(question);
  const lowerQ = question.toLowerCase();
  
  // Konsentratsiyadan pH
  if (numbers.length > 0) {
    const conc = numbers[0];
    
    // Kislota
    if (lowerQ.includes('kislota') || lowerQ.includes('h+') || lowerQ.includes('hcl') || 
        lowerQ.includes('h2so4') || lowerQ.includes('hno3')) {
      const pH = -Math.log10(conc);
      const pOH = 14 - pH;
      const ohConc = Math.pow(10, -pOH);
      
      return formatAnswer({
        given: `[H⁺] = ${conc} mol/L`,
        find: "pH = ?",
        solution: `1️⃣ pH HISOBLAYMIZ:
pH = -log[H⁺]
pH = -log(${conc})
pH = ${pH.toFixed(2)}

2️⃣ pOH HISOBLAYMIZ:
pOH = 14 - pH = 14 - ${pH.toFixed(2)} = ${pOH.toFixed(2)}

3️⃣ [OH⁻] KONSENTRATSIYASI:
[OH⁻] = 10^(-pOH) = ${ohConc.toExponential(2)} mol/L`,
        answer: `pH = ${pH.toFixed(2)}`,
        note: pH < 7 ? "Kislotali muhit (pH < 7)" : pH > 7 ? "Ishqoriy muhit (pH > 7)" : "Neytral muhit"
      });
    }
    
    // Ishqor
    if (lowerQ.includes('ishqor') || lowerQ.includes('oh') || lowerQ.includes('naoh') || lowerQ.includes('koh')) {
      const pOH = -Math.log10(conc);
      const pH = 14 - pOH;
      const hConc = Math.pow(10, -pH);
      
      return formatAnswer({
        given: `[OH⁻] = ${conc} mol/L`,
        find: "pH = ?",
        solution: `1️⃣ pOH HISOBLAYMIZ:
pOH = -log[OH⁻]
pOH = -log(${conc})
pOH = ${pOH.toFixed(2)}

2️⃣ pH HISOBLAYMIZ:
pH = 14 - pOH = 14 - ${pOH.toFixed(2)} = ${pH.toFixed(2)}

3️⃣ [H⁺] KONSENTRATSIYASI:
[H⁺] = 10^(-pH) = ${hConc.toExponential(2)} mol/L`,
        answer: `pH = ${pH.toFixed(2)}`,
        note: "Ishqoriy muhit (pH > 7)"
      });
    }
    
    // pH berilgan, konsentratsiya topish
    if (lowerQ.includes('ph') && conc >= 0 && conc <= 14) {
      const hConc = Math.pow(10, -conc);
      const ohConc = Math.pow(10, -(14 - conc));
      
      return formatAnswer({
        given: `pH = ${conc}`,
        find: "[H⁺] = ?, [OH⁻] = ?",
        solution: `1️⃣ VODOROD IONLARI KONSENTRATSIYASI:
[H⁺] = 10^(-pH) = 10^(-${conc})
[H⁺] = ${hConc.toExponential(2)} mol/L

2️⃣ GIDROKSID IONLARI KONSENTRATSIYASI:
pOH = 14 - pH = ${14 - conc}
[OH⁻] = 10^(-pOH) = ${ohConc.toExponential(2)} mol/L

3️⃣ TEKSHIRISH:
[H⁺] × [OH⁻] = ${(hConc * ohConc).toExponential(2)} ≈ 10⁻¹⁴ ✓`,
        answer: `[H⁺] = ${hConc.toExponential(2)} mol/L`,
        note: conc < 7 ? "Kislotali muhit" : conc > 7 ? "Ishqoriy muhit" : "Neytral muhit"
      });
    }
  }
  
  return formatAnswer({
    given: question,
    find: "pH",
    solution: `📝 pH FORMULALARI:

• pH = -log[H⁺]
• pOH = -log[OH⁻]
• pH + pOH = 14
• [H⁺] = 10^(-pH)
• [OH⁻] = 10^(-pOH)
• Kw = [H⁺]×[OH⁻] = 10⁻¹⁴

📊 pH SHKALA:
0-3: Kuchli kislota
3-6: Kuchsiz kislota
7: Neytral (sof suv)
8-11: Kuchsiz ishqor
11-14: Kuchli ishqor`,
    answer: "Konsentratsiya yoki pH qiymatini kiriting"
  });
}

// 7. Konsentratsiya hisoblash
function solveConcentration(question: string): string {
  const formula = findFormula(question);
  const numbers = extractAllNumbers(question);
  const lowerQ = question.toLowerCase();
  
  // Massa va hajm berilgan
  if (numbers.length >= 2) {
    const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'kg', 'mg']);
    const volMatch = extractNumberWithUnit(question, ['l', 'litr', 'ml', 'L', 'mL']);
    
    if (massMatch && volMatch && formula) {
      let mass = massMatch.value;
      if (massMatch.unit === 'kg') mass *= 1000;
      if (massMatch.unit === 'mg') mass /= 1000;
      
      let volume = volMatch.value;
      if (volMatch.unit.toLowerCase() === 'ml') volume /= 1000;
      
      const { mass: molarMass } = calculateMolarMass(formula);
      const moles = mass / molarMass;
      const concentration = moles / volume;
      
      return formatAnswer({
        given: `m(${formula}) = ${mass} g, V = ${volume} L`,
        find: "C (molyar konsentratsiya) = ?",
        solution: `1️⃣ MOLYAR MASSA:
M(${formula}) = ${molarMass} g/mol

2️⃣ MOL SONI:
n = m / M = ${mass} / ${molarMass} = ${moles.toFixed(4)} mol

3️⃣ MOLYAR KONSENTRATSIYA:
C = n / V = ${moles.toFixed(4)} / ${volume}
C = ${concentration.toFixed(4)} mol/L`,
        answer: `C = ${concentration.toFixed(4)} mol/L ≈ ${concentration.toFixed(2)} M`,
        note: "M = mol/L (molyarlik)"
      });
    }
    
    // Mol va hajm
    if (lowerQ.includes('mol') && (lowerQ.includes('litr') || lowerQ.includes('l'))) {
      const moles = numbers[0];
      const volume = numbers[1];
      const concentration = moles / volume;
      
      return formatAnswer({
        given: `n = ${moles} mol, V = ${volume} L`,
        find: "C = ?",
        solution: `C = n / V = ${moles} / ${volume} = ${concentration.toFixed(4)} mol/L`,
        answer: `C = ${concentration.toFixed(4)} mol/L`
      });
    }
  }
  
  return formatAnswer({
    given: question,
    find: "Konsentratsiya",
    solution: `📝 KONSENTRATSIYA FORMULALARI:

🔹 Molyar konsentratsiya (M):
C = n / V (mol/L)

🔹 Massa ulushi (%):
ω = m(erigan) / m(eritma) × 100%

🔹 Suyultirish:
C₁V₁ = C₂V₂`,
    answer: "Mol va hajm yoki massa va hajm kiriting"
  });
}

// 8. Reaksiya bo'yicha hisoblash
function solveReaction(question: string): string {
  const formulas: string[] = [];
  const textUpper = question.toUpperCase();
  
  // Formulalarni topish
  const commonFormulas = [
    'H2O', 'H2', 'O2', 'N2', 'CO2', 'HCl', 'H2SO4', 'NaOH', 'NaCl', 'KOH',
    'CaCO3', 'CaO', 'Ca(OH)2', 'NH3', 'ZnCl2', 'FeCl2', 'FeCl3', 'CuO',
    'Fe2O3', 'Al2O3', 'MgO', 'SO2', 'SO3', 'NO2', 'CH4', 'C2H5OH'
  ];
  
  for (const f of commonFormulas) {
    if (textUpper.includes(f.toUpperCase())) {
      formulas.push(f);
    }
  }
  
  const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'kg']);
  
  if (formulas.length >= 1 && massMatch) {
    const givenFormula = formulas[0];
    let mass = massMatch.value;
    if (massMatch.unit === 'kg') mass *= 1000;
    
    const { mass: molarMass } = calculateMolarMass(givenFormula);
    const moles = mass / molarMass;
    
    // Mashhur reaksiyalar
    const reactions: Record<string, { eq: string; ratio: Record<string, number> }> = {
      'H2+O2': { eq: '2H₂ + O₂ → 2H₂O', ratio: { 'H2': 2, 'O2': 1, 'H2O': 2 } },
      'Zn+HCl': { eq: 'Zn + 2HCl → ZnCl₂ + H₂↑', ratio: { 'Zn': 1, 'HCl': 2, 'ZnCl2': 1, 'H2': 1 } },
      'CaCO3': { eq: 'CaCO₃ → CaO + CO₂↑', ratio: { 'CaCO3': 1, 'CaO': 1, 'CO2': 1 } },
      'NaOH+HCl': { eq: 'NaOH + HCl → NaCl + H₂O', ratio: { 'NaOH': 1, 'HCl': 1, 'NaCl': 1, 'H2O': 1 } },
      'Fe+O2': { eq: '4Fe + 3O₂ → 2Fe₂O₃', ratio: { 'Fe': 4, 'O2': 3, 'Fe2O3': 2 } },
      'CH4+O2': { eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', ratio: { 'CH4': 1, 'O2': 2, 'CO2': 1, 'H2O': 2 } },
    };
    
    let solution = `1️⃣ BERILGAN MODDA:
M(${givenFormula}) = ${molarMass} g/mol
n(${givenFormula}) = m/M = ${mass}/${molarMass} = ${moles.toFixed(4)} mol

2️⃣ REAKSIYALAR BO'YICHA:`;

    // Har bir mumkin bo'lgan reaksiya uchun
    if (formulas.length >= 2) {
      const targetFormula = formulas[1];
      const { mass: targetMolarMass } = calculateMolarMass(targetFormula);
      const targetMoles = moles; // 1:1 nisbat (oddiy holat)
      const targetMass = targetMoles * targetMolarMass;
      
      solution += `
      
Agar nisbat 1:1 bo'lsa:
n(${targetFormula}) = n(${givenFormula}) = ${moles.toFixed(4)} mol
m(${targetFormula}) = n × M = ${moles.toFixed(4)} × ${targetMolarMass} = ${targetMass.toFixed(3)} g`;
      
      return formatAnswer({
        given: `m(${givenFormula}) = ${mass} g`,
        find: `m(${targetFormula}) = ?`,
        solution: solution,
        answer: `m(${targetFormula}) = ${targetMass.toFixed(2)} g (1:1 nisbatda)`,
        note: "Haqiqiy koeffitsientlarni reaksiya tenglamasidan oling!"
      });
    }
    
    return formatAnswer({
      given: `m(${givenFormula}) = ${mass} g`,
      find: "Hosil bo'ladigan moddalar massasi",
      solution: solution + `

📝 KEYINGI QADAM:
Reaksiya tenglamasini yozing va koeffitsientlar bo'yicha boshqa moddalar mol sonini toping.

MASHHUR REAKSIYALAR:
• 2H₂ + O₂ → 2H₂O
• Zn + 2HCl → ZnCl₂ + H₂
• CaCO₃ → CaO + CO₂
• NaOH + HCl → NaCl + H₂O`,
      answer: `n(${givenFormula}) = ${moles.toFixed(4)} mol`
    });
  }
  
  return formatAnswer({
    given: question,
    find: "Reaksiya bo'yicha hisob",
    solution: `📝 REAKSIYA BO'YICHA HISOBLASH ALGORITMI:

1️⃣ Berilgan modda mol sonini toping: n = m/M

2️⃣ Reaksiya tenglamasini yozing va tenglashtiring

3️⃣ Koeffitsientlar nisbatidan kerakli modda mol sonini toping

4️⃣ Kerakli modda massasini hisoblang: m = n × M

⚗️ MISOL:
"4g H₂ dan qancha H₂O hosil bo'ladi?"
2H₂ + O₂ → 2H₂O (nisbat 2:2 = 1:1)
n(H₂) = 4/2 = 2 mol
n(H₂O) = 2 mol (1:1)
m(H₂O) = 2 × 18 = 36 g`,
    answer: "Modda formulasi va massasini kiriting"
  });
}

// 9. Massa ulushi (foiz)
function solvePercent(question: string): string {
  const formula = findFormula(question);
  const numbers = extractAllNumbers(question);
  const lowerQ = question.toLowerCase();
  
  // Elementning massa ulushi
  if (formula && (lowerQ.includes('element') || lowerQ.includes('ulush') || lowerQ.includes('%'))) {
    const { mass: molarMass } = calculateMolarMass(formula);
    const parsed = parseFormula(formula);
    
    let solution = `M(${formula}) = ${molarMass} g/mol\n\nHar bir elementning massa ulushi:\n`;
    const results: string[] = [];
    
    for (const [el, count] of Object.entries(parsed)) {
      if (elements[el]) {
        const elementMass = elements[el].mass * count;
        const percent = (elementMass / molarMass) * 100;
        solution += `• ω(${el}) = (${count} × ${elements[el].mass}) / ${molarMass} × 100% = ${percent.toFixed(2)}%\n`;
        results.push(`ω(${el}) = ${percent.toFixed(2)}%`);
      }
    }
    
    return formatAnswer({
      given: `Modda: ${formula}`,
      find: "Elementlarning massa ulushi ω = ?",
      solution: solution,
      answer: results.join(', '),
      note: "ω = (n × Ar) / M × 100%"
    });
  }
  
  // Oddiy foiz hisoblash
  if (numbers.length >= 2) {
    const part = numbers[0];
    const total = numbers[1];
    const percent = (part / total) * 100;
    
    return formatAnswer({
      given: `Qism = ${part}, Butun = ${total}`,
      find: "Foiz = ?",
      solution: `% = (qism / butun) × 100
% = (${part} / ${total}) × 100
% = ${percent.toFixed(2)}%`,
      answer: `${percent.toFixed(2)}%`
    });
  }
  
  return formatAnswer({
    given: question,
    find: "Foiz yoki massa ulushi",
    solution: `📝 FOIZ FORMULALARI:

🔹 Massa ulushi:
ω = m(erigan) / m(eritma) × 100%

🔹 Elementning massa ulushi:
ω(E) = (n × Ar) / M × 100%

🔹 Hosildorlik (chiqim):
η = m(haqiqiy) / m(nazariy) × 100%`,
    answer: "Sonlarni yoki formulani kiriting"
  });
}

// 10. Zarrachalar soni
function solveParticles(question: string): string {
  const formula = findFormula(question);
  const numbers = extractAllNumbers(question);
  const lowerQ = question.toLowerCase();
  
  // Massadan zarrachalar
  if (formula) {
    const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'kg', 'mg']);
    if (massMatch) {
      let mass = massMatch.value;
      if (massMatch.unit === 'kg') mass *= 1000;
      if (massMatch.unit === 'mg') mass /= 1000;
      
      const { mass: molarMass } = calculateMolarMass(formula);
      const moles = mass / molarMass;
      const particles = moles * 6.022e23;
      
      return formatAnswer({
        given: `m(${formula}) = ${mass} g`,
        find: "N (zarrachalar soni) = ?",
        solution: `1️⃣ MOLYAR MASSA:
M(${formula}) = ${molarMass} g/mol

2️⃣ MOL SONI:
n = m / M = ${mass} / ${molarMass} = ${moles.toFixed(6)} mol

3️⃣ ZARRACHALAR SONI:
N = n × Nₐ
N = ${moles.toFixed(4)} × 6.022 × 10²³
N = ${particles.toExponential(3)} ta`,
        answer: `N = ${particles.toExponential(3)} ta molekula`,
        note: "Nₐ = 6.022 × 10²³ mol⁻¹ (Avogadro soni)"
      });
    }
    
    // Moldan zarrachalar
    const molMatch = lowerQ.match(/(\d+[.,]?\d*)\s*mol/);
    if (molMatch) {
      const moles = parseFloat(molMatch[1].replace(',', '.'));
      const particles = moles * 6.022e23;
      
      return formatAnswer({
        given: `n(${formula}) = ${moles} mol`,
        find: "N = ?",
        solution: `N = n × Nₐ
N = ${moles} × 6.022 × 10²³
N = ${particles.toExponential(3)} ta`,
        answer: `N = ${particles.toExponential(3)} ta`
      });
    }
  }
  
  // Zarrachalardan mol
  if (lowerQ.includes('zarracha') || lowerQ.includes('atom') || lowerQ.includes('molekula')) {
    const bigNumMatch = question.match(/(\d+[.,]?\d*)\s*[×x·]\s*10\^?(\d+)/i);
    if (bigNumMatch) {
      const coeff = parseFloat(bigNumMatch[1].replace(',', '.'));
      const exp = parseInt(bigNumMatch[2]);
      const particles = coeff * Math.pow(10, exp);
      const moles = particles / 6.022e23;
      
      return formatAnswer({
        given: `N = ${coeff} × 10^${exp} ta`,
        find: "n (mol) = ?",
        solution: `n = N / Nₐ
n = (${coeff} × 10^${exp}) / (6.022 × 10²³)
n = ${moles.toFixed(6)} mol`,
        answer: `n = ${moles.toFixed(4)} mol`
      });
    }
  }
  
  return formatAnswer({
    given: question,
    find: "Zarrachalar soni",
    solution: `📝 ZARRACHALAR FORMULASI:

N = n × Nₐ
n = N / Nₐ

• N - zarrachalar soni
• n - mol soni
• Nₐ = 6.022 × 10²³ mol⁻¹`,
    answer: "Mol yoki massa kiriting"
  });
}

// 11. Elektroliz
function solveElectrolysis(question: string): string {
  const numbers = extractAllNumbers(question);
  
  if (numbers.length >= 2) {
    const current = numbers[0]; // Amper
    const time = numbers[1]; // Soniya yoki daqiqa/soat
    
    let timeInSeconds = time;
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('daqiqa') || lowerQ.includes('min')) timeInSeconds = time * 60;
    if (lowerQ.includes('soat') || lowerQ.includes('hour')) timeInSeconds = time * 3600;
    
    const charge = current * timeInSeconds;
    const molesElectrons = charge / 96485;
    
    return formatAnswer({
      given: `I = ${current} A, t = ${timeInSeconds} s`,
      find: "Elektroliz natijasi",
      solution: `1️⃣ O'TGAN ELEKTR MIQDORI:
Q = I × t = ${current} × ${timeInSeconds} = ${charge} C

2️⃣ ELEKTRON MOL SONI:
nₑ = Q / F = ${charge} / 96485 = ${molesElectrons.toFixed(6)} mol

📝 MODDA MASSASINI HISOBLASH:
m = (M × n × t) / (nₑ × F)

Masalan, Cu²⁺ uchun (M=64, nₑ=2):
m = (64 × ${current} × ${timeInSeconds}) / (2 × 96485) = ${((64 * current * timeInSeconds) / (2 * 96485)).toFixed(3)} g`,
      answer: `Q = ${charge} C, nₑ = ${molesElectrons.toFixed(4)} mol`,
      note: "F = 96485 C/mol (Faradey soni)"
    });
  }
  
  return formatAnswer({
    given: question,
    find: "Elektroliz hisobi",
    solution: `📝 FARADEY QONUNLARI:

m = (M × I × t) / (n × F)

• m - ajralgan modda massasi (g)
• M - molyar massa (g/mol)
• I - tok kuchi (A)
• t - vaqt (s)
• n - elektron soni
• F = 96485 C/mol`,
    answer: "Tok kuchi va vaqtni kiriting"
  });
}

// 12. Element ma'lumotlari
function solveElementInfo(question: string): string {
  const lowerQ = question.toLowerCase();
  
  for (const [symbol, data] of Object.entries(elements)) {
    if (lowerQ.includes(data.name.toLowerCase()) || lowerQ.includes(symbol.toLowerCase())) {
      return formatAnswer({
        given: `Element: ${data.name}`,
        find: "Element haqida ma'lumot",
        solution: `📊 ${data.name.toUpperCase()} (${symbol})

• Tartib raqami: ${data.number}
• Nisbiy atom massasi: ${data.mass}
• Guruh: ${data.group}
• Simvol: ${symbol}

⚛️ ATOM TUZILISHI:
• Protonlar soni: ${data.number}
• Elektronlar soni: ${data.number}
• Neytronlar soni: ${Math.round(data.mass) - data.number}`,
        answer: `Ar(${symbol}) = ${data.mass}`,
        note: `${data.name} ${data.group} guruhiga kiradi`
      });
    }
  }
  
  return formatAnswer({
    given: question,
    find: "Element ma'lumotlari",
    solution: `Element topilmadi. Element nomi yoki simvolini kiriting.

Masalan: "Kislorod", "Temir", "Fe", "Na" va h.k.`,
    answer: "Element nomini kiriting"
  });
}

// ==================== ASOSIY FUNKSIYA ====================
export function solveChemistryProblem(question: string): string {
  const lowerQ = question.toLowerCase();
  
  // Masala turini aniqlash va mos yechuvchini chaqirish
  
  // Molyar massa
  if (lowerQ.includes('molyar massa') || lowerQ.includes('molar massa') || 
      lowerQ.includes('molekulyar massa') || lowerQ.includes('mr ') ||
      (lowerQ.includes('m(') && lowerQ.includes(')'))) {
    return solveMolarMass(question);
  }
  
  // Massadan mol
  if ((lowerQ.includes('mol') && lowerQ.includes('necha')) ||
      (lowerQ.includes('mol') && lowerQ.includes('qancha')) ||
      (lowerQ.includes('gram') && lowerQ.includes('mol')) ||
      (lowerQ.match(/\d+\s*g/) && lowerQ.includes('mol'))) {
    return solveMassToMoles(question);
  }
  
  // Moldan massa
  if ((lowerQ.includes('mol') && lowerQ.includes('massa')) ||
      (lowerQ.includes('mol') && lowerQ.includes('gram')) ||
      (lowerQ.match(/\d+\s*mol/) && (lowerQ.includes('massa') || lowerQ.includes('gram') || lowerQ.includes('og\'ir')))) {
    return solveMolesToMass(question);
  }
  
  // Gaz hajmi
  if (lowerQ.includes('hajm') && (lowerQ.includes('gaz') || lowerQ.includes('n.sh') || 
      lowerQ.includes('normal') || lowerQ.includes('litr') || lowerQ.includes('22.4'))) {
    return solveGasVolume(question);
  }
  
  // Hajmdan mol
  if ((lowerQ.includes('litr') || lowerQ.includes(' l ')) && 
      (lowerQ.includes('mol') || lowerQ.includes('massa'))) {
    return solveVolumeToMoles(question);
  }
  
  // pH
  if (lowerQ.includes('ph') || lowerQ.includes('poh') || 
      lowerQ.includes('vodorod ko\'rsatkich') || lowerQ.includes('kislotalik')) {
    return solvePH(question);
  }
  
  // Konsentratsiya
  if (lowerQ.includes('konsentratsiya') || lowerQ.includes('molarlik') ||
      lowerQ.includes('mol/l') || lowerQ.includes('eritma')) {
    return solveConcentration(question);
  }
  
  // Reaksiya
  if (lowerQ.includes('reaksiya') || lowerQ.includes('hosil') ||
      lowerQ.includes('→') || lowerQ.includes('->') || lowerQ.includes('=')) {
    return solveReaction(question);
  }
  
  // Foiz/ulush
  if (lowerQ.includes('foiz') || lowerQ.includes('%') || 
      lowerQ.includes('ulush') || lowerQ.includes('tarkib')) {
    return solvePercent(question);
  }
  
  // Zarrachalar
  if (lowerQ.includes('zarracha') || lowerQ.includes('atom') ||
      lowerQ.includes('molekula') || lowerQ.includes('avogadro')) {
    return solveParticles(question);
  }
  
  // Elektroliz
  if (lowerQ.includes('elektroliz') || lowerQ.includes('faradey') ||
      lowerQ.includes('tok') && lowerQ.includes('vaqt')) {
    return solveElectrolysis(question);
  }
  
  // Element ma'lumotlari
  for (const [symbol, data] of Object.entries(elements)) {
    if (lowerQ.includes(data.name.toLowerCase()) || 
        (lowerQ.includes(symbol.toLowerCase()) && symbol.length >= 2)) {
      return solveElementInfo(question);
    }
  }
  
  // Formula bor - molyar massa
  const formula = findFormula(question);
  if (formula) {
    // Massadan mol tekshirish
    const massMatch = extractNumberWithUnit(question, ['g', 'gram', 'kg', 'mg']);
    if (massMatch) {
      return solveMassToMoles(question);
    }
    
    // Moldan massa
    const molMatch = lowerQ.match(/(\d+[.,]?\d*)\s*mol/);
    if (molMatch) {
      return solveMolesToMass(question);
    }
    
    // Faqat formula - molyar massa
    return solveMolarMass(question);
  }
  
  // Umumiy javob
  return formatAnswer({
    given: question,
    find: "Yechim",
    solution: `📝 KIMYOVIY HISOB-KITOBLAR:

Quyidagi masala turlarini yecha olaman:

🔹 Molyar massa: "H2SO4 molyar massasi"
🔹 Mol hisoblash: "10g NaCl da necha mol"
🔹 Massa hisoblash: "2 mol H2O massasi"
🔹 Gaz hajmi: "5g O2 hajmi (n.sh.)"
🔹 pH hisoblash: "0.01M HCl ning pH i"
🔹 Konsentratsiya: "4g NaOH 500ml da"
🔹 Reaksiya: "10g Zn + HCl dan qancha H2"
🔹 Foiz: "H2O da vodorod foizi"
🔹 Zarrachalar: "2g H2 da qancha molekula"
🔹 Elektroliz: "2A tok, 1 soat"
🔹 Element: "Kislorod haqida"

📌 KONSTANTALAR:
• Nₐ = 6.022 × 10²³ mol⁻¹
• Vₘ = 22.4 L/mol (n.sh.)
• R = 8.314 J/(mol·K)
• F = 96485 C/mol`,
    answer: "Savolni aniqroq yozing"
  });
}

// Javobni formatlash
function formatAnswer(data: { given: string; find: string; solution: string; answer: string; note?: string }): string {
  let result = `📋 BERILGAN:\n${data.given}\n\n`;
  result += `🎯 TOPISH KERAK:\n${data.find}\n\n`;
  result += `📝 YECHIM:\n${data.solution}\n\n`;
  result += `✅ JAVOB:\n${data.answer}`;
  
  if (data.note) {
    result += `\n\n💡 ESLATMA:\n${data.note}`;
  }
  
  return result;
}
