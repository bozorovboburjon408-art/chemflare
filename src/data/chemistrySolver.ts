import {
  elements,
  compounds,
  constants,
  formulas,
  parseFormula,
  calculateMolarMass,
  calculateMoles,
  calculateMass,
  calculateConcentration,
  calculatePH,
  calculatePOH,
  calculateGasVolume,
  calculateElectrolysisMass,
  identifyProblemType,
  extractNumbers,
  extractFormulas,
  type ChemistrySolution
} from './chemistryKnowledge';

// Asosiy masala yechuvchi funksiya
export function solveChemistryProblem(question: string): string {
  const lowerQ = question.toLowerCase();
  const numbers = extractNumbers(question);
  const foundFormulas = extractFormulas(question);
  const problemType = identifyProblemType(question);
  
  let solution = "";
  
  try {
    switch (problemType) {
      case 'molar_mass':
        solution = solveMolarMass(question, foundFormulas);
        break;
      case 'mole_calculation':
        solution = solveMoleCalculation(question, foundFormulas, numbers);
        break;
      case 'mass_calculation':
        solution = solveMassCalculation(question, foundFormulas, numbers);
        break;
      case 'concentration':
        solution = solveConcentration(question, numbers);
        break;
      case 'ph_calculation':
        solution = solvePHCalculation(question, numbers);
        break;
      case 'gas_volume':
        solution = solveGasVolume(question, foundFormulas, numbers);
        break;
      case 'electrolysis':
        solution = solveElectrolysis(question, numbers);
        break;
      case 'percent_calculation':
        solution = solvePercentCalculation(question, numbers);
        break;
      case 'reaction_balance':
        solution = solveReactionBalance(question, foundFormulas);
        break;
      case 'density':
        solution = solveDensity(question, numbers);
        break;
      default:
        solution = solveGeneral(question, foundFormulas, numbers);
    }
  } catch (error) {
    solution = solveGeneral(question, foundFormulas, numbers);
  }
  
  return solution;
}

// Molyar massa hisoblash
function solveMolarMass(question: string, formulas: string[]): string {
  if (formulas.length === 0) {
    return formatSolution({
      given: "Formula ko'rsatilmagan",
      find: "Molyar massa (M)",
      solution: `Molyar massani hisoblash uchun modda formulasi kerak.

📝 MOLYAR MASSA FORMULASI:
M = m₁ × n₁ + m₂ × n₂ + ...

Bu yerda:
• m - element atom massasi
• n - formuladagi atom soni

🔬 MISOL:
H₂O uchun:
M(H₂O) = 2 × 1 + 1 × 16 = 18 g/mol

H₂SO₄ uchun:
M(H₂SO₄) = 2 × 1 + 1 × 32 + 4 × 16 = 98 g/mol`,
      answer: "Formula kiriting va molyar massani hisoblang"
    });
  }
  
  const results: string[] = [];
  
  for (const formula of formulas) {
    const { mass, breakdown } = calculateMolarMass(formula);
    if (mass > 0) {
      results.push(`📌 ${formula} uchun:\n${breakdown}\n━━━━━━━━━━━━━━━━━\nM(${formula}) = ${mass} g/mol`);
    }
  }
  
  if (results.length === 0) {
    return formatSolution({
      given: `Formulalar: ${formulas.join(', ')}`,
      find: "Molyar massa (M)",
      solution: "Formulani to'g'ri kiritganingizni tekshiring. Masalan: H2O, NaCl, H2SO4",
      answer: "Formulani tekshiring"
    });
  }
  
  return formatSolution({
    given: `Formulalar: ${formulas.join(', ')}`,
    find: "Molyar massa (M)",
    solution: results.join('\n\n'),
    answer: `Molyar massalar hisoblandi`,
    note: "M = Σ(Ar × n) - atom massalari yig'indisi"
  });
}

// Mol soni hisoblash
function solveMoleCalculation(question: string, formulas: string[], numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  // Massadan mol hisoblash
  if (lowerQ.includes('g') || lowerQ.includes('gram') || lowerQ.includes('massa')) {
    if (formulas.length > 0 && numbers.length > 0) {
      const formula = formulas[0];
      const mass = numbers[0];
      const { mass: molarMass } = calculateMolarMass(formula);
      
      if (molarMass > 0) {
        const moles = calculateMoles(mass, molarMass);
        
        return formatSolution({
          given: `m(${formula}) = ${mass} g`,
          find: "n(mol soni) = ?",
          solution: `1️⃣ Molyar massani hisoblaymiz:
M(${formula}) = ${molarMass} g/mol

2️⃣ Mol sonini hisoblaymiz:
n = m / M
n = ${mass} / ${molarMass}
n = ${moles.toFixed(4)} mol`,
          answer: `n(${formula}) = ${moles.toFixed(4)} mol ≈ ${moles.toFixed(2)} mol`,
          note: "n = m/M formulasidan foydalandik"
        });
      }
    }
  }
  
  // Zarrachalar sonidan mol
  if (lowerQ.includes('zarracha') || lowerQ.includes('atom') || lowerQ.includes('molekula') || lowerQ.includes('10^') || lowerQ.includes('×10')) {
    // Katta sonlarni qidirish
    const bigNumberMatch = question.match(/(\d+[.,]?\d*)\s*[×x·]\s*10\^?(\d+)/i);
    if (bigNumberMatch) {
      const coefficient = parseFloat(bigNumberMatch[1].replace(',', '.'));
      const exponent = parseInt(bigNumberMatch[2]);
      const particleCount = coefficient * Math.pow(10, exponent);
      const moles = particleCount / 6.022e23;
      
      return formatSolution({
        given: `N = ${coefficient} × 10²³ ta zarracha`,
        find: "n(mol) = ?",
        solution: `Avogadro soni: Nₐ = 6.022 × 10²³ mol⁻¹

n = N / Nₐ
n = (${coefficient} × 10^${exponent}) / (6.022 × 10²³)
n = ${moles.toFixed(4)} mol`,
        answer: `n = ${moles.toFixed(4)} mol ≈ ${moles.toFixed(2)} mol`,
        note: "n = N/Nₐ formulasidan foydalandik"
      });
    }
  }
  
  // Hajmdan mol (gaz uchun)
  if (lowerQ.includes('litr') || lowerQ.includes('l') || lowerQ.includes('hajm')) {
    if (numbers.length > 0) {
      const volume = numbers[0];
      const moles = volume / 22.4;
      
      return formatSolution({
        given: `V = ${volume} L (normal sharoitda)`,
        find: "n(mol) = ?",
        solution: `Normal sharoitda (0°C, 1 atm) 1 mol gaz 22.4 L hajm egallaydi.

n = V / Vₘ
n = ${volume} / 22.4
n = ${moles.toFixed(4)} mol`,
        answer: `n = ${moles.toFixed(4)} mol ≈ ${moles.toFixed(2)} mol`,
        note: "n = V/Vₘ (Vₘ = 22.4 L/mol normal sharoitda)"
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "Mol soni (n)",
    solution: `📝 MOL SONINI HISOBLASH FORMULALARI:

1️⃣ Massadan: n = m / M
   m - massa (g), M - molyar massa (g/mol)

2️⃣ Zarrachalar sonidan: n = N / Nₐ
   N - zarrachalar soni, Nₐ = 6.022 × 10²³

3️⃣ Gaz hajmidan (n.sh.): n = V / 22.4
   V - hajm (L), 22.4 L/mol - molar hajm

4️⃣ Konsentratsiyadan: n = C × V
   C - konsentratsiya (mol/L), V - hajm (L)`,
    answer: "Kerakli ma'lumotlarni kiriting"
  });
}

// Massa hisoblash
function solveMassCalculation(question: string, formulas: string[], numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  // Reaksiya bo'yicha massa hisoblash
  if (lowerQ.includes('reaksiya') || lowerQ.includes('hosil') || lowerQ.includes('→') || lowerQ.includes('->')) {
    return solveReactionMass(question, formulas, numbers);
  }
  
  // Mol sonidan massa
  if ((lowerQ.includes('mol') && numbers.length > 0 && formulas.length > 0)) {
    const formula = formulas[0];
    const moles = numbers[0];
    const { mass: molarMass } = calculateMolarMass(formula);
    
    if (molarMass > 0) {
      const mass = calculateMass(moles, molarMass);
      
      return formatSolution({
        given: `n(${formula}) = ${moles} mol`,
        find: "m(massa) = ?",
        solution: `1️⃣ Molyar massani hisoblaymiz:
M(${formula}) = ${molarMass} g/mol

2️⃣ Massani hisoblaymiz:
m = n × M
m = ${moles} × ${molarMass}
m = ${mass.toFixed(3)} g`,
        answer: `m(${formula}) = ${mass.toFixed(3)} g`,
        note: "m = n × M formulasidan foydalandik"
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "Massa (m)",
    solution: `📝 MASSA HISOBLASH FORMULALARI:

1️⃣ Mol sonidan: m = n × M
   n - mol soni, M - molyar massa (g/mol)

2️⃣ Zichlikdan: m = ρ × V
   ρ - zichlik (g/mL), V - hajm (mL)

3️⃣ Massa ulushidan: m = ω × m(eritma) / 100
   ω - massa ulushi (%)`,
    answer: "Kerakli ma'lumotlarni kiriting"
  });
}

// Reaksiya bo'yicha massa hisoblash
function solveReactionMass(question: string, formulas: string[], numbers: number[]): string {
  // Mashhur reaksiyalar
  const reactions: Record<string, { equation: string; reactants: string[]; products: string[]; coefficients: number[] }> = {
    "H2+O2": {
      equation: "2H₂ + O₂ → 2H₂O",
      reactants: ["H2", "O2"],
      products: ["H2O"],
      coefficients: [2, 1, 2]
    },
    "Na+Cl2": {
      equation: "2Na + Cl₂ → 2NaCl",
      reactants: ["Na", "Cl2"],
      products: ["NaCl"],
      coefficients: [2, 1, 2]
    },
    "Zn+HCl": {
      equation: "Zn + 2HCl → ZnCl₂ + H₂",
      reactants: ["Zn", "HCl"],
      products: ["ZnCl2", "H2"],
      coefficients: [1, 2, 1, 1]
    },
    "Fe+O2": {
      equation: "4Fe + 3O₂ → 2Fe₂O₃",
      reactants: ["Fe", "O2"],
      products: ["Fe2O3"],
      coefficients: [4, 3, 2]
    },
    "CaCO3": {
      equation: "CaCO₃ → CaO + CO₂",
      reactants: ["CaCO3"],
      products: ["CaO", "CO2"],
      coefficients: [1, 1, 1]
    },
    "CH4+O2": {
      equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      reactants: ["CH4", "O2"],
      products: ["CO2", "H2O"],
      coefficients: [1, 2, 1, 2]
    },
    "NaOH+HCl": {
      equation: "NaOH + HCl → NaCl + H₂O",
      reactants: ["NaOH", "HCl"],
      products: ["NaCl", "H2O"],
      coefficients: [1, 1, 1, 1]
    },
    "Mg+HCl": {
      equation: "Mg + 2HCl → MgCl₂ + H₂",
      reactants: ["Mg", "HCl"],
      products: ["MgCl2", "H2"],
      coefficients: [1, 2, 1, 1]
    },
    "Al+O2": {
      equation: "4Al + 3O₂ → 2Al₂O₃",
      reactants: ["Al", "O2"],
      products: ["Al2O3"],
      coefficients: [4, 3, 2]
    },
    "C+O2": {
      equation: "C + O₂ → CO₂",
      reactants: ["C", "O2"],
      products: ["CO2"],
      coefficients: [1, 1, 1]
    },
    "S+O2": {
      equation: "S + O₂ → SO₂",
      reactants: ["S", "O2"],
      products: ["SO2"],
      coefficients: [1, 1, 1]
    },
    "N2+H2": {
      equation: "N₂ + 3H₂ ⇌ 2NH₃",
      reactants: ["N2", "H2"],
      products: ["NH3"],
      coefficients: [1, 3, 2]
    },
    "Cu+O2": {
      equation: "2Cu + O₂ → 2CuO",
      reactants: ["Cu", "O2"],
      products: ["CuO"],
      coefficients: [2, 1, 2]
    },
    "Zn+H2SO4": {
      equation: "Zn + H₂SO₄ → ZnSO₄ + H₂",
      reactants: ["Zn", "H2SO4"],
      products: ["ZnSO4", "H2"],
      coefficients: [1, 1, 1, 1]
    },
    "Fe+HCl": {
      equation: "Fe + 2HCl → FeCl₂ + H₂",
      reactants: ["Fe", "HCl"],
      products: ["FeCl2", "H2"],
      coefficients: [1, 2, 1, 1]
    },
    "CaO+H2O": {
      equation: "CaO + H₂O → Ca(OH)₂",
      reactants: ["CaO", "H2O"],
      products: ["Ca(OH)2"],
      coefficients: [1, 1, 1]
    },
    "Na2CO3+HCl": {
      equation: "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂",
      reactants: ["Na2CO3", "HCl"],
      products: ["NaCl", "H2O", "CO2"],
      coefficients: [1, 2, 2, 1, 1]
    }
  };
  
  // Formulalarni tekshirish
  if (formulas.length >= 1 && numbers.length >= 1) {
    const givenFormula = formulas[0];
    const givenMass = numbers[0];
    const { mass: givenMolarMass } = calculateMolarMass(givenFormula);
    
    if (givenMolarMass > 0) {
      const givenMoles = givenMass / givenMolarMass;
      
      // Agar ikkinchi formula bor bo'lsa
      if (formulas.length >= 2) {
        const targetFormula = formulas[1];
        const { mass: targetMolarMass } = calculateMolarMass(targetFormula);
        
        if (targetMolarMass > 0) {
          // Koeffitsientlarni topish (oddiy holat - 1:1)
          const targetMoles = givenMoles; // Oddiy holat
          const targetMass = targetMoles * targetMolarMass;
          
          return formatSolution({
            given: `m(${givenFormula}) = ${givenMass} g`,
            find: `m(${targetFormula}) = ?`,
            solution: `1️⃣ Berilgan moddaning molyar massasi:
M(${givenFormula}) = ${givenMolarMass} g/mol

2️⃣ Mol sonini hisoblaymiz:
n(${givenFormula}) = m / M = ${givenMass} / ${givenMolarMass} = ${givenMoles.toFixed(4)} mol

3️⃣ Maqsad moddaning molyar massasi:
M(${targetFormula}) = ${targetMolarMass} g/mol

4️⃣ Reaksiya tenglamasidan (1:1 nisbatda):
n(${targetFormula}) = n(${givenFormula}) = ${givenMoles.toFixed(4)} mol

5️⃣ Maqsad modda massasi:
m(${targetFormula}) = n × M = ${givenMoles.toFixed(4)} × ${targetMolarMass} = ${targetMass.toFixed(3)} g`,
            answer: `m(${targetFormula}) = ${targetMass.toFixed(3)} g`,
            note: "Koeffitsientlar 1:1 deb qabul qilindi. Haqiqiy reaksiyada koeffitsientlarni tekshiring!"
          });
        }
      }
      
      // Umumiy yechim
      return formatSolution({
        given: `m(${givenFormula}) = ${givenMass} g`,
        find: "Hosil bo'ladigan modda massasi",
        solution: `1️⃣ Berilgan moddaning molyar massasi:
M(${givenFormula}) = ${givenMolarMass} g/mol

2️⃣ Mol sonini hisoblaymiz:
n(${givenFormula}) = m / M = ${givenMass} / ${givenMolarMass} = ${givenMoles.toFixed(4)} mol

📝 KEYINGI QADAM:
Reaksiya tenglamasidagi koeffitsientlarga qarab hosil bo'ladigan modda mol sonini toping.

Masalan:
2H₂ + O₂ → 2H₂O reaksiyasida:
• 2 mol H₂ dan 2 mol H₂O hosil bo'ladi (nisbat 1:1)
• 1 mol O₂ dan 2 mol H₂O hosil bo'ladi (nisbat 1:2)`,
        answer: `n(${givenFormula}) = ${givenMoles.toFixed(4)} mol`
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "Reaksiya bo'yicha massa",
    solution: `📝 REAKSIYA BO'YICHA HISOBLASH:

1. Berilgan modda mol sonini toping: n = m/M
2. Reaksiya koeffitsientlari bo'yicha kerakli modda mol sonini toping
3. Massani hisoblang: m = n × M

⚗️ MASHHUR REAKSIYALAR:
• 2H₂ + O₂ → 2H₂O
• Zn + 2HCl → ZnCl₂ + H₂
• CaCO₃ → CaO + CO₂
• NaOH + HCl → NaCl + H₂O
• N₂ + 3H₂ ⇌ 2NH₃`,
    answer: "Modda formulasi va massasini kiriting"
  });
}

// Konsentratsiya hisoblash
function solveConcentration(question: string, numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  if (numbers.length >= 2) {
    // Mol va hajm berilgan
    if (lowerQ.includes('mol') && (lowerQ.includes('litr') || lowerQ.includes('l'))) {
      const moles = numbers[0];
      const volume = numbers[1];
      const concentration = moles / volume;
      
      return formatSolution({
        given: `n = ${moles} mol, V = ${volume} L`,
        find: "C (konsentratsiya) = ?",
        solution: `Molyar konsentratsiya formulasi:
C = n / V

C = ${moles} / ${volume}
C = ${concentration.toFixed(4)} mol/L`,
        answer: `C = ${concentration.toFixed(4)} mol/L ≈ ${concentration.toFixed(2)} M`,
        note: "M = mol/L (molyarlik)"
      });
    }
    
    // Massa va hajm berilgan
    if ((lowerQ.includes('g') || lowerQ.includes('gram')) && (lowerQ.includes('ml') || lowerQ.includes('l'))) {
      return formatSolution({
        given: `Massa va hajm berilgan`,
        find: "Konsentratsiya",
        solution: `Konsentratsiya hisoblash:

1️⃣ Molyar konsentratsiya:
C = n/V = m/(M × V)

2️⃣ Massa ulushi (foiz):
ω = (m₁/m₂) × 100%

3️⃣ Molal konsentratsiya:
Cm = n / m(erituvchi, kg)`,
        answer: "Ma'lumotlarni aniqroq kiriting"
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "Konsentratsiya",
    solution: `📝 KONSENTRATSIYA TURLARI:

1️⃣ MOLYAR (C, M):
C = n/V (mol/L)

2️⃣ MASSA ULUSHI (ω):
ω = m(erigan)/m(eritma) × 100%

3️⃣ MOLAL (Cm):
Cm = n(erigan)/m(erituvchi, kg)

4️⃣ MOL ULUSHI (χ):
χ = n₁/(n₁ + n₂)

🔬 SUYULTIRISH:
C₁V₁ = C₂V₂`,
    answer: "Mol soni va hajm kiriting"
  });
}

// pH hisoblash
function solvePHCalculation(question: string, numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  if (numbers.length > 0) {
    const value = numbers[0];
    
    // Konsentratsiyadan pH
    if (lowerQ.includes('mol') || lowerQ.includes('m') || lowerQ.includes('konsentratsiya')) {
      if (lowerQ.includes('kislota') || lowerQ.includes('h+') || lowerQ.includes('hcl') || lowerQ.includes('h2so4')) {
        const pH = -Math.log10(value);
        const pOH = 14 - pH;
        
        return formatSolution({
          given: `[H⁺] = ${value} mol/L`,
          find: "pH = ?",
          solution: `pH = -log[H⁺]
pH = -log(${value})
pH = ${pH.toFixed(2)}

pOH = 14 - pH = 14 - ${pH.toFixed(2)} = ${pOH.toFixed(2)}`,
          answer: `pH = ${pH.toFixed(2)}`,
          note: `pH < 7 - kislotali muhit, pH = 7 - neytral, pH > 7 - ishqoriy muhit`
        });
      }
      
      if (lowerQ.includes('ishqor') || lowerQ.includes('oh') || lowerQ.includes('naoh') || lowerQ.includes('koh')) {
        const pOH = -Math.log10(value);
        const pH = 14 - pOH;
        
        return formatSolution({
          given: `[OH⁻] = ${value} mol/L`,
          find: "pH = ?",
          solution: `pOH = -log[OH⁻]
pOH = -log(${value})
pOH = ${pOH.toFixed(2)}

pH = 14 - pOH = 14 - ${pOH.toFixed(2)} = ${pH.toFixed(2)}`,
          answer: `pH = ${pH.toFixed(2)}`,
          note: `pH + pOH = 14 (25°C da)`
        });
      }
    }
    
    // pH dan konsentratsiya
    if (lowerQ.includes('ph') && value >= 0 && value <= 14) {
      const hConc = Math.pow(10, -value);
      const ohConc = Math.pow(10, -(14 - value));
      
      return formatSolution({
        given: `pH = ${value}`,
        find: "[H⁺] = ?, [OH⁻] = ?",
        solution: `[H⁺] = 10^(-pH)
[H⁺] = 10^(-${value})
[H⁺] = ${hConc.toExponential(2)} mol/L

[OH⁻] = 10^(-pOH) = 10^(-(14-pH))
[OH⁻] = 10^(-${14 - value})
[OH⁻] = ${ohConc.toExponential(2)} mol/L`,
        answer: `[H⁺] = ${hConc.toExponential(2)} mol/L, [OH⁻] = ${ohConc.toExponential(2)} mol/L`,
        note: "[H⁺] × [OH⁻] = 10⁻¹⁴ (suv ion ko'paytmasi)"
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "pH yoki pOH",
    solution: `📝 pH HISOBLASH:

1️⃣ pH = -log[H⁺]
2️⃣ pOH = -log[OH⁻]
3️⃣ pH + pOH = 14 (25°C da)
4️⃣ [H⁺] = 10^(-pH)
5️⃣ [OH⁻] = 10^(-pOH)

📊 pH SHKALA:
• pH = 0-3: Kuchli kislota
• pH = 3-6: Kuchsiz kislota
• pH = 7: Neytral
• pH = 8-11: Kuchsiz ishqor
• pH = 11-14: Kuchli ishqor`,
    answer: "Konsentratsiya yoki pH qiymatini kiriting"
  });
}

// Gaz hajmi hisoblash
function solveGasVolume(question: string, formulas: string[], numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  // Massadan hajm
  if (numbers.length > 0 && formulas.length > 0) {
    const formula = formulas[0];
    const { mass: molarMass } = calculateMolarMass(formula);
    
    if (molarMass > 0) {
      const mass = numbers[0];
      const moles = mass / molarMass;
      const volume = moles * 22.4;
      
      return formatSolution({
        given: `m(${formula}) = ${mass} g`,
        find: "V (hajm, n.sh.) = ?",
        solution: `1️⃣ Molyar massa:
M(${formula}) = ${molarMass} g/mol

2️⃣ Mol soni:
n = m/M = ${mass}/${molarMass} = ${moles.toFixed(4)} mol

3️⃣ Hajm (normal sharoitda):
V = n × Vₘ = ${moles.toFixed(4)} × 22.4 = ${volume.toFixed(3)} L`,
        answer: `V(${formula}) = ${volume.toFixed(3)} L (n.sh.)`,
        note: "Normal sharoit: 0°C (273 K), 1 atm (101.325 kPa)"
      });
    }
  }
  
  // Mol sonidan hajm
  if (numbers.length > 0 && lowerQ.includes('mol')) {
    const moles = numbers[0];
    const volume = moles * 22.4;
    
    return formatSolution({
      given: `n = ${moles} mol`,
      find: "V (hajm, n.sh.) = ?",
      solution: `Normal sharoitda 1 mol gazning hajmi 22.4 L

V = n × Vₘ
V = ${moles} × 22.4
V = ${volume.toFixed(3)} L`,
      answer: `V = ${volume.toFixed(3)} L`,
      note: "Vₘ = 22.4 L/mol (normal sharoitda)"
    });
  }
  
  return formatSolution({
    given: question,
    find: "Gaz hajmi",
    solution: `📝 GAZ HAJMI FORMULALARI:

1️⃣ Normal sharoitda (0°C, 1 atm):
V = n × 22.4 L

2️⃣ Ideal gaz tenglamasi:
PV = nRT
V = nRT/P

Bu yerda:
• P - bosim (Pa)
• V - hajm (L)
• n - mol soni
• R = 8.314 J/(mol·K)
• T - harorat (K)

3️⃣ Standart sharoit (25°C, 1 atm):
Vₘ ≈ 24.5 L/mol`,
    answer: "Mol soni yoki massani kiriting"
  });
}

// Elektroliz hisoblash
function solveElectrolysis(question: string, numbers: number[]): string {
  if (numbers.length >= 2) {
    // Tok kuchi va vaqt berilgan
    const current = numbers[0];
    const time = numbers[1];
    const charge = current * time;
    const faraday = 96485;
    
    return formatSolution({
      given: `I = ${current} A, t = ${time} s`,
      find: "Ajralgan modda massasi = ?",
      solution: `Faradey qonuni:
m = (M × I × t) / (n × F)

Bu yerda:
• M - molyar massa (g/mol)
• I = ${current} A (tok kuchi)
• t = ${time} s (vaqt)
• n - elektron soni
• F = 96485 C/mol (Faradey soni)

O'tgan zaryad:
Q = I × t = ${current} × ${time} = ${charge} C

Elektron mol soni:
nₑ = Q/F = ${charge}/${faraday} = ${(charge / faraday).toFixed(4)} mol`,
      answer: `Q = ${charge} C, nₑ = ${(charge / faraday).toFixed(4)} mol`,
      note: "Massani hisoblash uchun modda formulasini kiriting"
    });
  }
  
  return formatSolution({
    given: question,
    find: "Elektroliz hisobi",
    solution: `📝 FARADEY QONUNLARI:

1️⃣ Birinchi qonun:
m = k × Q = k × I × t

2️⃣ Ikkinchi qonun:
m = (M × I × t) / (n × F)

Bu yerda:
• m - ajralgan modda massasi (g)
• M - molyar massa (g/mol)
• I - tok kuchi (A)
• t - vaqt (s)
• n - elektron soni
• F = 96485 C/mol

⚗️ ELEKTRODLARDA:
Katod (-): Qaytarilish (Me⁺ⁿ + ne⁻ → Me)
Anod (+): Oksidlanish (2X⁻ - 2e⁻ → X₂)`,
    answer: "Tok kuchi va vaqtni kiriting"
  });
}

// Foiz hisoblash
function solvePercentCalculation(question: string, numbers: number[]): string {
  if (numbers.length >= 2) {
    const part = numbers[0];
    const total = numbers[1];
    const percent = (part / total) * 100;
    
    return formatSolution({
      given: `Qism = ${part}, Butun = ${total}`,
      find: "Foiz = ?",
      solution: `Foiz formulasi:
% = (qism / butun) × 100

% = (${part} / ${total}) × 100
% = ${percent.toFixed(2)}%`,
      answer: `${percent.toFixed(2)}%`,
      note: "ω = m₁/m₂ × 100% (massa ulushi)"
    });
  }
  
  return formatSolution({
    given: question,
    find: "Foiz (%) yoki massa ulushi (ω)",
    solution: `📝 FOIZ HISOBLASH:

1️⃣ Massa ulushi:
ω = (m₁ / m₂) × 100%
m₁ - erigan modda, m₂ - eritma

2️⃣ Elementning massa ulushi:
ω(E) = (n × Ar) / M × 100%
n - atom soni, Ar - atom massa, M - molyar massa

3️⃣ Chiqim (hosildorlik):
η = (m(haqiqiy) / m(nazariy)) × 100%`,
    answer: "Sonlarni kiriting"
  });
}

// Reaksiya tenglamasini tekshirish
function solveReactionBalance(question: string, formulas: string[]): string {
  return formatSolution({
    given: question,
    find: "Reaksiya tenglamasi",
    solution: `📝 REAKSIYA TENGLAMASINI TENGLASHTIRISH:

⚗️ QOIDALAR:
1. Har bir element atomlari soni ikkala tomonda teng bo'lishi kerak
2. Zaryad muvozanati saqlanishi kerak
3. Massa saqlanish qonuniga bo'ysunadi

📊 REAKSIYA TURLARI:
• Sintez: A + B → AB
• Parchalanish: AB → A + B
• Almashtirish: A + BC → AC + B
• Ikki tomonlama: AB + CD → AD + CB
• Oksidlanish-qaytarilish (redoks)

🔬 MISOL:
Fe + O₂ → Fe₂O₃
Tenglashtirish: 4Fe + 3O₂ → 2Fe₂O₃`,
    answer: "Reaksiya tenglamasini kiriting"
  });
}

// Zichlik hisoblash
function solveDensity(question: string, numbers: number[]): string {
  if (numbers.length >= 2) {
    const mass = numbers[0];
    const volume = numbers[1];
    const density = mass / volume;
    
    return formatSolution({
      given: `m = ${mass} g, V = ${volume} mL`,
      find: "ρ (zichlik) = ?",
      solution: `Zichlik formulasi:
ρ = m / V

ρ = ${mass} / ${volume}
ρ = ${density.toFixed(4)} g/mL`,
      answer: `ρ = ${density.toFixed(4)} g/mL`,
      note: "1 g/mL = 1 kg/L = 1000 kg/m³"
    });
  }
  
  return formatSolution({
    given: question,
    find: "Zichlik (ρ)",
    solution: `📝 ZICHLIK FORMULASI:

ρ = m / V

• ρ - zichlik (g/mL, kg/L, kg/m³)
• m - massa (g, kg)
• V - hajm (mL, L, m³)

📊 BA'ZI MODDALAR ZICHLIGI:
• Suv: 1.0 g/mL
• Etanol: 0.789 g/mL
• Simob: 13.6 g/mL
• Oltin: 19.3 g/cm³
• Havo: 1.29 g/L (n.sh.)`,
    answer: "Massa va hajmni kiriting"
  });
}

// Umumiy masalalar
function solveGeneral(question: string, formulas: string[], numbers: number[]): string {
  const lowerQ = question.toLowerCase();
  
  // Element haqida ma'lumot
  for (const [symbol, data] of Object.entries(elements)) {
    if (lowerQ.includes(data.name.toLowerCase()) || lowerQ.includes(symbol.toLowerCase())) {
      return formatSolution({
        given: `Element: ${data.name} (${symbol})`,
        find: "Element haqida ma'lumot",
        solution: `📊 ${data.name.toUpperCase()} (${symbol})

• Atom raqami: ${data.number}
• Atom massasi: ${data.mass} a.b.
• Guruh: ${data.group}

⚛️ ELEKTRON KONFIGURATSIYASI:
Element ${data.number}-elementdir.`,
        answer: `Ar(${symbol}) = ${data.mass}`
      });
    }
  }
  
  // Birikma haqida ma'lumot
  for (const [formula, data] of Object.entries(compounds)) {
    const cleanFormula = formula.toLowerCase().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => {
      const map: Record<string, string> = {'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9'};
      return map[m] || m;
    });
    if (lowerQ.includes(cleanFormula) || lowerQ.includes(data.name.toLowerCase())) {
      return formatSolution({
        given: `Birikma: ${data.name} (${data.formula})`,
        find: "Birikma haqida ma'lumot",
        solution: `📊 ${data.name.toUpperCase()}

• Formula: ${data.formula}
• Molyar massa: ${data.molarMass} g/mol
• Turi: ${data.type}`,
        answer: `M(${data.formula}) = ${data.molarMass} g/mol`
      });
    }
  }
  
  // Formulalar haqida ma'lumot
  if (formulas.length > 0) {
    const results: string[] = [];
    for (const formula of formulas) {
      const { mass, breakdown } = calculateMolarMass(formula);
      if (mass > 0) {
        results.push(`📌 ${formula}:\n${breakdown}\nM = ${mass} g/mol`);
      }
    }
    
    if (results.length > 0) {
      return formatSolution({
        given: `Formulalar: ${formulas.join(', ')}`,
        find: "Ma'lumotlar",
        solution: results.join('\n\n'),
        answer: "Molyar massalar hisoblandi"
      });
    }
  }
  
  return formatSolution({
    given: question,
    find: "Yechim",
    solution: `📝 KIMYOVIY HISOB-KITOBLAR:

🔬 ASOSIY FORMULALAR:
• n = m/M (mol soni)
• m = n × M (massa)
• V = n × 22.4 (gaz hajmi, n.sh.)
• C = n/V (konsentratsiya)
• pH = -log[H⁺]

📊 KONSTANTALAR:
• Nₐ = 6.022 × 10²³ mol⁻¹
• Vₘ = 22.4 L/mol (n.sh.)
• R = 8.314 J/(mol·K)
• F = 96485 C/mol

Savolingizni aniqroq yozing yoki formula kiriting.`,
    answer: "Masalani batafsil kiriting"
  });
}

// Yechimni formatlash
function formatSolution(sol: ChemistrySolution): string {
  let result = "";
  
  result += `📋 BERILGAN:\n${sol.given}\n\n`;
  result += `🎯 TOPISH KERAK:\n${sol.find}\n\n`;
  result += `📝 YECHIM:\n${sol.solution}\n\n`;
  result += `✅ JAVOB:\n${sol.answer}`;
  
  if (sol.note) {
    result += `\n\n💡 ESLATMA:\n${sol.note}`;
  }
  
  return result;
}
