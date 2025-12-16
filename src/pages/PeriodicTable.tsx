import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AtomVisualization, NucleusVisualization } from "@/components/AtomVisualization";
import { NuclearStability } from "@/components/NuclearStability";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Element {
  symbol: string;
  name: string;
  nameUz: string;
  atomicNumber: number;
  atomicMass: string;
  category: string;
  electrons: string;
  description: string;
  detailedInfo?: string;
  // Extended properties (30+ fields)
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

const elements: Element[] = [
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
  { symbol: "Na", name: "Sodium", nameUz: "Natriy", atomicNumber: 11, atomicMass: "22.99", category: "alkali", electrons: "2,8,1", description: "Osh tuzi (NaCl) tarkibida", detailedInfo: "Nerv impulslari va muskul harakati uchun zarur. Sabun, shisha va kimyoviy ishlab chiqarishda ishlatiladi." },
  { symbol: "Mg", name: "Magnesium", nameUz: "Magniy", atomicNumber: 12, atomicMass: "24.31", category: "alkaline", electrons: "2,8,2", description: "Yengil va mustahkam qotishmalarda", detailedInfo: "Xlorofill molekulasi markazida. Samolyot qismlari, avtomobil g'ildiraklari va noutbuk korpuslarida ishlatiladi." },
  { symbol: "Al", name: "Aluminum", nameUz: "Alyuminiy", atomicNumber: 13, atomicMass: "26.98", category: "metal", electrons: "2,8,3", description: "Yengil va korroziyaga chidamli", detailedInfo: "Eng ko'p ishlatiluvchi metall (po'latdan keyin). Quti-bankalar, folga, samolyotlar va qurilishda ishlatiladi." },
  { symbol: "Si", name: "Silicon", nameUz: "Kremniy", atomicNumber: 14, atomicMass: "28.09", category: "metalloid", electrons: "2,8,4", description: "Mikrochiplar va qum tarkibida", detailedInfo: "Yarim o'tkazgichlar va mikrochiplar asosi. Yer qobig'ida kisloroddan keyin ikkinchi eng ko'p element." },
  { symbol: "P", name: "Phosphorus", nameUz: "Fosfor", atomicNumber: 15, atomicMass: "30.97", category: "nonmetal", electrons: "2,8,5", description: "DNK va ATP tarkibida muhim", detailedInfo: "DNK, RNK va ATP molekulalarida mavjud. O'g'itlar, gugurt va portlovchi moddalarda ishlatiladi." },
  { symbol: "S", name: "Sulfur", nameUz: "Oltingugurt", atomicNumber: 16, atomicMass: "32.07", category: "nonmetal", electrons: "2,8,6", description: "Oqsil va kislotalar tarkibida", detailedInfo: "Aminokislotalar va vitaminlar tarkibida. Sulfat kislota, vulkanizatsiya va dorilar ishlab chiqarishda." },
  { symbol: "Cl", name: "Chlorine", nameUz: "Xlor", atomicNumber: 17, atomicMass: "35.45", category: "halogen", electrons: "2,8,7", description: "Dezinfeksiya va osh tuzi tarkibida", detailedInfo: "Suv tozalash, plastmassalar (PVC) va qog'oz oqartirish uchun ishlatiladi. Oshxona tuzining tarkibiy qismi." },
  { symbol: "Ar", name: "Argon", nameUz: "Argon", atomicNumber: 18, atomicMass: "39.95", category: "noble", electrons: "2,8,8", description: "Payvandlashda himoya gazi sifatida", detailedInfo: "Havodagi eng ko'p inert gaz (1%). Payvandlash, elektr lampochkalari va oyna ishlab chiqarishda ishlatiladi." },
  
  // Period 4
  { symbol: "K", name: "Potassium", nameUz: "Kaliy", atomicNumber: 19, atomicMass: "39.10", category: "alkali", electrons: "2,8,8,1", description: "O'g'it va tirik organizmlar uchun zarur", detailedInfo: "Nerv-muskul faoliyati uchun muhim. Qishloq xo'jalik o'g'itlari va kimyoviy sanoatda ishlatiladi." },
  { symbol: "Ca", name: "Calcium", nameUz: "Kaltsiy", atomicNumber: 20, atomicMass: "40.08", category: "alkaline", electrons: "2,8,8,2", description: "Suyak va tish tarkibida", detailedInfo: "Suyak va tish mineral qismi (gidroksiapatit). Sement, ohak va o'g'it ishlab chiqarishda ishlatiladi." },
  { symbol: "Sc", name: "Scandium", nameUz: "Skandiy", atomicNumber: 21, atomicMass: "44.96", category: "transition", electrons: "2,8,9,2", description: "Yengil qotishmalarda ishlatiladi", detailedInfo: "Sport anjomlari va samolyot qismlari uchun yuqori sifatli alyuminiy qotishmalarida ishlatiladi." },
  { symbol: "Ti", name: "Titanium", nameUz: "Titan", atomicNumber: 22, atomicMass: "47.87", category: "transition", electrons: "2,8,10,2", description: "Kuchli va yengil, korroziyaga chidamli", detailedInfo: "Samolyotlar, raketa qismlari, tibbiy implantlar va sport jihozlarida. Po'latdek mustahkam, lekin 45% yengilroq." },
  { symbol: "V", name: "Vanadium", nameUz: "Vanadiy", atomicNumber: 23, atomicMass: "50.94", category: "transition", electrons: "2,8,11,2", description: "Po'lat qotishmalarini mustahkamlaydi", detailedInfo: "Yuqori sifatli po'lat va asboblar ishlab chiqarishda. Batareyalar va katalizatorlarda ham ishlatiladi." },
  { symbol: "Cr", name: "Chromium", nameUz: "Xrom", atomicNumber: 24, atomicMass: "52.00", category: "transition", electrons: "2,8,13,1", description: "Metall qoplamalar va bo'yoqlar", detailedInfo: "Zanglamaydigan po'lat (18% Cr). Metall yuzalarni yorqin qoplash va turli rangli bo'yoqlar ishlab chiqarishda." },
  { symbol: "Mn", name: "Manganese", nameUz: "Marganets", atomicNumber: 25, atomicMass: "54.94", category: "transition", electrons: "2,8,13,2", description: "Po'lat ishlab chiqarishda muhim", detailedInfo: "Po'lat sifatini yaxshilaydi, oksidlanishni oldini oladi. Alyuminiy bankalari va batareyalarda ishlatiladi." },
  { symbol: "Fe", name: "Iron", nameUz: "Temir", atomicNumber: 26, atomicMass: "55.85", category: "transition", electrons: "2,8,14,2", description: "Gemoglobin va po'lat ishlab chiqarish", detailedInfo: "Eng ko'p ishlatiluvchi metall. Gemoglobinda kislorod tashish, qurilish va transport vositalarida asosiy material." },
  { symbol: "Co", name: "Cobalt", nameUz: "Kobalt", atomicNumber: 27, atomicMass: "58.93", category: "transition", electrons: "2,8,15,2", description: "Vitamin B12 tarkibida", detailedInfo: "Magnit materiallar, Li-ion batareyalar va vitamin B12 (kobalamin) tarkibida. Ko'k rang beradi." },
  { symbol: "Ni", name: "Nickel", nameUz: "Nikel", atomicNumber: 28, atomicMass: "58.69", category: "transition", electrons: "2,8,16,2", description: "Zanglamaydigan po'lat va tangalar", detailedInfo: "Zanglamaydigan po'lat (8-10% Ni), batareyalar, magnit materiallar va tangalarda ishlatiladi." },
  { symbol: "Cu", name: "Copper", nameUz: "Mis", atomicNumber: 29, atomicMass: "63.55", category: "transition", electrons: "2,8,18,1", description: "Elektr simlar va sanitariya quvurlari", detailedInfo: "Eng yaxshi elektr o'tkazgich (kumushdan keyin). Elektr simlari, sanitariya, elektrоnika va bronza qotishmasida." },
  { symbol: "Zn", name: "Zinc", nameUz: "Rux", atomicNumber: 30, atomicMass: "65.38", category: "transition", electrons: "2,8,18,2", description: "Fermentlar va metall qoplash", detailedInfo: "100+ fermentlarda mavjud. Temir zangdan himoya qilish (galvanizatsiya), qotishmalar va batareyalarda." },
  { symbol: "Ga", name: "Gallium", nameUz: "Galliy", atomicNumber: 31, atomicMass: "69.72", category: "metal", electrons: "2,8,18,3", description: "Past erish harorati, yarim o'tkazgich", detailedInfo: "Qo'lda eriydi (29.8°C). LED lampalar, quyosh batareyalari va mikroelektronikada ishlatiladi." },
  { symbol: "Ge", name: "Germanium", nameUz: "Germaniy", atomicNumber: 32, atomicMass: "72.63", category: "metalloid", electrons: "2,8,18,4", description: "Optik tolalar va yarim o'tkazgichlar", detailedInfo: "Optik tolalar, infraqizil optika va yarim o'tkazgich qurilmalarda. Birinchi tranzistorlar Ge dan yasalgan." },
  { symbol: "As", name: "Arsenic", nameUz: "Mishyak", atomicNumber: 33, atomicMass: "74.92", category: "metalloid", electrons: "2,8,18,5", description: "Zaharli, lekin yarim o'tkazgichlarda", detailedInfo: "Yuqori zaharli, ammo yarim o'tkazgichlar (GaAs), yog'och konservanti va o'tkazgichlarida ishlatiladi." },
  { symbol: "Se", name: "Selenium", nameUz: "Selen", atomicNumber: 34, atomicMass: "78.96", category: "nonmetal", electrons: "2,8,18,6", description: "Antioksidant, fotosellalarda", detailedInfo: "Muhim mikroelement. Fotokopiya mashinalari, quyosh batareyalari va shisha ishlab chiqarishda ishlatiladi." },
  { symbol: "Br", name: "Bromine", nameUz: "Brom", atomicNumber: 35, atomicMass: "79.90", category: "halogen", electrons: "2,8,18,7", description: "Xona haroratida suyuq galogen", detailedInfo: "Yonmaydigan qiluvchi moddalar, dorilar, fotografiya va suv tozalashda ishlatiladi. Qizil-jigarrang suyuqlik." },
  { symbol: "Kr", name: "Krypton", nameUz: "Kripton", atomicNumber: 36, atomicMass: "83.80", category: "noble", electrons: "2,8,18,8", description: "Yuqori intensivlikdagi lampalar", detailedInfo: "Lazer texnologiyasi, avto faralar va yorug'lik reklamalarda ishlatiladi. Oq yorug'lik beradi." },
  
  // Period 5
  { symbol: "Rb", name: "Rubidium", nameUz: "Rubidiy", atomicNumber: 37, atomicMass: "85.47", category: "alkali", electrons: "2,8,18,8,1", description: "Atom soatlar va ilmiy tadqiqotlar", detailedInfo: "Atom soatlarda, fotosellalarda va tibbiy tasvirlashda ishlatiladi. Juda yumshoq va reaktiv metall." },
  { symbol: "Sr", name: "Strontium", nameUz: "Stronsiy", atomicNumber: 38, atomicMass: "87.62", category: "alkaline", electrons: "2,8,18,8,2", description: "Ot-satqin uchun va pirotexnikada", detailedInfo: "Qizil rang beradi (ot-satqinda). Suyak kasalliklari davolash va magnit materiallarida ishlatiladi." },
  { symbol: "Y", name: "Yttrium", nameUz: "Ittriy", atomicNumber: 39, atomicMass: "88.91", category: "transition", electrons: "2,8,18,9,2", description: "Yuqori haroratli supero'tkazgichlar", detailedInfo: "LED lampalar, lazerlar, superо'tkazgichlar va qattiq oksid yonilg'i xujayralarida ishlatiladi." },
  { symbol: "Zr", name: "Zirconium", nameUz: "Tsirkoniy", atomicNumber: 40, atomicMass: "91.22", category: "transition", electrons: "2,8,18,10,2", description: "Yadro reaktorlari va zargarlik", detailedInfo: "Yadro reaktor quvurlari, zargarlik buyumlari (kubik tsirkoniya) va keramikada ishlatiladi." },
  { symbol: "Nb", name: "Niobium", nameUz: "Niobiy", atomicNumber: 41, atomicMass: "92.91", category: "transition", electrons: "2,8,18,12,1", description: "Superо'tkazgichlar va po'lat qotishma", detailedInfo: "Yuqori haroratli qotishmalar, MRI skanerlari uchun superо'tkazgichlar va zargarlikda ishlatiladi." },
  { symbol: "Mo", name: "Molybdenum", nameUz: "Molibden", atomicNumber: 42, atomicMass: "95.95", category: "transition", electrons: "2,8,18,13,1", description: "Po'lat qotishmalarini mustahkamlaydi", detailedInfo: "Yuqori haroratli po'lat qotishmalari, fermentlar va katalitik konverterlarda ishlatiladi." },
  { symbol: "Tc", name: "Technetium", nameUz: "Texnetsiy", atomicNumber: 43, atomicMass: "(98)", category: "transition", electrons: "2,8,18,13,2", description: "Birinchi sun'iy element, radioaktiv", detailedInfo: "Tibbiy diagnostikada (skanerlash), korroziyani oldini olish va ilmiy tadqiqotlarda ishlatiladi." },
  { symbol: "Ru", name: "Ruthenium", nameUz: "Ruteniy", atomicNumber: 44, atomicMass: "101.07", category: "transition", electrons: "2,8,18,15,1", description: "Qimmatbaho metall, elektrоnika", detailedInfo: "Qattiq disk drayvlar, elektr kontaktlar, katalizatorlar va zargarlik buyumlarida ishlatiladi." },
  { symbol: "Rh", name: "Rhodium", nameUz: "Rodiy", atomicNumber: 45, atomicMass: "102.91", category: "transition", electrons: "2,8,18,16,1", description: "Eng qimmat metall, katalizatorlar", detailedInfo: "Avtomobil katalitik konverterlari, oynalar uchun ko'zgular va zargarlikda qoplama sifatida ishlatiladi." },
  { symbol: "Pd", name: "Palladium", nameUz: "Palladiy", atomicNumber: 46, atomicMass: "106.42", category: "transition", electrons: "2,8,18,18", description: "Katalizatorlar va zargarlik", detailedInfo: "Avtomobil katalizatorlari, elektronika, tish protezelari va investitsiya metallari sifatida." },
  { symbol: "Ag", name: "Silver", nameUz: "Kumush", atomicNumber: 47, atomicMass: "107.87", category: "transition", electrons: "2,8,18,18,1", description: "Eng yaxshi elektr o'tkazgich", detailedInfo: "Zargarlik, tangalar, quyosh panellari, antibakterial vositalar va elektr kontaktlarda ishlatiladi." },
  { symbol: "Cd", name: "Cadmium", nameUz: "Kadmiy", atomicNumber: 48, atomicMass: "112.41", category: "transition", electrons: "2,8,18,18,2", description: "Batareyalar va bo'yoqlar", detailedInfo: "Ni-Cd batareyalar, sariq pigment, galvanik qoplash va yadro reaktor nazoratida ishlatiladi." },
  { symbol: "In", name: "Indium", nameUz: "Indiy", atomicNumber: 49, atomicMass: "114.82", category: "metal", electrons: "2,8,18,18,3", description: "Sensorli ekranlar", detailedInfo: "LCD va sensorli ekranlar (ITO qoplama), quyosh batareyalari va past haroratli lehimlashda." },
  { symbol: "Sn", name: "Tin", nameUz: "Qalay", atomicNumber: 50, atomicMass: "118.71", category: "metal", electrons: "2,8,18,18,4", description: "Konserva bankalari va lehimlash", detailedInfo: "Konserva bankalari qoplamalari, bronza qotishmasi, lehimlash va qalaylangan po'lat ishlab chiqarishda." },
  { symbol: "Sb", name: "Antimony", nameUz: "Surma", atomicNumber: 51, atomicMass: "121.76", category: "metalloid", electrons: "2,8,18,18,5", description: "Yonmaydigan qiluvchi va qotishmalar", detailedInfo: "Yonmaydigan qiluvchi materiallar, batareyalar, qotishmalar va yarim o'tkazgichlarda ishlatiladi." },
  { symbol: "Te", name: "Tellurium", nameUz: "Tellur", atomicNumber: 52, atomicMass: "127.60", category: "metalloid", electrons: "2,8,18,18,6", description: "Quyosh batareyalari va CD/DVD", detailedInfo: "CdTe quyosh batareyalari, CD/DVD qayta yozish qatlamlari va termoelektrik qurilmalarda." },
  { symbol: "I", name: "Iodine", nameUz: "Yod", atomicNumber: 53, atomicMass: "126.90", category: "halogen", electrons: "2,8,18,18,7", description: "Qalqonsimon bez va antiseptik", detailedInfo: "Qalqonsimon bez gormonlari, antiseptik, tuzdagi qo'shimcha va tibbiy tasvirlashda ishlatiladi." },
  { symbol: "Xe", name: "Xenon", nameUz: "Ksenon", atomicNumber: 54, atomicMass: "131.29", category: "noble", electrons: "2,8,18,18,8", description: "Avto faralar va anesteziya", detailedInfo: "Yuqori intensivlikdagi avto faralar, plazmali televizorlar, lazerlar va umumiy anesteziyada." },
  
  // Period 6
  { symbol: "Cs", name: "Cesium", nameUz: "Tseziy", atomicNumber: 55, atomicMass: "132.91", category: "alkali", electrons: "2,8,18,18,8,1", description: "Atom soatlari va fotosellalar", detailedInfo: "Atom soatlarda vaqt standartini belgilaydi. Fotosellalar, burg'ilash suyuqliklari va kimyoda." },
  { symbol: "Ba", name: "Barium", nameUz: "Bariy", atomicNumber: 56, atomicMass: "137.33", category: "alkaline", electrons: "2,8,18,18,8,2", description: "Rentgen tekshiruvi va ot-satqin", detailedInfo: "Rentgen kontrast modda (BaSO₄), yashil ot-satqin rangi, keramika va shisha ishlab chiqarishda." },
  { symbol: "La", name: "Lanthanum", nameUz: "Lantan", atomicNumber: 57, atomicMass: "138.91", category: "lanthanide", electrons: "2,8,18,18,9,2", description: "Kamera linzalari va katalizatorlar", detailedInfo: "Yuqori sifatli kamera linzalari, neft qayta ishlash katalizatorlari va magnit materiallarida." },
  { symbol: "Ce", name: "Cerium", nameUz: "Seriy", atomicNumber: 58, atomicMass: "140.12", category: "lanthanide", electrons: "2,8,18,19,9,2", description: "Katalizatorlar va sayqallash", detailedInfo: "Avtomobil katalizatorlari, shisha sayqallash, O'z-O'zini tozalaydigan pechlar va LED fosforida." },
  { symbol: "Pr", name: "Praseodymium", nameUz: "Prazeodim", atomicNumber: 59, atomicMass: "140.91", category: "lanthanide", electrons: "2,8,18,21,8,2", description: "Kuchli magnit va bo'yoqlar", detailedInfo: "Kuchli doimiy magnitlar, samolyot dvigatellari, shisha ranglash va karbon yoy lampalarida." },
  { symbol: "Nd", name: "Neodymium", nameUz: "Neodim", atomicNumber: 60, atomicMass: "144.24", category: "lanthanide", electrons: "2,8,18,22,8,2", description: "Eng kuchli doimiy magnit", detailedInfo: "NdFeB magnitlar (eng kuchli). Elektr motorlar, quloqchinlar, shamol turbinalari va MRI skanerlarida." },
  { symbol: "Pm", name: "Promethium", nameUz: "Prometiy", atomicNumber: 61, atomicMass: "(145)", category: "lanthanide", electrons: "2,8,18,23,8,2", description: "Radioaktiv, ilmiy tadqiqotlar", detailedInfo: "Yadro batareyalari, luminestent bo'yoqlar va qalinlik o'lchagichlarida ishlatiladi. Tabiiy emas." },
  { symbol: "Sm", name: "Samarium", nameUz: "Samariy", atomicNumber: 62, atomicMass: "150.36", category: "lanthanide", electrons: "2,8,18,24,8,2", description: "Kuchli magnit va lazerlar", detailedInfo: "SmCo magnitlar (yuqori haroratga chidamli), lazerlar, yadro reaktorlar va saraton terapiyasida." },
  { symbol: "Eu", name: "Europium", nameUz: "Yevropiy", atomicNumber: 63, atomicMass: "151.96", category: "lanthanide", electrons: "2,8,18,25,8,2", description: "Fosfor, qizil rang", detailedInfo: "TV va LED fosforlari (qizil rang), laser materiallar va yevro banknotalarini himoyalashda." },
  { symbol: "Gd", name: "Gadolinium", nameUz: "Gadoliniy", atomicNumber: 64, atomicMass: "157.25", category: "lanthanide", electrons: "2,8,18,25,9,2", description: "MRI kontrasti va magnit", detailedInfo: "MRI kontrast modda, yadro reaktor nazoroti, magnit sovutish va ma'lumot saqlash qurilmalarida." },
  { symbol: "Tb", name: "Terbium", nameUz: "Terbiy", atomicNumber: 65, atomicMass: "158.93", category: "lanthanide", electrons: "2,8,18,27,8,2", description: "Yashil fosfor va magnitlar", detailedInfo: "LED va ekran fosforlari (yashil rang), magnit materiallar va yuqori aniqlikdagi sensorlarda." },
  { symbol: "Dy", name: "Dysprosium", nameUz: "Disproziy", atomicNumber: 66, atomicMass: "162.50", category: "lanthanide", electrons: "2,8,18,28,8,2", description: "Yuqori haroratli magnit", detailedInfo: "Neodim magnitlarni yaxshilaydi. Yadro reaktorlar, lazerlar va magnit qurilmalarda ishlatiladi." },
  { symbol: "Ho", name: "Holmium", nameUz: "Golmiy", atomicNumber: 67, atomicMass: "164.93", category: "lanthanide", electrons: "2,8,18,29,8,2", description: "Eng kuchli magnit xususiyat", detailedInfo: "Lazerlar (tibbiy jarrohlik), magnit maydon konsentratorlari va yadro reaktorlarda ishlatiladi." },
  { symbol: "Er", name: "Erbium", nameUz: "Erbiy", atomicNumber: 68, atomicMass: "167.26", category: "lanthanide", electrons: "2,8,18,30,8,2", description: "Optik tolalar va lazerlar", detailedInfo: "Optik tola kuchaytirgichlari, lazerlar (terini davolash), rangli shisha va qotishmalarda." },
  { symbol: "Tm", name: "Thulium", nameUz: "Tuliy", atomicNumber: 69, atomicMass: "168.93", category: "lanthanide", electrons: "2,8,18,31,8,2", description: "Rentgen manbalari va lazerlar", detailedInfo: "Portativ rentgen qurilmalari, lazerlar (prostat davolash) va sintillatorlarda ishlatiladi." },
  { symbol: "Yb", name: "Ytterbium", nameUz: "Itterbiy", atomicNumber: 70, atomicMass: "173.05", category: "lanthanide", electrons: "2,8,18,32,8,2", description: "Atom soatlari va lazerlar", detailedInfo: "Eng aniq atom soatlari, yuqori quvvatli lazerlar, Yer qimirlashini o'lchash va qotishmalarda." },
  { symbol: "Lu", name: "Lutetium", nameUz: "Lutetsiy", atomicNumber: 71, atomicMass: "174.97", category: "lanthanide", electrons: "2,8,18,32,9,2", description: "PET skanerlar va katalizatorlar", detailedInfo: "PET skanerlar uchun sintillatorlar, neft qayta ishlash katalizatorlari va saraton davolashda." },
  { symbol: "Hf", name: "Hafnium", nameUz: "Gafniy", atomicNumber: 72, atomicMass: "178.49", category: "transition", electrons: "2,8,18,32,10,2", description: "Mikrochiplar va yadro reaktorlar", detailedInfo: "Kompyuter chiplarida oksid qatlamlari, yadro reaktor nazorati va plasma qirqishda ishlatiladi." },
  { symbol: "Ta", name: "Tantalum", nameUz: "Tantal", atomicNumber: 73, atomicMass: "180.95", category: "transition", electrons: "2,8,18,32,11,2", description: "Kondensatorlar va tibbiy implantlar", detailedInfo: "Elektronika kondensatorlari, jarrohlik implantlar, kimyoviy idishlar va qattiq qotishmalarda." },
  { symbol: "W", name: "Tungsten", nameUz: "Volfram", atomicNumber: 74, atomicMass: "183.84", category: "transition", electrons: "2,8,18,32,12,2", description: "Eng yuqori erish harorati", detailedInfo: "Lampa tolalari, elektr yoy payvandlash, raketa nozzellari va rentgen trubkalarida ishlatiladi." },
  { symbol: "Re", name: "Rhenium", nameUz: "Reniy", atomicNumber: 75, atomicMass: "186.21", category: "transition", electrons: "2,8,18,32,13,2", description: "Yuqori haroratli qotishmalar", detailedInfo: "Samolyot va raketa dvigatellari, yuqori haroratli termojuftlar va neft qayta ishlash katalizatorlarida." },
  { symbol: "Os", name: "Osmium", nameUz: "Osmiy", atomicNumber: 76, atomicMass: "190.23", category: "transition", electrons: "2,8,18,32,14,2", description: "Eng zich element", detailedInfo: "Qattiq qotishmalar, elektr kontaktlar, qalam uchlari va o'tkir jarrohlik asboblarida ishlatiladi." },
  { symbol: "Ir", name: "Iridium", nameUz: "Iridiy", atomicNumber: 77, atomicMass: "192.22", category: "transition", electrons: "2,8,18,32,15,2", description: "Juda qattiq va korroziyaga chidamli", detailedInfo: "Uchqun svechalari, qalam uchlari, tigulli, saraton terapiyasi va standart o'lchovlar." },
  { symbol: "Pt", name: "Platinum", nameUz: "Platina", atomicNumber: 78, atomicMass: "195.08", category: "transition", electrons: "2,8,18,32,17,1", description: "Qimmatbaho metall, katalizatorlar", detailedInfo: "Zargarlik, katalizatorlar (avtomobil, kimyo), elektrodlar, tibbiy asboblar va investitsiya metallari." },
  { symbol: "Au", name: "Gold", nameUz: "Oltin", atomicNumber: 79, atomicMass: "196.97", category: "transition", electrons: "2,8,18,32,18,1", description: "Qimmatbaho metall, zargarlik", detailedInfo: "Zargarlik, elektronika, tish protezelari, tangalar, investitsiya va kosmik apparatlar qoplamasi." },
  { symbol: "Hg", name: "Mercury", nameUz: "Simob", atomicNumber: 80, atomicMass: "200.59", category: "transition", electrons: "2,8,18,32,18,2", description: "Xona haroratida suyuq metall", detailedInfo: "Termometrlar, barometrlar, lyuminestsent lampalar, stomatolоgiya amalgamalari. Zaharli!" },
  { symbol: "Tl", name: "Thallium", nameUz: "Talliy", atomicNumber: 81, atomicMass: "204.38", category: "metal", electrons: "2,8,18,32,18,3", description: "Yuqori zaharli, ilmiy tadqiqotlar", detailedInfo: "Sintillatorlar (yadro tibbiyot), optik linzalar, yuqori harorat superо'tkazgichlari. Juda zaharli!" },
  { symbol: "Pb", name: "Lead", nameUz: "Qo'rg'oshin", atomicNumber: 82, atomicMass: "207.2", category: "metal", electrons: "2,8,18,32,18,4", description: "Og'ir metall, batareyalar va himoya", detailedInfo: "Avtomobil akkumulyatorlari, radiatsiyadan himoya, keramika sirkalari va qalaylash. Zaharli!" },
  { symbol: "Bi", name: "Bismuth", nameUz: "Vismut", atomicNumber: 83, atomicMass: "208.98", category: "metal", electrons: "2,8,18,32,18,5", description: "Past eruvchi qotishmalar, dorilar", detailedInfo: "Oshqozon dorilar, kosmetika, past eruvchi qotishmalar (yong'in detektorlari) va zargarlikda." },
  { symbol: "Po", name: "Polonium", nameUz: "Poloniy", atomicNumber: 84, atomicMass: "(209)", category: "metalloid", electrons: "2,8,18,32,18,6", description: "Radioaktiv, statik elektr", detailedInfo: "Statik elektr neytrallashtiruvchilari, kosmik apparatlar uchun issiqlik manbalari. Juda radioaktiv!" },
  { symbol: "At", name: "Astatine", nameUz: "Astatin", atomicNumber: 85, atomicMass: "(210)", category: "halogen", electrons: "2,8,18,32,18,7", description: "Eng noyob tabiiy element", detailedInfo: "Tiroid xavfli o'smalari davolashda. Yerda juda oz miqdorda, juda radioaktiv." },
  { symbol: "Rn", name: "Radon", nameUz: "Radon", atomicNumber: 86, atomicMass: "(222)", category: "noble", electrons: "2,8,18,32,18,8", description: "Radioaktiv gaz, sog'liq xavfi", detailedInfo: "Zilzilalarni bashorat qilish, saraton terapiyasi va radiografiyada. Xonalarga kirib kelishi xavfli!" },
  
  // Period 7
  { symbol: "Fr", name: "Francium", nameUz: "Frantsiy", atomicNumber: 87, atomicMass: "(223)", category: "alkali", electrons: "2,8,18,32,18,8,1", description: "Juda noyob radioaktiv element", detailedInfo: "Ilmiy tadqiqotlarda. Har qanday vaqtda Yerda taxminan 30g mavjud. Juda reaktiv va radioaktiv." },
  { symbol: "Ra", name: "Radium", nameUz: "Radiy", atomicNumber: 88, atomicMass: "(226)", category: "alkaline", electrons: "2,8,18,32,18,8,2", description: "Radioaktiv, tibbiyotda ishlatilgan", detailedInfo: "Ilgari saraton terapiyasida. Lyuminestsent bo'yoqlarda ishlatilgan (endi man etilgan). Juda radioaktiv!" },
  { symbol: "Ac", name: "Actinium", nameUz: "Aktiniy", atomicNumber: 89, atomicMass: "(227)", category: "actinide", electrons: "2,8,18,32,18,9,2", description: "Radioaktiv, saraton terapiyasi", detailedInfo: "Saraton terapiyasi uchun alfa nurlanish manbai. Neytron manbasi va ilmiy tadqiqotlarda ishlatiladi." },
  { symbol: "Th", name: "Thorium", nameUz: "Toriy", atomicNumber: 90, atomicMass: "232.04", category: "actinide", electrons: "2,8,18,32,18,10,2", description: "Kelajak yadro yonilg'isi", detailedInfo: "Yadro reaktorlar yonilg'isi (kelajakda), gaz mantiyalari, shisha sayqallash va magnitlarda." },
  { symbol: "Pa", name: "Protactinium", nameUz: "Protaktiniy", atomicNumber: 91, atomicMass: "231.04", category: "actinide", electrons: "2,8,18,32,20,9,2", description: "Juda noyob, ilmiy tadqiqotlar", detailedInfo: "Asosan ilmiy tadqiqotlarda. Juda noyob va radioaktiv, amaliy qo'llanilishi kam." },
  { symbol: "U", name: "Uranium", nameUz: "Uran", atomicNumber: 92, atomicMass: "238.03", category: "actinide", electrons: "2,8,18,32,21,9,2", description: "Yadro energiyasi va qurollar", detailedInfo: "Yadro elektr stantsiyalari yonilg'isi (U-235), yadro qurollar, radiometrik sana aniqlash va shisha ranglashda." },
  { symbol: "Np", name: "Neptunium", nameUz: "Neptuniy", atomicNumber: 93, atomicMass: "(237)", category: "actinide", electrons: "2,8,18,32,22,9,2", description: "Sun'iy, neutron detektorlari", detailedInfo: "Neutron detektorlari, plutoniy ishlab chiqarish va ilmiy tadqiqotlarda. Birinchi transuranik element." },
  { symbol: "Pu", name: "Plutonium", nameUz: "Plutoniy", atomicNumber: 94, atomicMass: "(244)", category: "actinide", electrons: "2,8,18,32,24,8,2", description: "Yadro yonilg'isi va qurollar", detailedInfo: "Yadro qurollar, kosmik apparatlar energiya manbalari (RTG) va ilmiy tadqiqotlarda ishlatiladi." },
  { symbol: "Am", name: "Americium", nameUz: "Ameritsiy", atomicNumber: 95, atomicMass: "(243)", category: "actinide", electrons: "2,8,18,32,25,8,2", description: "Tutun detektorlari", detailedInfo: "Uy tutun detektorlari, neft qazmalarni tekshirish va portativ rentgen qurilmalarida ishlatiladi." },
  { symbol: "Cm", name: "Curium", nameUz: "Kyuriy", atomicNumber: 96, atomicMass: "(247)", category: "actinide", electrons: "2,8,18,32,25,9,2", description: "Alfa nurlanish manbai", detailedInfo: "Kosmik apparatlar energiya manbalari, alfa zarralar manbai va ilmiy tadqiqotlarda ishlatiladi." },
  { symbol: "Bk", name: "Berkelium", nameUz: "Berkeliy", atomicNumber: 97, atomicMass: "(247)", category: "actinide", electrons: "2,8,18,32,27,8,2", description: "Sun'iy, ilmiy tadqiqotlar", detailedInfo: "Og'irroq elementlar sintezi va ilmiy tadqiqotlarda. Juda noyob, faqat laboratoriyada ishlab chiqariladi." },
  { symbol: "Cf", name: "Californium", nameUz: "Kaliforniy", atomicNumber: 98, atomicMass: "(251)", category: "actinide", electrons: "2,8,18,32,28,8,2", description: "Kuchli neutron manbai", detailedInfo: "Saraton terapiyasi, neft qatlamlarini tahlil, aeroport xavfsizligi va ilmiy tadqiqotlarda." },
  { symbol: "Es", name: "Einsteinium", nameUz: "Eynshteyniy", atomicNumber: 99, atomicMass: "(252)", category: "actinide", electrons: "2,8,18,32,29,8,2", description: "Ilmiy tadqiqotlar, juda noyob", detailedInfo: "Asosan ilmiy tadqiqotlarda og'irroq elementlarni o'rganishda. Juda noyob va radioaktiv." },
  { symbol: "Fm", name: "Fermium", nameUz: "Fermiy", atomicNumber: 100, atomicMass: "(257)", category: "actinide", electrons: "2,8,18,32,30,8,2", description: "Ilmiy tadqiqotlar, sun'iy", detailedInfo: "Atom va yadro fizikasi tadqiqotlarida. Birinchi vodorod bombasi portlashida topilgan." },
  { symbol: "Md", name: "Mendelevium", nameUz: "Mendeleviy", atomicNumber: 101, atomicMass: "(258)", category: "actinide", electrons: "2,8,18,32,31,8,2", description: "Mendeleev sharafiga nomlangan", detailedInfo: "Faqat ilmiy tadqiqotlar uchun. Atom bir-biridan sintez qilinadi, juda noyob element." },
  { symbol: "No", name: "Nobelium", nameUz: "Nobeliy", atomicNumber: 102, atomicMass: "(259)", category: "actinide", electrons: "2,8,18,32,32,8,2", description: "Nobel sharafiga nomlangan", detailedInfo: "Ilmiy tadqiqotlarda. Nobel mukofoti sohibi Alfred Nobel sharafiga nomlangan, juda noyob." },
  { symbol: "Lr", name: "Lawrencium", nameUz: "Lourensiy", atomicNumber: 103, atomicMass: "(266)", category: "actinide", electrons: "2,8,18,32,32,8,3", description: "Sun'iy, ilmiy tadqiqotlar", detailedInfo: "Faqat ilmiy tadqiqotlar. Ernest Lawrence sharafiga nomlangan, juda qisqa yarim yemirilish davri." },
  { symbol: "Rf", name: "Rutherfordium", nameUz: "Ruterfordiy", atomicNumber: 104, atomicMass: "(267)", category: "transition", electrons: "2,8,18,32,32,10,2", description: "Birinchi transaktinid element", detailedInfo: "Faqat laboratoriya tadqiqotlari. Rutherford sharafiga nomlangan, bir necha sekund yashaydi." },
  { symbol: "Db", name: "Dubnium", nameUz: "Dubniy", atomicNumber: 105, atomicMass: "(268)", category: "transition", electrons: "2,8,18,32,32,11,2", description: "Sun'iy superog'ir element", detailedInfo: "Dubna shahri sharafiga nomlangan. Faqat ilmiy tadqiqotlarda, juda qisqa umr." },
  { symbol: "Sg", name: "Seaborgium", nameUz: "Siborgiy", atomicNumber: 106, atomicMass: "(269)", category: "transition", electrons: "2,8,18,32,32,12,2", description: "Seaborg sharafiga nomlangan", detailedInfo: "Glenn Seaborg sharafiga nomlangan yagona biron kishi hayotida nomlangan element. Juda noyob." },
  { symbol: "Bh", name: "Bohrium", nameUz: "Boriy", atomicNumber: 107, atomicMass: "(270)", category: "transition", electrons: "2,8,18,32,32,13,2", description: "Niels Bohr sharafiga", detailedInfo: "Niels Bohr sharafiga nomlangan. Faqat atom bir-biridan sintez qilinadi, mikrosekundlar davomida mavjud." },
  { symbol: "Hs", name: "Hassium", nameUz: "Hassiy", atomicNumber: 108, atomicMass: "(277)", category: "transition", electrons: "2,8,18,32,32,14,2", description: "Sun'iy superog'ir element", detailedInfo: "Germaniyaning Hessen viloyati sharafiga. Juda qisqa yarim yemirilish davri, faqat tadqiqot maqsadida." },
  { symbol: "Mt", name: "Meitnerium", nameUz: "Maytneriy", atomicNumber: 109, atomicMass: "(278)", category: "transition", electrons: "2,8,18,32,32,15,2", description: "Lise Meitner sharafiga", detailedInfo: "Lise Meitner (ayol fizik) sharafiga nomlangan. Millisekund davomida mavjud, faqat tadqiqotlarda." },
  { symbol: "Ds", name: "Darmstadtium", nameUz: "Darmshtadtiy", atomicNumber: 110, atomicMass: "(281)", category: "transition", electrons: "2,8,18,32,32,17,1", description: "Germaniya shahri sharafiga", detailedInfo: "Darmstadt shahri sharafiga nomlangan. Juda noyob va qisqa umr, faqat ilmiy tadqiqotlarda." },
  { symbol: "Rg", name: "Roentgenium", nameUz: "Rentgeniy", atomicNumber: 111, atomicMass: "(282)", category: "transition", electrons: "2,8,18,32,32,18,1", description: "Rentgen sharafiga nomlangan", detailedInfo: "Wilhelm Röntgen (rentgen kashfiyotchisi) sharafiga. Millisekund davomida mavjud." },
  { symbol: "Cn", name: "Copernicium", nameUz: "Kopernikiy", atomicNumber: 112, atomicMass: "(285)", category: "transition", electrons: "2,8,18,32,32,18,2", description: "Kopernik sharafiga nomlangan", detailedInfo: "Nikolay Kopernik sharafiga. Juda qisqa umr, faqat bir necha atomlar sintez qilingan." },
  { symbol: "Nh", name: "Nihonium", nameUz: "Nihoniy", atomicNumber: 113, atomicMass: "(286)", category: "metal", electrons: "2,8,18,32,32,18,3", description: "Yaponiya tomonidan kashf etilgan", detailedInfo: "Yaponiya ('Nihon') nomi bilan. Yaponlar kashf etgan birinchi element, juda qisqa umr." },
  { symbol: "Fl", name: "Flerovium", nameUz: "Fleroviy", atomicNumber: 114, atomicMass: "(289)", category: "metal", electrons: "2,8,18,32,32,18,4", description: "Flerov sharafiga nomlangan", detailedInfo: "Georgy Flerov (rus fizik) sharafiga. Bir necha sekund yashaydi, faqat tadqiqot maqsadida." },
  { symbol: "Mc", name: "Moscovium", nameUz: "Moskoviy", atomicNumber: 115, atomicMass: "(290)", category: "metal", electrons: "2,8,18,32,32,18,5", description: "Moskva sharafiga nomlangan", detailedInfo: "Moskva viloyati sharafiga nomlangan. Juda qisqa yarim yemirilish davri, bir necha atomlar sintez qilingan." },
  { symbol: "Lv", name: "Livermorium", nameUz: "Livermoriy", atomicNumber: 116, atomicMass: "(293)", category: "metal", electrons: "2,8,18,32,32,18,6", description: "Livermore sharafiga", detailedInfo: "Lawrence Livermore laboratoriyasi sharafiga. Millisekund davomida mavjud, juda noyob." },
  { symbol: "Ts", name: "Tennessine", nameUz: "Tennesin", atomicNumber: 117, atomicMass: "(294)", category: "halogen", electrons: "2,8,18,32,32,18,7", description: "Tennessee shtati sharafiga", detailedInfo: "AQShning Tennessee shtati sharafiga. Eng og'ir galogen, faqat bir necha atomlar yaratilgan." },
  { symbol: "Og", name: "Oganesson", nameUz: "Oganesson", atomicNumber: 118, atomicMass: "(294)", category: "noble", electrons: "2,8,18,32,32,18,8", description: "Eng og'ir element", detailedInfo: "Yuriy Oganesyan sharafiga. Eng og'ir va eng oxirgi tasdiqlangan element. Mikrosekundlar yashaydi." },
];

const categoryColors = {
  nonmetal: "bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30",
  noble: "bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30",
  alkali: "bg-red-500/20 border-red-500/40 hover:bg-red-500/30",
  alkaline: "bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30",
  metalloid: "bg-green-500/20 border-green-500/40 hover:bg-green-500/30",
  halogen: "bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30",
  metal: "bg-gray-500/20 border-gray-500/40 hover:bg-gray-500/30",
  transition: "bg-cyan-500/20 border-cyan-500/40 hover:bg-cyan-500/30",
  lanthanide: "bg-pink-500/20 border-pink-500/40 hover:bg-pink-500/30",
  actinide: "bg-rose-500/20 border-rose-500/40 hover:bg-rose-500/30",
};

// Standard Mendeleev periodic table positions (col, row)
const getElementPosition = (atomicNumber: number): { col: number; row: number } | null => {
  const positions: { [key: number]: { col: number; row: number } } = {
    // Period 1
    1: { col: 1, row: 1 },   // H
    2: { col: 18, row: 1 },  // He
    
    // Period 2
    3: { col: 1, row: 2 },   // Li
    4: { col: 2, row: 2 },   // Be
    5: { col: 13, row: 2 },  // B
    6: { col: 14, row: 2 },  // C
    7: { col: 15, row: 2 },  // N
    8: { col: 16, row: 2 },  // O
    9: { col: 17, row: 2 },  // F
    10: { col: 18, row: 2 }, // Ne
    
    // Period 3
    11: { col: 1, row: 3 },  // Na
    12: { col: 2, row: 3 },  // Mg
    13: { col: 13, row: 3 }, // Al
    14: { col: 14, row: 3 }, // Si
    15: { col: 15, row: 3 }, // P
    16: { col: 16, row: 3 }, // S
    17: { col: 17, row: 3 }, // Cl
    18: { col: 18, row: 3 }, // Ar
    
    // Period 4
    19: { col: 1, row: 4 },  // K
    20: { col: 2, row: 4 },  // Ca
    21: { col: 3, row: 4 },  // Sc
    22: { col: 4, row: 4 },  // Ti
    23: { col: 5, row: 4 },  // V
    24: { col: 6, row: 4 },  // Cr
    25: { col: 7, row: 4 },  // Mn
    26: { col: 8, row: 4 },  // Fe
    27: { col: 9, row: 4 },  // Co
    28: { col: 10, row: 4 }, // Ni
    29: { col: 11, row: 4 }, // Cu
    30: { col: 12, row: 4 }, // Zn
    31: { col: 13, row: 4 }, // Ga
    32: { col: 14, row: 4 }, // Ge
    33: { col: 15, row: 4 }, // As
    34: { col: 16, row: 4 }, // Se
    35: { col: 17, row: 4 }, // Br
    36: { col: 18, row: 4 }, // Kr
    
    // Period 5
    37: { col: 1, row: 5 },  // Rb
    38: { col: 2, row: 5 },  // Sr
    39: { col: 3, row: 5 },  // Y
    40: { col: 4, row: 5 },  // Zr
    41: { col: 5, row: 5 },  // Nb
    42: { col: 6, row: 5 },  // Mo
    43: { col: 7, row: 5 },  // Tc
    44: { col: 8, row: 5 },  // Ru
    45: { col: 9, row: 5 },  // Rh
    46: { col: 10, row: 5 }, // Pd
    47: { col: 11, row: 5 }, // Ag
    48: { col: 12, row: 5 }, // Cd
    49: { col: 13, row: 5 }, // In
    50: { col: 14, row: 5 }, // Sn
    51: { col: 15, row: 5 }, // Sb
    52: { col: 16, row: 5 }, // Te
    53: { col: 17, row: 5 }, // I
    54: { col: 18, row: 5 }, // Xe
    
    // Period 6
    55: { col: 1, row: 6 },  // Cs
    56: { col: 2, row: 6 },  // Ba
    // Lanthanides (57-71) go in row 9
    72: { col: 4, row: 6 },  // Hf
    73: { col: 5, row: 6 },  // Ta
    74: { col: 6, row: 6 },  // W
    75: { col: 7, row: 6 },  // Re
    76: { col: 8, row: 6 },  // Os
    77: { col: 9, row: 6 },  // Ir
    78: { col: 10, row: 6 }, // Pt
    79: { col: 11, row: 6 }, // Au
    80: { col: 12, row: 6 }, // Hg
    81: { col: 13, row: 6 }, // Tl
    82: { col: 14, row: 6 }, // Pb
    83: { col: 15, row: 6 }, // Bi
    84: { col: 16, row: 6 }, // Po
    85: { col: 17, row: 6 }, // At
    86: { col: 18, row: 6 }, // Rn
    
    // Period 7
    87: { col: 1, row: 7 },  // Fr
    88: { col: 2, row: 7 },  // Ra
    // Actinides (89-103) go in row 10
    104: { col: 4, row: 7 },  // Rf
    105: { col: 5, row: 7 },  // Db
    106: { col: 6, row: 7 },  // Sg
    107: { col: 7, row: 7 },  // Bh
    108: { col: 8, row: 7 },  // Hs
    109: { col: 9, row: 7 },  // Mt
    110: { col: 10, row: 7 }, // Ds
    111: { col: 11, row: 7 }, // Rg
    112: { col: 12, row: 7 }, // Cn
    113: { col: 13, row: 7 }, // Nh
    114: { col: 14, row: 7 }, // Fl
    115: { col: 15, row: 7 }, // Mc
    116: { col: 16, row: 7 }, // Lv
    117: { col: 17, row: 7 }, // Ts
    118: { col: 18, row: 7 }, // Og
    
    // Lanthanides (row 9)
    57: { col: 4, row: 9 },  // La
    58: { col: 5, row: 9 },  // Ce
    59: { col: 6, row: 9 },  // Pr
    60: { col: 7, row: 9 },  // Nd
    61: { col: 8, row: 9 },  // Pm
    62: { col: 9, row: 9 },  // Sm
    63: { col: 10, row: 9 }, // Eu
    64: { col: 11, row: 9 }, // Gd
    65: { col: 12, row: 9 }, // Tb
    66: { col: 13, row: 9 }, // Dy
    67: { col: 14, row: 9 }, // Ho
    68: { col: 15, row: 9 }, // Er
    69: { col: 16, row: 9 }, // Tm
    70: { col: 17, row: 9 }, // Yb
    71: { col: 18, row: 9 }, // Lu
    
    // Actinides (row 10)
    89: { col: 4, row: 10 },  // Ac
    90: { col: 5, row: 10 },  // Th
    91: { col: 6, row: 10 },  // Pa
    92: { col: 7, row: 10 },  // U
    93: { col: 8, row: 10 },  // Np
    94: { col: 9, row: 10 },  // Pu
    95: { col: 10, row: 10 }, // Am
    96: { col: 11, row: 10 }, // Cm
    97: { col: 12, row: 10 }, // Bk
    98: { col: 13, row: 10 }, // Cf
    99: { col: 14, row: 10 }, // Es
    100: { col: 15, row: 10 }, // Fm
    101: { col: 16, row: 10 }, // Md
    102: { col: 17, row: 10 }, // No
    103: { col: 18, row: 10 }, // Lr
  };
  
  return positions[atomicNumber] || null;
};

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            KIMYOVIY ELEMENTLAR DAVRIY JADVALI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Barcha elementlarni o'rganing va ularning xususiyatlari haqida batafsil ma'lumot oling
          </p>
        </div>

        {/* Standard Mendeleev Periodic Table Layout */}
        <div className="overflow-x-auto pb-4">
          <div className="grid gap-1 md:gap-1.5 min-w-[950px]" style={{ 
            gridTemplateColumns: 'auto repeat(18, minmax(45px, 1fr))',
            gridTemplateRows: 'auto auto repeat(10, auto)'
          }}>
            {/* Group Names Row */}
            <div style={{ gridColumn: 1, gridRow: 1 }}></div>
            <div 
              className="text-[8px] md:text-[10px] text-red-400 font-medium text-center py-1"
              style={{ gridColumn: 2, gridRow: 1 }}
            >
              Ishqoriy
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-orange-400 font-medium text-center py-1"
              style={{ gridColumn: 3, gridRow: 1 }}
            >
              Ishqoriy-yer
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-cyan-400 font-medium text-center py-1 col-span-10"
              style={{ gridColumn: '4 / 14', gridRow: 1 }}
            >
              O'tish metallari
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-gray-400 font-medium text-center py-1"
              style={{ gridColumn: 14, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-gray-400 font-medium text-center py-1"
              style={{ gridColumn: 15, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-blue-400 font-medium text-center py-1"
              style={{ gridColumn: 16, gridRow: 1 }}
            >
              
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-yellow-400 font-medium text-center py-1"
              style={{ gridColumn: 18, gridRow: 1 }}
            >
              Galogenlar
            </div>
            <div 
              className="text-[8px] md:text-[10px] text-purple-400 font-medium text-center py-1"
              style={{ gridColumn: 19, gridRow: 1 }}
            >
              Inert gazlar
            </div>
            
            {/* Group Numbers Row */}
            <div 
              className="text-[10px] md:text-xs text-muted-foreground font-bold text-center"
              style={{ gridColumn: 1, gridRow: 2 }}
            >
              Davr
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group) => (
              <div 
                key={`group-${group}`}
                className="text-[10px] md:text-xs text-primary font-bold text-center py-1"
                style={{ gridColumn: group + 1, gridRow: 2 }}
              >
                {group}
              </div>
            ))}
            
            {/* Period Labels */}
            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
              <div 
                key={`period-${period}`}
                className="text-[10px] md:text-xs text-primary font-bold flex items-center justify-center"
                style={{ gridColumn: 1, gridRow: period + 2 }}
              >
                {period}
              </div>
            ))}
            
            {/* Lanthanide/Actinide Period Labels */}
            <div 
              className="text-[10px] md:text-xs text-pink-400 font-bold flex items-center justify-center"
              style={{ gridColumn: 1, gridRow: 11 }}
            >
              *
            </div>
            <div 
              className="text-[10px] md:text-xs text-rose-400 font-bold flex items-center justify-center"
              style={{ gridColumn: 1, gridRow: 12 }}
            >
              **
            </div>
            
            {elements.map((element) => {
              const position = getElementPosition(element.atomicNumber);
              if (!position) return null;
              
              return (
                <Card
                  key={element.symbol}
                  onClick={() => setSelectedElement(element)}
                  className={`p-1.5 md:p-2 cursor-pointer border-2 transition-all hover:scale-105 hover:shadow-elegant ${
                    categoryColors[element.category as keyof typeof categoryColors]
                  }`}
                  style={{
                    gridColumn: position.col + 1,
                    gridRow: position.row + 2
                  }}
                >
                  <div className="text-[8px] md:text-[10px] text-muted-foreground text-right mb-0.5">
                    {element.atomicNumber}
                  </div>
                  <div className="text-sm md:text-lg font-bold text-center text-foreground mb-0.5">
                    {element.symbol}
                  </div>
                  <div className="text-[7px] md:text-[9px] text-center text-muted-foreground truncate">
                    {element.nameUz}
                  </div>
                  <div className="text-[7px] md:text-[9px] text-center text-muted-foreground">
                    {element.atomicMass}
                  </div>
                </Card>
              );
            })}
            
            {/* Lanthanide indicator */}
            <div 
              className="flex items-center justify-center text-[10px] md:text-xs text-pink-400 font-medium"
              style={{ gridColumn: 4, gridRow: 8 }}
            >
              *57-71
            </div>
            
            {/* Actinide indicator */}
            <div 
              className="flex items-center justify-center text-[10px] md:text-xs text-rose-400 font-medium"
              style={{ gridColumn: 4, gridRow: 9 }}
            >
              **89-103
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 md:gap-3 justify-center text-xs md:text-sm">
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/40">
            Nometall
          </Badge>
          <Badge variant="outline" className="bg-purple-500/10 border-purple-500/40">
            Inert gaz
          </Badge>
          <Badge variant="outline" className="bg-red-500/10 border-red-500/40">
            Ishqoriy metall
          </Badge>
          <Badge variant="outline" className="bg-orange-500/10 border-orange-500/40">
            Ishqoriy-yer metall
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 border-green-500/40">
            Yarim metall
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/40">
            Galogen
          </Badge>
          <Badge variant="outline" className="bg-gray-500/10 border-gray-500/40">
            Metall
          </Badge>
          <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/40">
            O'tish metall
          </Badge>
          <Badge variant="outline" className="bg-pink-500/10 border-pink-500/40">
            Lantanoidlar
          </Badge>
          <Badge variant="outline" className="bg-rose-500/10 border-rose-500/40">
            Aktinoidlar
          </Badge>
        </div>
      </main>

      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedElement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl flex items-center justify-between">
                  <span>{selectedElement.nameUz}</span>
                  <span className="text-5xl font-bold text-primary">{selectedElement.symbol}</span>
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="3d" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="3d">3D Model</TabsTrigger>
                  <TabsTrigger value="nucleus">Yadro</TabsTrigger>
                  <TabsTrigger value="stability">Barqarorlik</TabsTrigger>
                  <TabsTrigger value="info">Ma'lumot</TabsTrigger>
                </TabsList>
                
                <TabsContent value="3d" className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      3D atom modeli - aylanish uchun sichqoncha bilan sudrab boring, zoom qilish uchun scroll qiling
                    </p>
                    <AtomVisualization
                      atomicNumber={selectedElement.atomicNumber}
                      symbol={selectedElement.symbol}
                      electrons={selectedElement.electrons}
                      atomicMass={selectedElement.atomicMass}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Protonlar</p>
                      <p className="text-xl font-bold text-primary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Elektronlar</p>
                      <p className="text-xl font-bold text-secondary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Qobiqlar</p>
                      <p className="text-xl font-bold text-accent">{selectedElement.electrons.split(',').length}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <p className="text-sm font-semibold text-primary mb-2">Elektron taqsimoti</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedElement.electrons.split(',').map((e, i) => (
                        <Badge key={i} variant="outline" className="text-sm">
                          {i + 1}-qobiq: {e} elektron
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="nucleus" className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-3">
                      Yadro tuzilishi - har bir proton va neytron alohida ko'rsatilgan. Aylanish uchun sudrab boring.
                    </p>
                    <NucleusVisualization
                      atomicNumber={selectedElement.atomicNumber}
                      symbol={selectedElement.symbol}
                      electrons={selectedElement.electrons}
                      atomicMass={selectedElement.atomicMass}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <p className="text-xs text-muted-foreground">Protonlar</p>
                      </div>
                      <p className="text-2xl font-bold text-red-500">{selectedElement.atomicNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">Musbat (+) zaryad</p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <p className="text-xs text-muted-foreground">Neytronlar</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-500">
                        {Math.round(parseFloat(selectedElement.atomicMass.replace(/[()]/g, '')) || selectedElement.atomicNumber) - selectedElement.atomicNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Neytral (0) zaryad</p>
                    </div>
                    
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <p className="text-xs text-muted-foreground">Jami</p>
                      </div>
                      <p className="text-2xl font-bold text-amber-500">
                        {Math.round(parseFloat(selectedElement.atomicMass.replace(/[()]/g, '')) || selectedElement.atomicNumber)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Nuklonlar soni</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <h3 className="text-sm font-semibold text-primary mb-3">Yadro haqida</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">Yadro o'lchami:</span> Atom o'lchamidan 100,000 marta kichikroq, lekin atomning 99.9% massasini tashkil qiladi.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Kuchli o'zaro ta'sir:</span> Proton va neytronlarni bir-biriga bog'laydigan eng kuchli tabiiy kuch.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Massa raqami:</span> {selectedElement.atomicMass} - proton va neytronlar yig'indisi.
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Zaryad:</span> +{selectedElement.atomicNumber} (protonlar soni tufayli).
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <h3 className="text-sm font-semibold text-accent-foreground mb-2">Qiziqarli fakt</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedElement.atomicNumber <= 2 && "Bu element Big Bang vaqtida paydo bo'lgan."}
                      {selectedElement.atomicNumber > 2 && selectedElement.atomicNumber <= 26 && "Bu element yulduzlar ichida sintez qilinadi."}
                      {selectedElement.atomicNumber > 26 && selectedElement.atomicNumber <= 92 && "Bu element supernova portlashlarida yoki neytron yulduzlar to'qnashuvida hosil bo'ladi."}
                      {selectedElement.atomicNumber > 92 && "Bu element faqat laboratoriyada sun'iy ravishda yaratiladi."}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="stability" className="space-y-4">
                  <NuclearStability
                    atomicNumber={selectedElement.atomicNumber}
                    atomicMass={selectedElement.atomicMass}
                    symbol={selectedElement.symbol}
                  />
                </TabsContent>
                
                <TabsContent value="info" className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Atom raqami</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.atomicNumber}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Atom massasi</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.atomicMass}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Davr</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.period || selectedElement.electrons.split(',').length}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Guruh</p>
                      <p className="text-lg font-bold text-primary">{selectedElement.group || "—"}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Elektronlar taqsimoti</p>
                    <p className="text-lg font-mono font-semibold">{selectedElement.electrons}</p>
                    {selectedElement.valencElectrons && (
                      <p className="text-xs text-muted-foreground mt-1">Valent elektronlar: {selectedElement.valencElectrons}</p>
                    )}
                  </div>
                  
                  {/* Discovery Info */}
                  {(selectedElement.discoveryYear || selectedElement.discoveredBy) && (
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <p className="text-sm font-semibold text-amber-400 mb-2">Kashfiyot</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedElement.discoveryYear && (
                          <div>
                            <p className="text-xs text-muted-foreground">Kashf etilgan yili</p>
                            <p className="font-medium">{selectedElement.discoveryYear}</p>
                          </div>
                        )}
                        {selectedElement.discoveredBy && (
                          <div>
                            <p className="text-xs text-muted-foreground">Kashf etgan olim</p>
                            <p className="font-medium">{selectedElement.discoveredBy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Physical Properties */}
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-sm font-semibold text-blue-400 mb-3">Fizik xususiyatlar</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedElement.state && (
                        <div>
                          <p className="text-xs text-muted-foreground">Holati (xona t°)</p>
                          <p className="font-medium">{selectedElement.state}</p>
                        </div>
                      )}
                      {selectedElement.color && (
                        <div>
                          <p className="text-xs text-muted-foreground">Rangi</p>
                          <p className="font-medium">{selectedElement.color}</p>
                        </div>
                      )}
                      {selectedElement.meltingPoint && (
                        <div>
                          <p className="text-xs text-muted-foreground">Erish harorati</p>
                          <p className="font-medium">{selectedElement.meltingPoint}</p>
                        </div>
                      )}
                      {selectedElement.boilingPoint && (
                        <div>
                          <p className="text-xs text-muted-foreground">Qaynash harorati</p>
                          <p className="font-medium">{selectedElement.boilingPoint}</p>
                        </div>
                      )}
                      {selectedElement.density && (
                        <div>
                          <p className="text-xs text-muted-foreground">Zichlik</p>
                          <p className="font-medium">{selectedElement.density}</p>
                        </div>
                      )}
                      {selectedElement.crystalStructure && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kristall tuzilishi</p>
                          <p className="font-medium">{selectedElement.crystalStructure}</p>
                        </div>
                      )}
                      {selectedElement.magneticOrdering && (
                        <div>
                          <p className="text-xs text-muted-foreground">Magnit xususiyati</p>
                          <p className="font-medium">{selectedElement.magneticOrdering}</p>
                        </div>
                      )}
                      {selectedElement.thermalConductivity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Issiqlik o'tkazuvchanlik</p>
                          <p className="font-medium">{selectedElement.thermalConductivity}</p>
                        </div>
                      )}
                      {selectedElement.electricalResistivity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektr qarshilik</p>
                          <p className="font-medium">{selectedElement.electricalResistivity}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Chemical Properties */}
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm font-semibold text-green-400 mb-3">Kimyoviy xususiyatlar</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {selectedElement.electronegativity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektronegativlik</p>
                          <p className="font-medium">{selectedElement.electronegativity}</p>
                        </div>
                      )}
                      {selectedElement.oxidationStates && (
                        <div>
                          <p className="text-xs text-muted-foreground">Oksidlanish darajasi</p>
                          <p className="font-medium">{selectedElement.oxidationStates}</p>
                        </div>
                      )}
                      {selectedElement.ionizationEnergy && (
                        <div>
                          <p className="text-xs text-muted-foreground">Ionlanish energiyasi</p>
                          <p className="font-medium">{selectedElement.ionizationEnergy}</p>
                        </div>
                      )}
                      {selectedElement.electronAffinity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Elektron affinligi</p>
                          <p className="font-medium">{selectedElement.electronAffinity}</p>
                        </div>
                      )}
                      {selectedElement.block && (
                        <div>
                          <p className="text-xs text-muted-foreground">Blok</p>
                          <p className="font-medium">{selectedElement.block}-blok</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Atomic Radii */}
                  <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm font-semibold text-purple-400 mb-3">Atom o'lchamlari</p>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {selectedElement.atomicRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Atom radiusi</p>
                          <p className="font-medium">{selectedElement.atomicRadius}</p>
                        </div>
                      )}
                      {selectedElement.covalentRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kovalent radius</p>
                          <p className="font-medium">{selectedElement.covalentRadius}</p>
                        </div>
                      )}
                      {selectedElement.vanDerWaalsRadius && (
                        <div>
                          <p className="text-xs text-muted-foreground">Van der Waals</p>
                          <p className="font-medium">{selectedElement.vanDerWaalsRadius}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Isotopes */}
                  {(selectedElement.isotopeCount || selectedElement.stableIsotopes) && (
                    <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                      <p className="text-sm font-semibold text-cyan-400 mb-3">Izotoplar</p>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        {selectedElement.isotopeCount && (
                          <div>
                            <p className="text-xs text-muted-foreground">Izotoplar soni</p>
                            <p className="font-medium">{selectedElement.isotopeCount}</p>
                          </div>
                        )}
                        {selectedElement.stableIsotopes && (
                          <div>
                            <p className="text-xs text-muted-foreground">Barqaror izotoplar</p>
                            <p className="font-medium">{selectedElement.stableIsotopes}</p>
                          </div>
                        )}
                        {selectedElement.halfLife && (
                          <div>
                            <p className="text-xs text-muted-foreground">Yarim yemirilish</p>
                            <p className="font-medium">{selectedElement.halfLife}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Abundance & Origin */}
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-sm font-semibold text-orange-400 mb-3">Tarqalishi va kelib chiqishi</p>
                    <div className="space-y-2 text-sm">
                      {selectedElement.abundance && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tarqalishi</p>
                          <p className="font-medium">{selectedElement.abundance}</p>
                        </div>
                      )}
                      {selectedElement.origin && (
                        <div>
                          <p className="text-xs text-muted-foreground">Kelib chiqishi</p>
                          <p className="font-medium">{selectedElement.origin}</p>
                        </div>
                      )}
                      {selectedElement.naturalOccurrence && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tabiatda uchraydi</p>
                          <p className="font-medium">{selectedElement.naturalOccurrence}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Uses */}
                  {selectedElement.uses && selectedElement.uses.length > 0 && (
                    <div className="p-4 bg-gradient-card rounded-lg border border-border">
                      <p className="text-sm font-semibold text-primary mb-3">Qo'llanilishi</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedElement.uses.map((use, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Hazards */}
                  {selectedElement.hazards && (
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm font-semibold text-red-400 mb-2">Xavflar</p>
                      <p className="text-sm">{selectedElement.hazards}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Inglizcha nomi</p>
                    <p className="text-xl font-semibold">{selectedElement.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-card rounded-lg border border-border">
                    <p className="text-sm font-semibold text-primary mb-2">Qisqacha ma'lumot</p>
                    <p className="text-foreground leading-relaxed">{selectedElement.description}</p>
                  </div>
                  
                  {selectedElement.detailedInfo && (
                    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm font-semibold text-accent-foreground mb-2">Batafsil ma'lumot</p>
                      <p className="text-foreground leading-relaxed">{selectedElement.detailedInfo}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeriodicTable;
