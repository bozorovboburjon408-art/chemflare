export interface Element {
  symbol: string;
  name: string;
  nameUz: string;
  atomicNumber: number;
  atomicMass: string;
  category: string;
  electrons: string;
  description: string;
  detailedInfo?: string;
  discoveryYear?: string;
  discoveredBy?: string;
  meltingPoint?: string;
  boilingPoint?: string;
  density?: string;
  electronegativity?: string;
  atomicRadius?: string;
  ionizationEnergy?: string;
  oxidationStates?: string;
  crystalStructure?: string;
  magneticOrdering?: string;
  thermalConductivity?: string;
  electricalResistivity?: string;
  abundance?: string;
  isotopeCount?: number;
  stableIsotopes?: string;
  halfLife?: string;
  electronAffinity?: string;
  valencElectrons?: number;
  period?: number;
  group?: number;
  block?: string;
  state?: string;
  color?: string;
  origin?: string;
  uses?: string[];
  hazards?: string;
  naturalOccurrence?: string;
  covalentRadius?: string;
  vanDerWaalsRadius?: string;
}

export const elements: Element[] = [
  // Period 1
  { 
    symbol: "H", name: "Hydrogen", nameUz: "Vodorod", atomicNumber: 1, atomicMass: "1.008", category: "nonmetal", electrons: "1", 
    description: "Eng yengil element, yulduzlarda ko'p uchraydi", 
    detailedInfo: "Koinotdagi eng ko'p tarqalgan element. Suv (H₂O), ammiakli (NH₃) va barcha organik birikmalar tarkibida mavjud.",
    discoveryYear: "1766", discoveredBy: "Genri Kavendish", meltingPoint: "-259.14°C", boilingPoint: "-252.87°C",
    density: "0.00008988 g/cm³", electronegativity: "2.20", atomicRadius: "53 pm", ionizationEnergy: "1312 kJ/mol",
    oxidationStates: "-1, +1", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "0.1805 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Koinot: 75%, Yer qobig'i: 0.14%", isotopeCount: 7, stableIsotopes: "H-1, H-2",
    halfLife: "Barqaror", electronAffinity: "72.8 kJ/mol", valencElectrons: 1, period: 1, group: 1, block: "s",
    state: "Gaz", color: "Rangsiz", origin: "Primitiv (Big Bang)", 
    uses: ["Yonilg'i hujayralari", "Ammiak ishlab chiqarish", "Raketalar yonilg'isi", "Neft qayta ishlash", "Suyultirilgan gaz"],
    hazards: "Juda yonuvchan, portlovchi", naturalOccurrence: "Suv, organik moddalar", covalentRadius: "31 pm", vanDerWaalsRadius: "120 pm"
  },
  { 
    symbol: "He", name: "Helium", nameUz: "Geliy", atomicNumber: 2, atomicMass: "4.003", category: "noble", electrons: "2", 
    description: "Inert gaz, havodagi sharlar uchun ishlatiladi", 
    detailedInfo: "Eng yengil inert gaz. Kriyogen texnologiyada, kemiruvchi sharlar va MRI skanerlarida ishlatiladi.",
    discoveryYear: "1868", discoveredBy: "Per Yanssen, Jozef Loker", meltingPoint: "-272.20°C (bosim ostida)", boilingPoint: "-268.93°C",
    density: "0.0001785 g/cm³", electronegativity: "Yo'q", atomicRadius: "31 pm", ionizationEnergy: "2372 kJ/mol",
    oxidationStates: "0", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "0.1513 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Koinot: 23%, Yer atmosferasi: 0.0005%", isotopeCount: 9, stableIsotopes: "He-3, He-4",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 0, period: 1, group: 18, block: "s",
    state: "Gaz", color: "Rangsiz", origin: "Primitiv (Big Bang)", 
    uses: ["Sharlar va dirijabllar", "MRI sovutish", "Sho'ng'uvchilar nafas aralashmasi", "Lazerlar", "Yadro reaktorlar"],
    hazards: "Bo'g'ilish xavfi (havo o'rnini bosadi)", naturalOccurrence: "Tabiiy gaz konlari", covalentRadius: "28 pm", vanDerWaalsRadius: "140 pm"
  },
  
  // Period 2
  { 
    symbol: "Li", name: "Lithium", nameUz: "Litiy", atomicNumber: 3, atomicMass: "6.941", category: "alkali", electrons: "2,1", 
    description: "Eng yengil metall, batareyalarda ishlatiladi", 
    detailedInfo: "Li-ion batareyalar uchun asosiy material. Psixiatriyada dori sifatida va shisha ishlab chiqarishda qo'llaniladi.",
    discoveryYear: "1817", discoveredBy: "Yoxan Arfvedson", meltingPoint: "180.5°C", boilingPoint: "1342°C",
    density: "0.534 g/cm³", electronegativity: "0.98", atomicRadius: "167 pm", ionizationEnergy: "520.2 kJ/mol",
    oxidationStates: "+1", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "84.8 W/(m·K)",
    electricalResistivity: "92.8 nΩ·m", abundance: "Yer qobig'i: 20 ppm", isotopeCount: 7, stableIsotopes: "Li-6, Li-7",
    halfLife: "Barqaror", electronAffinity: "59.6 kJ/mol", valencElectrons: 1, period: 2, group: 1, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Big Bang va kosmik nurlar", 
    uses: ["Li-ion batareyalar", "Psixiatrik dorilar", "Qotishmalar", "Shisha va keramika", "Yadro reaktorlar"],
    hazards: "Yonuvchan, suv bilan reaktiv", naturalOccurrence: "Minerallar (spodumen, lepidolit)", covalentRadius: "128 pm", vanDerWaalsRadius: "182 pm"
  },
  { 
    symbol: "Be", name: "Beryllium", nameUz: "Berilliy", atomicNumber: 4, atomicMass: "9.012", category: "alkaline", electrons: "2,2", 
    description: "Qattiq va yengil metall", 
    detailedInfo: "Kosmik texnologiyada, rentgen apparatlarida va yuqori aniqlikdagi asboblarda ishlatiladi.",
    discoveryYear: "1798", discoveredBy: "Lui Vokel", meltingPoint: "1287°C", boilingPoint: "2471°C",
    density: "1.85 g/cm³", electronegativity: "1.57", atomicRadius: "112 pm", ionizationEnergy: "899.5 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "200 W/(m·K)",
    electricalResistivity: "36 nΩ·m", abundance: "Yer qobig'i: 2.8 ppm", isotopeCount: 12, stableIsotopes: "Be-9",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 2, period: 2, group: 2, block: "s",
    state: "Qattiq", color: "Kulrang-oq", origin: "Kosmik nurlar parchalanishi", 
    uses: ["Kosmik oynalar", "Rentgen oynalari", "Yadro reaktorlar", "Qotishmalar", "Elektr kontaktlar"],
    hazards: "Zaharli chang, saraton keltirib chiqaruvchi", naturalOccurrence: "Berill, xrizobberill minerallari", covalentRadius: "96 pm", vanDerWaalsRadius: "153 pm"
  },
  { 
    symbol: "B", name: "Boron", nameUz: "Bor", atomicNumber: 5, atomicMass: "10.81", category: "metalloid", electrons: "2,3", 
    description: "Yarim o'tkazgich xususiyatlariga ega", 
    detailedInfo: "Shisha tolali materiallar, yuvish vositalari va yadro reaktorlarida ishlatiladi.",
    discoveryYear: "1808", discoveredBy: "Lui Gay-Lyussak va Gemfri Devi", meltingPoint: "2076°C", boilingPoint: "3927°C",
    density: "2.34 g/cm³", electronegativity: "2.04", atomicRadius: "87 pm", ionizationEnergy: "800.6 kJ/mol",
    oxidationStates: "+3", crystalStructure: "Romboedr", magneticOrdering: "Diamagnetik", thermalConductivity: "27.4 W/(m·K)",
    electricalResistivity: "10000 Ω·m", abundance: "Yer qobig'i: 10 ppm", isotopeCount: 14, stableIsotopes: "B-10, B-11",
    halfLife: "Barqaror", electronAffinity: "26.7 kJ/mol", valencElectrons: 3, period: 2, group: 13, block: "p",
    state: "Qattiq", color: "Qora", origin: "Kosmik nurlar parchalanishi", 
    uses: ["Borosilikat shisha", "Yuvish kukunlari", "Yadro reaktorlar", "Abraziv materiallar", "Shisha tolalar"],
    hazards: "O'rta darajada zaharli", naturalOccurrence: "Boraks, kernit minerallari", covalentRadius: "84 pm", vanDerWaalsRadius: "192 pm"
  },
  { 
    symbol: "C", name: "Carbon", nameUz: "Uglerod", atomicNumber: 6, atomicMass: "12.01", category: "nonmetal", electrons: "2,4", 
    description: "Hayot asosi, organik birikmalar tuzilishi", 
    detailedInfo: "Barcha organik moddalar asosi. Olmoslar, grafit, ko'mir va fulleren shakllarda mavjud. DNK, oqsillar va yog'lar tarkibida.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "3550°C (sublimatsiya)", boilingPoint: "4027°C (sublimatsiya)",
    density: "2.267 g/cm³ (grafit)", electronegativity: "2.55", atomicRadius: "77 pm", ionizationEnergy: "1086.5 kJ/mol",
    oxidationStates: "-4, -3, -2, -1, +1, +2, +3, +4", crystalStructure: "Geksagonal (grafit), Kubik (olmos)", magneticOrdering: "Diamagnetik", thermalConductivity: "129-2310 W/(m·K)",
    electricalResistivity: "1250 nΩ·m (grafit)", abundance: "Yer qobig'i: 200 ppm, Inson tanasi: 18%", isotopeCount: 15, stableIsotopes: "C-12, C-13",
    halfLife: "C-14: 5730 yil", electronAffinity: "153.9 kJ/mol", valencElectrons: 4, period: 2, group: 14, block: "p",
    state: "Qattiq", color: "Qora (grafit), Shaffof (olmos)", origin: "Yulduzlar sintezi", 
    uses: ["Po'lat ishlab chiqarish", "Yonilg'i", "Plastmassalar", "DNK asosi", "Olmoslar", "Grafen"],
    hazards: "Ko'mir changi yonuvchan", naturalOccurrence: "Ko'mir, neft, olmos, grafit", covalentRadius: "77 pm", vanDerWaalsRadius: "170 pm"
  },
  { 
    symbol: "N", name: "Nitrogen", nameUz: "Azot", atomicNumber: 7, atomicMass: "14.01", category: "nonmetal", electrons: "2,5", 
    description: "Havo tarkibining 78%ini tashkil qiladi", 
    detailedInfo: "Oqsillar va DNK tarkibida. O'g'itlar ishlab chiqarish va oziq-ovqat sanoatida (muzlatish) ishlatiladi.",
    discoveryYear: "1772", discoveredBy: "Daniel Rezerford", meltingPoint: "-210.0°C", boilingPoint: "-195.8°C",
    density: "0.001251 g/cm³", electronegativity: "3.04", atomicRadius: "56 pm", ionizationEnergy: "1402.3 kJ/mol",
    oxidationStates: "-3, -2, -1, +1, +2, +3, +4, +5", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "0.02583 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 78%, Yer qobig'i: 19 ppm", isotopeCount: 16, stableIsotopes: "N-14, N-15",
    halfLife: "Barqaror", electronAffinity: "7 kJ/mol", valencElectrons: 5, period: 2, group: 15, block: "p",
    state: "Gaz", color: "Rangsiz", origin: "Yulduzlar sintezi", 
    uses: ["Ammiak va o'g'itlar", "Portlovchi moddalar", "Oziq-ovqat saqlash", "Kriyogen suyuqlik", "Metallurgiya"],
    hazards: "Bo'g'ilish xavfi", naturalOccurrence: "Atmosfera, nitratlar", covalentRadius: "71 pm", vanDerWaalsRadius: "155 pm"
  },
  { 
    symbol: "O", name: "Oxygen", nameUz: "Kislorod", atomicNumber: 8, atomicMass: "16.00", category: "nonmetal", electrons: "2,6", 
    description: "Nafas olish va yonish uchun zarur", 
    detailedInfo: "Havo tarkibining 21%i. Aerob hayot uchun zarur, yonish jarayonlarida ishtirok etadi. Suv molekulasi tarkibida.",
    discoveryYear: "1774", discoveredBy: "Jozef Pristli va Karl Shele", meltingPoint: "-218.8°C", boilingPoint: "-183.0°C",
    density: "0.001429 g/cm³", electronegativity: "3.44", atomicRadius: "48 pm", ionizationEnergy: "1313.9 kJ/mol",
    oxidationStates: "-2, -1, +1, +2", crystalStructure: "Kubik", magneticOrdering: "Paramagnetik", thermalConductivity: "0.02658 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 21%, Yer qobig'i: 46%", isotopeCount: 17, stableIsotopes: "O-16, O-17, O-18",
    halfLife: "Barqaror", electronAffinity: "141 kJ/mol", valencElectrons: 6, period: 2, group: 16, block: "p",
    state: "Gaz", color: "Rangsiz (gaz), Och ko'k (suyuq)", origin: "Yulduzlar sintezi", 
    uses: ["Nafas olish", "Po'lat ishlab chiqarish", "Suvga cho'kish", "Tibbiyot", "Raketalar oksidlovchisi"],
    hazards: "Yonish tezlashtiruvchi", naturalOccurrence: "Atmosfera, suv, minerallar", covalentRadius: "66 pm", vanDerWaalsRadius: "152 pm"
  },
  { 
    symbol: "F", name: "Fluorine", nameUz: "Ftor", atomicNumber: 9, atomicMass: "19.00", category: "halogen", electrons: "2,7", 
    description: "Eng reaktiv element", 
    detailedInfo: "Eng kuchli oksidlovchi. Tish pastasi, teflon (politeflon) va sovutish suyuqliklari tarkibida ishlatiladi.",
    discoveryYear: "1886", discoveredBy: "Anri Muassan", meltingPoint: "-219.6°C", boilingPoint: "-188.1°C",
    density: "0.001696 g/cm³", electronegativity: "3.98", atomicRadius: "42 pm", ionizationEnergy: "1681 kJ/mol",
    oxidationStates: "-1", crystalStructure: "Kubik", magneticOrdering: "Diamagnetik", thermalConductivity: "0.0277 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Yer qobig'i: 585 ppm", isotopeCount: 18, stableIsotopes: "F-19",
    halfLife: "Barqaror", electronAffinity: "328 kJ/mol", valencElectrons: 7, period: 2, group: 17, block: "p",
    state: "Gaz", color: "Och sariq", origin: "Yulduzlar sintezi", 
    uses: ["Tish pastasi (fluorid)", "Teflon", "Sovutish suyuqliklari", "Uran boyitish", "Plastmassalar"],
    hazards: "Juda zaharli va korroziv", naturalOccurrence: "Fluorit, kriolit minerallari", covalentRadius: "64 pm", vanDerWaalsRadius: "147 pm"
  },
  { 
    symbol: "Ne", name: "Neon", nameUz: "Neon", atomicNumber: 10, atomicMass: "20.18", category: "noble", electrons: "2,8", 
    description: "Reklamalarda yorug'lik uchun ishlatiladi", 
    detailedInfo: "Yorug'lik reklamalar, lazerlar va televizor trubkalarida ishlatiladi. Qizil-to'q sariq yorug'lik beradi.",
    discoveryYear: "1898", discoveredBy: "Uilyam Remzi va Moris Trevers", meltingPoint: "-248.6°C", boilingPoint: "-246.1°C",
    density: "0.0009002 g/cm³", electronegativity: "Yo'q", atomicRadius: "38 pm", ionizationEnergy: "2080.7 kJ/mol",
    oxidationStates: "0", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "0.0491 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 18 ppm", isotopeCount: 19, stableIsotopes: "Ne-20, Ne-21, Ne-22",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 0, period: 2, group: 18, block: "p",
    state: "Gaz", color: "Rangsiz, qizil-to'q sariq nur beradi", origin: "Yulduzlar sintezi", 
    uses: ["Neon yorug'lik reklamalar", "Lazerlar", "Televizor trubkalari", "Yuqori kuchlanishli indikatorlar"],
    hazards: "Bo'g'ilish xavfi", naturalOccurrence: "Atmosfera", covalentRadius: "58 pm", vanDerWaalsRadius: "154 pm"
  },
  
  // Period 3
  { 
    symbol: "Na", name: "Sodium", nameUz: "Natriy", atomicNumber: 11, atomicMass: "22.99", category: "alkali", electrons: "2,8,1", 
    description: "Osh tuzi (NaCl) tarkibida", 
    detailedInfo: "Nerv impulslari va muskul harakati uchun zarur. Sabun, shisha va kimyoviy ishlab chiqarishda ishlatiladi.",
    discoveryYear: "1807", discoveredBy: "Gemfri Devi", meltingPoint: "97.8°C", boilingPoint: "883°C",
    density: "0.968 g/cm³", electronegativity: "0.93", atomicRadius: "186 pm", ionizationEnergy: "495.8 kJ/mol",
    oxidationStates: "+1", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "142 W/(m·K)",
    electricalResistivity: "47.7 nΩ·m", abundance: "Yer qobig'i: 2.36%", isotopeCount: 22, stableIsotopes: "Na-23",
    halfLife: "Barqaror", electronAffinity: "52.8 kJ/mol", valencElectrons: 1, period: 3, group: 1, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Osh tuzi", "Sabun ishlab chiqarish", "Ko'cha lampalar", "Metall qotishmalar", "Kimyoviy reagent"],
    hazards: "Suv bilan portlovchi reaksiya", naturalOccurrence: "Tuz konlari, dengiz suvi", covalentRadius: "166 pm", vanDerWaalsRadius: "227 pm"
  },
  { 
    symbol: "Mg", name: "Magnesium", nameUz: "Magniy", atomicNumber: 12, atomicMass: "24.31", category: "alkaline", electrons: "2,8,2", 
    description: "Yengil va mustahkam qotishmalarda", 
    detailedInfo: "Xlorofill molekulasi markazida. Samolyot qismlari, avtomobil g'ildiraklari va noutbuk korpuslarida ishlatiladi.",
    discoveryYear: "1755", discoveredBy: "Jozef Blek", meltingPoint: "650°C", boilingPoint: "1090°C",
    density: "1.738 g/cm³", electronegativity: "1.31", atomicRadius: "160 pm", ionizationEnergy: "737.7 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "156 W/(m·K)",
    electricalResistivity: "43.9 nΩ·m", abundance: "Yer qobig'i: 2.33%", isotopeCount: 22, stableIsotopes: "Mg-24, Mg-25, Mg-26",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 2, period: 3, group: 2, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Qotishmalar (samolyot)", "Pirotexnika", "Dorilar (antatsidlar)", "Xlorofill", "Batareyalar"],
    hazards: "Yonuvchan (chang va lenta)", naturalOccurrence: "Dolomit, magnezit, dengiz suvi", covalentRadius: "141 pm", vanDerWaalsRadius: "173 pm"
  },
  { 
    symbol: "Al", name: "Aluminum", nameUz: "Alyuminiy", atomicNumber: 13, atomicMass: "26.98", category: "metal", electrons: "2,8,3", 
    description: "Yengil va korroziyaga chidamli", 
    detailedInfo: "Eng ko'p ishlatiluvchi metall (po'latdan keyin). Quti-bankalar, folga, samolyotlar va qurilishda ishlatiladi.",
    discoveryYear: "1825", discoveredBy: "Xans Ersted", meltingPoint: "660.3°C", boilingPoint: "2519°C",
    density: "2.70 g/cm³", electronegativity: "1.61", atomicRadius: "143 pm", ionizationEnergy: "577.5 kJ/mol",
    oxidationStates: "+3", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "237 W/(m·K)",
    electricalResistivity: "26.5 nΩ·m", abundance: "Yer qobig'i: 8.1%", isotopeCount: 24, stableIsotopes: "Al-27",
    halfLife: "Barqaror", electronAffinity: "42.5 kJ/mol", valencElectrons: 3, period: 3, group: 13, block: "p",
    state: "Qattiq", color: "Kumush", origin: "Yulduzlar sintezi", 
    uses: ["Samolyotlar", "Ichimlik bankalari", "Folga", "Qurilish materiallari", "Elektr simlari"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Boksit, korund", covalentRadius: "121 pm", vanDerWaalsRadius: "184 pm"
  },
  { 
    symbol: "Si", name: "Silicon", nameUz: "Kremniy", atomicNumber: 14, atomicMass: "28.09", category: "metalloid", electrons: "2,8,4", 
    description: "Mikrochiplar va qum tarkibida", 
    detailedInfo: "Yarim o'tkazgichlar va mikrochiplar asosi. Yer qobig'ida kisloroddan keyin ikkinchi eng ko'p element.",
    discoveryYear: "1824", discoveredBy: "Yons Yakob Berselius", meltingPoint: "1414°C", boilingPoint: "3265°C",
    density: "2.329 g/cm³", electronegativity: "1.90", atomicRadius: "111 pm", ionizationEnergy: "786.5 kJ/mol",
    oxidationStates: "-4, +2, +4", crystalStructure: "Olmossimon kubik", magneticOrdering: "Diamagnetik", thermalConductivity: "149 W/(m·K)",
    electricalResistivity: "2300 Ω·m", abundance: "Yer qobig'i: 27.7%", isotopeCount: 23, stableIsotopes: "Si-28, Si-29, Si-30",
    halfLife: "Barqaror", electronAffinity: "133.6 kJ/mol", valencElectrons: 4, period: 3, group: 14, block: "p",
    state: "Qattiq", color: "Kulrang-ko'k", origin: "Yulduzlar sintezi", 
    uses: ["Mikrochiplar", "Quyosh panellari", "Shisha", "Silikon", "Sement"],
    hazards: "Chang nafas olishga xavfli", naturalOccurrence: "Qum, kvarts, silikatlar", covalentRadius: "111 pm", vanDerWaalsRadius: "210 pm"
  },
  { 
    symbol: "P", name: "Phosphorus", nameUz: "Fosfor", atomicNumber: 15, atomicMass: "30.97", category: "nonmetal", electrons: "2,8,5", 
    description: "DNK va ATP tarkibida muhim", 
    detailedInfo: "DNK, RNK va ATP molekulalarida mavjud. O'g'itlar, gugurt va portlovchi moddalarda ishlatiladi.",
    discoveryYear: "1669", discoveredBy: "Xenning Brand", meltingPoint: "44.1°C (oq P)", boilingPoint: "280.5°C",
    density: "1.82 g/cm³ (oq P)", electronegativity: "2.19", atomicRadius: "98 pm", ionizationEnergy: "1011.8 kJ/mol",
    oxidationStates: "-3, +3, +5", crystalStructure: "Kubik (oq), Ortorombik (qora)", magneticOrdering: "Diamagnetik", thermalConductivity: "0.236 W/(m·K)",
    electricalResistivity: "10¹⁰ Ω·m", abundance: "Yer qobig'i: 1050 ppm", isotopeCount: 23, stableIsotopes: "P-31",
    halfLife: "Barqaror", electronAffinity: "72.0 kJ/mol", valencElectrons: 5, period: 3, group: 15, block: "p",
    state: "Qattiq", color: "Oq, Qizil, Qora", origin: "Yulduzlar sintezi", 
    uses: ["O'g'itlar", "Gugurt", "DNK/RNK", "Portlovchi moddalar", "Pestitsidlar"],
    hazards: "Oq fosfor zaharli va yonuvchan", naturalOccurrence: "Fosfat jinslari, suyaklar", covalentRadius: "107 pm", vanDerWaalsRadius: "180 pm"
  },
  { 
    symbol: "S", name: "Sulfur", nameUz: "Oltingugurt", atomicNumber: 16, atomicMass: "32.07", category: "nonmetal", electrons: "2,8,6", 
    description: "Oqsil va kislotalar tarkibida", 
    detailedInfo: "Aminokislotalar va vitaminlar tarkibida. Sulfat kislota, vulkanizatsiya va dorilar ishlab chiqarishda.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "115.2°C", boilingPoint: "444.6°C",
    density: "2.07 g/cm³", electronegativity: "2.58", atomicRadius: "88 pm", ionizationEnergy: "999.6 kJ/mol",
    oxidationStates: "-2, +2, +4, +6", crystalStructure: "Ortorombik", magneticOrdering: "Diamagnetik", thermalConductivity: "0.205 W/(m·K)",
    electricalResistivity: "10¹⁵ Ω·m", abundance: "Yer qobig'i: 350 ppm", isotopeCount: 25, stableIsotopes: "S-32, S-33, S-34, S-36",
    halfLife: "Barqaror", electronAffinity: "200 kJ/mol", valencElectrons: 6, period: 3, group: 16, block: "p",
    state: "Qattiq", color: "Sariq", origin: "Yulduzlar sintezi", 
    uses: ["Sulfat kislota", "Rezina vulkanizatsiya", "Dorilar", "Fungitsidlar", "Qog'oz"],
    hazards: "Yonganida zaharli SO₂ chiqaradi", naturalOccurrence: "Vulkan mintaqalari, sulfidlar", covalentRadius: "105 pm", vanDerWaalsRadius: "180 pm"
  },
  { 
    symbol: "Cl", name: "Chlorine", nameUz: "Xlor", atomicNumber: 17, atomicMass: "35.45", category: "halogen", electrons: "2,8,7", 
    description: "Dezinfeksiya va osh tuzi tarkibida", 
    detailedInfo: "Suv tozalash, plastmassalar (PVC) va qog'oz oqartirish uchun ishlatiladi. Oshxona tuzining tarkibiy qismi.",
    discoveryYear: "1774", discoveredBy: "Karl Shele", meltingPoint: "-101.5°C", boilingPoint: "-34.0°C",
    density: "0.003214 g/cm³", electronegativity: "3.16", atomicRadius: "79 pm", ionizationEnergy: "1251.2 kJ/mol",
    oxidationStates: "-1, +1, +3, +5, +7", crystalStructure: "Ortorombik", magneticOrdering: "Diamagnetik", thermalConductivity: "0.0089 W/(m·K)",
    electricalResistivity: ">10¹⁰ Ω·m", abundance: "Yer qobig'i: 145 ppm", isotopeCount: 24, stableIsotopes: "Cl-35, Cl-37",
    halfLife: "Barqaror", electronAffinity: "349 kJ/mol", valencElectrons: 7, period: 3, group: 17, block: "p",
    state: "Gaz", color: "Sariq-yashil", origin: "Yulduzlar sintezi", 
    uses: ["Suv tozalash", "PVC plastik", "Oqlovchi", "Osh tuzi", "Dorilar"],
    hazards: "Zaharli gaz, nafas yo'llarini yallig'lantiradi", naturalOccurrence: "Tuz konlari, dengiz suvi", covalentRadius: "102 pm", vanDerWaalsRadius: "175 pm"
  },
  { 
    symbol: "Ar", name: "Argon", nameUz: "Argon", atomicNumber: 18, atomicMass: "39.95", category: "noble", electrons: "2,8,8", 
    description: "Payvandlashda himoya gazi sifatida", 
    detailedInfo: "Havodagi eng ko'p inert gaz (1%). Payvandlash, elektr lampochkalari va oyna ishlab chiqarishda ishlatiladi.",
    discoveryYear: "1894", discoveredBy: "Lord Reyli va Uilyam Remzi", meltingPoint: "-189.3°C", boilingPoint: "-185.8°C",
    density: "0.001784 g/cm³", electronegativity: "Yo'q", atomicRadius: "71 pm", ionizationEnergy: "1520.6 kJ/mol",
    oxidationStates: "0", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "0.01772 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 0.93%", isotopeCount: 26, stableIsotopes: "Ar-36, Ar-38, Ar-40",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 0, period: 3, group: 18, block: "p",
    state: "Gaz", color: "Rangsiz", origin: "Yulduzlar sintezi", 
    uses: ["Payvandlash himoya gazi", "Lampochkalar", "Oyna ishlab chiqarish", "Lazerlar", "Arxeologik sanalash"],
    hazards: "Bo'g'ilish xavfi", naturalOccurrence: "Atmosfera", covalentRadius: "106 pm", vanDerWaalsRadius: "188 pm"
  },
  
  // Period 4
  { 
    symbol: "K", name: "Potassium", nameUz: "Kaliy", atomicNumber: 19, atomicMass: "39.10", category: "alkali", electrons: "2,8,8,1", 
    description: "O'g'it va tirik organizmlar uchun zarur", 
    detailedInfo: "Nerv-muskul faoliyati uchun muhim. Qishloq xo'jalik o'g'itlari va kimyoviy sanoatda ishlatiladi.",
    discoveryYear: "1807", discoveredBy: "Gemfri Devi", meltingPoint: "63.4°C", boilingPoint: "759°C",
    density: "0.862 g/cm³", electronegativity: "0.82", atomicRadius: "227 pm", ionizationEnergy: "418.8 kJ/mol",
    oxidationStates: "+1", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "102.5 W/(m·K)",
    electricalResistivity: "72.0 nΩ·m", abundance: "Yer qobig'i: 2.09%", isotopeCount: 25, stableIsotopes: "K-39, K-41",
    halfLife: "K-40: 1.25 mlrd yil", electronAffinity: "48.4 kJ/mol", valencElectrons: 1, period: 4, group: 1, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["O'g'itlar", "Sabun", "Shisha", "Dorilar", "Oziq-ovqat sanoati"],
    hazards: "Suv bilan portlovchi reaksiya", naturalOccurrence: "Silvit, karnalit minerallari", covalentRadius: "203 pm", vanDerWaalsRadius: "275 pm"
  },
  { 
    symbol: "Ca", name: "Calcium", nameUz: "Kaltsiy", atomicNumber: 20, atomicMass: "40.08", category: "alkaline", electrons: "2,8,8,2", 
    description: "Suyak va tish tarkibida", 
    detailedInfo: "Suyak va tish mineral qismi (gidroksiapatit). Sement, ohak va o'g'it ishlab chiqarishda ishlatiladi.",
    discoveryYear: "1808", discoveredBy: "Gemfri Devi", meltingPoint: "842°C", boilingPoint: "1484°C",
    density: "1.55 g/cm³", electronegativity: "1.00", atomicRadius: "197 pm", ionizationEnergy: "589.8 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "201 W/(m·K)",
    electricalResistivity: "33.6 nΩ·m", abundance: "Yer qobig'i: 4.15%", isotopeCount: 26, stableIsotopes: "Ca-40, Ca-42, Ca-43, Ca-44, Ca-46, Ca-48",
    halfLife: "Barqaror", electronAffinity: "2.37 kJ/mol", valencElectrons: 2, period: 4, group: 2, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Sement", "Suyak va tish", "O'g'itlar", "Po'lat ishlab chiqarish", "Qog'oz"],
    hazards: "Suv bilan reaksiya, yonuvchan", naturalOccurrence: "Ohaktosh, gips, dolomit", covalentRadius: "176 pm", vanDerWaalsRadius: "231 pm"
  },
  { 
    symbol: "Sc", name: "Scandium", nameUz: "Skandiy", atomicNumber: 21, atomicMass: "44.96", category: "transition", electrons: "2,8,9,2", 
    description: "Yengil qotishmalarda ishlatiladi", 
    detailedInfo: "Sport anjomlari va samolyot qismlari uchun yuqori sifatli alyuminiy qotishmalarida ishlatiladi.",
    discoveryYear: "1879", discoveredBy: "Lars Nilson", meltingPoint: "1541°C", boilingPoint: "2836°C",
    density: "2.985 g/cm³", electronegativity: "1.36", atomicRadius: "162 pm", ionizationEnergy: "633.1 kJ/mol",
    oxidationStates: "+3", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "15.8 W/(m·K)",
    electricalResistivity: "562 nΩ·m", abundance: "Yer qobig'i: 22 ppm", isotopeCount: 25, stableIsotopes: "Sc-45",
    halfLife: "Barqaror", electronAffinity: "18.1 kJ/mol", valencElectrons: 3, period: 4, group: 3, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Al-Sc qotishmalar", "Sport anjomlar", "Samolyot qismlari", "Yuqori intensivlikdagi lampalar"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Tortveyit, gadolinit minerallari", covalentRadius: "170 pm", vanDerWaalsRadius: "211 pm"
  },
  { 
    symbol: "Ti", name: "Titanium", nameUz: "Titan", atomicNumber: 22, atomicMass: "47.87", category: "transition", electrons: "2,8,10,2", 
    description: "Kuchli va yengil, korroziyaga chidamli", 
    detailedInfo: "Samolyotlar, raketa qismlari, tibbiy implantlar va sport jihozlarida. Po'latdek mustahkam, lekin 45% yengilroq.",
    discoveryYear: "1791", discoveredBy: "Uilyam Gregor", meltingPoint: "1668°C", boilingPoint: "3287°C",
    density: "4.506 g/cm³", electronegativity: "1.54", atomicRadius: "147 pm", ionizationEnergy: "658.8 kJ/mol",
    oxidationStates: "+2, +3, +4", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "21.9 W/(m·K)",
    electricalResistivity: "420 nΩ·m", abundance: "Yer qobig'i: 0.565%", isotopeCount: 26, stableIsotopes: "Ti-46, Ti-47, Ti-48, Ti-49, Ti-50",
    halfLife: "Barqaror", electronAffinity: "7.6 kJ/mol", valencElectrons: 4, period: 4, group: 4, block: "d",
    state: "Qattiq", color: "Kumush", origin: "Yulduzlar sintezi", 
    uses: ["Samolyotlar", "Tibbiy implantlar", "Sport jihozlari", "Bo'yoqlar (TiO₂)", "Zargarlik"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Rutil, ilmenit minerallari", covalentRadius: "160 pm", vanDerWaalsRadius: "187 pm"
  },
  { 
    symbol: "V", name: "Vanadium", nameUz: "Vanadiy", atomicNumber: 23, atomicMass: "50.94", category: "transition", electrons: "2,8,11,2", 
    description: "Po'lat qotishmalarini mustahkamlaydi", 
    detailedInfo: "Yuqori sifatli po'lat va asboblar ishlab chiqarishda. Batareyalar va katalizatorlarda ham ishlatiladi.",
    discoveryYear: "1801", discoveredBy: "Andres del Rio", meltingPoint: "1910°C", boilingPoint: "3407°C",
    density: "6.11 g/cm³", electronegativity: "1.63", atomicRadius: "134 pm", ionizationEnergy: "650.9 kJ/mol",
    oxidationStates: "+2, +3, +4, +5", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "30.7 W/(m·K)",
    electricalResistivity: "197 nΩ·m", abundance: "Yer qobig'i: 120 ppm", isotopeCount: 24, stableIsotopes: "V-51",
    halfLife: "V-50: 1.5×10¹⁷ yil", electronAffinity: "50.6 kJ/mol", valencElectrons: 5, period: 4, group: 5, block: "d",
    state: "Qattiq", color: "Kulrang-ko'k", origin: "Yulduzlar sintezi", 
    uses: ["Po'lat qotishmalar", "Asboblar", "Vanadiy batareyalar", "Katalizatorlar", "Reaktor materiallar"],
    hazards: "Ba'zi birikmalari zaharli", naturalOccurrence: "Patronit, vanadinit minerallari", covalentRadius: "153 pm", vanDerWaalsRadius: "179 pm"
  },
  { 
    symbol: "Cr", name: "Chromium", nameUz: "Xrom", atomicNumber: 24, atomicMass: "52.00", category: "transition", electrons: "2,8,13,1", 
    description: "Metall qoplamalar va bo'yoqlar", 
    detailedInfo: "Zanglamaydigan po'lat (18% Cr). Metall yuzalarni yorqin qoplash va turli rangli bo'yoqlar ishlab chiqarishda.",
    discoveryYear: "1797", discoveredBy: "Lui Vokel", meltingPoint: "1907°C", boilingPoint: "2671°C",
    density: "7.19 g/cm³", electronegativity: "1.66", atomicRadius: "128 pm", ionizationEnergy: "652.9 kJ/mol",
    oxidationStates: "+2, +3, +6", crystalStructure: "Kubik markazlangan", magneticOrdering: "Antiferromagnet", thermalConductivity: "93.9 W/(m·K)",
    electricalResistivity: "125 nΩ·m", abundance: "Yer qobig'i: 102 ppm", isotopeCount: 26, stableIsotopes: "Cr-50, Cr-52, Cr-53, Cr-54",
    halfLife: "Barqaror", electronAffinity: "64.3 kJ/mol", valencElectrons: 6, period: 4, group: 6, block: "d",
    state: "Qattiq", color: "Kumush", origin: "Yulduzlar sintezi", 
    uses: ["Zanglamaydigan po'lat", "Xromlash", "Bo'yoqlar", "Charm oshirish", "Refrakter materiallar"],
    hazards: "Cr(VI) saraton keltirib chiqaradi", naturalOccurrence: "Xromit minerali", covalentRadius: "139 pm", vanDerWaalsRadius: "189 pm"
  },
  { 
    symbol: "Mn", name: "Manganese", nameUz: "Marganets", atomicNumber: 25, atomicMass: "54.94", category: "transition", electrons: "2,8,13,2", 
    description: "Po'lat ishlab chiqarishda muhim", 
    detailedInfo: "Po'lat sifatini yaxshilaydi, oksidlanishni oldini oladi. Alyuminiy bankalari va batareyalarda ishlatiladi.",
    discoveryYear: "1774", discoveredBy: "Yoxan Gan", meltingPoint: "1246°C", boilingPoint: "2061°C",
    density: "7.21 g/cm³", electronegativity: "1.55", atomicRadius: "127 pm", ionizationEnergy: "717.3 kJ/mol",
    oxidationStates: "+2, +3, +4, +6, +7", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "7.81 W/(m·K)",
    electricalResistivity: "1440 nΩ·m", abundance: "Yer qobig'i: 950 ppm", isotopeCount: 28, stableIsotopes: "Mn-55",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 7, period: 4, group: 7, block: "d",
    state: "Qattiq", color: "Kumush-kulrang", origin: "Yulduzlar sintezi", 
    uses: ["Po'lat ishlab chiqarish", "Al qotishmalar", "Batareyalar", "Keramika ranglash", "Fermentlar"],
    hazards: "Chang va bug' zaharli", naturalOccurrence: "Piroluzit, manganit minerallari", covalentRadius: "139 pm", vanDerWaalsRadius: "197 pm"
  },
  { 
    symbol: "Fe", name: "Iron", nameUz: "Temir", atomicNumber: 26, atomicMass: "55.85", category: "transition", electrons: "2,8,14,2", 
    description: "Gemoglobin va po'lat ishlab chiqarish", 
    detailedInfo: "Eng ko'p ishlatiluvchi metall. Gemoglobinda kislorod tashish, qurilish va transport vositalarida asosiy material.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "1538°C", boilingPoint: "2862°C",
    density: "7.874 g/cm³", electronegativity: "1.83", atomicRadius: "126 pm", ionizationEnergy: "762.5 kJ/mol",
    oxidationStates: "+2, +3", crystalStructure: "Kubik markazlangan", magneticOrdering: "Ferromagnet", thermalConductivity: "80.4 W/(m·K)",
    electricalResistivity: "96.1 nΩ·m", abundance: "Yer qobig'i: 5.63%", isotopeCount: 28, stableIsotopes: "Fe-54, Fe-56, Fe-57, Fe-58",
    halfLife: "Barqaror", electronAffinity: "15.7 kJ/mol", valencElectrons: 8, period: 4, group: 8, block: "d",
    state: "Qattiq", color: "Kulrang-kumush", origin: "Yulduzlar sintezi", 
    uses: ["Po'lat ishlab chiqarish", "Qurilish", "Transport", "Gemoglobin", "Magnitlar"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Gematit, magnetit, pirit", covalentRadius: "132 pm", vanDerWaalsRadius: "194 pm"
  },
  { 
    symbol: "Co", name: "Cobalt", nameUz: "Kobalt", atomicNumber: 27, atomicMass: "58.93", category: "transition", electrons: "2,8,15,2", 
    description: "Vitamin B12 tarkibida", 
    detailedInfo: "Magnit materiallar, Li-ion batareyalar va vitamin B12 (kobalamin) tarkibida. Ko'k rang beradi.",
    discoveryYear: "1735", discoveredBy: "Georg Brandt", meltingPoint: "1495°C", boilingPoint: "2927°C",
    density: "8.90 g/cm³", electronegativity: "1.88", atomicRadius: "125 pm", ionizationEnergy: "760.4 kJ/mol",
    oxidationStates: "+2, +3", crystalStructure: "Geksagonal", magneticOrdering: "Ferromagnet", thermalConductivity: "100 W/(m·K)",
    electricalResistivity: "62.4 nΩ·m", abundance: "Yer qobig'i: 25 ppm", isotopeCount: 28, stableIsotopes: "Co-59",
    halfLife: "Barqaror", electronAffinity: "63.7 kJ/mol", valencElectrons: 9, period: 4, group: 9, block: "d",
    state: "Qattiq", color: "Kulrang-ko'k", origin: "Yulduzlar sintezi", 
    uses: ["Li-ion batareyalar", "Magnitlar", "Vitamin B12", "Ko'k pigment", "Qotishmalar"],
    hazards: "Chang saraton keltirishi mumkin", naturalOccurrence: "Kobaltit, skutterudit", covalentRadius: "126 pm", vanDerWaalsRadius: "192 pm"
  },
  { 
    symbol: "Ni", name: "Nickel", nameUz: "Nikel", atomicNumber: 28, atomicMass: "58.69", category: "transition", electrons: "2,8,16,2", 
    description: "Zanglamaydigan po'lat va tangalar", 
    detailedInfo: "Zanglamaydigan po'lat (8-10% Ni), batareyalar, magnit materiallar va tangalarda ishlatiladi.",
    discoveryYear: "1751", discoveredBy: "Aksil Kronstedt", meltingPoint: "1455°C", boilingPoint: "2913°C",
    density: "8.908 g/cm³", electronegativity: "1.91", atomicRadius: "124 pm", ionizationEnergy: "737.1 kJ/mol",
    oxidationStates: "+2, +3", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Ferromagnet", thermalConductivity: "90.9 W/(m·K)",
    electricalResistivity: "69.3 nΩ·m", abundance: "Yer qobig'i: 84 ppm", isotopeCount: 31, stableIsotopes: "Ni-58, Ni-60, Ni-61, Ni-62, Ni-64",
    halfLife: "Barqaror", electronAffinity: "112 kJ/mol", valencElectrons: 10, period: 4, group: 10, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Zanglamaydigan po'lat", "Tangalar", "Batareyalar", "Qotishmalar", "Galvanoplastika"],
    hazards: "Allergiya keltirib chiqaradi", naturalOccurrence: "Pentlandit, garnierit", covalentRadius: "124 pm", vanDerWaalsRadius: "163 pm"
  },
  { 
    symbol: "Cu", name: "Copper", nameUz: "Mis", atomicNumber: 29, atomicMass: "63.55", category: "transition", electrons: "2,8,18,1", 
    description: "Elektr simlar va sanitariya quvurlari", 
    detailedInfo: "Eng yaxshi elektr o'tkazgich (kumushdan keyin). Elektr simlari, sanitariya, elektrоnika va bronza qotishmasida.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "1084.6°C", boilingPoint: "2562°C",
    density: "8.96 g/cm³", electronegativity: "1.90", atomicRadius: "128 pm", ionizationEnergy: "745.5 kJ/mol",
    oxidationStates: "+1, +2", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "401 W/(m·K)",
    electricalResistivity: "16.78 nΩ·m", abundance: "Yer qobig'i: 60 ppm", isotopeCount: 29, stableIsotopes: "Cu-63, Cu-65",
    halfLife: "Barqaror", electronAffinity: "118.4 kJ/mol", valencElectrons: 11, period: 4, group: 11, block: "d",
    state: "Qattiq", color: "Qizil-to'q sariq", origin: "Yulduzlar sintezi", 
    uses: ["Elektr simlari", "Sanitariya quvurlari", "Bronza", "Elektrоnika", "Antibiog'ida"],
    hazards: "Og'ir dozalarda zaharli", naturalOccurrence: "Xalkopirit, malaxit", covalentRadius: "132 pm", vanDerWaalsRadius: "140 pm"
  },
  { 
    symbol: "Zn", name: "Zinc", nameUz: "Rux", atomicNumber: 30, atomicMass: "65.38", category: "transition", electrons: "2,8,18,2", 
    description: "Fermentlar va metall qoplash", 
    detailedInfo: "100+ fermentlarda mavjud. Temir zangdan himoya qilish (galvanizatsiya), qotishmalar va batareyalarda.",
    discoveryYear: "1746", discoveredBy: "Andreas Marggraf", meltingPoint: "419.5°C", boilingPoint: "907°C",
    density: "7.14 g/cm³", electronegativity: "1.65", atomicRadius: "134 pm", ionizationEnergy: "906.4 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "116 W/(m·K)",
    electricalResistivity: "59.0 nΩ·m", abundance: "Yer qobig'i: 70 ppm", isotopeCount: 30, stableIsotopes: "Zn-64, Zn-66, Zn-67, Zn-68, Zn-70",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 12, period: 4, group: 12, block: "d",
    state: "Qattiq", color: "Ko'kimtir-kumush", origin: "Yulduzlar sintezi", 
    uses: ["Galvanizatsiya", "Batareyalar", "Guruch qotishmasi", "Quyosh kremlari", "Dorilar"],
    hazards: "Bug' va chang zaharli", naturalOccurrence: "Sfalerit, smitsonit", covalentRadius: "122 pm", vanDerWaalsRadius: "139 pm"
  },
  { 
    symbol: "Ga", name: "Gallium", nameUz: "Galliy", atomicNumber: 31, atomicMass: "69.72", category: "metal", electrons: "2,8,18,3", 
    description: "Past erish harorati, yarim o'tkazgich", 
    detailedInfo: "Qo'lda eriydi (29.8°C). LED lampalar, quyosh batareyalari va mikroelektronikada ishlatiladi.",
    discoveryYear: "1875", discoveredBy: "Pol-Emil Lecoq de Boisbodran", meltingPoint: "29.8°C", boilingPoint: "2204°C",
    density: "5.91 g/cm³", electronegativity: "1.81", atomicRadius: "136 pm", ionizationEnergy: "578.8 kJ/mol",
    oxidationStates: "+1, +3", crystalStructure: "Ortorombik", magneticOrdering: "Diamagnetik", thermalConductivity: "40.6 W/(m·K)",
    electricalResistivity: "140 nΩ·m", abundance: "Yer qobig'i: 19 ppm", isotopeCount: 31, stableIsotopes: "Ga-69, Ga-71",
    halfLife: "Barqaror", electronAffinity: "41 kJ/mol", valencElectrons: 3, period: 4, group: 13, block: "p",
    state: "Qattiq", color: "Kumush", origin: "Yulduzlar sintezi", 
    uses: ["LED lampalar", "Yarim o'tkazgichlar", "Termometrlar", "Quyosh batareyalari", "MRI"],
    hazards: "Kam zaharli", naturalOccurrence: "Boksit, sfalerit ichida", covalentRadius: "122 pm", vanDerWaalsRadius: "187 pm"
  },
  { 
    symbol: "Ge", name: "Germanium", nameUz: "Germaniy", atomicNumber: 32, atomicMass: "72.63", category: "metalloid", electrons: "2,8,18,4", 
    description: "Optik tolalar va yarim o'tkazgichlar", 
    detailedInfo: "Optik tolalar, infraqizil optika va yarim o'tkazgich qurilmalarda. Birinchi tranzistorlar Ge dan yasalgan.",
    discoveryYear: "1886", discoveredBy: "Klemens Vinkler", meltingPoint: "938.3°C", boilingPoint: "2833°C",
    density: "5.323 g/cm³", electronegativity: "2.01", atomicRadius: "125 pm", ionizationEnergy: "762 kJ/mol",
    oxidationStates: "+2, +4", crystalStructure: "Olmossimon kubik", magneticOrdering: "Diamagnetik", thermalConductivity: "60.2 W/(m·K)",
    electricalResistivity: "1 Ω·m", abundance: "Yer qobig'i: 1.5 ppm", isotopeCount: 32, stableIsotopes: "Ge-70, Ge-72, Ge-73, Ge-74, Ge-76",
    halfLife: "Barqaror", electronAffinity: "119 kJ/mol", valencElectrons: 4, period: 4, group: 14, block: "p",
    state: "Qattiq", color: "Kulrang-oq", origin: "Yulduzlar sintezi", 
    uses: ["Optik tolalar", "Infraqizil optika", "Yarim o'tkazgichlar", "Tranzistorlar", "Quyosh batareyalari"],
    hazards: "Kam zaharli", naturalOccurrence: "Arginodit, germanit", covalentRadius: "122 pm", vanDerWaalsRadius: "211 pm"
  },
  { 
    symbol: "As", name: "Arsenic", nameUz: "Mishyak", atomicNumber: 33, atomicMass: "74.92", category: "metalloid", electrons: "2,8,18,5", 
    description: "Zaharli, lekin yarim o'tkazgichlarda", 
    detailedInfo: "Yuqori zaharli, ammo yarim o'tkazgichlar (GaAs), yog'och konservanti va o'tkazgichlarida ishlatiladi.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Albertus Magnus", meltingPoint: "817°C (sublimatsiya)", boilingPoint: "614°C",
    density: "5.727 g/cm³", electronegativity: "2.18", atomicRadius: "114 pm", ionizationEnergy: "947 kJ/mol",
    oxidationStates: "-3, +3, +5", crystalStructure: "Romboedr", magneticOrdering: "Diamagnetik", thermalConductivity: "50.2 W/(m·K)",
    electricalResistivity: "333 nΩ·m", abundance: "Yer qobig'i: 1.8 ppm", isotopeCount: 33, stableIsotopes: "As-75",
    halfLife: "Barqaror", electronAffinity: "78 kJ/mol", valencElectrons: 5, period: 4, group: 15, block: "p",
    state: "Qattiq", color: "Metall kulrang", origin: "Yulduzlar sintezi", 
    uses: ["GaAs yarim o'tkazgichlar", "Yog'och konservanti", "Qotishmalar", "Pestitsidlar"],
    hazards: "Juda zaharli, saraton keltirib chiqaradi", naturalOccurrence: "Arsenopirit, realgar", covalentRadius: "119 pm", vanDerWaalsRadius: "185 pm"
  },
  { 
    symbol: "Se", name: "Selenium", nameUz: "Selen", atomicNumber: 34, atomicMass: "78.96", category: "nonmetal", electrons: "2,8,18,6", 
    description: "Antioksidant, fotosellalarda", 
    detailedInfo: "Muhim mikroelement. Fotokopiya mashinalari, quyosh batareyalari va shisha ishlab chiqarishda ishlatiladi.",
    discoveryYear: "1817", discoveredBy: "Yons Yakob Berselius", meltingPoint: "221°C", boilingPoint: "685°C",
    density: "4.809 g/cm³", electronegativity: "2.55", atomicRadius: "103 pm", ionizationEnergy: "941 kJ/mol",
    oxidationStates: "-2, +2, +4, +6", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "2.04 W/(m·K)",
    electricalResistivity: "10¹² Ω·m", abundance: "Yer qobig'i: 0.05 ppm", isotopeCount: 29, stableIsotopes: "Se-74, Se-76, Se-77, Se-78, Se-80, Se-82",
    halfLife: "Barqaror", electronAffinity: "195 kJ/mol", valencElectrons: 6, period: 4, group: 16, block: "p",
    state: "Qattiq", color: "Kulrang, qizil", origin: "Yulduzlar sintezi", 
    uses: ["Shisha ranglash", "Fotokopiya", "Quyosh batareyalari", "Ozuqa qo'shimchasi", "Shampunlar"],
    hazards: "Yuqori dozalarda zaharli", naturalOccurrence: "Sulfid rudalari ichida", covalentRadius: "120 pm", vanDerWaalsRadius: "190 pm"
  },
  { 
    symbol: "Br", name: "Bromine", nameUz: "Brom", atomicNumber: 35, atomicMass: "79.90", category: "halogen", electrons: "2,8,18,7", 
    description: "Xona haroratida suyuq galogen", 
    detailedInfo: "Yonmaydigan qiluvchi moddalar, dorilar, fotografiya va suv tozalashda ishlatiladi. Qizil-jigarrang suyuqlik.",
    discoveryYear: "1826", discoveredBy: "Antuan Balar", meltingPoint: "-7.2°C", boilingPoint: "58.8°C",
    density: "3.12 g/cm³", electronegativity: "2.96", atomicRadius: "94 pm", ionizationEnergy: "1139.9 kJ/mol",
    oxidationStates: "-1, +1, +3, +5, +7", crystalStructure: "Ortorombik", magneticOrdering: "Diamagnetik", thermalConductivity: "0.122 W/(m·K)",
    electricalResistivity: "10¹⁰ Ω·m", abundance: "Yer qobig'i: 2.4 ppm", isotopeCount: 32, stableIsotopes: "Br-79, Br-81",
    halfLife: "Barqaror", electronAffinity: "324.6 kJ/mol", valencElectrons: 7, period: 4, group: 17, block: "p",
    state: "Suyuq", color: "Qizil-jigarrang", origin: "Yulduzlar sintezi", 
    uses: ["Yonmaydigan qiluvchilar", "Dorilar", "Pestitsidlar", "Fotografiya", "Suv tozalash"],
    hazards: "Zaharli, terini kuydiradi", naturalOccurrence: "Dengiz suvi, tuz konlari", covalentRadius: "120 pm", vanDerWaalsRadius: "185 pm"
  },
  { 
    symbol: "Kr", name: "Krypton", nameUz: "Kripton", atomicNumber: 36, atomicMass: "83.80", category: "noble", electrons: "2,8,18,8", 
    description: "Yuqori intensivlikdagi lampalar", 
    detailedInfo: "Lazer texnologiyasi, avto farlar va yorug'lik reklamalarda ishlatiladi. Oq yorug'lik beradi.",
    discoveryYear: "1898", discoveredBy: "Uilyam Remzi va Moris Trevers", meltingPoint: "-157.4°C", boilingPoint: "-153.2°C",
    density: "0.003733 g/cm³", electronegativity: "3.00", atomicRadius: "88 pm", ionizationEnergy: "1350.8 kJ/mol",
    oxidationStates: "0, +2", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "0.00943 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 1 ppm", isotopeCount: 32, stableIsotopes: "Kr-78, Kr-80, Kr-82, Kr-83, Kr-84, Kr-86",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 8, period: 4, group: 18, block: "p",
    state: "Gaz", color: "Rangsiz", origin: "Yulduzlar sintezi", 
    uses: ["Yuqori intensivlik lampalari", "Lazerlar", "Avto farlar", "O'lchov standarti"],
    hazards: "Bo'g'ilish xavfi", naturalOccurrence: "Atmosfera", covalentRadius: "116 pm", vanDerWaalsRadius: "202 pm"
  },
  
  // Period 5
  { 
    symbol: "Rb", name: "Rubidium", nameUz: "Rubidiy", atomicNumber: 37, atomicMass: "85.47", category: "alkali", electrons: "2,8,18,8,1", 
    description: "Atom soatlar va ilmiy tadqiqotlar", 
    detailedInfo: "Atom soatlarda, fotosellalarda va tibbiy tasvirlashda ishlatiladi. Juda yumshoq va reaktiv metall.",
    discoveryYear: "1861", discoveredBy: "Robert Bunsen va Gustav Kirxgof", meltingPoint: "39.3°C", boilingPoint: "688°C",
    density: "1.532 g/cm³", electronegativity: "0.82", atomicRadius: "248 pm", ionizationEnergy: "403 kJ/mol",
    oxidationStates: "+1", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "58.2 W/(m·K)",
    electricalResistivity: "128 nΩ·m", abundance: "Yer qobig'i: 90 ppm", isotopeCount: 32, stableIsotopes: "Rb-85",
    halfLife: "Rb-87: 49 mlrd yil", electronAffinity: "46.9 kJ/mol", valencElectrons: 1, period: 5, group: 1, block: "s",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Atom soatlar", "Fotosellalar", "Tibbiy tasvir", "Ilmiy tadqiqot"],
    hazards: "Suv bilan portlovchi, yonuvchan", naturalOccurrence: "Lepidolit, pollucit", covalentRadius: "220 pm", vanDerWaalsRadius: "303 pm"
  },
  { 
    symbol: "Sr", name: "Strontium", nameUz: "Stronsiy", atomicNumber: 38, atomicMass: "87.62", category: "alkaline", electrons: "2,8,18,8,2", 
    description: "Ot-satqin uchun va pirotexnikada", 
    detailedInfo: "Qizil rang beradi (ot-satqinda). Suyak kasalliklari davolash va magnit materiallarida ishlatiladi.",
    discoveryYear: "1790", discoveredBy: "Adair Crawford", meltingPoint: "777°C", boilingPoint: "1382°C",
    density: "2.64 g/cm³", electronegativity: "0.95", atomicRadius: "215 pm", ionizationEnergy: "549.5 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "35.4 W/(m·K)",
    electricalResistivity: "132 nΩ·m", abundance: "Yer qobig'i: 370 ppm", isotopeCount: 35, stableIsotopes: "Sr-84, Sr-86, Sr-87, Sr-88",
    halfLife: "Barqaror", electronAffinity: "5.0 kJ/mol", valencElectrons: 2, period: 5, group: 2, block: "s",
    state: "Qattiq", color: "Kumush-sariq", origin: "Yulduzlar sintezi", 
    uses: ["Pirotexnika (qizil)", "Magnit materiallar", "Suyak kasalliklari", "CRT televizorlar"],
    hazards: "Sr-90 radioaktiv, xavfli", naturalOccurrence: "Selestit, strontsianit", covalentRadius: "195 pm", vanDerWaalsRadius: "249 pm"
  },
  { 
    symbol: "Y", name: "Yttrium", nameUz: "Ittriy", atomicNumber: 39, atomicMass: "88.91", category: "transition", electrons: "2,8,18,9,2", 
    description: "Yuqori haroratli supero'tkazgichlar", 
    detailedInfo: "LED lampalar, lazerlar, superо'tkazgichlar va qattiq oksid yonilg'i xujayralarida ishlatiladi.",
    discoveryYear: "1794", discoveredBy: "Yoxan Gadolin", meltingPoint: "1526°C", boilingPoint: "3336°C",
    density: "4.472 g/cm³", electronegativity: "1.22", atomicRadius: "180 pm", ionizationEnergy: "600 kJ/mol",
    oxidationStates: "+3", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "17.2 W/(m·K)",
    electricalResistivity: "596 nΩ·m", abundance: "Yer qobig'i: 33 ppm", isotopeCount: 32, stableIsotopes: "Y-89",
    halfLife: "Barqaror", electronAffinity: "29.6 kJ/mol", valencElectrons: 3, period: 5, group: 3, block: "d",
    state: "Qattiq", color: "Kumush-metall", origin: "Yulduzlar sintezi", 
    uses: ["LED lampalar", "Superо'tkazgichlar", "Lazerlar", "Yonilg'i xujayralari", "Magnit materiallar"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Ksenotim, gadolinit", covalentRadius: "190 pm", vanDerWaalsRadius: "219 pm"
  },
  { 
    symbol: "Zr", name: "Zirconium", nameUz: "Tsirkoniy", atomicNumber: 40, atomicMass: "91.22", category: "transition", electrons: "2,8,18,10,2", 
    description: "Yadro reaktorlari va zargarlik", 
    detailedInfo: "Yadro reaktor quvurlari, zargarlik buyumlari (kubik tsirkoniya) va keramikada ishlatiladi.",
    discoveryYear: "1789", discoveredBy: "Martin Klaproth", meltingPoint: "1855°C", boilingPoint: "4409°C",
    density: "6.52 g/cm³", electronegativity: "1.33", atomicRadius: "160 pm", ionizationEnergy: "640.1 kJ/mol",
    oxidationStates: "+4", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "22.6 W/(m·K)",
    electricalResistivity: "421 nΩ·m", abundance: "Yer qobig'i: 165 ppm", isotopeCount: 33, stableIsotopes: "Zr-90, Zr-91, Zr-92, Zr-94, Zr-96",
    halfLife: "Barqaror", electronAffinity: "41.1 kJ/mol", valencElectrons: 4, period: 5, group: 4, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Yadro reaktorlar", "Kubik tsirkoniya", "Keramika", "Kimyoviy idishlar", "Tibbiy implantlar"],
    hazards: "Chang yonuvchan", naturalOccurrence: "Tsirkon, baddeleyit", covalentRadius: "175 pm", vanDerWaalsRadius: "186 pm"
  },
  { 
    symbol: "Nb", name: "Niobium", nameUz: "Niobiy", atomicNumber: 41, atomicMass: "92.91", category: "transition", electrons: "2,8,18,12,1", 
    description: "Superо'tkazgichlar va po'lat qotishma", 
    detailedInfo: "Yuqori haroratli qotishmalar, MRI skanerlari uchun superо'tkazgichlar va zargarlikda ishlatiladi.",
    discoveryYear: "1801", discoveredBy: "Charlz Xetchett", meltingPoint: "2477°C", boilingPoint: "4744°C",
    density: "8.57 g/cm³", electronegativity: "1.6", atomicRadius: "146 pm", ionizationEnergy: "652.1 kJ/mol",
    oxidationStates: "+3, +5", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "53.7 W/(m·K)",
    electricalResistivity: "152 nΩ·m", abundance: "Yer qobig'i: 20 ppm", isotopeCount: 32, stableIsotopes: "Nb-93",
    halfLife: "Barqaror", electronAffinity: "86.1 kJ/mol", valencElectrons: 5, period: 5, group: 5, block: "d",
    state: "Qattiq", color: "Kulrang metall", origin: "Yulduzlar sintezi", 
    uses: ["Superо'tkazgichlar", "MRI magnit", "Qotishmalar", "Zargarlik", "Yadro texnologiya"],
    hazards: "Chang ko'z va terini yallig'lantiradi", naturalOccurrence: "Kolumbit, piroklor", covalentRadius: "164 pm", vanDerWaalsRadius: "207 pm"
  },
  { 
    symbol: "Mo", name: "Molybdenum", nameUz: "Molibden", atomicNumber: 42, atomicMass: "95.95", category: "transition", electrons: "2,8,18,13,1", 
    description: "Po'lat qotishmalarini mustahkamlaydi", 
    detailedInfo: "Yuqori haroratli po'lat qotishmalari, fermentlar va katalitik konverterlarda ishlatiladi.",
    discoveryYear: "1781", discoveredBy: "Karl Shele", meltingPoint: "2623°C", boilingPoint: "4639°C",
    density: "10.28 g/cm³", electronegativity: "2.16", atomicRadius: "139 pm", ionizationEnergy: "684.3 kJ/mol",
    oxidationStates: "+2, +3, +4, +5, +6", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "138 W/(m·K)",
    electricalResistivity: "53.4 nΩ·m", abundance: "Yer qobig'i: 1.2 ppm", isotopeCount: 35, stableIsotopes: "Mo-92, Mo-94, Mo-95, Mo-96, Mo-97, Mo-98, Mo-100",
    halfLife: "Barqaror", electronAffinity: "71.9 kJ/mol", valencElectrons: 6, period: 5, group: 6, block: "d",
    state: "Qattiq", color: "Kumush-kulrang", origin: "Yulduzlar sintezi", 
    uses: ["Qotishmalar", "Katalizatorlar", "Fermentlar", "Moylash materiallari", "Elektrodlar"],
    hazards: "Chang nafas olishga xavfli", naturalOccurrence: "Molibdenit", covalentRadius: "154 pm", vanDerWaalsRadius: "209 pm"
  },
  { 
    symbol: "Tc", name: "Technetium", nameUz: "Texnetsiy", atomicNumber: 43, atomicMass: "(98)", category: "transition", electrons: "2,8,18,13,2", 
    description: "Birinchi sun'iy element, radioaktiv", 
    detailedInfo: "Tibbiy diagnostikada (skanerlash), korroziyani oldini olish va ilmiy tadqiqotlarda ishlatiladi.",
    discoveryYear: "1937", discoveredBy: "Karl Perrye va Emilyo Segre", meltingPoint: "2157°C", boilingPoint: "4265°C",
    density: "11.5 g/cm³", electronegativity: "1.9", atomicRadius: "136 pm", ionizationEnergy: "702 kJ/mol",
    oxidationStates: "+4, +7", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "50.6 W/(m·K)",
    electricalResistivity: "200 nΩ·m", abundance: "Juda kam (sun'iy)", isotopeCount: 33, stableIsotopes: "Yo'q",
    halfLife: "Tc-98: 4.2 mln yil", electronAffinity: "53 kJ/mol", valencElectrons: 7, period: 5, group: 7, block: "d",
    state: "Qattiq", color: "Kumush-kulrang", origin: "Sun'iy", 
    uses: ["Tibbiy diagnostika", "Korroziyadan himoya", "Ilmiy tadqiqot"],
    hazards: "Radioaktiv", naturalOccurrence: "Tabiatda deyarli yo'q", covalentRadius: "147 pm", vanDerWaalsRadius: "209 pm"
  },
  { 
    symbol: "Ru", name: "Ruthenium", nameUz: "Ruteniy", atomicNumber: 44, atomicMass: "101.07", category: "transition", electrons: "2,8,18,15,1", 
    description: "Qimmatbaho metall, elektrоnika", 
    detailedInfo: "Qattiq disk drayvlar, elektr kontaktlar, katalizatorlar va zargarlik buyumlarida ishlatiladi.",
    discoveryYear: "1844", discoveredBy: "Karl Klaus", meltingPoint: "2334°C", boilingPoint: "4150°C",
    density: "12.45 g/cm³", electronegativity: "2.2", atomicRadius: "134 pm", ionizationEnergy: "710.2 kJ/mol",
    oxidationStates: "+2, +3, +4, +8", crystalStructure: "Geksagonal", magneticOrdering: "Paramagnetik", thermalConductivity: "117 W/(m·K)",
    electricalResistivity: "71 nΩ·m", abundance: "Yer qobig'i: 0.001 ppm", isotopeCount: 34, stableIsotopes: "Ru-96, Ru-98, Ru-99, Ru-100, Ru-101, Ru-102, Ru-104",
    halfLife: "Barqaror", electronAffinity: "101 kJ/mol", valencElectrons: 8, period: 5, group: 8, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Qattiq disklar", "Elektr kontaktlar", "Katalizatorlar", "Zargarlik", "Quyosh batareyalari"],
    hazards: "Ba'zi birikmalari zaharli", naturalOccurrence: "Platina rudalari", covalentRadius: "146 pm", vanDerWaalsRadius: "207 pm"
  },
  { 
    symbol: "Rh", name: "Rhodium", nameUz: "Rodiy", atomicNumber: 45, atomicMass: "102.91", category: "transition", electrons: "2,8,18,16,1", 
    description: "Eng qimmat metall, katalizatorlar", 
    detailedInfo: "Avtomobil katalitik konverterlari, oynalar uchun ko'zgular va zargarlikda qoplama sifatida ishlatiladi.",
    discoveryYear: "1803", discoveredBy: "Uilyam Uollaston", meltingPoint: "1964°C", boilingPoint: "3695°C",
    density: "12.41 g/cm³", electronegativity: "2.28", atomicRadius: "134 pm", ionizationEnergy: "719.7 kJ/mol",
    oxidationStates: "+3", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "150 W/(m·K)",
    electricalResistivity: "43.3 nΩ·m", abundance: "Yer qobig'i: 0.001 ppm", isotopeCount: 33, stableIsotopes: "Rh-103",
    halfLife: "Barqaror", electronAffinity: "109.7 kJ/mol", valencElectrons: 9, period: 5, group: 9, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Katalitik konverterlar", "Ko'zgular", "Zargarlik qoplama", "Termoelementlar"],
    hazards: "Kam zaharli", naturalOccurrence: "Platina rudalari", covalentRadius: "142 pm", vanDerWaalsRadius: "195 pm"
  },
  { 
    symbol: "Pd", name: "Palladium", nameUz: "Palladiy", atomicNumber: 46, atomicMass: "106.42", category: "transition", electrons: "2,8,18,18", 
    description: "Katalizatorlar va zargarlik", 
    detailedInfo: "Avtomobil katalizatorlari, elektronika, tish protezelari va investitsiya metallari sifatida.",
    discoveryYear: "1803", discoveredBy: "Uilyam Uollaston", meltingPoint: "1555°C", boilingPoint: "2963°C",
    density: "12.023 g/cm³", electronegativity: "2.20", atomicRadius: "137 pm", ionizationEnergy: "804.4 kJ/mol",
    oxidationStates: "+2, +4", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "71.8 W/(m·K)",
    electricalResistivity: "105.4 nΩ·m", abundance: "Yer qobig'i: 0.015 ppm", isotopeCount: 35, stableIsotopes: "Pd-102, Pd-104, Pd-105, Pd-106, Pd-108, Pd-110",
    halfLife: "Barqaror", electronAffinity: "54.2 kJ/mol", valencElectrons: 10, period: 5, group: 10, block: "d",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Katalitik konverterlar", "Zargarlik", "Elektronika", "Tish protezelari", "Vodorod saqlash"],
    hazards: "Kam zaharli", naturalOccurrence: "Platina rudalari", covalentRadius: "139 pm", vanDerWaalsRadius: "202 pm"
  },
  { 
    symbol: "Ag", name: "Silver", nameUz: "Kumush", atomicNumber: 47, atomicMass: "107.87", category: "transition", electrons: "2,8,18,18,1", 
    description: "Eng yaxshi elektr o'tkazgich", 
    detailedInfo: "Zargarlik, tangalar, quyosh panellari, antibakterial vositalar va elektr kontaktlarda ishlatiladi.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "961.8°C", boilingPoint: "2162°C",
    density: "10.49 g/cm³", electronegativity: "1.93", atomicRadius: "144 pm", ionizationEnergy: "731 kJ/mol",
    oxidationStates: "+1", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "429 W/(m·K)",
    electricalResistivity: "15.87 nΩ·m", abundance: "Yer qobig'i: 0.075 ppm", isotopeCount: 38, stableIsotopes: "Ag-107, Ag-109",
    halfLife: "Barqaror", electronAffinity: "125.6 kJ/mol", valencElectrons: 11, period: 5, group: 11, block: "d",
    state: "Qattiq", color: "Kumush", origin: "Yulduzlar sintezi", 
    uses: ["Zargarlik", "Tangalar", "Elektr kontaktlar", "Quyosh panellari", "Antibakterial"],
    hazards: "Kam zaharli, argiria keltirib chiqarishi mumkin", naturalOccurrence: "Argentit, tug'ma kumush", covalentRadius: "145 pm", vanDerWaalsRadius: "172 pm"
  },
  { 
    symbol: "Cd", name: "Cadmium", nameUz: "Kadmiy", atomicNumber: 48, atomicMass: "112.41", category: "transition", electrons: "2,8,18,18,2", 
    description: "Batareyalar va bo'yoqlar", 
    detailedInfo: "Ni-Cd batareyalar, sariq pigment, galvanik qoplash va yadro reaktor nazoratida ishlatiladi.",
    discoveryYear: "1817", discoveredBy: "Karl Shtromeyer", meltingPoint: "321.1°C", boilingPoint: "767°C",
    density: "8.65 g/cm³", electronegativity: "1.69", atomicRadius: "151 pm", ionizationEnergy: "867.8 kJ/mol",
    oxidationStates: "+2", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "96.6 W/(m·K)",
    electricalResistivity: "72.7 nΩ·m", abundance: "Yer qobig'i: 0.15 ppm", isotopeCount: 38, stableIsotopes: "Cd-106, Cd-108, Cd-110, Cd-111, Cd-112, Cd-113, Cd-114, Cd-116",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 12, period: 5, group: 12, block: "d",
    state: "Qattiq", color: "Kumush-ko'k", origin: "Yulduzlar sintezi", 
    uses: ["Ni-Cd batareyalar", "Pigmentlar", "Qoplash", "Yadro reaktorlar", "Quyosh batareyalari"],
    hazards: "Juda zaharli, saraton keltirib chiqaradi", naturalOccurrence: "Sfalerit ichida", covalentRadius: "144 pm", vanDerWaalsRadius: "158 pm"
  },
  { 
    symbol: "In", name: "Indium", nameUz: "Indiy", atomicNumber: 49, atomicMass: "114.82", category: "metal", electrons: "2,8,18,18,3", 
    description: "Sensorli ekranlar", 
    detailedInfo: "LCD va sensorli ekranlar (ITO qoplama), quyosh batareyalari va past haroratli lehimlashda.",
    discoveryYear: "1863", discoveredBy: "Ferdinand Rayx va Xieronimus Rixter", meltingPoint: "156.6°C", boilingPoint: "2072°C",
    density: "7.31 g/cm³", electronegativity: "1.78", atomicRadius: "167 pm", ionizationEnergy: "558.3 kJ/mol",
    oxidationStates: "+1, +3", crystalStructure: "Tetragonal", magneticOrdering: "Diamagnetik", thermalConductivity: "81.8 W/(m·K)",
    electricalResistivity: "83.7 nΩ·m", abundance: "Yer qobig'i: 0.25 ppm", isotopeCount: 39, stableIsotopes: "In-113",
    halfLife: "In-115: 4.4×10¹⁴ yil", electronAffinity: "28.9 kJ/mol", valencElectrons: 3, period: 5, group: 13, block: "p",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["LCD ekranlar", "Sensorli ekranlar", "Quyosh batareyalari", "Lehimlash", "Yarim o'tkazgichlar"],
    hazards: "Kam zaharli", naturalOccurrence: "Sfalerit ichida", covalentRadius: "142 pm", vanDerWaalsRadius: "193 pm"
  },
  { 
    symbol: "Sn", name: "Tin", nameUz: "Qalay", atomicNumber: 50, atomicMass: "118.71", category: "metal", electrons: "2,8,18,18,4", 
    description: "Konserva bankalari va lehimlash", 
    detailedInfo: "Konserva bankalari qoplamalari, bronza qotishmasi, lehimlash va qalaylangan po'lat ishlab chiqarishda.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "231.9°C", boilingPoint: "2602°C",
    density: "7.31 g/cm³", electronegativity: "1.96", atomicRadius: "140 pm", ionizationEnergy: "708.6 kJ/mol",
    oxidationStates: "+2, +4", crystalStructure: "Tetragonal", magneticOrdering: "Diamagnetik", thermalConductivity: "66.8 W/(m·K)",
    electricalResistivity: "115 nΩ·m", abundance: "Yer qobig'i: 2.3 ppm", isotopeCount: 38, stableIsotopes: "Sn-112, Sn-114, Sn-115, Sn-116, Sn-117, Sn-118, Sn-119, Sn-120, Sn-122, Sn-124",
    halfLife: "Barqaror", electronAffinity: "107.3 kJ/mol", valencElectrons: 4, period: 5, group: 14, block: "p",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Konserva qoplama", "Lehimlash", "Bronza", "PVC stabilizator", "Shisha ishlab chiqarish"],
    hazards: "Organik birikmalari zaharli", naturalOccurrence: "Kassiterit", covalentRadius: "139 pm", vanDerWaalsRadius: "217 pm"
  },
  { 
    symbol: "Sb", name: "Antimony", nameUz: "Surma", atomicNumber: 51, atomicMass: "121.76", category: "metalloid", electrons: "2,8,18,18,5", 
    description: "Yonmaydigan qiluvchi va qotishmalar", 
    detailedInfo: "Yonmaydigan qiluvchi materiallar, batareyalar, qotishmalar va yarim o'tkazgichlarda ishlatiladi.",
    discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "630.6°C", boilingPoint: "1587°C",
    density: "6.697 g/cm³", electronegativity: "2.05", atomicRadius: "140 pm", ionizationEnergy: "834 kJ/mol",
    oxidationStates: "-3, +3, +5", crystalStructure: "Romboedr", magneticOrdering: "Diamagnetik", thermalConductivity: "24.4 W/(m·K)",
    electricalResistivity: "417 nΩ·m", abundance: "Yer qobig'i: 0.2 ppm", isotopeCount: 35, stableIsotopes: "Sb-121, Sb-123",
    halfLife: "Barqaror", electronAffinity: "103.2 kJ/mol", valencElectrons: 5, period: 5, group: 15, block: "p",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["Yonmaydigan qiluvchilar", "Akkumulyator qotishmasi", "Yarim o'tkazgichlar", "Plastik stabilizator"],
    hazards: "Zaharli", naturalOccurrence: "Stibnit", covalentRadius: "139 pm", vanDerWaalsRadius: "206 pm"
  },
  { 
    symbol: "Te", name: "Tellurium", nameUz: "Tellur", atomicNumber: 52, atomicMass: "127.60", category: "metalloid", electrons: "2,8,18,18,6", 
    description: "Quyosh batareyalari va CD/DVD", 
    detailedInfo: "CdTe quyosh batareyalari, CD/DVD qayta yozish qatlamlari va termoelektrik qurilmalarda.",
    discoveryYear: "1783", discoveredBy: "Frans-Jozef Myuller", meltingPoint: "449.5°C", boilingPoint: "988°C",
    density: "6.24 g/cm³", electronegativity: "2.1", atomicRadius: "123 pm", ionizationEnergy: "869.3 kJ/mol",
    oxidationStates: "-2, +2, +4, +6", crystalStructure: "Geksagonal", magneticOrdering: "Diamagnetik", thermalConductivity: "2.35 W/(m·K)",
    electricalResistivity: "10⁴ Ω·m", abundance: "Yer qobig'i: 0.001 ppm", isotopeCount: 38, stableIsotopes: "Te-120, Te-122, Te-123, Te-124, Te-125, Te-126, Te-128, Te-130",
    halfLife: "Barqaror", electronAffinity: "190.2 kJ/mol", valencElectrons: 6, period: 5, group: 16, block: "p",
    state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", 
    uses: ["CdTe quyosh batareyalari", "CD/DVD", "Termoelektrik", "Qotishmalar", "Vulkanizatsiya"],
    hazards: "Zaharli, sarimsoq hidi beradi", naturalOccurrence: "Kalaverit, tug'ma tellur", covalentRadius: "138 pm", vanDerWaalsRadius: "206 pm"
  },
  { 
    symbol: "I", name: "Iodine", nameUz: "Yod", atomicNumber: 53, atomicMass: "126.90", category: "halogen", electrons: "2,8,18,18,7", 
    description: "Qalqonsimon bez va antiseptik", 
    detailedInfo: "Qalqonsimon bez gormonlari, antiseptik, tuzdagi qo'shimcha va tibbiy tasvirlashda ishlatiladi.",
    discoveryYear: "1811", discoveredBy: "Bernar Kurtua", meltingPoint: "113.7°C", boilingPoint: "184.3°C",
    density: "4.933 g/cm³", electronegativity: "2.66", atomicRadius: "115 pm", ionizationEnergy: "1008.4 kJ/mol",
    oxidationStates: "-1, +1, +3, +5, +7", crystalStructure: "Ortorombik", magneticOrdering: "Diamagnetik", thermalConductivity: "0.449 W/(m·K)",
    electricalResistivity: "1.3×10⁷ Ω·m", abundance: "Yer qobig'i: 0.45 ppm", isotopeCount: 37, stableIsotopes: "I-127",
    halfLife: "Barqaror", electronAffinity: "295.2 kJ/mol", valencElectrons: 7, period: 5, group: 17, block: "p",
    state: "Qattiq", color: "Binafsha-qora", origin: "Yulduzlar sintezi", 
    uses: ["Tiroid gormonlar", "Antiseptik", "Yodlangan tuz", "Tibbiy tasvir", "Fotografiya"],
    hazards: "Teriga ta'sir qiladi, bug' ko'zni yallig'lantiradi", naturalOccurrence: "Dengiz suvi, yodoq minerallari", covalentRadius: "139 pm", vanDerWaalsRadius: "198 pm"
  },
  { 
    symbol: "Xe", name: "Xenon", nameUz: "Ksenon", atomicNumber: 54, atomicMass: "131.29", category: "noble", electrons: "2,8,18,18,8", 
    description: "Avto farlar va anesteziya", 
    detailedInfo: "Yuqori intensivlikdagi avto farlar, plazmali televizorlar, lazerlar va umumiy anesteziyada.",
    discoveryYear: "1898", discoveredBy: "Uilyam Remzi va Moris Trevers", meltingPoint: "-111.8°C", boilingPoint: "-108.1°C",
    density: "0.005887 g/cm³", electronegativity: "2.6", atomicRadius: "108 pm", ionizationEnergy: "1170.4 kJ/mol",
    oxidationStates: "0, +2, +4, +6, +8", crystalStructure: "Kubik yuzasi markazlangan", magneticOrdering: "Diamagnetik", thermalConductivity: "0.00565 W/(m·K)",
    electricalResistivity: "∞ (izolyator)", abundance: "Atmosfera: 0.09 ppm", isotopeCount: 36, stableIsotopes: "Xe-124, Xe-126, Xe-128, Xe-129, Xe-130, Xe-131, Xe-132, Xe-134, Xe-136",
    halfLife: "Barqaror", electronAffinity: "0 kJ/mol", valencElectrons: 8, period: 5, group: 18, block: "p",
    state: "Gaz", color: "Rangsiz", origin: "Yulduzlar sintezi", 
    uses: ["Avto farlar", "Plazmali TV", "Anesteziya", "Lazerlar", "Kosmik apparatlar"],
    hazards: "Bo'g'ilish xavfi", naturalOccurrence: "Atmosfera", covalentRadius: "140 pm", vanDerWaalsRadius: "216 pm"
  },
  
  // Period 6 - abbreviated for space, includes all elements 55-86
  { symbol: "Cs", name: "Cesium", nameUz: "Tseziy", atomicNumber: 55, atomicMass: "132.91", category: "alkali", electrons: "2,8,18,18,8,1", description: "Atom soatlari va fotosellalar", detailedInfo: "Atom soatlarda vaqt standartini belgilaydi. Fotosellalar, burg'ilash suyuqliklari va kimyoda.", discoveryYear: "1860", discoveredBy: "Robert Bunsen va Gustav Kirxgof", meltingPoint: "28.4°C", boilingPoint: "671°C", density: "1.93 g/cm³", electronegativity: "0.79", atomicRadius: "265 pm", ionizationEnergy: "375.7 kJ/mol", oxidationStates: "+1", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "35.9 W/(m·K)", electricalResistivity: "205 nΩ·m", abundance: "Yer qobig'i: 3 ppm", isotopeCount: 39, stableIsotopes: "Cs-133", halfLife: "Barqaror", electronAffinity: "45.5 kJ/mol", valencElectrons: 1, period: 6, group: 1, block: "s", state: "Qattiq", color: "Kumush-oltin", origin: "Yulduzlar sintezi", uses: ["Atom soatlar", "Fotosellalar", "Burg'ilash suyuqligi", "Ilmiy tadqiqot"], hazards: "Suv bilan portlovchi", naturalOccurrence: "Pollucit", covalentRadius: "244 pm", vanDerWaalsRadius: "343 pm" },
  { symbol: "Ba", name: "Barium", nameUz: "Bariy", atomicNumber: 56, atomicMass: "137.33", category: "alkaline", electrons: "2,8,18,18,8,2", description: "Rentgen tekshiruvi va ot-satqin", detailedInfo: "Rentgen kontrast modda (BaSO₄), yashil ot-satqin rangi, keramika va shisha ishlab chiqarishda.", discoveryYear: "1808", discoveredBy: "Gemfri Devi", meltingPoint: "727°C", boilingPoint: "1897°C", density: "3.51 g/cm³", electronegativity: "0.89", atomicRadius: "222 pm", ionizationEnergy: "502.9 kJ/mol", oxidationStates: "+2", crystalStructure: "Kubik markazlangan", magneticOrdering: "Paramagnetik", thermalConductivity: "18.4 W/(m·K)", electricalResistivity: "332 nΩ·m", abundance: "Yer qobig'i: 425 ppm", isotopeCount: 40, stableIsotopes: "Ba-130, Ba-132, Ba-134, Ba-135, Ba-136, Ba-137, Ba-138", halfLife: "Barqaror", electronAffinity: "13.95 kJ/mol", valencElectrons: 2, period: 6, group: 2, block: "s", state: "Qattiq", color: "Kumush-oq", origin: "Yulduzlar sintezi", uses: ["Rentgen kontrast", "Pirotexnika (yashil)", "Keramika", "Shisha", "Magnit materiallar"], hazards: "Eruvchi tuzlari zaharli", naturalOccurrence: "Barit, viterit", covalentRadius: "215 pm", vanDerWaalsRadius: "268 pm" },
  
  // Lanthanides (57-71)
  { symbol: "La", name: "Lanthanum", nameUz: "Lantan", atomicNumber: 57, atomicMass: "138.91", category: "lanthanide", electrons: "2,8,18,18,9,2", description: "Kamera linzalari va katalizatorlar", detailedInfo: "Yuqori sifatli kamera linzalari, neft qayta ishlash katalizatorlari va magnit materiallarida.", discoveryYear: "1839", discoveredBy: "Karl Mozander", meltingPoint: "920°C", boilingPoint: "3464°C", density: "6.162 g/cm³", electronegativity: "1.1", atomicRadius: "187 pm", ionizationEnergy: "538.1 kJ/mol", oxidationStates: "+3", valencElectrons: 3, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Kamera linzalari", "Katalizatorlar", "Magnit materiallar", "Batareyalar"], hazards: "Chang yonuvchan" },
  { symbol: "Ce", name: "Cerium", nameUz: "Seriy", atomicNumber: 58, atomicMass: "140.12", category: "lanthanide", electrons: "2,8,18,19,9,2", description: "Katalizatorlar va sayqallash", detailedInfo: "Avtomobil katalizatorlari, shisha sayqallash, O'z-O'zini tozalaydigan pechlar va LED fosforida.", discoveryYear: "1803", discoveredBy: "Yons Yakob Berselius", meltingPoint: "795°C", boilingPoint: "3443°C", density: "6.770 g/cm³", electronegativity: "1.12", atomicRadius: "181.8 pm", ionizationEnergy: "534.4 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 4, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Katalizatorlar", "Shisha sayqallash", "LED fosfor", "O'z-o'zini tozalaydigan pechlar"], hazards: "Chang yonuvchan" },
  { symbol: "Pr", name: "Praseodymium", nameUz: "Prazeodim", atomicNumber: 59, atomicMass: "140.91", category: "lanthanide", electrons: "2,8,18,21,8,2", description: "Kuchli magnit va bo'yoqlar", detailedInfo: "Kuchli doimiy magnitlar, samolyot dvigatellari, shisha ranglash va karbon yoy lampalarida.", discoveryYear: "1885", discoveredBy: "Karl Auer fon Velsbach", meltingPoint: "931°C", boilingPoint: "3520°C", density: "6.77 g/cm³", electronegativity: "1.13", atomicRadius: "182 pm", ionizationEnergy: "527 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 5, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Magnitlar", "Shisha ranglash", "Samolyot dvigatellari", "Lazerlar"], hazards: "Chang yonuvchan" },
  { symbol: "Nd", name: "Neodymium", nameUz: "Neodim", atomicNumber: 60, atomicMass: "144.24", category: "lanthanide", electrons: "2,8,18,22,8,2", description: "Eng kuchli doimiy magnit", detailedInfo: "NdFeB magnitlar (eng kuchli). Elektr motorlar, quloqchinlar, shamol turbinalari va MRI skanerlarida.", discoveryYear: "1885", discoveredBy: "Karl Auer fon Velsbach", meltingPoint: "1021°C", boilingPoint: "3074°C", density: "7.01 g/cm³", electronegativity: "1.14", atomicRadius: "181 pm", ionizationEnergy: "533.1 kJ/mol", oxidationStates: "+3", valencElectrons: 6, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["NdFeB magnitlar", "Elektr motorlar", "Quloqchinlar", "Shamol turbinalari", "MRI"], hazards: "Chang yonuvchan" },
  { symbol: "Pm", name: "Promethium", nameUz: "Prometiy", atomicNumber: 61, atomicMass: "(145)", category: "lanthanide", electrons: "2,8,18,23,8,2", description: "Radioaktiv, ilmiy tadqiqotlar", detailedInfo: "Yadro batareyalari, luminestent bo'yoqlar va qalinlik o'lchagichlarida ishlatiladi. Tabiiy emas.", discoveryYear: "1945", discoveredBy: "Chon Marinski va boshqalar", meltingPoint: "1042°C", boilingPoint: "3000°C", density: "7.26 g/cm³", electronegativity: "1.13", ionizationEnergy: "540 kJ/mol", oxidationStates: "+3", valencElectrons: 7, period: 6, group: 3, block: "f", state: "Qattiq", color: "Metall", halfLife: "Pm-145: 17.7 yil", uses: ["Yadro batareyalar", "Luminestent bo'yoqlar", "Qalinlik o'lchagich"], hazards: "Radioaktiv" },
  { symbol: "Sm", name: "Samarium", nameUz: "Samariy", atomicNumber: 62, atomicMass: "150.36", category: "lanthanide", electrons: "2,8,18,24,8,2", description: "Kuchli magnit va lazerlar", detailedInfo: "SmCo magnitlar (yuqori haroratga chidamli), lazerlar, yadro reaktorlar va saraton terapiyasida.", discoveryYear: "1879", discoveredBy: "Pol-Emil Lecoq de Boisbodran", meltingPoint: "1072°C", boilingPoint: "1900°C", density: "7.52 g/cm³", electronegativity: "1.17", atomicRadius: "180 pm", ionizationEnergy: "544.5 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 8, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["SmCo magnitlar", "Lazerlar", "Yadro reaktorlar", "Saraton terapiya"], hazards: "Chang yonuvchan" },
  { symbol: "Eu", name: "Europium", nameUz: "Yevropiy", atomicNumber: 63, atomicMass: "151.96", category: "lanthanide", electrons: "2,8,18,25,8,2", description: "Fosfor, qizil rang", detailedInfo: "TV va LED fosforlari (qizil rang), laser materiallar va yevro banknotalarini himoyalashda.", discoveryYear: "1901", discoveredBy: "Evgen Demarsey", meltingPoint: "822°C", boilingPoint: "1529°C", density: "5.264 g/cm³", electronegativity: "1.2", atomicRadius: "180 pm", ionizationEnergy: "547.1 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 9, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["LED fosfor (qizil)", "Banknot himoyasi", "Lazerlar", "Yadro boshqaruv"], hazards: "Chang yonuvchan" },
  { symbol: "Gd", name: "Gadolinium", nameUz: "Gadoliniy", atomicNumber: 64, atomicMass: "157.25", category: "lanthanide", electrons: "2,8,18,25,9,2", description: "MRI kontrasti va magnit", detailedInfo: "MRI kontrast modda, yadro reaktor nazoroti, magnit sovutish va ma'lumot saqlash qurilmalarida.", discoveryYear: "1880", discoveredBy: "Jan de Marinnyak", meltingPoint: "1313°C", boilingPoint: "3273°C", density: "7.90 g/cm³", electronegativity: "1.20", atomicRadius: "180 pm", ionizationEnergy: "593.4 kJ/mol", oxidationStates: "+3", valencElectrons: 10, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["MRI kontrast", "Yadro reaktorlar", "Magnit sovutish", "Ma'lumot saqlash"], hazards: "Chang yonuvchan, MRI kontrast xavfli bo'lishi mumkin" },
  { symbol: "Tb", name: "Terbium", nameUz: "Terbiy", atomicNumber: 65, atomicMass: "158.93", category: "lanthanide", electrons: "2,8,18,27,8,2", description: "Yashil fosfor va magnitlar", detailedInfo: "LED va ekran fosforlari (yashil rang), magnit materiallar va yuqori aniqlikdagi sensorlarda.", discoveryYear: "1843", discoveredBy: "Karl Mozander", meltingPoint: "1356°C", boilingPoint: "3230°C", density: "8.23 g/cm³", electronegativity: "1.2", atomicRadius: "177 pm", ionizationEnergy: "565.8 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 11, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["LED fosfor (yashil)", "Magnitlar", "Sensorlar", "Qattiq qotishmalar"], hazards: "Chang yonuvchan" },
  { symbol: "Dy", name: "Dysprosium", nameUz: "Disproziy", atomicNumber: 66, atomicMass: "162.50", category: "lanthanide", electrons: "2,8,18,28,8,2", description: "Yuqori haroratli magnit", detailedInfo: "Neodim magnitlarni yaxshilaydi. Yadro reaktorlar, lazerlar va magnit qurilmalarda ishlatiladi.", discoveryYear: "1886", discoveredBy: "Pol-Emil Lecoq de Boisbodran", meltingPoint: "1412°C", boilingPoint: "2567°C", density: "8.540 g/cm³", electronegativity: "1.22", atomicRadius: "178 pm", ionizationEnergy: "573.0 kJ/mol", oxidationStates: "+3", valencElectrons: 12, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Magnit yaxshilash", "Yadro reaktorlar", "Lazerlar", "Ma'lumot saqlash"], hazards: "Chang yonuvchan" },
  { symbol: "Ho", name: "Holmium", nameUz: "Golmiy", atomicNumber: 67, atomicMass: "164.93", category: "lanthanide", electrons: "2,8,18,29,8,2", description: "Eng kuchli magnit xususiyat", detailedInfo: "Lazerlar (tibbiy jarrohlik), magnit maydon konsentratorlari va yadro reaktorlarda ishlatiladi.", discoveryYear: "1878", discoveredBy: "Mark Delafontaine va Jaques-Lui Soret", meltingPoint: "1474°C", boilingPoint: "2700°C", density: "8.79 g/cm³", electronegativity: "1.23", atomicRadius: "176 pm", ionizationEnergy: "581.0 kJ/mol", oxidationStates: "+3", valencElectrons: 13, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Tibbiy lazerlar", "Magnit maydon", "Yadro reaktorlar", "Spektroskopiya"], hazards: "Chang yonuvchan" },
  { symbol: "Er", name: "Erbium", nameUz: "Erbiy", atomicNumber: 68, atomicMass: "167.26", category: "lanthanide", electrons: "2,8,18,30,8,2", description: "Optik tolalar va lazerlar", detailedInfo: "Optik tola kuchaytirgichlari, lazerlar (terini davolash), rangli shisha va qotishmalarda.", discoveryYear: "1843", discoveredBy: "Karl Mozander", meltingPoint: "1529°C", boilingPoint: "2868°C", density: "9.066 g/cm³", electronegativity: "1.24", atomicRadius: "176 pm", ionizationEnergy: "589.3 kJ/mol", oxidationStates: "+3", valencElectrons: 14, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Optik tola kuchaytirgich", "Dermatologiya lazerlari", "Rangli shisha", "Yadro texnologiya"], hazards: "Chang yonuvchan" },
  { symbol: "Tm", name: "Thulium", nameUz: "Tuliy", atomicNumber: 69, atomicMass: "168.93", category: "lanthanide", electrons: "2,8,18,31,8,2", description: "Rentgen manbalari va lazerlar", detailedInfo: "Portativ rentgen qurilmalari, lazerlar (prostat davolash) va sintillatorlarda ishlatiladi.", discoveryYear: "1879", discoveredBy: "Per Teodor Kleve", meltingPoint: "1545°C", boilingPoint: "1950°C", density: "9.32 g/cm³", electronegativity: "1.25", atomicRadius: "176 pm", ionizationEnergy: "596.7 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 15, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Portativ rentgen", "Tibbiy lazerlar", "Sintillatorlar", "Yuqori harorat superо'tkazgichlar"], hazards: "Chang yonuvchan" },
  { symbol: "Yb", name: "Ytterbium", nameUz: "Itterbiy", atomicNumber: 70, atomicMass: "173.05", category: "lanthanide", electrons: "2,8,18,32,8,2", description: "Atom soatlari va lazerlar", detailedInfo: "Eng aniq atom soatlari, yuqori quvvatli lazerlar, Yer qimirlashini o'lchash va qotishmalarda.", discoveryYear: "1878", discoveredBy: "Jan de Marinnyak", meltingPoint: "824°C", boilingPoint: "1196°C", density: "6.90 g/cm³", electronegativity: "1.1", atomicRadius: "176 pm", ionizationEnergy: "603.4 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 16, period: 6, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", uses: ["Atom soatlar", "Yuqori quvvatli lazerlar", "Seysmik o'lchash", "Qotishmalar"], hazards: "Chang yonuvchan" },
  { symbol: "Lu", name: "Lutetium", nameUz: "Lutetsiy", atomicNumber: 71, atomicMass: "174.97", category: "lanthanide", electrons: "2,8,18,32,9,2", description: "PET skanerlar va katalizatorlar", detailedInfo: "PET skanerlar uchun sintillatorlar, neft qayta ishlash katalizatorlari va saraton davolashda.", discoveryYear: "1907", discoveredBy: "Jorj Urban va Karl Auer fon Velsbach", meltingPoint: "1663°C", boilingPoint: "3402°C", density: "9.841 g/cm³", electronegativity: "1.27", atomicRadius: "174 pm", ionizationEnergy: "523.5 kJ/mol", oxidationStates: "+3", valencElectrons: 3, period: 6, group: 3, block: "d", state: "Qattiq", color: "Kumush-oq", uses: ["PET skaner sintillator", "Neft katalizatorlari", "Saraton terapiya", "LED fosfor"], hazards: "Chang yonuvchan" },
  
  // Continue with elements 72-86
  { symbol: "Hf", name: "Hafnium", nameUz: "Gafniy", atomicNumber: 72, atomicMass: "178.49", category: "transition", electrons: "2,8,18,32,10,2", description: "Mikrochiplar va yadro reaktorlar", detailedInfo: "Kompyuter chiplarida oksid qatlamlari, yadro reaktor nazorati va plasma qirqishda ishlatiladi.", discoveryYear: "1923", discoveredBy: "Dirk Koster va Georg de Xeveshi", meltingPoint: "2233°C", boilingPoint: "4603°C", density: "13.31 g/cm³", electronegativity: "1.3", atomicRadius: "159 pm", ionizationEnergy: "658.5 kJ/mol", oxidationStates: "+4", valencElectrons: 4, period: 6, group: 4, block: "d", state: "Qattiq", color: "Kumush-kulrang", uses: ["Mikrochiplar", "Yadro reaktorlar", "Plasma kesish", "Yuqori harorat qotishmalar"], hazards: "Chang yonuvchan" },
  { symbol: "Ta", name: "Tantalum", nameUz: "Tantal", atomicNumber: 73, atomicMass: "180.95", category: "transition", electrons: "2,8,18,32,11,2", description: "Kondensatorlar va tibbiy implantlar", detailedInfo: "Elektronika kondensatorlari, jarrohlik implantlar, kimyoviy idishlar va qattiq qotishmalarda.", discoveryYear: "1802", discoveredBy: "Anders Ekeberg", meltingPoint: "3017°C", boilingPoint: "5458°C", density: "16.69 g/cm³", electronegativity: "1.5", atomicRadius: "146 pm", ionizationEnergy: "761 kJ/mol", oxidationStates: "+5", valencElectrons: 5, period: 6, group: 5, block: "d", state: "Qattiq", color: "Kulrang-ko'k", uses: ["Kondensatorlar", "Tibbiy implantlar", "Kimyoviy idishlar", "Qattiq qotishmalar"], hazards: "Chang yonuvchan" },
  { symbol: "W", name: "Tungsten", nameUz: "Volfram", atomicNumber: 74, atomicMass: "183.84", category: "transition", electrons: "2,8,18,32,12,2", description: "Eng yuqori erish harorati", detailedInfo: "Lampa tolalari, elektr yoy payvandlash, raketa nozzellari va rentgen trubkalarida ishlatiladi.", discoveryYear: "1783", discoveredBy: "Xuan Xose va Fausto Elhuyar", meltingPoint: "3422°C", boilingPoint: "5555°C", density: "19.25 g/cm³", electronegativity: "2.36", atomicRadius: "139 pm", ionizationEnergy: "770 kJ/mol", oxidationStates: "+2, +3, +4, +5, +6", valencElectrons: 6, period: 6, group: 6, block: "d", state: "Qattiq", color: "Kulrang-oq", uses: ["Lampa tolalari", "Payvandlash elektrodlari", "Qattiq qotishmalar", "Rentgen trubkalari"], hazards: "Chang nafas olishga xavfli" },
  { symbol: "Re", name: "Rhenium", nameUz: "Reniy", atomicNumber: 75, atomicMass: "186.21", category: "transition", electrons: "2,8,18,32,13,2", description: "Yuqori haroratli qotishmalar", detailedInfo: "Samolyot va raketa dvigatellari, yuqori haroratli termojuftlar va neft qayta ishlash katalizatorlarida.", discoveryYear: "1925", discoveredBy: "Valter Noddak va boshqalar", meltingPoint: "3186°C", boilingPoint: "5596°C", density: "21.02 g/cm³", electronegativity: "1.9", atomicRadius: "137 pm", ionizationEnergy: "760 kJ/mol", oxidationStates: "+4, +6, +7", valencElectrons: 7, period: 6, group: 7, block: "d", state: "Qattiq", color: "Kumush-oq", uses: ["Jet dvigatel qotishmalar", "Termojuftlar", "Katalizatorlar", "Elektr kontaktlar"], hazards: "Chang xavfli" },
  { symbol: "Os", name: "Osmium", nameUz: "Osmiy", atomicNumber: 76, atomicMass: "190.23", category: "transition", electrons: "2,8,18,32,14,2", description: "Eng zich element", detailedInfo: "Qattiq qotishmalar, elektr kontaktlar, qalam uchlari va o'tkir jarrohlik asboblarida ishlatiladi.", discoveryYear: "1803", discoveredBy: "Smithson Tennant", meltingPoint: "3033°C", boilingPoint: "5012°C", density: "22.59 g/cm³", electronegativity: "2.2", atomicRadius: "135 pm", ionizationEnergy: "840 kJ/mol", oxidationStates: "+2, +3, +4, +8", valencElectrons: 8, period: 6, group: 8, block: "d", state: "Qattiq", color: "Ko'kimtir-oq", uses: ["Qattiq qotishmalar", "Qalam uchlari", "Elektr kontaktlar", "O'tkir asboblar"], hazards: "OsO₄ juda zaharli" },
  { symbol: "Ir", name: "Iridium", nameUz: "Iridiy", atomicNumber: 77, atomicMass: "192.22", category: "transition", electrons: "2,8,18,32,15,2", description: "Juda qattiq va korroziyaga chidamli", detailedInfo: "Uchqun svechalari, qalam uchlari, tigulli, saraton terapiyasi va standart o'lchovlar.", discoveryYear: "1803", discoveredBy: "Smithson Tennant", meltingPoint: "2446°C", boilingPoint: "4428°C", density: "22.56 g/cm³", electronegativity: "2.20", atomicRadius: "136 pm", ionizationEnergy: "880 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 9, period: 6, group: 9, block: "d", state: "Qattiq", color: "Kumush-oq", uses: ["Uchqun svechalari", "Qalam uchlari", "Standart o'lchovlar", "Saraton terapiya"], hazards: "Chang ko'z yallig'lanishi" },
  { symbol: "Pt", name: "Platinum", nameUz: "Platina", atomicNumber: 78, atomicMass: "195.08", category: "transition", electrons: "2,8,18,32,17,1", description: "Qimmatbaho metall, katalizatorlar", detailedInfo: "Zargarlik, katalizatorlar (avtomobil, kimyo), elektrodlar, tibbiy asboblar va investitsiya metallari.", discoveryYear: "1735", discoveredBy: "Antonio de Ulloa", meltingPoint: "1768°C", boilingPoint: "3825°C", density: "21.45 g/cm³", electronegativity: "2.28", atomicRadius: "139 pm", ionizationEnergy: "870 kJ/mol", oxidationStates: "+2, +4", valencElectrons: 10, period: 6, group: 10, block: "d", state: "Qattiq", color: "Kumush-oq", uses: ["Zargarlik", "Katalizatorlar", "Elektrodlar", "Tibbiy asboblar", "Investitsiya"], hazards: "Kam zaharli" },
  { symbol: "Au", name: "Gold", nameUz: "Oltin", atomicNumber: 79, atomicMass: "196.97", category: "transition", electrons: "2,8,18,32,18,1", description: "Qimmatbaho metall, zargarlik", detailedInfo: "Zargarlik, elektronika, tish protezelari, tangalar, investitsiya va kosmik apparatlar qoplamasi.", discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "1064.2°C", boilingPoint: "2856°C", density: "19.30 g/cm³", electronegativity: "2.54", atomicRadius: "144 pm", ionizationEnergy: "890.1 kJ/mol", oxidationStates: "+1, +3", valencElectrons: 11, period: 6, group: 11, block: "d", state: "Qattiq", color: "Oltin sariq", uses: ["Zargarlik", "Elektronika", "Tish protezelari", "Investitsiya", "Kosmik qoplama"], hazards: "Kam zaharli" },
  { symbol: "Hg", name: "Mercury", nameUz: "Simob", atomicNumber: 80, atomicMass: "200.59", category: "transition", electrons: "2,8,18,32,18,2", description: "Xona haroratida suyuq metall", detailedInfo: "Termometrlar, barometrlar, lyuminestsent lampalar, stomatolоgiya amalgamalari. Zaharli!", discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "-38.8°C", boilingPoint: "356.7°C", density: "13.534 g/cm³", electronegativity: "2.00", atomicRadius: "151 pm", ionizationEnergy: "1007.1 kJ/mol", oxidationStates: "+1, +2", valencElectrons: 12, period: 6, group: 12, block: "d", state: "Suyuq", color: "Kumush", uses: ["Termometrlar", "Barometrlar", "Lyuminestsent lampalar", "Amalgama"], hazards: "Juda zaharli, nerv sistemasiga ta'sir qiladi" },
  { symbol: "Tl", name: "Thallium", nameUz: "Talliy", atomicNumber: 81, atomicMass: "204.38", category: "metal", electrons: "2,8,18,32,18,3", description: "Yuqori zaharli, ilmiy tadqiqotlar", detailedInfo: "Sintillatorlar (yadro tibbiyot), optik linzalar, yuqori harorat superо'tkazgichlari. Juda zaharli!", discoveryYear: "1861", discoveredBy: "Uilyam Kruks", meltingPoint: "304°C", boilingPoint: "1473°C", density: "11.85 g/cm³", electronegativity: "1.62", atomicRadius: "170 pm", ionizationEnergy: "589.4 kJ/mol", oxidationStates: "+1, +3", valencElectrons: 3, period: 6, group: 13, block: "p", state: "Qattiq", color: "Kumush-oq", uses: ["Sintillatorlar", "Optik linzalar", "Superо'tkazgichlar", "Pestitsidlar (ilgari)"], hazards: "Juda zaharli, o'lim olib kelishi mumkin" },
  { symbol: "Pb", name: "Lead", nameUz: "Qo'rg'oshin", atomicNumber: 82, atomicMass: "207.2", category: "metal", electrons: "2,8,18,32,18,4", description: "Og'ir metall, batareyalar va himoya", detailedInfo: "Avtomobil akkumulyatorlari, radiatsiyadan himoya, keramika sirkalari va qalaylash. Zaharli!", discoveryYear: "Qadimdan ma'lum", discoveredBy: "Noma'lum", meltingPoint: "327.5°C", boilingPoint: "1749°C", density: "11.34 g/cm³", electronegativity: "1.87", atomicRadius: "175 pm", ionizationEnergy: "715.6 kJ/mol", oxidationStates: "+2, +4", valencElectrons: 4, period: 6, group: 14, block: "p", state: "Qattiq", color: "Ko'kimtir-kulrang", uses: ["Akkumulyatorlar", "Radiatsiya himoyasi", "Lehimlash (ilgari)", "Keramika"], hazards: "Zaharli, bolalar aql rivojlanishiga ta'sir qiladi" },
  { symbol: "Bi", name: "Bismuth", nameUz: "Vismut", atomicNumber: 83, atomicMass: "208.98", category: "metal", electrons: "2,8,18,32,18,5", description: "Past eruvchi qotishmalar, dorilar", detailedInfo: "Oshqozon dorilar, kosmetika, past eruvchi qotishmalar (yong'in detektorlari) va zargarlikda.", discoveryYear: "1753", discoveredBy: "Klod Joffrua", meltingPoint: "271.4°C", boilingPoint: "1564°C", density: "9.78 g/cm³", electronegativity: "2.02", atomicRadius: "156 pm", ionizationEnergy: "703 kJ/mol", oxidationStates: "+3, +5", valencElectrons: 5, period: 6, group: 15, block: "p", state: "Qattiq", color: "Kumush-pushti", uses: ["Oshqozon dorilari", "Kosmetika", "Past eruvchi qotishmalar", "Yong'in detektorlari"], hazards: "Kam zaharli" },
  { symbol: "Po", name: "Polonium", nameUz: "Poloniy", atomicNumber: 84, atomicMass: "(209)", category: "metalloid", electrons: "2,8,18,32,18,6", description: "Radioaktiv, statik elektr", detailedInfo: "Statik elektr neytrallashtiruvchilari, kosmik apparatlar uchun issiqlik manbalari. Juda radioaktiv!", discoveryYear: "1898", discoveredBy: "Mariya va Per Kyuri", meltingPoint: "254°C", boilingPoint: "962°C", density: "9.196 g/cm³", electronegativity: "2.0", atomicRadius: "168 pm", ionizationEnergy: "812.1 kJ/mol", oxidationStates: "+2, +4", valencElectrons: 6, period: 6, group: 16, block: "p", state: "Qattiq", color: "Kumush", halfLife: "Po-209: 125 yil", uses: ["Statik neytrallashtirish", "Kosmik issiqlik manbalari", "Ilmiy tadqiqot"], hazards: "Juda radioaktiv va zaharli" },
  { symbol: "At", name: "Astatine", nameUz: "Astatin", atomicNumber: 85, atomicMass: "(210)", category: "halogen", electrons: "2,8,18,32,18,7", description: "Eng noyob tabiiy element", detailedInfo: "Tiroid xavfli o'smalari davolashda. Yerda juda oz miqdorda, juda radioaktiv.", discoveryYear: "1940", discoveredBy: "Deyl Korson va boshqalar", meltingPoint: "302°C", boilingPoint: "337°C", density: "~7 g/cm³", electronegativity: "2.2", atomicRadius: "150 pm", ionizationEnergy: "890 kJ/mol", oxidationStates: "-1, +1, +3, +5, +7", valencElectrons: 7, period: 6, group: 17, block: "p", state: "Qattiq", color: "Qora (taxminiy)", halfLife: "At-210: 8.1 soat", uses: ["Saraton terapiyasi", "Ilmiy tadqiqot"], hazards: "Juda radioaktiv" },
  { symbol: "Rn", name: "Radon", nameUz: "Radon", atomicNumber: 86, atomicMass: "(222)", category: "noble", electrons: "2,8,18,32,18,8", description: "Radioaktiv gaz, sog'liq xavfi", detailedInfo: "Zilzilalarni bashorat qilish, saraton terapiyasi va radiografiyada. Xonalarga kirib kelishi xavfli!", discoveryYear: "1900", discoveredBy: "Fridrix Dorn", meltingPoint: "-71°C", boilingPoint: "-61.7°C", density: "0.00973 g/cm³", electronegativity: "2.2", atomicRadius: "120 pm", ionizationEnergy: "1037 kJ/mol", oxidationStates: "0", valencElectrons: 8, period: 6, group: 18, block: "p", state: "Gaz", color: "Rangsiz", halfLife: "Rn-222: 3.8 kun", uses: ["Zilzila bashorati", "Saraton terapiya", "Radiografiya"], hazards: "Radioaktiv, o'pka saratoniga sabab bo'ladi" },
  
  // Period 7 and Actinides (87-118)
  { symbol: "Fr", name: "Francium", nameUz: "Frantsiy", atomicNumber: 87, atomicMass: "(223)", category: "alkali", electrons: "2,8,18,32,18,8,1", description: "Juda noyob radioaktiv element", detailedInfo: "Ilmiy tadqiqotlarda. Har qanday vaqtda Yerda taxminan 30g mavjud. Juda reaktiv va radioaktiv.", discoveryYear: "1939", discoveredBy: "Margarita Perey", meltingPoint: "27°C", boilingPoint: "677°C", density: "~2.9 g/cm³", electronegativity: "0.79", atomicRadius: "348 pm", ionizationEnergy: "380 kJ/mol", oxidationStates: "+1", valencElectrons: 1, period: 7, group: 1, block: "s", state: "Qattiq", color: "Metall (taxminiy)", halfLife: "Fr-223: 22 daqiqa", uses: ["Ilmiy tadqiqot"], hazards: "Juda radioaktiv va reaktiv" },
  { symbol: "Ra", name: "Radium", nameUz: "Radiy", atomicNumber: 88, atomicMass: "(226)", category: "alkaline", electrons: "2,8,18,32,18,8,2", description: "Radioaktiv, tibbiyotda ishlatilgan", detailedInfo: "Ilgari saraton terapiyasida. Lyuminestsent bo'yoqlarda ishlatilgan (endi man etilgan). Juda radioaktiv!", discoveryYear: "1898", discoveredBy: "Mariya va Per Kyuri", meltingPoint: "700°C", boilingPoint: "1737°C", density: "5.5 g/cm³", electronegativity: "0.9", atomicRadius: "215 pm", ionizationEnergy: "509.3 kJ/mol", oxidationStates: "+2", valencElectrons: 2, period: 7, group: 2, block: "s", state: "Qattiq", color: "Kumush-oq", halfLife: "Ra-226: 1600 yil", uses: ["Ilgari saraton terapiyasida", "Ilgari lyuminestsent bo'yoqlarda"], hazards: "Juda radioaktiv, suyak saratoni xavfi" },
  { symbol: "Ac", name: "Actinium", nameUz: "Aktiniy", atomicNumber: 89, atomicMass: "(227)", category: "actinide", electrons: "2,8,18,32,18,9,2", description: "Radioaktiv, saraton terapiyasi", detailedInfo: "Saraton terapiyasi uchun alfa nurlanish manbai. Neytron manbasi va ilmiy tadqiqotlarda ishlatiladi.", discoveryYear: "1899", discoveredBy: "Andre-Lui Debiern", meltingPoint: "1050°C", boilingPoint: "3200°C", density: "10.07 g/cm³", electronegativity: "1.1", atomicRadius: "195 pm", ionizationEnergy: "499 kJ/mol", oxidationStates: "+3", valencElectrons: 3, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", halfLife: "Ac-227: 21.8 yil", uses: ["Saraton terapiyasi", "Neytron manbasi", "Ilmiy tadqiqot"], hazards: "Juda radioaktiv" },
  { symbol: "Th", name: "Thorium", nameUz: "Toriy", atomicNumber: 90, atomicMass: "232.04", category: "actinide", electrons: "2,8,18,32,18,10,2", description: "Kelajak yadro yonilg'isi", detailedInfo: "Yadro reaktorlar yonilg'isi (kelajakda), gaz mantiyalari, shisha sayqallash va magnitlarda.", discoveryYear: "1828", discoveredBy: "Yons Yakob Berselius", meltingPoint: "1750°C", boilingPoint: "4788°C", density: "11.72 g/cm³", electronegativity: "1.3", atomicRadius: "179 pm", ionizationEnergy: "587 kJ/mol", oxidationStates: "+4", valencElectrons: 4, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", halfLife: "Th-232: 14 mlrd yil", uses: ["Kelajak yadro yonilg'isi", "Gaz mantiyalari", "Shisha sayqallash"], hazards: "Radioaktiv" },
  { symbol: "Pa", name: "Protactinium", nameUz: "Protaktiniy", atomicNumber: 91, atomicMass: "231.04", category: "actinide", electrons: "2,8,18,32,20,9,2", description: "Juda noyob, ilmiy tadqiqotlar", detailedInfo: "Asosan ilmiy tadqiqotlarda. Juda noyob va radioaktiv, amaliy qo'llanilishi kam.", discoveryYear: "1913", discoveredBy: "Kazimir Fayans va Oswald Gering", meltingPoint: "1572°C", boilingPoint: "4000°C", density: "15.37 g/cm³", electronegativity: "1.5", atomicRadius: "163 pm", ionizationEnergy: "568 kJ/mol", oxidationStates: "+4, +5", valencElectrons: 5, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-metall", halfLife: "Pa-231: 32760 yil", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv va zaharli" },
  { symbol: "U", name: "Uranium", nameUz: "Uran", atomicNumber: 92, atomicMass: "238.03", category: "actinide", electrons: "2,8,18,32,21,9,2", description: "Yadro energiyasi va qurollar", detailedInfo: "Yadro elektr stantsiyalari yonilg'isi (U-235), yadro qurollar, radiometrik sana aniqlash va shisha ranglashda.", discoveryYear: "1789", discoveredBy: "Martin Klaproth", meltingPoint: "1135°C", boilingPoint: "4131°C", density: "19.05 g/cm³", electronegativity: "1.38", atomicRadius: "156 pm", ionizationEnergy: "597.6 kJ/mol", oxidationStates: "+3, +4, +5, +6", valencElectrons: 6, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-kulrang", halfLife: "U-238: 4.5 mlrd yil", uses: ["Yadro energiyasi", "Yadro qurollar", "Sana aniqlash", "Shisha ranglash"], hazards: "Radioaktiv va zaharli" },
  { symbol: "Np", name: "Neptunium", nameUz: "Neptuniy", atomicNumber: 93, atomicMass: "(237)", category: "actinide", electrons: "2,8,18,32,22,9,2", description: "Sun'iy, neutron detektorlari", detailedInfo: "Neutron detektorlari, plutoniy ishlab chiqarish va ilmiy tadqiqotlarda. Birinchi transuranik element.", discoveryYear: "1940", discoveredBy: "Edvin MakMillan va Filip Abelson", meltingPoint: "644°C", boilingPoint: "3902°C", density: "20.45 g/cm³", electronegativity: "1.36", atomicRadius: "155 pm", ionizationEnergy: "604.5 kJ/mol", oxidationStates: "+3, +4, +5, +6, +7", valencElectrons: 7, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-metall", halfLife: "Np-237: 2.14 mln yil", uses: ["Neytron detektorlari", "Plutoniy ishlab chiqarish", "Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Pu", name: "Plutonium", nameUz: "Plutoniy", atomicNumber: 94, atomicMass: "(244)", category: "actinide", electrons: "2,8,18,32,24,8,2", description: "Yadro yonilg'isi va qurollar", detailedInfo: "Yadro qurollar, kosmik apparatlar energiya manbalari (RTG) va ilmiy tadqiqotlarda ishlatiladi.", discoveryYear: "1940", discoveredBy: "Glenn Siborg va boshqalar", meltingPoint: "640°C", boilingPoint: "3228°C", density: "19.84 g/cm³", electronegativity: "1.28", atomicRadius: "159 pm", ionizationEnergy: "584.7 kJ/mol", oxidationStates: "+3, +4, +5, +6, +7", valencElectrons: 8, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", halfLife: "Pu-244: 80 mln yil", uses: ["Yadro qurollar", "RTG energiya manbalari", "Ilmiy tadqiqot"], hazards: "Juda radioaktiv va zaharli" },
  { symbol: "Am", name: "Americium", nameUz: "Ameritsiy", atomicNumber: 95, atomicMass: "(243)", category: "actinide", electrons: "2,8,18,32,25,8,2", description: "Tutun detektorlari", detailedInfo: "Uy tutun detektorlari, neft qazmalarni tekshirish va portativ rentgen qurilmalarida ishlatiladi.", discoveryYear: "1944", discoveredBy: "Glenn Siborg va boshqalar", meltingPoint: "1176°C", boilingPoint: "2011°C", density: "12 g/cm³", electronegativity: "1.3", atomicRadius: "173 pm", ionizationEnergy: "578 kJ/mol", oxidationStates: "+3, +4, +5, +6", valencElectrons: 9, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush-oq", halfLife: "Am-243: 7370 yil", uses: ["Tutun detektorlari", "Neft qazma tekshiruvi", "Portativ rentgen"], hazards: "Radioaktiv" },
  { symbol: "Cm", name: "Curium", nameUz: "Kyuriy", atomicNumber: 96, atomicMass: "(247)", category: "actinide", electrons: "2,8,18,32,25,9,2", description: "Alfa nurlanish manbai", detailedInfo: "Kosmik apparatlar energiya manbalari, alfa zarralar manbai va ilmiy tadqiqotlarda ishlatiladi.", discoveryYear: "1944", discoveredBy: "Glenn Siborg va boshqalar", meltingPoint: "1345°C", boilingPoint: "3110°C", density: "13.51 g/cm³", electronegativity: "1.3", atomicRadius: "174 pm", ionizationEnergy: "581 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 10, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush", halfLife: "Cm-247: 15.6 mln yil", uses: ["Kosmik energiya manbalari", "Alfa zarralar manbai", "Ilmiy tadqiqot"], hazards: "Juda radioaktiv" },
  { symbol: "Bk", name: "Berkelium", nameUz: "Berkeliy", atomicNumber: 97, atomicMass: "(247)", category: "actinide", electrons: "2,8,18,32,27,8,2", description: "Sun'iy, ilmiy tadqiqotlar", detailedInfo: "Og'irroq elementlar sintezi va ilmiy tadqiqotlarda. Juda noyob, faqat laboratoriyada ishlab chiqariladi.", discoveryYear: "1949", discoveredBy: "Glenn Siborg va boshqalar", meltingPoint: "986°C", boilingPoint: "2627°C", density: "14.78 g/cm³", electronegativity: "1.3", atomicRadius: "170 pm", ionizationEnergy: "601 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 11, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush", halfLife: "Bk-247: 1380 yil", uses: ["Og'ir elementlar sintezi", "Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Cf", name: "Californium", nameUz: "Kaliforniy", atomicNumber: 98, atomicMass: "(251)", category: "actinide", electrons: "2,8,18,32,28,8,2", description: "Kuchli neutron manbai", detailedInfo: "Saraton terapiyasi, neft qatlamlarini tahlil, aeroport xavfsizligi va ilmiy tadqiqotlarda.", discoveryYear: "1950", discoveredBy: "Glenn Siborg va boshqalar", meltingPoint: "900°C", boilingPoint: "1470°C", density: "15.1 g/cm³", electronegativity: "1.3", atomicRadius: "186 pm", ionizationEnergy: "608 kJ/mol", oxidationStates: "+3, +4", valencElectrons: 12, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush", halfLife: "Cf-251: 898 yil", uses: ["Neytron manbai", "Saraton terapiyasi", "Neft qatlam tahlili", "Xavfsizlik tekshiruvi"], hazards: "Juda radioaktiv" },
  { symbol: "Es", name: "Einsteinium", nameUz: "Eynshteyniy", atomicNumber: 99, atomicMass: "(252)", category: "actinide", electrons: "2,8,18,32,29,8,2", description: "Ilmiy tadqiqotlar, juda noyob", detailedInfo: "Asosan ilmiy tadqiqotlarda og'irroq elementlarni o'rganishda. Juda noyob va radioaktiv.", discoveryYear: "1952", discoveredBy: "Albert Giyorso va boshqalar", meltingPoint: "860°C", boilingPoint: "996°C", density: "8.84 g/cm³", electronegativity: "1.3", ionizationEnergy: "619 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 13, period: 7, group: 3, block: "f", state: "Qattiq", color: "Kumush", halfLife: "Es-252: 471 kun", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Fm", name: "Fermium", nameUz: "Fermiy", atomicNumber: 100, atomicMass: "(257)", category: "actinide", electrons: "2,8,18,32,30,8,2", description: "Ilmiy tadqiqotlar, sun'iy", detailedInfo: "Atom va yadro fizikasi tadqiqotlarida. Birinchi vodorod bombasi portlashida topilgan.", discoveryYear: "1952", discoveredBy: "Albert Giyorso va boshqalar", meltingPoint: "1527°C", boilingPoint: "~1800°C", density: "~9.7 g/cm³", electronegativity: "1.3", ionizationEnergy: "627 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 14, period: 7, group: 3, block: "f", state: "Qattiq", color: "Noma'lum", halfLife: "Fm-257: 100 kun", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Md", name: "Mendelevium", nameUz: "Mendeleviy", atomicNumber: 101, atomicMass: "(258)", category: "actinide", electrons: "2,8,18,32,31,8,2", description: "Mendeleev sharafiga nomlangan", detailedInfo: "Faqat ilmiy tadqiqotlar uchun. Atom bir-biridan sintez qilinadi, juda noyob element.", discoveryYear: "1955", discoveredBy: "Albert Giyorso va boshqalar", meltingPoint: "827°C", boilingPoint: "~1100°C", density: "~10.3 g/cm³", electronegativity: "1.3", ionizationEnergy: "635 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 15, period: 7, group: 3, block: "f", state: "Qattiq", color: "Noma'lum", halfLife: "Md-258: 51 kun", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "No", name: "Nobelium", nameUz: "Nobeliy", atomicNumber: 102, atomicMass: "(259)", category: "actinide", electrons: "2,8,18,32,32,8,2", description: "Nobel sharafiga nomlangan", detailedInfo: "Ilmiy tadqiqotlarda. Nobel mukofoti sohibi Alfred Nobel sharafiga nomlangan, juda noyob.", discoveryYear: "1958", discoveredBy: "Albert Giyorso va boshqalar", meltingPoint: "827°C", boilingPoint: "~1100°C", density: "~9.9 g/cm³", electronegativity: "1.3", ionizationEnergy: "642 kJ/mol", oxidationStates: "+2, +3", valencElectrons: 16, period: 7, group: 3, block: "f", state: "Qattiq", color: "Noma'lum", halfLife: "No-259: 58 daqiqa", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Lr", name: "Lawrencium", nameUz: "Lourensiy", atomicNumber: 103, atomicMass: "(266)", category: "actinide", electrons: "2,8,18,32,32,8,3", description: "Sun'iy, ilmiy tadqiqotlar", detailedInfo: "Faqat ilmiy tadqiqotlar. Ernest Lawrence sharafiga nomlangan, juda qisqa yarim yemirilish davri.", discoveryYear: "1961", discoveredBy: "Albert Giyorso va boshqalar", meltingPoint: "1627°C", boilingPoint: "~2500°C", density: "~14.4 g/cm³", electronegativity: "1.3", ionizationEnergy: "470 kJ/mol", oxidationStates: "+3", valencElectrons: 3, period: 7, group: 3, block: "d", state: "Qattiq", color: "Noma'lum", halfLife: "Lr-266: 11 soat", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  
  // Transactinides (104-118)
  { symbol: "Rf", name: "Rutherfordium", nameUz: "Ruterfordiy", atomicNumber: 104, atomicMass: "(267)", category: "transition", electrons: "2,8,18,32,32,10,2", description: "Birinchi transaktinid element", detailedInfo: "Faqat laboratoriya tadqiqotlari. Rutherford sharafiga nomlangan, bir necha sekund yashaydi.", discoveryYear: "1964", discoveredBy: "Dubna/Berkeley", meltingPoint: "~2100°C", boilingPoint: "~5500°C", density: "~23 g/cm³", ionizationEnergy: "580 kJ/mol", oxidationStates: "+4", valencElectrons: 4, period: 7, group: 4, block: "d", state: "Qattiq", halfLife: "Rf-267: 1.3 soat", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Db", name: "Dubnium", nameUz: "Dubniy", atomicNumber: 105, atomicMass: "(268)", category: "transition", electrons: "2,8,18,32,32,11,2", description: "Sun'iy superog'ir element", detailedInfo: "Dubna shahri sharafiga nomlangan. Faqat ilmiy tadqiqotlarda, juda qisqa umr.", discoveryYear: "1967", discoveredBy: "Dubna", meltingPoint: "~3500°C", boilingPoint: "~5500°C", density: "~29 g/cm³", ionizationEnergy: "665 kJ/mol", oxidationStates: "+5", valencElectrons: 5, period: 7, group: 5, block: "d", state: "Qattiq", halfLife: "Db-268: 29 soat", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Sg", name: "Seaborgium", nameUz: "Siborgiy", atomicNumber: 106, atomicMass: "(269)", category: "transition", electrons: "2,8,18,32,32,12,2", description: "Seaborg sharafiga nomlangan", detailedInfo: "Glenn Seaborg sharafiga nomlangan yagona biron kishi hayotida nomlangan element. Juda noyob.", discoveryYear: "1974", discoveredBy: "Berkeley/Dubna", meltingPoint: "~3500°C", boilingPoint: "~5500°C", density: "~35 g/cm³", ionizationEnergy: "757 kJ/mol", oxidationStates: "+6", valencElectrons: 6, period: 7, group: 6, block: "d", state: "Qattiq", halfLife: "Sg-269: 14 daqiqa", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Bh", name: "Bohrium", nameUz: "Boriy", atomicNumber: 107, atomicMass: "(270)", category: "transition", electrons: "2,8,18,32,32,13,2", description: "Niels Bohr sharafiga", detailedInfo: "Niels Bohr sharafiga nomlangan. Faqat atom bir-biridan sintez qilinadi, mikrosekundlar davomida mavjud.", discoveryYear: "1981", discoveredBy: "Darmstadt", meltingPoint: "~4000°C", boilingPoint: "~6000°C", density: "~37 g/cm³", ionizationEnergy: "743 kJ/mol", oxidationStates: "+7", valencElectrons: 7, period: 7, group: 7, block: "d", state: "Qattiq", halfLife: "Bh-270: 61 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Hs", name: "Hassium", nameUz: "Hassiy", atomicNumber: 108, atomicMass: "(277)", category: "transition", electrons: "2,8,18,32,32,14,2", description: "Sun'iy superog'ir element", detailedInfo: "Germaniyaning Hessen viloyati sharafiga. Juda qisqa yarim yemirilish davri, faqat tadqiqot maqsadida.", discoveryYear: "1984", discoveredBy: "Darmstadt", meltingPoint: "~4000°C", boilingPoint: "~6000°C", density: "~41 g/cm³", ionizationEnergy: "733 kJ/mol", oxidationStates: "+8", valencElectrons: 8, period: 7, group: 8, block: "d", state: "Qattiq", halfLife: "Hs-277: 11 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Mt", name: "Meitnerium", nameUz: "Maytneriy", atomicNumber: 109, atomicMass: "(278)", category: "transition", electrons: "2,8,18,32,32,15,2", description: "Lise Meitner sharafiga", detailedInfo: "Lise Meitner (ayol fizik) sharafiga nomlangan. Millisekund davomida mavjud, faqat tadqiqotlarda.", discoveryYear: "1982", discoveredBy: "Darmstadt", meltingPoint: "~4000°C", boilingPoint: "~6000°C", density: "~37 g/cm³", ionizationEnergy: "800 kJ/mol", oxidationStates: "+3, +6", valencElectrons: 9, period: 7, group: 9, block: "d", state: "Qattiq", halfLife: "Mt-278: 4.5 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Ds", name: "Darmstadtium", nameUz: "Darmshtadtiy", atomicNumber: 110, atomicMass: "(281)", category: "transition", electrons: "2,8,18,32,32,17,1", description: "Germaniya shahri sharafiga", detailedInfo: "Darmstadt shahri sharafiga nomlangan. Juda noyob va qisqa umr, faqat ilmiy tadqiqotlarda.", discoveryYear: "1994", discoveredBy: "Darmstadt", meltingPoint: "~4000°C", boilingPoint: "~6000°C", density: "~34 g/cm³", ionizationEnergy: "868 kJ/mol", oxidationStates: "+6", valencElectrons: 10, period: 7, group: 10, block: "d", state: "Qattiq", halfLife: "Ds-281: 14 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Rg", name: "Roentgenium", nameUz: "Rentgeniy", atomicNumber: 111, atomicMass: "(282)", category: "transition", electrons: "2,8,18,32,32,18,1", description: "Rentgen sharafiga nomlangan", detailedInfo: "Wilhelm Röntgen (rentgen kashfiyotchisi) sharafiga. Millisekund davomida mavjud.", discoveryYear: "1994", discoveredBy: "Darmstadt", meltingPoint: "~4000°C", boilingPoint: "~6000°C", density: "~28 g/cm³", ionizationEnergy: "1020 kJ/mol", oxidationStates: "+3, +5", valencElectrons: 11, period: 7, group: 11, block: "d", state: "Qattiq", halfLife: "Rg-282: 100 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Cn", name: "Copernicium", nameUz: "Kopernikiy", atomicNumber: 112, atomicMass: "(285)", category: "transition", electrons: "2,8,18,32,32,18,2", description: "Kopernik sharafiga nomlangan", detailedInfo: "Nikolay Kopernik sharafiga. Juda qisqa umr, faqat bir necha atomlar sintez qilingan.", discoveryYear: "1996", discoveredBy: "Darmstadt", meltingPoint: "~283°C", boilingPoint: "~357°C", density: "~14 g/cm³", ionizationEnergy: "1155 kJ/mol", oxidationStates: "+2", valencElectrons: 12, period: 7, group: 12, block: "d", state: "Suyuq (taxminiy)", halfLife: "Cn-285: 29 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Nh", name: "Nihonium", nameUz: "Nihoniy", atomicNumber: 113, atomicMass: "(286)", category: "metal", electrons: "2,8,18,32,32,18,3", description: "Yaponiya tomonidan kashf etilgan", detailedInfo: "Yaponiya ('Nihon') nomi bilan. Yaponlar kashf etgan birinchi element, juda qisqa umr.", discoveryYear: "2004", discoveredBy: "RIKEN (Yaponiya)", meltingPoint: "~430°C", boilingPoint: "~1100°C", density: "~16 g/cm³", ionizationEnergy: "707 kJ/mol", oxidationStates: "+1, +3", valencElectrons: 3, period: 7, group: 13, block: "p", state: "Qattiq", halfLife: "Nh-286: 9.5 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Fl", name: "Flerovium", nameUz: "Fleroviy", atomicNumber: 114, atomicMass: "(289)", category: "metal", electrons: "2,8,18,32,32,18,4", description: "Flerov sharafiga nomlangan", detailedInfo: "Georgy Flerov (rus fizik) sharafiga. Bir necha sekund yashaydi, faqat tadqiqot maqsadida.", discoveryYear: "1999", discoveredBy: "Dubna/Livermore", meltingPoint: "~70°C", boilingPoint: "~150°C", density: "~14 g/cm³", ionizationEnergy: "832 kJ/mol", oxidationStates: "+2, +4", valencElectrons: 4, period: 7, group: 14, block: "p", state: "Qattiq yoki suyuq", halfLife: "Fl-289: 2.6 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Mc", name: "Moscovium", nameUz: "Moskoviy", atomicNumber: 115, atomicMass: "(290)", category: "metal", electrons: "2,8,18,32,32,18,5", description: "Moskva sharafiga nomlangan", detailedInfo: "Moskva viloyati sharafiga nomlangan. Juda qisqa yarim yemirilish davri, bir necha atomlar sintez qilingan.", discoveryYear: "2003", discoveredBy: "Dubna/Livermore", meltingPoint: "~400°C", boilingPoint: "~1100°C", density: "~13.5 g/cm³", ionizationEnergy: "538 kJ/mol", oxidationStates: "+1, +3", valencElectrons: 5, period: 7, group: 15, block: "p", state: "Qattiq", halfLife: "Mc-290: 0.8 sekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Lv", name: "Livermorium", nameUz: "Livermoriy", atomicNumber: 116, atomicMass: "(293)", category: "metal", electrons: "2,8,18,32,32,18,6", description: "Livermore sharafiga", detailedInfo: "Lawrence Livermore laboratoriyasi sharafiga. Millisekund davomida mavjud, juda noyob.", discoveryYear: "2000", discoveredBy: "Dubna/Livermore", meltingPoint: "~364-507°C", boilingPoint: "~762-862°C", density: "~12.9 g/cm³", ionizationEnergy: "664 kJ/mol", oxidationStates: "+2, +4", valencElectrons: 6, period: 7, group: 16, block: "p", state: "Qattiq", halfLife: "Lv-293: 61 millisekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Ts", name: "Tennessine", nameUz: "Tennesin", atomicNumber: 117, atomicMass: "(294)", category: "halogen", electrons: "2,8,18,32,32,18,7", description: "Tennessee shtati sharafiga", detailedInfo: "AQShning Tennessee shtati sharafiga. Eng og'ir galogen, faqat bir necha atomlar yaratilgan.", discoveryYear: "2010", discoveredBy: "Dubna/Oak Ridge", meltingPoint: "~350-550°C", boilingPoint: "~610°C", density: "~7.2 g/cm³", ionizationEnergy: "743 kJ/mol", oxidationStates: "-1, +1, +3, +5", valencElectrons: 7, period: 7, group: 17, block: "p", state: "Qattiq", halfLife: "Ts-294: 78 millisekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
  { symbol: "Og", name: "Oganesson", nameUz: "Oganesson", atomicNumber: 118, atomicMass: "(294)", category: "noble", electrons: "2,8,18,32,32,18,8", description: "Eng og'ir element", detailedInfo: "Yuriy Oganesyan sharafiga. Eng og'ir va eng oxirgi tasdiqlangan element. Mikrosekundlar yashaydi.", discoveryYear: "2006", discoveredBy: "Dubna/Livermore", meltingPoint: "~52°C", boilingPoint: "~177°C", density: "~5 g/cm³", ionizationEnergy: "839 kJ/mol", oxidationStates: "0, +2, +4", valencElectrons: 8, period: 7, group: 18, block: "p", state: "Qattiq (taxminiy)", halfLife: "Og-294: 0.89 millisekund", uses: ["Ilmiy tadqiqot"], hazards: "Radioaktiv" },
];
