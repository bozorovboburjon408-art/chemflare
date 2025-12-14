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

// Gesture types (20+ expanded movements)
type GestureType = 
  | "idle" | "wave" | "point" | "thumbsUp" | "think" | "celebrate" | "listen" | "nod" 
  | "raiseHand" | "salute" | "clap" | "walk" | "dance" | "jump" | "stretch" | "punch" | "flex"
  // New gestures (20+)
  | "fly" | "run" | "spin" | "swim" | "kick" | "crouch" | "hover" | "land"
  | "pushUp" | "sitUp" | "squat" | "lunge" | "bow" | "handstand" | "backflip"
  | "moonwalk" | "robot" | "disco" | "breakdance" | "victory" | "tired" | "confused" | "angry";

// Bumblebee - kirish ketma-ketligi (3 bosqich)
const bumblebeeIntroSequence = [
  "Salom! Men Bumblebee! Avtobotlarning eng sodiq jangchisiman!",
  "Sening bilim olishing biz uchun jangdan muhim! Keling, birga o'rganamiz!",
];

// Optimus Prime - kirish ketma-ketligi (3 bosqich)
const optimusIntroSequence = [
  "Men Optimus Prime! Avtobotlar lideri! Bilim - eng kuchli qurolimiz!",
  "Sening bilim olishing biz uchun jangdan muhim! Biz senga yordam beramiz!",
];

// Umumiy bilimlar bazasi - barcha sahifalar uchun aralashtiriladi (kengaytirilgan)
const knowledgeBase: string[] = [
  // Elementlar - 1-20
  "H - Vodorod, eng yengil element, atom massasi 1",
  "He - Geliy, inert gaz, sharlar uchun ishlatiladi",
  "Li - Litiy, eng yengil metall, batareyalarda",
  "Be - Berilliy, yengil va qattiq metall",
  "B - Bor, yarim o'tkazgich, shishada ishlatiladi",
  "C - Uglerod, olmos va grafitda mavjud",
  "N - Azot, havoning 78 foizi",
  "O - Kislorod, nafas olish uchun zarur",
  "F - Ftor, eng faol nometall",
  "Ne - Neon, reklama chiroqlarida",
  "Na - Natriy, suv bilan portlaydi!",
  "Mg - Magniy, yonganida yorqin oq nur",
  "Al - Alyuminiy, samolyotlarda ishlatiladi",
  "Si - Kremniy, kompyuter chiplari asosi",
  "P - Fosfor, gugurt ishlab chiqarishda",
  "S - Oltingugurt, vulqonlarda topiladi",
  "Cl - Xlor, tuz tarkibida NaCl",
  "Ar - Argon, payvandlashda himoya gazi",
  "K - Kaliy, o'simliklar uchun zarur",
  "Ca - Kalsiy, suyaklar tarkibida",
  
  // Elementlar - 21-40
  "Sc - Skandiy, kosmik texnologiyalarda",
  "Ti - Titan, eng mustahkam metallardan",
  "V - Vanadiy, po'lat qotishmalarida",
  "Cr - Xrom, zanglamaydigan po'latda",
  "Mn - Marganes, batareyalarda ishlatiladi",
  "Fe - Temir, qon tarkibida, magnit xususiyatli",
  "Co - Kobalt, ko'k rang beradi",
  "Ni - Nikel, tangalarda ishlatiladi",
  "Cu - Mis, simlar uchun ishlatiladi",
  "Zn - Rux, korroziyadan himoya",
  "Ga - Galliy, qo'lda eriydi (29°C)",
  "Ge - Germaniy, yarim o'tkazgich",
  "As - Mishyak, zaharli element",
  "Se - Selen, fotoelemtlarda",
  "Br - Brom, suyuq nometall",
  "Kr - Kripton, lazer nurlarida",
  "Rb - Rubidiy, atom soatlarida",
  "Sr - Stronsiy, fajerverklarda",
  "Y - Ittriy, LED ekranlarda",
  "Zr - Sirkoniy, yadro reaktorlarida",
  
  // Qimmatbaho metallar
  "Ag - Kumush, eng yaxshi elektr o'tkazgich",
  "Au - Oltin, eng cho'ziluvchan metall",
  "Pt - Platina, katalizator sifatida",
  "Pd - Palladiy, avtomobil katalizatorlarida",
  "Rh - Rodiy, eng qimmat metall",
  
  // Nodir elementlar
  "U - Uran, yadro yoqilg'isi",
  "Pu - Plutoniy, yadro qurollarida",
  "Ra - Radiy, radioaktiv, nurlanadi",
  "Hg - Simob, yagona suyuq metall",
  "Pb - Qo'rg'oshin, og'ir metall",
  "Sn - Qalay, konserva bankalarda",
  "Bi - Vismut, kamalak rangli kristallar",
  "W - Volfram, eng qiyin eriydigan metall (3422°C)",
  
  // Formulalar va qonunlar
  "Molyar massa: M = m/n (g/mol)",
  "Konsentratsiya: C = n/V (mol/L)",
  "pH = -log[H⁺], pOH = -log[OH⁻]",
  "Ideal gaz: PV = nRT",
  "Faradey qonuni: m = (M·I·t)/(n·F)",
  "Massa ulushi: w = m(element)/m(modda)",
  "Zichlik: ρ = m/V (g/ml)",
  "Hajm (gaz): V = n × 22.4 L (n.sh.)",
  "Issiqlik: Q = m × c × ΔT",
  "Avogadro soni: 6.02×10²³",
  "Gess qonuni: ΔH = ΣΔH(mahsulot) - ΣΔH(reaktant)",
  "Arrhenius tenglamasi: k = A·e^(-Ea/RT)",
  "Rault qonuni: P = P°·x (bug' bosimi)",
  "Gey-Lyussak qonuni: V₁/T₁ = V₂/T₂",
  "Boyl-Mariott qonuni: P₁V₁ = P₂V₂",
  "Dalton qonuni: P(umumiy) = P₁ + P₂ + P₃...",
  
  // Reaksiyalar - neytrallanish
  "2H₂ + O₂ = 2H₂O - suv hosil bo'lishi",
  "2Na + 2H₂O = 2NaOH + H₂↑ - natriy va suv",
  "CaCO₃ = CaO + CO₂↑ - ohak yonishi",
  "Zn + 2HCl = ZnCl₂ + H₂↑ - metall va kislota",
  "NaOH + HCl = NaCl + H₂O - neytrallanish",
  "Fe + CuSO₄ = FeSO₄ + Cu↓ - o'rin olish",
  "CH₄ + 2O₂ = CO₂ + 2H₂O - metan yonishi",
  "2KMnO₄ = K₂MnO₄ + MnO₂ + O₂↑",
  "2H₂O₂ = 2H₂O + O₂↑ - vodorod peroksid parchalanishi",
  "NH₄Cl + NaOH = NaCl + NH₃↑ + H₂O",
  
  // Oksidlanish-qaytarilish
  "Zn + Cu²⁺ → Zn²⁺ + Cu - oksidlanish-qaytarilish",
  "2Fe + 3Cl₂ → 2FeCl₃ - temir xlorlanishi",
  "4Fe + 3O₂ → 2Fe₂O₃ - zang hosil bo'lishi",
  "2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑",
  "Cu + 4HNO₃(konts) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O",
  "Mg + 2HCl → MgCl₂ + H₂↑ - faol metall",
  
  // Organik reaksiyalar
  "C₂H₄ + H₂ → C₂H₆ - gidrogenlanish",
  "C₂H₅OH + O₂ → CH₃COOH + H₂O - oksidlanish",
  "CH₃COOH + C₂H₅OH → CH₃COOC₂H₅ + H₂O - esterifikatsiya",
  "C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ - bijg'ish",
  "nCH₂=CH₂ → (-CH₂-CH₂-)n - polimerizatsiya",
  
  // Tushunchalar
  "Valentlik - atomning bog' hosil qilish qobiliyati",
  "Ion - zaryadlangan atom yoki molekula",
  "Kation (+) va anion (-) - ion turlari",
  "Molekula - atomlarning birikishi",
  "Kristall panjara - qattiq modda tuzilishi",
  "Elektrolitlar - eritma tok o'tkazadi",
  "Indikatorlar - muhit pH ini aniqlaydi",
  "Lakmus - kislotada qizil, asosda ko'k",
  "Fenolftalein - asosda pushti rang",
  "Metil oranj - kislotada qizil, asosda sariq",
  "Izotoplar - proton soni bir xil, neytron soni farqli",
  "Allotropiya - bir element turli shakllarda (olmos, grafit)",
  "Gibridlanish - sp, sp², sp³ orbitallar aralashuvi",
  "Elektronegativlik - atom elektron tortish kuchi",
  "Ionlanish energiyasi - elektronni ajratish uchun kerak energiya",
  
  // Qiziqarli faktlar
  "Mendeleev 1869-yilda davriy jadvalni yaratdi",
  "Olmos va grafit bir xil element - uglerod!",
  "Suv 0°C da muzlaydi, 100°C da qaynaydi",
  "Oltingugurt yonganida ko'k olov chiqadi",
  "Magniy yonganida yorqin oq nur hosil bo'ladi",
  "Natriy xlorid - oddiy osh tuzi",
  "Vodorod - Quyosh asosiy elementi",
  "Kislorod havoning 21 foizi",
  "Azot havoning 78 foizi",
  "Argon - havoda 3-chi ko'plik element",
  "Inson tanasida 65% kislorod bor",
  "DNA molekulasida N, C, H, O, P bor",
  "Eng katta atom - Oganesson (Og)",
  "Eng kichik atom - Vodorod (H)",
  "Geliy Yerda kam, Quyoshda ko'p",
  "Titan - eng mustahkam metall",
  "Simob yagona suyuq metall (20°C da)",
  "Fransiy - eng kam tarqalgan tabiiy element",
  "Karbon - hayotning asosi",
  "Ozon (O₃) - atmosferani UV nurdan himoya qiladi",
  
  // Amaliy bilimlar
  "Soda + sirka = vulqon tajribasi!",
  "Yod + kraxmal = ko'k rang hosil bo'ladi",
  "Mis sulfat + temir = mis cho'kadi",
  "Limon kislotasi - tabiiy kislota",
  "Sut - kolloid eritma misoli",
  "Tuz suvda eriganda ion hosil bo'ladi",
  "Muzlash - ekzotermik jarayon",
  "Bug'lanish - endotermik jarayon",
  "Sabun - yog' + ishqor reaksiyasi",
  "Cho'ntak isitgichlari - kristallanish issiqligidan foydalanadi",
  "Muzlatgich - ammiakni bug'latish orqali ishlaydi",
  "Shisha - SiO₂ asosida tayyorlanadi",
  "Sement - CaO, SiO₂, Al₂O₃ aralashmasi",
  "Plastmassa - uglerod polimerlaridan",
  "Rezina - kauchuk vulkanizatsiyasi",
  
  // Xavfsizlik
  "Laboratoriyada ko'zoynak kiyish shart!",
  "Kimyoviy moddalarni tatib ko'rib bo'lmaydi!",
  "Kislotalarni suv ustiga quyish kerak",
  "Tajribadan keyin qo'llarni yuvish zarur",
  "Isitish vaqtida probirkani yuzga qaratmang",
  "Zaharli gazlar bilan faqat mo'ri ostida ishlang",
  "Yonuvchan moddalarni olovdan uzoq saqlang",
  "Kimyoviy moddalar idishlarini yopiq saqlang",
  "Laboratoriyada ovqatlanish taqiqlangan",
  "Kislota bilan ishlaganda oldin suv, keyin kislota!",
  
  // Maslahatlar
  "Har kuni 15 daqiqa o'qish - katta natija!",
  "Avval nazariyani o'qing, keyin test ishlang",
  "Xato javoblarni qayta ko'rib chiqing",
  "Formulalarni yod oling - oson bo'ladi",
  "Davriy jadvalni yodlashdan boshlang",
  "Kimyoviy tenglamalarni muvozanatlashni o'rganing",
  "Testlarni vaqt bilan yechishni mashq qiling",
  "Murakkab mavzularni kichik qismlarga bo'ling",
  "Kimyoviy jarayonlarni vizualizatsiya qiling",
  "Video darslardan ham foydalaning",
  
  // Qo'shimcha elementlar
  "Mo - Molibden, po'lat qotishmalarida",
  "Nb - Niobiy, supero'tkazgichlarda",
  "Tc - Texnetsiy, birinchi sun'iy element",
  "Ru - Ruteniy, elektronikada",
  "Os - Osmiy, eng og'ir element",
  "Ir - Iridiy, eng zichligi yuqori",
  "Ta - Tantal, kondensatorlarda",
  "Re - Reniy, reaktiv dvigatlarda",
  "Ce - Seriy, o'tkazgich sifatida",
  "Nd - Neodim, kuchli magnitlarda",
  
  // Kislotalar
  "HCl - Xlorid kislota (oshqozon kislotasi)",
  "H₂SO₄ - Sulfat kislota (akkumulyatorlarda)",
  "HNO₃ - Nitrat kislota (o'g'itlarda)",
  "H₃PO₄ - Fosfat kislota (ichimliklar)",
  "CH₃COOH - Sirka kislotasi",
  "H₂CO₃ - Karbonat kislota (gazli suvda)",
  
  // Asoslar
  "NaOH - Natriy gidroksid (o'yuvchi natriy)",
  "KOH - Kaliy gidroksid (o'yuvchi kaliy)",
  "Ca(OH)₂ - Kalsiy gidroksid (ohak suvi)",
  "NH₄OH - Ammoniy gidroksid (nashatir spirt)",
  "Ba(OH)₂ - Bariy gidroksid",
  
  // Tuzlar
  "NaCl - Osh tuzi",
  "CaCO₃ - Ohaktosh, marmar, bo'r",
  "NaHCO₃ - Ichimlik sodasi",
  "Na₂CO₃ - Kir yuvish sodasi",
  "CaSO₄ - Gips",
  "KNO₃ - Kaliy nitrat (porox tarkibida)",
  "AgNO₃ - Kumush nitrat (fotografiyada)",
  "CuSO₄ - Mis sulfat (ko'k tosh)",
  "FeSO₄ - Temir sulfat (qaramog'or)",
  "MgSO₄ - Magniy sulfat (epsom tuzi)",
];

// Optimus Prime tips - avval o'zini tanishtiradi
// Page-specific tips for Bumblebee
const bumblebeeTips: Record<string, string[]> = {
  "/": [
    "Men Bumblebee! Davriy jadval - barcha elementlar uyi!",
    "Davriy jadvalda 118 ta element bor",
    "Metallar chapda, nometallar o'ngda joylashgan",
    "Har bir element o'z atom raqamiga ega",
    "Gorizonal qatorlar - davrlar deyiladi",
    "Vertikal ustunlar - gruppalar deyiladi",
    "Lantanoidlar va aktinoidlar alohida qatorda",
    "Vodorod eng birinchi element - atom raqami 1",
    "Oganeson eng oxirgi element - atom raqami 118",
    "Elementni bosib ko'proq ma'lumot oling!",
  ],
  "/reactions": [
    "Bumblebee reaksiyalar olamiga xush kelibsiz deydi!",
    "Kimyoviy reaksiya - moddalar o'zgarishi",
    "Reaktantlar → Mahsulotlar",
    "Tenglamani muvozanatlash zarur!",
    "Katalitik reaksiyalar tezroq o'tadi",
    "Endotermik reaksiyalar issiqlik yutadi",
    "Ekzotermik reaksiyalar issiqlik chiqaradi",
    "Oksidlanish-qaytarilish reaksiyalari muhim",
    "Neytrallanish: kislota + asos = tuz + suv",
    "Qidiruv orqali kerakli reaksiyani toping!",
  ],
  "/learning": [
    "Bumblebee o'rganishda sizga yordam beradi!",
    "Har bir bobni diqqat bilan o'qing",
    "Test yechib bilimingizni sinang",
    "AI savollar - istalgan mavzuda test",
    "Oson, o'rta, qiyin darajalar mavjud",
    "Qiyin darajada rasmli savollar ham bor",
    "Har bir to'g'ri javob ball qo'shadi",
    "Daraja oshishi bilan qiyinlik ortadi",
    "Muntazam mashq qiling!",
    "Bilimingiz oshib boradi!",
  ],
  "/library": [
    "Bumblebee kutubxonaga xush kelibsiz deydi!",
    "Bu yerda kimyo kitoblari mavjud",
    "Har bir kitobda boblar bor",
    "Boblarni o'qib, bilim oling",
    "Qidiruv orqali kitob toping",
    "1-qism: Boshlang'ich kimyo",
    "2-qism: Umumiy kimyo",
    "3-qism: Anorganik kimyo",
    "Har bir bob so'ngida savollar bor",
    "Kitoblarni yuklab olish mumkin!",
  ],
  "/quiz": [
    "Bumblebee test yechishda yordam beradi!",
    "Rasm yuklang va test yarating",
    "10 tagacha rasm yuklash mumkin",
    "AI savollarni avtomatik taniydi",
    "Javoblarni belgilang va tekshiring",
    "Har bir savolga izoh beriladi",
    "Xato javoblarni tahlil qiling",
    "Qayta-qayta mashq qiling!",
    "Vaqtni tejash uchun rasmdan test!",
    "Natijalaringiz saqlanadi!",
  ],
  "/calculator": [
    "Bumblebee hisoblashda kuchli!",
    "Istalgan kimyo masalasini yozing",
    "Yoki rasm yuklang - masala tahlil qilinadi",
    "Molyar massa hisoblash mumkin",
    "Konsentratsiya hisoblash mumkin",
    "pH qiymatini topish mumkin",
    "Gazlar qonunlari bo'yicha hisoblash",
    "Elektroliz hisoblash",
    "Yechim bosqichma-bosqich ko'rsatiladi",
    "Formula va izohlar beriladi!",
  ],
  "/experiments": [
    "Bumblebee tajribalarni sevadi!",
    "Bu yerda video tajribalar mavjud",
    "Har bir tajriba xavfsiz o'tkazilgan",
    "Tajribalarni uyda takrorlamang!",
    "Video ko'rib o'rganing",
    "Tajriba jarayonini kuzating",
    "Xavfsizlik qoidalariga rioya qiling!",
    "Laboratoriya jihozlari bilan ishlang",
    "Kimyo - amaliy fan!",
    "Nazariya + amaliyot = bilim!",
  ],
  "/developers": [
    "Bumblebee ChemFlare jamoasini tanishtiradi!",
    "Bu ilova Asilbek Salohiddinov tomonidan yaratilgan",
    "Kimyoni o'rganish osonlashtirildi!",
    "Telegram orqali bog'lanish mumkin",
    "Fikr-mulohazalaringizni yuboring!",
    "Ilova doimiy takomillashtirilmoqda",
    "Yangi imkoniyatlar qo'shilmoqda",
    "Foydalanganingiz uchun rahmat!",
    "Transformerlar sizni qo'llab-quvvatlaydi!",
    "Birga kimyoni o'rganamiz!",
  ],
};

// Page-specific tips for Optimus Prime
const optimusTips: Record<string, string[]> = {
  "/": [
    "Men Optimus Prime! Davriy jadval - kimyoning asosi!",
    "H - Vodorod, eng yengil element",
    "He - Geliy, inert gaz, shamlar uchun",
    "Li - Litiy, batareyalarda ishlatiladi",
    "C - Uglerod, hayot asosi",
    "N - Azot, havoning 78 foizi",
    "O - Kislorod, nafas olish uchun",
    "Na - Natriy, suv bilan portlaydi!",
    "Fe - Temir, qon tarkibida",
    "Au - Oltin, qimmatbaho metall",
  ],
  "/reactions": [
    "Optimus Prime! Reaksiyalar sirlarini ochamiz!",
    "2H₂ + O₂ → 2H₂O - suv hosil bo'lishi",
    "2Na + 2H₂O → 2NaOH + H₂↑ - natriy va suv",
    "CaCO₃ → CaO + CO₂↑ - ohak yonishi",
    "Zn + 2HCl → ZnCl₂ + H₂↑ - metall va kislota",
    "NaOH + HCl → NaCl + H₂O - neytrallanish",
    "Fe + CuSO₄ → FeSO₄ + Cu↓ - o'rin olish",
    "CH₄ + 2O₂ → CO₂ + 2H₂O - metan yonishi",
    "AI yordamida yangi reaksiyalar toping!",
    "Reaksiyalar kutubxonasini ko'ring!",
  ],
  "/learning": [
    "Optimus Prime o'rganishda yo'l ko'rsatadi!",
    "Valentlik - bog' hosil qilish qobiliyati",
    "Ion - zaryadlangan atom",
    "Kation (+) va anion (-) turlari",
    "Molekula - atomlar birikishi",
    "Kristall panjara - qattiq modda tuzilishi",
    "Kimyoviy bog' - atomlar orasidagi kuch",
    "Kovalent bog' - elektronlar umumiy",
    "Ion bog' - elektronlar ko'chgan",
    "Muntazam o'rganing!",
  ],
  "/library": [
    "Optimus Prime bilim xazinasiga taklif qiladi!",
    "Mendeleev 1869-yilda davriy jadval yaratdi",
    "Davriy qonun - xossalar atom massasiga bog'liq",
    "Atom tuzilishi: yadro + elektronlar",
    "Proton (+), neytron (0), elektron (-)",
    "Izotoplar - bir xil proton, turli neytron",
    "Atom massasi - proton + neytron",
    "Kitoblarni o'qib, chuqur bilim oling!",
    "Har bir bob muhim ma'lumot beradi",
    "Bilim - kuch!",
  ],
  "/quiz": [
    "Optimus Prime test yechishda kuch beradi!",
    "Har bir savolni diqqat bilan o'qing",
    "Formulalarni esda tuting",
    "Vaqtni to'g'ri taqsimlang",
    "Ishonchsiz javoblarni qayta ko'ring",
    "Xatolardan o'rganing",
    "Bilim - eng kuchli qurol!",
    "Testlar bilimni mustahkamlaydi",
    "Har kuni mashq qiling!",
    "Omad sizga yor bo'lsin!",
  ],
  "/calculator": [
    "Optimus Prime hisoblashda yordam beradi!",
    "M = m/n - molyar massa formulasi",
    "C = n/V - konsentratsiya formulasi",
    "pH = -log[H⁺] - kislotalik ko'rsatkichi",
    "PV = nRT - ideal gaz tenglamasi",
    "ρ = m/V - zichlik formulasi",
    "V = n × 22.4 L - gaz hajmi (n.sh.)",
    "Faradey qonuni: m = MIt/nF",
    "Bosqichma-bosqich yeching!",
    "Hisob-kitob - aniqlik talab qiladi!",
  ],
  "/experiments": [
    "Optimus Prime tajribalar sirlari bilan tanishtiradi!",
    "NaHCO₃ + CH₃COOH → vulqon tajribasi!",
    "Yod + kraxmal → ko'k rang",
    "Magniy + olov → yorqin oq nur!",
    "Kalsiy + suv → vodorod gazi",
    "Xavfsizlik - birinchi o'rinda!",
    "Himoya ko'zoynak ishlating",
    "Qo'lqop kiyib ishlang",
    "Tajribalarni nazorat ostida o'tkazing!",
    "Kimyo - qiziqarli fan!",
  ],
  "/developers": [
    "Optimus Prime ChemFlare jamoasini qo'llab-quvvatlaydi!",
    "Transformerlar kabi - bilim bilan o'zgaramiz!",
    "Birga o'rganamiz, birga kuchli bo'lamiz!",
    "Ilova kimyoni oson qiladi",
    "Yangi imkoniyatlar kutmoqda!",
    "Sizning fikringiz muhim!",
    "Ilovani do'stlaringizga tavsiya qiling!",
    "Kimyo - kelajak fani!",
    "Bilim - eng yaxshi sarmoya!",
    "Rahmat, ChemFlare bilan birga!",
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
    } 
    // NEW GESTURES - 20+ movements
    else if (gesture === "fly") {
      // Flying - arms spread like superman
      armRef.current.rotation.z = (isLeft ? -2.5 : 2.5) + Math.sin(time * 3) * 0.1;
      armRef.current.rotation.x = -0.3 + Math.sin(time * 2) * 0.15;
      forearmRef.current.rotation.x = 0.1 + Math.sin(time * 4) * 0.1;
    } else if (gesture === "run") {
      // Running - fast alternating arm pumps
      const runPhase = time * 12 + (isLeft ? 0 : Math.PI);
      armRef.current.rotation.z = (isLeft ? 0.2 : -0.2);
      armRef.current.rotation.x = Math.sin(runPhase) * 1.2;
      forearmRef.current.rotation.x = 0.8 + Math.abs(Math.sin(runPhase)) * 0.4;
    } else if (gesture === "spin") {
      // Spinning - arms out for balance
      armRef.current.rotation.z = (isLeft ? -2.2 : 2.2);
      armRef.current.rotation.x = Math.sin(time * 6) * 0.3;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "swim") {
      // Swimming strokes
      const swimPhase = time * 4 + (isLeft ? 0 : Math.PI);
      armRef.current.rotation.z = (isLeft ? -1.5 : 1.5) + Math.sin(swimPhase) * 0.8;
      armRef.current.rotation.x = Math.cos(swimPhase) * 0.6;
      forearmRef.current.rotation.x = 0.4 + Math.sin(swimPhase * 2) * 0.3;
    } else if (gesture === "kick") {
      // Kicking stance - arms guard position
      armRef.current.rotation.z = (isLeft ? -0.8 : 0.8);
      armRef.current.rotation.x = -0.5;
      forearmRef.current.rotation.x = 1.2;
    } else if (gesture === "crouch") {
      // Crouching - arms forward for balance
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = -0.8;
      forearmRef.current.rotation.x = 0.6;
    } else if (gesture === "hover") {
      // Hovering - gentle floating arms
      armRef.current.rotation.z = (isLeft ? -1.8 : 1.8) + Math.sin(time * 1.5) * 0.2;
      armRef.current.rotation.x = Math.sin(time * 2) * 0.15;
      forearmRef.current.rotation.x = 0.4 + Math.sin(time * 2.5) * 0.15;
    } else if (gesture === "land") {
      // Landing impact - arms down for balance
      const landPhase = Math.abs(Math.sin(time * 6));
      armRef.current.rotation.z = (isLeft ? 0.6 : -0.6) - landPhase * 0.3;
      armRef.current.rotation.x = 0.3 + landPhase * 0.2;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "pushUp") {
      // Push-up position
      armRef.current.rotation.z = (isLeft ? 0.1 : -0.1);
      armRef.current.rotation.x = -1.5 + Math.sin(time * 4) * 0.3;
      forearmRef.current.rotation.x = Math.sin(time * 4) * 0.4;
    } else if (gesture === "sitUp") {
      // Sit-up - arms behind head
      armRef.current.rotation.z = (isLeft ? -1.2 : 1.2);
      armRef.current.rotation.x = 0.5 + Math.sin(time * 3) * 0.2;
      forearmRef.current.rotation.x = 1.8;
    } else if (gesture === "squat") {
      // Squat - arms forward for balance
      armRef.current.rotation.z = (isLeft ? 0.2 : -0.2);
      armRef.current.rotation.x = -1.2 + Math.sin(time * 3) * 0.1;
      forearmRef.current.rotation.x = 0.3;
    } else if (gesture === "lunge") {
      // Lunge position
      armRef.current.rotation.z = (isLeft ? 0.4 : -0.4);
      armRef.current.rotation.x = isLeft ? -0.6 : 0.3;
      forearmRef.current.rotation.x = 0.5;
    } else if (gesture === "bow") {
      // Bowing - arms at sides
      armRef.current.rotation.z = (isLeft ? 0.2 : -0.2);
      armRef.current.rotation.x = 0.3;
      forearmRef.current.rotation.x = 0.2;
    } else if (gesture === "handstand") {
      // Handstand - arms supporting body
      armRef.current.rotation.z = (isLeft ? 0.1 : -0.1);
      armRef.current.rotation.x = -2.8 + Math.sin(time * 2) * 0.05;
      forearmRef.current.rotation.x = 0.1;
    } else if (gesture === "backflip") {
      // Backflip rotation
      const flipPhase = (time * 3) % (Math.PI * 2);
      armRef.current.rotation.z = (isLeft ? -1.5 : 1.5);
      armRef.current.rotation.x = Math.sin(flipPhase) * 1.5;
      forearmRef.current.rotation.x = 0.5 + Math.abs(Math.sin(flipPhase)) * 0.5;
    } else if (gesture === "moonwalk") {
      // Moonwalk - smooth arm swing
      const moonPhase = time * 3;
      armRef.current.rotation.z = (isLeft ? 0.3 : -0.3);
      armRef.current.rotation.x = Math.sin(moonPhase + (isLeft ? 0 : Math.PI)) * 0.4;
      forearmRef.current.rotation.x = 0.6 + Math.sin(moonPhase) * 0.2;
    } else if (gesture === "robot") {
      // Robot dance - stiff jerky movements
      const robotPhase = Math.floor(time * 4) % 4;
      armRef.current.rotation.z = (isLeft ? -1.0 : 1.0) + (robotPhase % 2) * 0.5;
      armRef.current.rotation.x = -0.5 + (robotPhase > 1 ? 0.8 : 0);
      forearmRef.current.rotation.x = (robotPhase % 2) * 1.2;
    } else if (gesture === "disco") {
      // Disco pointing
      const discoPhase = time * 6;
      armRef.current.rotation.z = (isLeft ? -2.5 : 2.5) + Math.sin(discoPhase + (isLeft ? Math.PI : 0)) * 0.5;
      armRef.current.rotation.x = -0.2 + Math.sin(discoPhase * 0.5) * 0.3;
      forearmRef.current.rotation.x = 0.2;
    } else if (gesture === "breakdance") {
      // Breakdance moves
      const breakPhase = time * 5;
      armRef.current.rotation.z = (isLeft ? -1.8 : 1.8) + Math.sin(breakPhase) * 0.8;
      armRef.current.rotation.x = Math.cos(breakPhase) * 0.7;
      forearmRef.current.rotation.x = 0.3 + Math.abs(Math.sin(breakPhase * 2)) * 0.8;
    } else if (gesture === "victory") {
      // Victory pose - both arms up in V
      armRef.current.rotation.z = (isLeft ? -2.5 : 2.5);
      armRef.current.rotation.x = -0.2 + Math.sin(time * 3) * 0.1;
      forearmRef.current.rotation.x = 0.1;
    } else if (gesture === "tired") {
      // Tired - arms hanging
      armRef.current.rotation.z = (isLeft ? 0.1 : -0.1);
      armRef.current.rotation.x = 0.2 + Math.sin(time * 0.5) * 0.05;
      forearmRef.current.rotation.x = 0.1;
    } else if (gesture === "confused") {
      // Confused - scratching head
      if (!isLeft) {
        armRef.current.rotation.z = 1.2;
        armRef.current.rotation.x = 0.3 + Math.sin(time * 3) * 0.15;
        forearmRef.current.rotation.x = 1.8;
      } else {
        armRef.current.rotation.z = 0.3;
        armRef.current.rotation.x = 0;
        forearmRef.current.rotation.x = 0.4;
      }
    } else if (gesture === "angry") {
      // Angry - fists clenched, arms tense
      armRef.current.rotation.z = (isLeft ? -0.6 : 0.6);
      armRef.current.rotation.x = -0.4 + Math.sin(time * 8) * 0.05;
      forearmRef.current.rotation.x = 1.4;
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
      legRef.current.rotation.x = isLeft ? 0.3 : -0.1;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "punch") {
      legRef.current.rotation.x = isLeft ? 0.3 : -0.2;
      legRef.current.rotation.z = isLeft ? -0.15 : 0.15;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "flex") {
      legRef.current.rotation.z = isLeft ? -0.2 : 0.2;
      lowerLegRef.current.rotation.x = 0.15;
    }
    // NEW LEG GESTURES - 20+ movements
    else if (gesture === "fly") {
      // Flying - legs straight back
      legRef.current.rotation.x = 0.4 + Math.sin(time * 2) * 0.1;
      legRef.current.rotation.z = isLeft ? 0.1 : -0.1;
      lowerLegRef.current.rotation.x = 0.1;
    } else if (gesture === "run") {
      // Running - fast alternating leg pumps
      const runPhase = time * 12 + (isLeft ? 0 : Math.PI);
      legRef.current.rotation.x = Math.sin(runPhase) * 0.9;
      lowerLegRef.current.rotation.x = Math.max(0, Math.sin(runPhase + 0.8)) * 1.2;
    } else if (gesture === "spin") {
      // Spinning - legs together
      legRef.current.rotation.x = Math.sin(time * 6) * 0.2;
      legRef.current.rotation.z = isLeft ? 0.05 : -0.05;
      lowerLegRef.current.rotation.x = 0.1;
    } else if (gesture === "swim") {
      // Swimming kick
      const swimPhase = time * 6 + (isLeft ? 0 : Math.PI);
      legRef.current.rotation.x = Math.sin(swimPhase) * 0.5;
      lowerLegRef.current.rotation.x = Math.abs(Math.sin(swimPhase * 1.5)) * 0.4;
    } else if (gesture === "kick") {
      // High kick - one leg kicks
      if (isLeft) {
        const kickPhase = Math.abs(Math.sin(time * 6));
        legRef.current.rotation.x = -1.2 - kickPhase * 0.5;
        lowerLegRef.current.rotation.x = 0.2;
      } else {
        legRef.current.rotation.x = 0.2;
        lowerLegRef.current.rotation.x = 0.3;
      }
    } else if (gesture === "crouch") {
      // Crouching position
      legRef.current.rotation.x = -0.8;
      legRef.current.rotation.z = isLeft ? -0.2 : 0.2;
      lowerLegRef.current.rotation.x = 1.4;
    } else if (gesture === "hover") {
      // Hovering - legs dangle
      legRef.current.rotation.x = 0.2 + Math.sin(time * 1.5 + (isLeft ? 0 : 0.5)) * 0.15;
      lowerLegRef.current.rotation.x = 0.3 + Math.sin(time * 2) * 0.1;
    } else if (gesture === "land") {
      // Landing impact - bent legs absorb impact
      const landPhase = Math.abs(Math.sin(time * 6));
      legRef.current.rotation.x = -0.3 - landPhase * 0.4;
      legRef.current.rotation.z = isLeft ? -0.15 : 0.15;
      lowerLegRef.current.rotation.x = 0.8 + landPhase * 0.4;
    } else if (gesture === "pushUp") {
      // Push-up - legs straight back
      legRef.current.rotation.x = 0.1;
      lowerLegRef.current.rotation.x = 0;
    } else if (gesture === "sitUp") {
      // Sit-up - legs bent, feet flat
      legRef.current.rotation.x = -0.8 + Math.sin(time * 3) * 0.2;
      lowerLegRef.current.rotation.x = 1.0;
    } else if (gesture === "squat") {
      // Deep squat
      const squatPhase = Math.sin(time * 3);
      legRef.current.rotation.x = -0.6 - squatPhase * 0.3;
      legRef.current.rotation.z = isLeft ? -0.25 : 0.25;
      lowerLegRef.current.rotation.x = 1.2 + squatPhase * 0.3;
    } else if (gesture === "lunge") {
      // Lunge - one leg forward, one back
      legRef.current.rotation.x = isLeft ? -0.8 : 0.5;
      lowerLegRef.current.rotation.x = isLeft ? 1.0 : 0.3;
    } else if (gesture === "bow") {
      // Bowing - slight knee bend
      legRef.current.rotation.x = -0.15;
      lowerLegRef.current.rotation.x = 0.3;
    } else if (gesture === "handstand") {
      // Handstand - legs up in air
      legRef.current.rotation.x = 0.1 + Math.sin(time * 2) * 0.1;
      legRef.current.rotation.z = isLeft ? 0.1 : -0.1;
      lowerLegRef.current.rotation.x = 0.05;
    } else if (gesture === "backflip") {
      // Backflip rotation
      const flipPhase = (time * 3) % (Math.PI * 2);
      legRef.current.rotation.x = Math.cos(flipPhase) * 0.8;
      lowerLegRef.current.rotation.x = Math.abs(Math.sin(flipPhase)) * 0.6;
    } else if (gesture === "moonwalk") {
      // Moonwalk - sliding back
      const moonPhase = time * 3 + (isLeft ? 0 : Math.PI);
      legRef.current.rotation.x = Math.sin(moonPhase) * 0.3;
      lowerLegRef.current.rotation.x = 0.2 + Math.abs(Math.sin(moonPhase)) * 0.2;
    } else if (gesture === "robot") {
      // Robot dance - stiff jerky leg movements
      const robotPhase = Math.floor(time * 4) % 4;
      legRef.current.rotation.x = isLeft ? (robotPhase % 2) * -0.5 : ((robotPhase + 1) % 2) * -0.5;
      lowerLegRef.current.rotation.x = (robotPhase > 1) ? 0.4 : 0;
    } else if (gesture === "disco") {
      // Disco moves
      const discoPhase = time * 6 + (isLeft ? 0 : Math.PI);
      legRef.current.rotation.x = Math.sin(discoPhase) * 0.4;
      legRef.current.rotation.z = Math.sin(discoPhase * 0.5) * 0.2;
      lowerLegRef.current.rotation.x = Math.abs(Math.sin(discoPhase)) * 0.5;
    } else if (gesture === "breakdance") {
      // Breakdance moves
      const breakPhase = time * 5;
      legRef.current.rotation.x = Math.sin(breakPhase + (isLeft ? 0 : Math.PI)) * 0.8;
      legRef.current.rotation.z = Math.cos(breakPhase * 0.5) * 0.3;
      lowerLegRef.current.rotation.x = Math.abs(Math.sin(breakPhase * 1.5)) * 0.8;
    } else if (gesture === "victory") {
      // Victory stance - stable
      legRef.current.rotation.z = isLeft ? -0.15 : 0.15;
      lowerLegRef.current.rotation.x = 0.1;
    } else if (gesture === "tired") {
      // Tired - slouching stance
      legRef.current.rotation.x = -0.1;
      legRef.current.rotation.z = isLeft ? -0.1 : 0.1;
      lowerLegRef.current.rotation.x = 0.2;
    } else if (gesture === "confused") {
      // Confused - weight shifting
      legRef.current.rotation.x = isLeft ? -0.1 : 0.05;
      legRef.current.rotation.z = Math.sin(time * 2) * 0.05;
      lowerLegRef.current.rotation.x = 0.15;
    } else if (gesture === "angry") {
      // Angry - aggressive stance
      legRef.current.rotation.z = isLeft ? -0.25 : 0.25;
      legRef.current.rotation.x = -0.1;
      lowerLegRef.current.rotation.x = 0.2;
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
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.02;
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.03;
        groupRef.current.rotation.z = Math.sin(time * 6) * 0.02;
      } else if (gesture === "celebrate") {
        groupRef.current.position.y = Math.abs(Math.sin(time * 8)) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.1;
      } else if (gesture === "fly") {
        // Flying - body tilted forward, rising and falling
        groupRef.current.position.y = 0.15 + Math.sin(time * 2) * 0.08;
        groupRef.current.rotation.x = -0.4;
        groupRef.current.rotation.y = Math.sin(time * 1) * 0.1;
        groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
      } else if (gesture === "run") {
        // Running - fast bounce with lean
        groupRef.current.position.y = Math.abs(Math.sin(time * 12)) * 0.035;
        groupRef.current.rotation.x = -0.15;
        groupRef.current.rotation.y = Math.sin(time * 6) * 0.04;
        groupRef.current.rotation.z = Math.sin(time * 12) * 0.03;
      } else if (gesture === "spin") {
        // Spinning fast
        groupRef.current.rotation.y = time * 8;
        groupRef.current.position.y = Math.sin(time * 3) * 0.03;
      } else if (gesture === "swim") {
        // Swimming motion
        groupRef.current.position.y = Math.sin(time * 2) * 0.05;
        groupRef.current.rotation.x = -0.2 + Math.sin(time * 2) * 0.1;
        groupRef.current.rotation.z = Math.sin(time * 3) * 0.1;
      } else if (gesture === "kick") {
        // Kicking stance
        groupRef.current.rotation.x = 0.1;
        groupRef.current.rotation.z = 0.15;
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.02;
      } else if (gesture === "crouch") {
        // Crouching - body lowered
        groupRef.current.position.y = -0.08;
        groupRef.current.rotation.x = 0.2;
      } else if (gesture === "hover") {
        // Hovering - gentle float
        groupRef.current.position.y = 0.1 + Math.sin(time * 1.5) * 0.04;
        groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      } else if (gesture === "land") {
        // Landing impact
        const landPhase = Math.abs(Math.sin(time * 6));
        groupRef.current.position.y = -0.05 + landPhase * 0.05;
        groupRef.current.rotation.x = 0.15 - landPhase * 0.1;
      } else if (gesture === "pushUp") {
        // Push-up - body goes up and down
        groupRef.current.position.y = -0.1 + Math.sin(time * 4) * 0.04;
        groupRef.current.rotation.x = -1.4;
      } else if (gesture === "sitUp") {
        // Sit-up motion
        groupRef.current.rotation.x = -0.8 + Math.sin(time * 3) * 0.5;
        groupRef.current.position.y = -0.05;
      } else if (gesture === "squat") {
        // Squat - body goes down
        const squatPhase = Math.sin(time * 3);
        groupRef.current.position.y = -0.06 - squatPhase * 0.04;
        groupRef.current.rotation.x = 0.1;
      } else if (gesture === "lunge") {
        // Lunge position
        groupRef.current.rotation.x = 0.1;
        groupRef.current.rotation.z = 0.1;
        groupRef.current.position.y = -0.04;
      } else if (gesture === "bow") {
        // Bowing motion
        groupRef.current.rotation.x = 0.6 + Math.sin(time * 2) * 0.1;
        groupRef.current.position.y = -0.03;
      } else if (gesture === "handstand") {
        // Handstand - upside down
        groupRef.current.rotation.x = Math.PI;
        groupRef.current.position.y = 0.2 + Math.sin(time * 2) * 0.02;
      } else if (gesture === "backflip") {
        // Backflip rotation
        groupRef.current.rotation.x = (time * 3) % (Math.PI * 2);
        groupRef.current.position.y = Math.abs(Math.sin(time * 3)) * 0.15;
      } else if (gesture === "moonwalk") {
        // Moonwalk - smooth glide back
        groupRef.current.rotation.y = Math.PI;
        groupRef.current.position.y = Math.sin(time * 3) * 0.01;
        groupRef.current.rotation.z = Math.sin(time * 2) * 0.03;
      } else if (gesture === "robot") {
        // Robot dance - stiff jerky
        const robotPhase = Math.floor(time * 4) % 4;
        groupRef.current.rotation.y = (robotPhase / 4) * Math.PI * 0.5;
        groupRef.current.position.y = (robotPhase % 2) * 0.02;
      } else if (gesture === "disco") {
        // Disco moves
        groupRef.current.rotation.y = Math.sin(time * 3) * 0.3;
        groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.03;
        groupRef.current.rotation.z = Math.sin(time * 6) * 0.1;
      } else if (gesture === "breakdance") {
        // Breakdance
        groupRef.current.rotation.z = Math.sin(time * 5) * 0.4;
        groupRef.current.rotation.x = Math.cos(time * 3) * 0.3;
        groupRef.current.position.y = Math.abs(Math.sin(time * 5)) * 0.06;
      } else if (gesture === "victory") {
        // Victory pose
        groupRef.current.position.y = 0.02;
        groupRef.current.rotation.y = Math.sin(time * 2) * 0.1;
      } else if (gesture === "tired") {
        // Tired slouch
        groupRef.current.rotation.x = 0.15;
        groupRef.current.position.y = -0.02 + Math.sin(time * 0.5) * 0.01;
      } else if (gesture === "confused") {
        // Confused - tilting
        groupRef.current.rotation.z = Math.sin(time * 2) * 0.15;
        groupRef.current.rotation.y = Math.sin(time * 1.5) * 0.1;
      } else if (gesture === "angry") {
        // Angry shake
        groupRef.current.rotation.z = Math.sin(time * 15) * 0.03;
        groupRef.current.position.y = Math.sin(time * 10) * 0.005;
      } else if (isTalking) {
        groupRef.current.position.y = Math.sin(time * 3) * 0.01;
        groupRef.current.rotation.y = Math.sin(time * 2) * 0.05;
        groupRef.current.rotation.x = -0.05 + Math.sin(time * 4) * 0.02;
      } else {
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
      left: '50%',
      transform: 'translateX(-50%)',
      bottom: '105%',
      marginBottom: '8px',
    }}
  >
    <div className="relative bg-gradient-to-br from-primary/95 to-primary/80 backdrop-blur-md 
      text-primary-foreground text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-elegant border border-primary/30
      max-w-[140px] sm:max-w-[180px] md:max-w-[220px] text-center">
      <p className="leading-relaxed break-words">{text}</p>
      <div 
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full w-0 h-0 
          border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-primary/90"
        style={{ borderLeftWidth: "6px", borderRightWidth: "6px", borderTopWidth: "8px" }}
      />
    </div>
  </motion.div>
);

// Bumblebee as Camaro Car (Yellow sports car) - REALISTIC VERSION
const BumblebeeCar = ({ transformProgress }: { transformProgress: number }) => {
  const carRef = useRef<THREE.Group>(null);
  const wheelFL = useRef<THREE.Group>(null);
  const wheelFR = useRef<THREE.Group>(null);
  const wheelBL = useRef<THREE.Group>(null);
  const wheelBR = useRef<THREE.Group>(null);
  const steeringAngle = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Wheel spinning - faster for realistic speed
    const wheelSpeed = time * 12;
    [wheelFL, wheelFR, wheelBL, wheelBR].forEach((wheel) => {
      if (wheel.current) {
        wheel.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x = wheelSpeed;
          }
        });
      }
    });
    
    // Subtle steering animation
    steeringAngle.current = Math.sin(time * 0.8) * 0.15;
    if (wheelFL.current) wheelFL.current.rotation.y = steeringAngle.current;
    if (wheelFR.current) wheelFR.current.rotation.y = steeringAngle.current;
    
    // Car movement - realistic driving motion
    if (carRef.current) {
      // Suspension bounce
      carRef.current.position.y = Math.sin(time * 4) * 0.008 + Math.sin(time * 7) * 0.003;
      // Slight body roll
      carRef.current.rotation.z = Math.sin(time * 0.8) * 0.02;
      // Forward/back pitch during acceleration
      carRef.current.rotation.x = Math.sin(time * 1.2) * 0.015;
      // Steering yaw
      carRef.current.rotation.y = Math.sin(time * 0.5) * 0.04;
    }
  });

  return (
    <group ref={carRef} scale={0.38}>
      {/* MAIN BODY - Curved sports car shape */}
      {/* Lower body/chassis */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.85, 0.12, 0.78]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      
      {/* Main body lower section */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.75, 0.15, 0.76]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* Main body upper section - muscular */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.7, 0.18, 0.74]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* HOOD - with muscle car bulge */}
      <mesh position={[0.55, 0.28, 0]}>
        <boxGeometry args={[0.65, 0.16, 0.72]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Hood scoop */}
      <mesh position={[0.45, 0.38, 0]}>
        <boxGeometry args={[0.35, 0.06, 0.25]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.1} />
      </mesh>
      {/* Hood vents */}
      <mesh position={[0.6, 0.36, 0.18]}>
        <boxGeometry args={[0.12, 0.02, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.36, -0.18]}>
        <boxGeometry args={[0.12, 0.02, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* FRONT BUMPER - detailed */}
      <mesh position={[0.92, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.18, 0.78]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Front splitter */}
      <mesh position={[0.94, 0.04, 0]}>
        <boxGeometry args={[0.06, 0.03, 0.82]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Air intakes */}
      <mesh position={[0.9, 0.08, 0.25]}>
        <boxGeometry args={[0.04, 0.08, 0.18]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.9, 0.08, -0.25]}>
        <boxGeometry args={[0.04, 0.08, 0.18]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      {/* Center grille */}
      <mesh position={[0.92, 0.16, 0]}>
        <boxGeometry args={[0.03, 0.1, 0.35]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* CABIN/ROOF */}
      <mesh position={[-0.1, 0.52, 0]}>
        <boxGeometry args={[0.75, 0.28, 0.68]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Roof panel */}
      <mesh position={[-0.1, 0.68, 0]}>
        <boxGeometry args={[0.6, 0.04, 0.55]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* WINDSHIELD - angled */}
      <mesh position={[0.32, 0.52, 0]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.42, 0.025, 0.62]} />
        <meshStandardMaterial color={BLUE_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      {/* Windshield frame */}
      <mesh position={[0.32, 0.52, 0.32]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.42, 0.03, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.32, 0.52, -0.32]} rotation={[0, 0, -0.55]}>
        <boxGeometry args={[0.42, 0.03, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* REAR WINDOW */}
      <mesh position={[-0.48, 0.5, 0]} rotation={[0, 0, 0.45]}>
        <boxGeometry args={[0.32, 0.025, 0.58]} />
        <meshStandardMaterial color={BLUE_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      
      {/* SIDE WINDOWS */}
      <mesh position={[-0.1, 0.52, 0.345]}>
        <boxGeometry args={[0.55, 0.18, 0.015]} />
        <meshStandardMaterial color={BLUE_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.1, 0.52, -0.345]}>
        <boxGeometry args={[0.55, 0.18, 0.015]} />
        <meshStandardMaterial color={BLUE_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.7} />
      </mesh>
      
      {/* RACING STRIPES - dual stripes */}
      <mesh position={[0.1, 0.42, 0.08]}>
        <boxGeometry args={[1.65, 0.015, 0.06]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.1, 0.42, -0.08]}>
        <boxGeometry args={[1.65, 0.015, 0.06]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* REAR SECTION */}
      <mesh position={[-0.7, 0.26, 0]}>
        <boxGeometry args={[0.45, 0.22, 0.72]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Rear diffuser */}
      <mesh position={[-0.92, 0.08, 0]}>
        <boxGeometry args={[0.06, 0.12, 0.65]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Spoiler */}
      <mesh position={[-0.72, 0.42, 0]}>
        <boxGeometry args={[0.12, 0.025, 0.65]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      {/* Spoiler supports */}
      <mesh position={[-0.72, 0.395, 0.22]}>
        <boxGeometry args={[0.08, 0.04, 0.03]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[-0.72, 0.395, -0.22]}>
        <boxGeometry args={[0.08, 0.04, 0.03]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* HEADLIGHTS - detailed LED style */}
      <mesh position={[0.88, 0.22, 0.28]}>
        <boxGeometry args={[0.06, 0.06, 0.12]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.88, 0.22, -0.28]}>
        <boxGeometry args={[0.06, 0.06, 0.12]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      {/* Headlight housings */}
      <mesh position={[0.86, 0.22, 0.28]}>
        <boxGeometry args={[0.08, 0.08, 0.14]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.86, 0.22, -0.28]}>
        <boxGeometry args={[0.08, 0.08, 0.14]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} transparent opacity={0.3} />
      </mesh>
      {/* DRL strips */}
      <mesh position={[0.89, 0.18, 0.28]}>
        <boxGeometry args={[0.02, 0.015, 0.1]} />
        <meshStandardMaterial color={YELLOW_HIGHLIGHT} emissive={YELLOW_HIGHLIGHT} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.89, 0.18, -0.28]}>
        <boxGeometry args={[0.02, 0.015, 0.1]} />
        <meshStandardMaterial color={YELLOW_HIGHLIGHT} emissive={YELLOW_HIGHLIGHT} emissiveIntensity={1.5} />
      </mesh>
      
      {/* TAILLIGHTS - detailed */}
      <mesh position={[-0.92, 0.22, 0.26]}>
        <boxGeometry args={[0.025, 0.08, 0.15]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[-0.92, 0.22, -0.26]}>
        <boxGeometry args={[0.025, 0.08, 0.15]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={1.5} />
      </mesh>
      {/* Brake light strip */}
      <mesh position={[-0.9, 0.35, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={1} />
      </mesh>
      {/* Exhaust tips */}
      <mesh position={[-0.94, 0.08, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.04, 0.06, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[-0.94, 0.08, -0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.04, 0.06, 12]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* SIDE MIRRORS */}
      <mesh position={[0.18, 0.48, 0.4]}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0.2, 0.48, 0.44]}>
        <boxGeometry args={[0.04, 0.035, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      <mesh position={[0.18, 0.48, -0.4]}>
        <boxGeometry args={[0.08, 0.04, 0.04]} />
        <meshStandardMaterial color={YELLOW_MAIN} metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0.2, 0.48, -0.44]}>
        <boxGeometry args={[0.04, 0.035, 0.02]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
      </mesh>
      
      {/* DOOR HANDLES */}
      <mesh position={[-0.05, 0.32, 0.375]}>
        <boxGeometry args={[0.08, 0.02, 0.015]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[-0.05, 0.32, -0.375]}>
        <boxGeometry args={[0.08, 0.02, 0.015]} />
        <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* WHEEL ARCHES */}
      <mesh position={[0.52, 0.1, 0.4]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[0.52, 0.1, -0.4]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-0.52, 0.1, 0.4]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-0.52, 0.1, -0.4]}>
        <boxGeometry args={[0.32, 0.18, 0.04]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.15} />
      </mesh>
      
      {/* WHEELS - Detailed with spokes */}
      {/* Front Left Wheel */}
      <group ref={wheelFL} position={[0.52, 0.02, 0.42]}>
        {/* Tire */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        {/* Tire sidewall */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.025, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        {/* Rim */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.08, 20]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        {/* Center cap */}
        <mesh position={[0, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        {/* Brake disc */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 20]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Brake caliper */}
        <mesh position={[0.06, -0.03, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.06]} />
          <meshStandardMaterial color={AUTOBOT_RED} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Front Right Wheel */}
      <group ref={wheelFR} position={[0.52, 0.02, -0.42]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.025, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.08, 20]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        <mesh position={[0, -0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 20]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.06, 0.03, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.06]} />
          <meshStandardMaterial color={AUTOBOT_RED} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Rear Left Wheel */}
      <group ref={wheelBL} position={[-0.52, 0.02, 0.42]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.025, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.1, 20]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 20]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.06, -0.03, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.06]} />
          <meshStandardMaterial color={AUTOBOT_RED} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Rear Right Wheel */}
      <group ref={wheelBR} position={[-0.52, 0.02, -0.42]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.12, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.025, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.095, 0.095, 0.1, 20]} />
          <meshStandardMaterial color={CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        <mesh position={[0, -0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 20]} />
          <meshStandardMaterial color="#444" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.06, 0.03, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.06]} />
          <meshStandardMaterial color={AUTOBOT_RED} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Autobot emblem on hood */}
      <mesh position={[0.35, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 6]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.8} />
      </mesh>
      
      {/* Headlight beams (light cones) */}
      <pointLight position={[0.95, 0.22, 0.28]} color="#FFFFFF" intensity={0.5} distance={1} />
      <pointLight position={[0.95, 0.22, -0.28]} color="#FFFFFF" intensity={0.5} distance={1} />
    </group>
  );
};

// Optimus Prime as Semi Truck (Red/Blue truck) - REALISTIC VERSION
const OptimusTruck = ({ transformProgress }: { transformProgress: number }) => {
  const truckRef = useRef<THREE.Group>(null);
  const wheelFL = useRef<THREE.Group>(null);
  const wheelFR = useRef<THREE.Group>(null);
  const wheelBL1 = useRef<THREE.Group>(null);
  const wheelBR1 = useRef<THREE.Group>(null);
  const wheelBL2 = useRef<THREE.Group>(null);
  const wheelBR2 = useRef<THREE.Group>(null);
  const steeringAngle = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Wheel spinning
    const wheelSpeed = time * 8;
    [wheelFL, wheelFR, wheelBL1, wheelBR1, wheelBL2, wheelBR2].forEach((wheel) => {
      if (wheel.current) {
        wheel.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x = wheelSpeed;
          }
        });
      }
    });
    
    // Steering
    steeringAngle.current = Math.sin(time * 0.6) * 0.12;
    if (wheelFL.current) wheelFL.current.rotation.y = steeringAngle.current;
    if (wheelFR.current) wheelFR.current.rotation.y = steeringAngle.current;
    
    // Truck movement - heavier, more substantial
    if (truckRef.current) {
      // Heavy suspension
      truckRef.current.position.y = Math.sin(time * 2.5) * 0.012 + Math.sin(time * 5) * 0.004;
      // Body sway
      truckRef.current.rotation.z = Math.sin(time * 0.6) * 0.015;
      // Pitch
      truckRef.current.rotation.x = Math.sin(time * 0.8) * 0.01;
      // Steering response
      truckRef.current.rotation.y = Math.sin(time * 0.4) * 0.035;
    }
  });

  return (
    <group ref={truckRef} scale={0.32}>
      {/* FRAME/CHASSIS */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[2.4, 0.08, 0.7]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.2} />
      </mesh>
      
      {/* CAB - Main body */}
      <mesh position={[0.45, 0.42, 0]}>
        <boxGeometry args={[0.95, 0.65, 0.82]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* CAB ROOF */}
      <mesh position={[0.3, 0.82, 0]}>
        <boxGeometry args={[0.7, 0.18, 0.78]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Roof deflector/sleeper */}
      <mesh position={[0.15, 0.95, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.65]} />
        <meshStandardMaterial color={OPTIMUS_RED} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* HOOD/ENGINE - Blue */}
      <mesh position={[0.88, 0.28, 0]}>
        <boxGeometry args={[0.5, 0.38, 0.8]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Hood top panel */}
      <mesh position={[0.88, 0.48, 0]}>
        <boxGeometry args={[0.48, 0.04, 0.76]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* WINDSHIELD - large truck style */}
      <mesh position={[0.7, 0.6, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.45, 0.03, 0.7]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      {/* Windshield frame */}
      <mesh position={[0.7, 0.6, 0.36]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.45, 0.04, 0.02]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[0.7, 0.6, -0.36]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.45, 0.04, 0.02]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* SIDE WINDOWS */}
      <mesh position={[0.35, 0.6, 0.415]}>
        <boxGeometry args={[0.4, 0.25, 0.015]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.35, 0.6, -0.415]}>
        <boxGeometry args={[0.4, 0.25, 0.015]} />
        <meshStandardMaterial color={OPTIMUS_ENERGY} metalness={0.4} roughness={0.05} transparent opacity={0.7} />
      </mesh>
      
      {/* FLAME STRIPES on sides - iconic Optimus design */}
      <mesh position={[0.45, 0.28, 0.42]}>
        <boxGeometry args={[0.9, 0.25, 0.015]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0.45, 0.28, -0.42]}>
        <boxGeometry args={[0.9, 0.25, 0.015]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Flame accent tips */}
      <mesh position={[0.75, 0.35, 0.42]}>
        <boxGeometry args={[0.18, 0.08, 0.018]} />
        <meshStandardMaterial color="#FF6B35" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.75, 0.35, -0.42]}>
        <boxGeometry args={[0.18, 0.08, 0.018]} />
        <meshStandardMaterial color="#FF6B35" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* FRONT BUMPER - chrome */}
      <mesh position={[1.14, 0.15, 0]}>
        <boxGeometry args={[0.06, 0.22, 0.85]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Bumper steps */}
      <mesh position={[1.12, 0.06, 0.3]}>
        <boxGeometry args={[0.08, 0.04, 0.2]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.2} />
      </mesh>
      <mesh position={[1.12, 0.06, -0.3]}>
        <boxGeometry args={[0.08, 0.04, 0.2]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.2} />
      </mesh>
      
      {/* GRILLE - detailed chrome */}
      <mesh position={[1.12, 0.32, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.55]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Grille bars */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((z, i) => (
        <mesh key={i} position={[1.12, 0.32, z]}>
          <boxGeometry args={[0.035, 0.24, 0.025]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.1} />
        </mesh>
      ))}
      
      {/* HEADLIGHTS - large truck style */}
      <mesh position={[1.1, 0.38, 0.32]}>
        <boxGeometry args={[0.04, 0.12, 0.14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[1.1, 0.38, -0.32]}>
        <boxGeometry args={[0.04, 0.12, 0.14]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      {/* Headlight housings */}
      <mesh position={[1.08, 0.38, 0.32]}>
        <boxGeometry args={[0.06, 0.14, 0.16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[1.08, 0.38, -0.32]}>
        <boxGeometry args={[0.06, 0.14, 0.16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* EXHAUST STACKS - chrome */}
      <mesh position={[0.02, 0.65, 0.48]}>
        <cylinderGeometry args={[0.045, 0.045, 0.55, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[0.02, 0.65, -0.48]}>
        <cylinderGeometry args={[0.045, 0.045, 0.55, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Exhaust tops */}
      <mesh position={[0.02, 0.94, 0.48]}>
        <cylinderGeometry args={[0.055, 0.045, 0.04, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[0.02, 0.94, -0.48]}>
        <cylinderGeometry args={[0.055, 0.045, 0.04, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* AIR FILTERS */}
      <mesh position={[0.02, 0.52, 0.48]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.02, 0.52, -0.48]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* SIDE MIRRORS */}
      <mesh position={[0.75, 0.72, 0.48]}>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.78, 0.72, 0.52]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[0.75, 0.72, -0.48]}>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.78, 0.72, -0.52]}>
        <boxGeometry args={[0.08, 0.12, 0.02]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* TRAILER CONNECTION/BED */}
      <mesh position={[-0.55, 0.18, 0]}>
        <boxGeometry args={[1.2, 0.2, 0.68]} />
        <meshStandardMaterial color={OPTIMUS_BLUE} metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Fifth wheel */}
      <mesh position={[-0.4, 0.3, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 16]} />
        <meshStandardMaterial color={BLACK_METAL} metalness={0.95} roughness={0.2} />
      </mesh>
      
      {/* FUEL TANKS */}
      <mesh position={[-0.15, 0.18, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      <mesh position={[-0.15, 0.18, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
        <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
      </mesh>
      
      {/* WHEELS - Front steering */}
      <group ref={wheelFL} position={[0.72, 0.02, 0.48]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.03, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.025, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
      
      <group ref={wheelFR} position={[0.72, 0.02, -0.48]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.12, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.16, 0.03, 8, 24]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.2} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.02, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
        <mesh position={[0, -0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.025, 12]} />
          <meshStandardMaterial color={BLACK_METAL} metalness={0.98} roughness={0.05} />
        </mesh>
      </group>
      
      {/* Rear wheels - dual axle */}
      <group ref={wheelBL1} position={[-0.6, 0.02, 0.44]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      <group ref={wheelBR1} position={[-0.6, 0.02, -0.44]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      <group ref={wheelBL2} position={[-0.9, 0.02, 0.44]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      <group ref={wheelBR2} position={[-0.9, 0.02, -0.44]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
          <meshStandardMaterial color={OPTIMUS_CHROME} metalness={0.99} roughness={0.02} />
        </mesh>
      </group>
      
      {/* MUD FLAPS */}
      <mesh position={[-0.45, 0.08, 0.38]}>
        <boxGeometry args={[0.02, 0.12, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.9} />
      </mesh>
      <mesh position={[-0.45, 0.08, -0.38]}>
        <boxGeometry args={[0.02, 0.12, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.9} />
      </mesh>
      
      {/* Autobot emblem on door */}
      <mesh position={[0.35, 0.5, 0.42]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.08, 6]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.35, 0.5, -0.42]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.08, 6]} />
        <meshStandardMaterial color={AUTOBOT_RED} emissive={AUTOBOT_RED} emissiveIntensity={0.8} />
      </mesh>
      
      {/* Headlight beams */}
      <pointLight position={[1.2, 0.38, 0.32]} color="#FFFFFF" intensity={0.6} distance={1.2} />
      <pointLight position={[1.2, 0.38, -0.32]} color="#FFFFFF" intensity={0.6} distance={1.2} />
    </group>
  );
};

// Transformation effect particles - Enhanced
const TransformParticles = ({ isTransforming, color = BLUE_ENERGY }: { isTransforming: boolean; color?: string }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const sparkRef = useRef<THREE.Points>(null);

  const particleGeometry = useMemo(() => {
    const positions = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.2 + Math.random() * 0.6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const sparkGeometry = useMemo(() => {
    const positions = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particlesRef.current && isTransforming) {
      particlesRef.current.rotation.y = time * 4;
      particlesRef.current.rotation.x = time * 3;
      particlesRef.current.rotation.z = time * 2;
    }
    if (sparkRef.current && isTransforming) {
      sparkRef.current.rotation.y = -time * 6;
      sparkRef.current.rotation.z = time * 4;
    }
  });

  if (!isTransforming) return null;

  return (
    <group>
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial color={color} size={0.035} transparent opacity={0.9} sizeAttenuation />
      </points>
      <points ref={sparkRef} geometry={sparkGeometry}>
        <pointsMaterial color="#FFFFFF" size={0.02} transparent opacity={0.7} sizeAttenuation />
      </points>
      {/* Energy ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Transforming limb component
const TransformingLimb = ({ 
  type, 
  side, 
  progress, 
  color 
}: { 
  type: "arm" | "leg"; 
  side: "left" | "right"; 
  progress: number;
  color: string;
}) => {
  const limbRef = useRef<THREE.Group>(null);
  const isLeft = side === "left";
  
  useFrame((state) => {
    if (!limbRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Each limb unfolds at different timing
    const limbDelay = type === "arm" ? (isLeft ? 0.1 : 0.2) : (isLeft ? 0.3 : 0.4);
    const adjustedProgress = Math.max(0, Math.min(1, (progress - limbDelay) / 0.5));
    
    if (type === "arm") {
      // Arms unfold from body - rotation from flat to down
      const unfoldAngle = adjustedProgress * Math.PI * 0.5;
      limbRef.current.rotation.z = isLeft ? -Math.PI / 2 + unfoldAngle : Math.PI / 2 - unfoldAngle;
      limbRef.current.rotation.x = Math.sin(adjustedProgress * Math.PI) * 0.5;
      // Position moves outward
      limbRef.current.position.x = isLeft ? -0.15 - adjustedProgress * 0.15 : 0.15 + adjustedProgress * 0.15;
      limbRef.current.position.y = 0.3 + adjustedProgress * 0.2;
    } else {
      // Legs unfold downward
      const unfoldAngle = adjustedProgress * Math.PI * 0.3;
      limbRef.current.rotation.x = -unfoldAngle;
      limbRef.current.position.x = isLeft ? -0.08 - adjustedProgress * 0.04 : 0.08 + adjustedProgress * 0.04;
      limbRef.current.position.y = -adjustedProgress * 0.4;
    }
    
    // Shaking during transformation
    if (progress > 0 && progress < 1) {
      limbRef.current.position.x += Math.sin(time * 30) * 0.005;
      limbRef.current.position.y += Math.cos(time * 25) * 0.005;
    }
  });

  const length = type === "arm" ? 0.25 : 0.35;
  const width = type === "arm" ? 0.06 : 0.08;

  return (
    <group ref={limbRef}>
      {/* Upper segment */}
      <mesh position={[0, -length / 2, 0]}>
        <boxGeometry args={[width, length, width * 0.8]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Joint */}
      <mesh position={[0, -length, 0]}>
        <sphereGeometry args={[width * 0.6, 12, 12]} />
        <meshStandardMaterial color="#CFD8DC" metalness={0.99} roughness={0.02} />
      </mesh>
      {/* Lower segment */}
      <mesh position={[0, -length * 1.5, 0]}>
        <boxGeometry args={[width * 0.9, length * 0.8, width * 0.7]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.08} />
      </mesh>
      {/* Glow during transformation */}
      {progress > 0 && progress < 1 && (
        <pointLight color={BLUE_ENERGY} intensity={1} distance={0.3} />
      )}
    </group>
  );
};

// Car parts transforming into robot
const TransformingCarParts = ({ progress, isBumblebee }: { progress: number; isBumblebee: boolean }) => {
  const bodyRef = useRef<THREE.Group>(null);
  const hoodRef = useRef<THREE.Mesh>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const leftDoorRef = useRef<THREE.Mesh>(null);
  const rightDoorRef = useRef<THREE.Mesh>(null);
  
  const mainColor = isBumblebee ? YELLOW_MAIN : OPTIMUS_RED;
  const accentColor = isBumblebee ? BLACK_METAL : OPTIMUS_BLUE;
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (bodyRef.current) {
      // Body rises and rotates to become torso
      bodyRef.current.position.y = progress * 0.4;
      bodyRef.current.rotation.x = progress * -Math.PI * 0.1;
      bodyRef.current.scale.y = 1 + progress * 0.3;
      bodyRef.current.scale.x = 1 - progress * 0.2;
    }
    
    if (hoodRef.current) {
      // Hood folds up to become chest
      hoodRef.current.rotation.x = -progress * Math.PI * 0.4;
      hoodRef.current.position.y = progress * 0.3;
      hoodRef.current.position.z = progress * 0.1;
    }
    
    if (roofRef.current) {
      // Roof rises to form head area
      roofRef.current.position.y = progress * 0.5;
      roofRef.current.scale.setScalar(1 - progress * 0.5);
    }
    
    if (leftDoorRef.current) {
      // Left door opens and rotates to become wing/shoulder
      leftDoorRef.current.rotation.y = progress * Math.PI * 0.6;
      leftDoorRef.current.position.z = 0.35 + progress * 0.2;
      leftDoorRef.current.position.y = progress * 0.25;
    }
    
    if (rightDoorRef.current) {
      // Right door mirrors left
      rightDoorRef.current.rotation.y = -progress * Math.PI * 0.6;
      rightDoorRef.current.position.z = -0.35 - progress * 0.2;
      rightDoorRef.current.position.y = progress * 0.25;
    }
    
    // Vibration during transformation
    if (progress > 0 && progress < 1) {
      const shake = 0.003;
      if (bodyRef.current) {
        bodyRef.current.position.x = Math.sin(time * 40) * shake;
      }
    }
  });

  return (
    <group scale={0.38}>
      {/* Main body transforming */}
      <group ref={bodyRef}>
        <mesh>
          <boxGeometry args={[1.2, 0.25, 0.65]} />
          <meshStandardMaterial color={mainColor} metalness={0.92} roughness={0.08} />
        </mesh>
      </group>
      
      {/* Hood becoming chest */}
      <mesh ref={hoodRef} position={[0.4, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.6]} />
        <meshStandardMaterial color={mainColor} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* Roof shrinking */}
      <mesh ref={roofRef} position={[0, 0.35, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.55]} />
        <meshStandardMaterial color={mainColor} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* Doors opening */}
      <mesh ref={leftDoorRef} position={[0, 0.2, 0.35]}>
        <boxGeometry args={[0.5, 0.25, 0.02]} />
        <meshStandardMaterial color={mainColor} metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh ref={rightDoorRef} position={[0, 0.2, -0.35]}>
        <boxGeometry args={[0.5, 0.25, 0.02]} />
        <meshStandardMaterial color={mainColor} metalness={0.92} roughness={0.08} />
      </mesh>
      
      {/* Wheels retracting */}
      <mesh position={[0.45, -0.05 - progress * 0.15, 0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1 * (1 - progress * 0.5), 0.1 * (1 - progress * 0.5), 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
      </mesh>
      <mesh position={[0.45, -0.05 - progress * 0.15, -0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1 * (1 - progress * 0.5), 0.1 * (1 - progress * 0.5), 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
      </mesh>
      <mesh position={[-0.45, -0.05 - progress * 0.15, 0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1 * (1 - progress * 0.5), 0.1 * (1 - progress * 0.5), 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
      </mesh>
      <mesh position={[-0.45, -0.05 - progress * 0.15, -0.38]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1 * (1 - progress * 0.5), 0.1 * (1 - progress * 0.5), 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
      </mesh>
      
      {/* Limbs emerging */}
      <TransformingLimb type="arm" side="left" progress={progress} color={accentColor} />
      <TransformingLimb type="arm" side="right" progress={progress} color={accentColor} />
      <TransformingLimb type="leg" side="left" progress={progress} color={accentColor} />
      <TransformingLimb type="leg" side="right" progress={progress} color={accentColor} />
    </group>
  );
};

// Transforming Bumblebee (car to robot) - Enhanced
const TransformingBumblebee = ({ gesture, isTalking, isTransformed, transformProgress }: { 
  gesture: GestureType; 
  isTalking?: boolean;
  isTransformed: boolean;
  transformProgress: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [showMidTransform, setShowMidTransform] = useState(false);

  useEffect(() => {
    // Show mid-transformation parts during the middle phase
    if (transformProgress > 0.2 && transformProgress < 0.8) {
      setShowMidTransform(true);
    } else {
      setShowMidTransform(false);
    }
  }, [transformProgress]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (transformProgress > 0 && transformProgress < 1) {
        // Multi-axis rotation during transformation
        groupRef.current.rotation.y = transformProgress * Math.PI * 2.5;
        groupRef.current.rotation.x = Math.sin(transformProgress * Math.PI) * 0.3;
        groupRef.current.position.y = Math.sin(transformProgress * Math.PI) * 0.4;
        // Shake effect
        groupRef.current.position.x = Math.sin(time * 20) * 0.01 * (1 - Math.abs(transformProgress - 0.5) * 2);
      } else {
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        groupRef.current.position.y = 0;
        groupRef.current.position.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <TransformParticles isTransforming={transformProgress > 0 && transformProgress < 1} color={YELLOW_HIGHLIGHT} />
      
      {/* Show different states based on progress */}
      {transformProgress === 0 && (
        <BumblebeeCar transformProgress={0} />
      )}
      
      {transformProgress > 0 && transformProgress < 1 && (
        <TransformingCarParts progress={transformProgress} isBumblebee={true} />
      )}
      
      {transformProgress >= 1 && (
        <BumblebeeRobot gesture={gesture} isTalking={isTalking} />
      )}
    </group>
  );
};

// Transforming Optimus Prime (truck to robot) - Enhanced
const TransformingOptimus = ({ gesture, isTalking, isTransformed, transformProgress }: { 
  gesture: GestureType; 
  isTalking?: boolean;
  isTransformed: boolean;
  transformProgress: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      
      if (transformProgress > 0 && transformProgress < 1) {
        // Heavier, more dramatic transformation
        groupRef.current.rotation.y = transformProgress * Math.PI * 2;
        groupRef.current.rotation.z = Math.sin(transformProgress * Math.PI * 2) * 0.15;
        groupRef.current.position.y = Math.sin(transformProgress * Math.PI) * 0.5;
        // Power surge shake
        groupRef.current.position.x = Math.sin(time * 25) * 0.015 * Math.sin(transformProgress * Math.PI);
      } else {
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = 0;
        groupRef.current.position.y = 0;
        groupRef.current.position.x = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <TransformParticles isTransforming={transformProgress > 0 && transformProgress < 1} color={OPTIMUS_ENERGY} />
      
      {transformProgress === 0 && (
        <OptimusTruck transformProgress={0} />
      )}
      
      {transformProgress > 0 && transformProgress < 1 && (
        <TransformingCarParts progress={transformProgress} isBumblebee={false} />
      )}
      
      {transformProgress >= 1 && (
        <OptimusRobot gesture={gesture} isTalking={isTalking} />
      )}
    </group>
  );
};

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
  const [introStep, setIntroStep] = useState(0); // 0 = tanishuv, 1 = motivatsiya, 2+ = o'rgatish
  const [shuffledKnowledge, setShuffledKnowledge] = useState<string[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(() => {
    return localStorage.getItem('robot_camera_enabled') === 'true';
  });
  const [isUserVisible, setIsUserVisible] = useState(false);
  
  // Transformation states
  const [bumblebeeTransformed, setBumblebeeTransformed] = useState(false);
  const [optimusTransformed, setOptimusTransformed] = useState(false);
  const [bumblebeeTransformProgress, setBumblebeeTransformProgress] = useState(0);
  const [optimusTransformProgress, setOptimusTransformProgress] = useState(0);
  
  const [bumblebeeTarget, setBumblebeeTarget] = useState({ x: 85, y: 20 });
  const [birdTarget, setBirdTarget] = useState({ x: 15, y: 25 });
  
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");
  const [robotResponse, setRobotResponse] = useState("");

  // Response templates based on user speech
  const generateResponse = useCallback((speech: string): string => {
    const lowerSpeech = speech.toLowerCase();
    
    // Greetings
    if (lowerSpeech.includes("salom") || lowerSpeech.includes("hello") || lowerSpeech.includes("hey")) {
      const responses = ["Salom do'stim! Qandaysiz?", "Hey! Sizni eshityapman!", "Salomlar! Xursandman!"];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // How are you
    if (lowerSpeech.includes("qanday") || lowerSpeech.includes("how are")) {
      const responses = ["Zo'rman! Sizchi?", "Ajoyib! Rahmat so'raganingiz uchun!", "Yaxshi, sizni ko'rib yanada yaxshi!"];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Name questions
    if (lowerSpeech.includes("kim") || lowerSpeech.includes("ism") || lowerSpeech.includes("name")) {
      return "Men Bumblebee! Avtobotlarning eng sodiq jangchisiman!";
    }
    
    // What can you do
    if (lowerSpeech.includes("nima qil") || lowerSpeech.includes("what can")) {
      return "Men sizni ko'raman, eshitaman va suhbatlashaman!";
    }
    
    // Compliments
    if (lowerSpeech.includes("zo'r") || lowerSpeech.includes("yaxshi") || lowerSpeech.includes("chiroyli") || lowerSpeech.includes("good") || lowerSpeech.includes("nice")) {
      const responses = ["Rahmat! Siz ham zo'rsiz!", "Voy, iltifotingiz uchun rahmat!", "Sizdan eshitish yoqimli!"];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Bye
    if (lowerSpeech.includes("xayr") || lowerSpeech.includes("ko'rishguncha") || lowerSpeech.includes("bye")) {
      return "Xayr do'stim! Yana ko'rishguncha!";
    }
    
    // Chemistry related
    if (lowerSpeech.includes("kimyo") || lowerSpeech.includes("chem") || lowerSpeech.includes("element")) {
      return "Kimyo haqida gapiryapsizmi? Bu mavzu menga yoqadi!";
    }
    
    // Default responses
    const defaultResponses = [
      "Qiziq! Davom eting!",
      "Sizni eshityapman!",
      "Ha, tushunyapman!",
      "Ajoyib fikr!",
      "Davom etamizmi?",
      "Siz juda qiziqsiz!",
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }, []);

  // Text-to-speech function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'uz-UZ';
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      
      // Try to find Uzbek or Russian voice, fallback to default
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('uz') || v.lang.includes('ru'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Listen for camera status changes
  useEffect(() => {
    const handleCameraChange = (event: CustomEvent<{ enabled: boolean }>) => {
      setCameraEnabled(event.detail.enabled);
    };
    
    window.addEventListener('cameraStatusChanged', handleCameraChange as EventListener);
    return () => {
      window.removeEventListener('cameraStatusChanged', handleCameraChange as EventListener);
    };
  }, []);

  // Initialize speech recognition when camera is enabled
  useEffect(() => {
    if (cameraEnabled && isUserVisible && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'uz-UZ';
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          console.log('User said:', finalTranscript);
          setUserSpeech(finalTranscript);
          
          // Generate and show response
          const response = generateResponse(finalTranscript);
          setRobotResponse(response);
          
          // Speak the response
          speak(response);
          
          // Clear after a while
          setTimeout(() => {
            setUserSpeech("");
            setRobotResponse("");
          }, 5000);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };
      
      recognition.onend = () => {
        // Restart recognition if camera is still enabled
        if (cameraEnabled && isUserVisible) {
          try {
            recognition.start();
          } catch (e) {
            console.log('Recognition restart failed:', e);
          }
        }
      };
      
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
      
      return () => {
        recognition.stop();
        recognitionRef.current = null;
        setIsListening(false);
      };
    } else if (!cameraEnabled && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [cameraEnabled, isUserVisible, generateResponse, speak]);

  // Handle camera stream for robot "vision"
  useEffect(() => {
    if (cameraEnabled && !streamRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          streamRef.current = stream;
          setIsUserVisible(true);
          
          // Create hidden video element
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          videoRef.current = video;
        })
        .catch(err => {
          console.error('Camera error:', err);
          setIsUserVisible(false);
        });
    } else if (!cameraEnabled && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current = null;
      setIsUserVisible(false);
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled]);

  // Get page-specific tips based on current path
  useEffect(() => {
    const path = location.pathname;
    
    // Get page-specific tips for both robots, fallback to "/" if path not found
    const bumblebePageTips = bumblebeeTips[path] || bumblebeeTips["/"];
    const optimusPageTips = optimusTips[path] || optimusTips["/"];
    
    // Combine and shuffle page-specific tips
    const combinedTips = [...bumblebePageTips, ...optimusPageTips].sort(() => Math.random() - 0.5);
    setShuffledKnowledge(combinedTips);
    setCurrentTipIndex(0);
    setIsFirstMessage(true);
    setIntroStep(0); // Reset intro step on page change
    setCurrentSpeaker("bumblebee");
    setBumblebeeGesture("wave");
    setBirdGesture("listen");
    setShowTip(true);
    
    // Reset transformation states
    setBumblebeeTransformed(false);
    setOptimusTransformed(false);
    setBumblebeeTransformProgress(0);
    setOptimusTransformProgress(0);
  }, [location.pathname]);
  
  // Transformation animation for Bumblebee
  useEffect(() => {
    if (isUserActive || isHidden) return;
    
    // Start as car, transform after 2 seconds
    const transformTimer = setTimeout(() => {
      // Animate transformation progress
      const duration = 1500; // 1.5 seconds transformation
      const startTime = Date.now();
      
      const animateTransform = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setBumblebeeTransformProgress(progress);
        
        if (progress >= 0.5 && !bumblebeeTransformed) {
          setBumblebeeTransformed(true);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateTransform);
        }
      };
      
      requestAnimationFrame(animateTransform);
    }, 2000);
    
    return () => clearTimeout(transformTimer);
  }, [isUserActive, isHidden, bumblebeeTransformed]);
  
  // Transformation animation for Optimus Prime
  useEffect(() => {
    if (isUserActive || isHidden || !showBird) return;
    
    // Start as truck, transform after 2 seconds of appearing
    const transformTimer = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();
      
      const animateTransform = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setOptimusTransformProgress(progress);
        
        if (progress >= 0.5 && !optimusTransformed) {
          setOptimusTransformed(true);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateTransform);
        }
      };
      
      requestAnimationFrame(animateTransform);
    }, 2000);
    
    return () => clearTimeout(transformTimer);
  }, [showBird, isUserActive, isHidden, optimusTransformed]);

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

  // Speaker gestures - only calm gestures (no playing/dancing)
  const speakerGestures: GestureType[] = ["wave", "point", "thumbsUp", "nod", "idle"];
  const getRandomSpeakerGesture = useCallback(() => {
    return speakerGestures[Math.floor(Math.random() * speakerGestures.length)];
  }, []);

  // Alternate speakers and change tips with varied gestures
  useEffect(() => {
    if (isUserActive) return;

    const interval = setInterval(() => {
      setShowTip(false);
      
      setTimeout(() => {
        // Handle intro sequence
        if (isFirstMessage) {
          // Increment intro step
          const nextStep = introStep + 1;
          
          if (currentSpeaker === "bumblebee") {
            // Bumblebee finished current step
            if (nextStep >= bumblebeeIntroSequence.length) {
              // Bumblebee done, switch to Bird
              setCurrentSpeaker("bird");
              setIntroStep(0);
              setBumblebeeGesture("listen");
              setBirdGesture("wave");
            } else {
              // Continue Bumblebee intro
              setIntroStep(nextStep);
              setBumblebeeGesture(getRandomSpeakerGesture());
            }
          } else {
            // Bird finished current step
            if (nextStep >= optimusIntroSequence.length) {
              // Both done with intro, start teaching
              setIsFirstMessage(false);
              setIntroStep(0);
              setCurrentSpeaker("bumblebee");
              setBumblebeeGesture(getRandomSpeakerGesture());
              setBirdGesture("listen");
            } else {
              // Continue Bird intro
              setIntroStep(nextStep);
              setBirdGesture(getRandomSpeakerGesture());
            }
          }
        } else {
          // Normal teaching mode - alternate speakers
          const nextSpeaker = currentSpeaker === "bumblebee" ? "bird" : "bumblebee";
          setCurrentSpeaker(nextSpeaker);
          
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
          setCurrentTipIndex(prev => (prev + 1) % shuffledKnowledge.length);
        }
        
        setShowTip(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [isUserActive, currentSpeaker, shuffledKnowledge.length, getRandomSpeakerGesture, isFirstMessage, introStep]);

  // Fixed landing positions - robots sit in center area for better visibility
  const landingSpots = useMemo(() => ({
    bumblebee: [
      { x: 25, y: 55, name: "left-center" },   // Left center - safe for speech
      { x: 20, y: 45, name: "left-middle" },   // Left middle
      { x: 28, y: 65, name: "left-lower" },    // Left lower center
    ],
    bird: [
      { x: 75, y: 55, name: "right-center" },  // Right center - safe for speech
      { x: 80, y: 45, name: "right-middle" },  // Right middle
      { x: 72, y: 65, name: "right-lower" },   // Right lower center
    ]
  }), []);

  // Get landing position for robot
  const getLandingPosition = useCallback((robotType: 'bumblebee' | 'bird') => {
    const spots = landingSpots[robotType];
    const spot = spots[Math.floor(Math.random() * spots.length)];
    return { x: spot.x, y: spot.y };
  }, [landingSpots]);

  // Robots fly to landing spots and stay there longer
  useEffect(() => {
    if (isUserActive || isHidden) return;

    // Set initial landing positions
    setBumblebeeTarget(getLandingPosition('bumblebee'));
    if (showBird) {
      setBirdTarget(getLandingPosition('bird'));
    }

    // Change position less frequently (every 20 seconds)
    const flyInterval = setInterval(() => {
      setBumblebeeTarget(getLandingPosition('bumblebee'));
      if (showBird) {
        setBirdTarget(getLandingPosition('bird'));
      }
    }, 20000);

    return () => clearInterval(flyInterval);
  }, [showBird, isUserActive, isHidden, getLandingPosition]);

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

  // Handle click - fly to new landing spot
  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      if (clickCount === 0) {
        setBumblebeeTarget(getLandingPosition('bumblebee'));
        if (showBird) {
          setBirdTarget(getLandingPosition('bird'));
        }
      }
      setClickCount(0);
    }, 300);

    if (clickCount === 1) {
      clearTimeout(clickTimerRef.current!);
      setIsHidden(true);
      setClickCount(0);
    }
  }, [clickCount, showBird, getLandingPosition]);

  if (isHidden) return null;

  // Conversational messages when camera is on - NO chemistry, just interaction
  const conversationMessages = useMemo(() => [
    // Greetings and observations
    "Voy! Sizni ko'rdim! Salom do'stim!",
    "O'h, bugun juda chiroyli ko'rinyapsiz!",
    "Salom! Kayfiyatingiz qanday?",
    "Sizni ko'rib xursandman!",
    "Bugun qanday o'tyapti kuningiz?",
    
    // Questions
    "Sevimli rangingiz qanday?",
    "Bugun nima qildingiz?",
    "Eng yaxshi ko'rgan ovqatingiz nima?",
    "Qaysi sport turini yoqtirasiz?",
    "Musiqa eshitishni yoqtirasizmi?",
    "Kitob o'qishni yaxshi ko'rasizmi?",
    "Orzuingiz nima?",
    "Eng yaxshi do'stingiz kim?",
    "Qaysi mamlakat borishni xohlaysiz?",
    
    // Fun interactions
    "Kulgingizni ko'rsating!",
    "Menga qo'l silkiting!",
    "Tabassumingiz juda chiroyli!",
    "Siz judayam zo'rsiz!",
    "Sizga omad tilayman!",
    "Siz menga yoqasiz!",
    
    // Mood boosters
    "Siz eng zo'ri ekansiz!",
    "Bugun sizning kuningiz bo'ladi!",
    "Siz hamma narsaga qodirsiz!",
    "O'zingizga ishoning!",
    "Siz ajoyib odamsiz!",
    "Tabassumingiz kunimni yoritdi!",
    
    // Playful
    "Hoy! Men bu yerdaman!",
    "Meni ko'ryapsizmi?",
    "Kelaqoling, suhbatlashamiz!",
    "Sizni kutayotgan edim!",
    "Birga o'yin o'ynaymizmi?",
    "Qani, besh bering!",
    
    // Encouragement
    "Siz bugun ajoyib ko'rinyapsiz!",
    "Energiyangiz juda zo'r!",
    "Sizdan ilhom olyapman!",
    "Sizga uchrashdim - baxtliman!",
    "Davom eting, zo'rsiz!",
  ], []);

  // Shuffled conversation messages
  const [shuffledConversation, setShuffledConversation] = useState<string[]>([]);
  const [conversationIndex, setConversationIndex] = useState(0);

  // Shuffle conversation messages when camera becomes visible
  useEffect(() => {
    if (isUserVisible) {
      const shuffled = [...conversationMessages].sort(() => Math.random() - 0.5);
      setShuffledConversation(shuffled);
      setConversationIndex(0);
    }
  }, [isUserVisible, conversationMessages]);

  // Get current tip - prioritize robot response if available
  const displayTip = useMemo(() => {
    // If robot is responding to user speech, show that instead
    if (robotResponse) {
      return robotResponse;
    }
    
    // Intro sequence: step 0 = tanishuv, step 1 = motivatsiya, then tips
    if (isFirstMessage) {
      if (currentSpeaker === "bumblebee") {
        // Bumblebee intro sequence
        if (introStep < bumblebeeIntroSequence.length) {
          return bumblebeeIntroSequence[introStep];
        }
      } else {
        // Bird (Optimus) intro sequence
        if (introStep < optimusIntroSequence.length) {
          return optimusIntroSequence[introStep];
        }
      }
    }
    
    // If camera enabled and user visible - ONLY show conversation messages
    if (isUserVisible && shuffledConversation.length > 0) {
      return shuffledConversation[conversationIndex % shuffledConversation.length];
    }
    if (shuffledKnowledge.length === 0) return knowledgeBase[0];
    return shuffledKnowledge[currentTipIndex % shuffledKnowledge.length];
  }, [isFirstMessage, currentSpeaker, introStep, isUserVisible, shuffledConversation, conversationIndex, shuffledKnowledge, currentTipIndex, robotResponse]);

  // Update conversation index when speaker changes (for camera mode)
  useEffect(() => {
    if (isUserVisible && !isFirstMessage) {
      setConversationIndex(prev => prev + 1);
    }
  }, [currentSpeaker, isUserVisible, isFirstMessage]);

  // Show listening indicator
  const showListeningIndicator = isListening && isUserVisible;

  return (
    <AnimatePresence>
      {!isUserActive && (
        <>
          {/* Bumblebee */}
          <motion.div
            className="fixed z-30 select-none w-[140px] h-[160px] sm:w-[180px] sm:h-[210px] md:w-[220px] md:h-[260px] cursor-pointer"
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
                <SpeechBubble text={displayTip} isRight={bumblebeePos.x > 50} />
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
                <TransformingBumblebee 
                  gesture={bumblebeeGesture} 
                  isTalking={showTip && currentSpeaker === "bumblebee"} 
                  isTransformed={bumblebeeTransformed}
                  transformProgress={bumblebeeTransformProgress}
                />
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
                className="fixed z-30 select-none w-[140px] h-[160px] sm:w-[180px] sm:h-[210px] md:w-[220px] md:h-[260px] cursor-pointer"
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
                    <SpeechBubble text={displayTip} isRight={birdPos.x > 50} />
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
                    <TransformingOptimus 
                      gesture={birdGesture} 
                      isTalking={showTip && currentSpeaker === "bird"} 
                      isTransformed={optimusTransformed}
                      transformProgress={optimusTransformProgress}
                    />
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
