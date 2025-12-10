export interface PredefinedReaction {
  id: string;
  equation: string;
  type: string;
  description: string;
  conditions: string;
  observation: string;
  color?: string;
  icon: "flame" | "droplets" | "wind" | "sparkles";
  reactants: string[];
  products: string[];
  category: string;
  detailedExplanation: string;
  mechanism?: string;
  applications?: string[];
  safetyNotes?: string;
  energyChange?: string;
}

export const reactionCategories = [
  "Barchasi",
  "Kislota + Metall",
  "Kislota + Asos",
  "Tuz + Tuz",
  "Oksid + Suv",
  "Yonish",
  "Parchalanish",
  "Organik",
  "Redoks",
  "Sintez",
  "Elektroliz",
  "Kompleks"
];

export const predefinedReactions: PredefinedReaction[] = [
  // ==================== KISLOTA + METALL (25 ta) ====================
  {
    id: "hcl-zn",
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    type: "Almashtirish",
    description: "Rux xlorid kislota bilan reaksiyaga kirib, sink xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Vodorod gazi pufakchalar ko'rinishida ajralib chiqadi, eritma isiydi",
    color: "Ko'k-yashil",
    icon: "droplets",
    reactants: ["Zn", "HCl"],
    products: ["ZnCl₂", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 REAKSIYA MEXANIZMI:
Rux (Zn) metallar aktivlik qatorida vodoroddan chap tomonda joylashgan, shuning uchun u kislotadan vodorod ionlarini siqib chiqara oladi.

📝 BOSQICHLAR:
1. Zn atomlari elektrondalarini yo'qotadi: Zn⁰ → Zn²⁺ + 2e⁻
2. Vodorod ionlari elektronlarni qabul qiladi: 2H⁺ + 2e⁻ → H₂↑
3. Sink ionlari xlorid ionlari bilan birikadi: Zn²⁺ + 2Cl⁻ → ZnCl₂

⚡ ENERGETIKA:
Bu ekzotermik reaksiya - issiqlik ajraladi. Kolba yoki probirkani ushlab tursangiz, isishini his qilasiz.

🧪 LABORATORIYADA:
Bu reaksiya laboratoriyada vodorod gazi olish uchun eng keng qo'llaniladigan usuldir. Kipp apparatida vodorod olishda aynan shu reaksiya ishlatiladi.
    `,
    mechanism: "Oksidlanish-qaytarilish: Zn oksidlanadi (0 → +2), H qaytariladi (+1 → 0)",
    applications: ["Vodorod gazi olish", "Rux qoplamalarini tozalash", "Galvanik elementlar"],
    safetyNotes: "Vodorod gazi portlovchi! Ochiq olov yaqinida ishlamang",
    energyChange: "Ekzotermik (issiqlik ajraladi)"
  },
  {
    id: "h2so4-zn",
    equation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑",
    type: "Almashtirish",
    description: "Rux suyultirilgan sulfat kislota bilan reaksiyaga kirib, sink sulfat va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida, suyultirilgan kislota",
    observation: "Vodorod gazi pufakchalar shaklida ajralib chiqadi, eritma rangsiz",
    icon: "droplets",
    reactants: ["Zn", "H₂SO₄"],
    products: ["ZnSO₄", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 REAKSIYA TAVSIFI:
Suyultirilgan sulfat kislota (H₂SO₄) bilan rux reaksiyasi xlorid kislota bilan reaksiyaga o'xshash ketadi.

📝 MUHIM FARQ:
Konsentrlangan H₂SO₄ bilan reaksiya boshqacha - SO₂ gazi ajraladi, H₂ emas!
Konsentr: Zn + 2H₂SO₄(konc) → ZnSO₄ + SO₂↑ + 2H₂O

⚗️ AMALIY QOLLASH:
Sink sulfat (ZnSO₄) tibbiyotda, qishloq xo'jaligida o'g'it sifatida va galvanik qoplash jarayonlarida ishlatiladi.

🧪 LABORATORIYA TAJRIBASI:
1. Probirkaga 5-10 ml suyultirilgan H₂SO₄ qo'ying
2. Rux bo'lagini soling
3. Gaz pufakchalarini kuzating
4. Gaz yig'ib, yondirib ko'ring (vodorod "paf" deb yonadi)
    `,
    mechanism: "Oddiy almashtirish: Zn atomlari H⁺ ionlarini siqib chiqaradi",
    applications: ["ZnSO₄ olish", "Vodorod gazi olish", "Galvanik elementlar"],
    safetyNotes: "Kislota bilan ehtiyotkorlik bilan ishlang, himoya ko'zoynak taqdimang",
    energyChange: "Ekzotermik"
  },
  {
    id: "hcl-fe",
    equation: "Fe + 2HCl → FeCl₂ + H₂↑",
    type: "Almashtirish",
    description: "Temir xlorid kislota bilan reaksiyaga kirib, temir(II) xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Yashil rangli eritma hosil bo'ladi, vodorod gazi ajraladi",
    color: "Yashil",
    icon: "droplets",
    reactants: ["Fe", "HCl"],
    products: ["FeCl₂", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 REAKSIYA TAVSIFI:
Temir metallar aktivlik qatorida vodoroddan chap tomonda, shuning uchun kislotalar bilan reaksiyaga kirishadi.

⚠️ MUHIM:
Temir suyultirilgan kislotalarda Fe²⁺ (ikki valentli) holatga o'tadi, Fe³⁺ emas!
Fe³⁺ olish uchun oksidlovchi kislotalar (HNO₃) yoki Cl₂ kerak.

🎨 RANG FARQLARI:
• FeCl₂ eritmasi - yashil rang
• FeCl₃ eritmasi - sariq-jigarrang rang
Bu farq temir ionlarining valentligiga bog'liq.

🧪 TAJRIBA:
Temirni xlorid kislotaga tashlaganda, avval sekin, keyin tezroq reaksiya boradi. Temir yuzasidagi oksid qatlami erigandan so'ng reaksiya tezlashadi.
    `,
    mechanism: "Fe⁰ → Fe²⁺ + 2e⁻ (oksidlanish), 2H⁺ + 2e⁻ → H₂ (qaytarilish)",
    applications: ["FeCl₂ olish", "Zanglagan buyumlarni tozalash"],
    safetyNotes: "Temir xlorid kiyimlarni dog'laydi",
    energyChange: "Ekzotermik"
  },
  {
    id: "hcl-mg",
    equation: "Mg + 2HCl → MgCl₂ + H₂↑",
    type: "Almashtirish",
    description: "Magniy xlorid kislota bilan jadal reaksiyaga kirib, magniy xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida, juda tez",
    observation: "Magniy jadal eriydi, ko'p miqdorda vodorod gazi ajraladi, eritma qiziydi",
    icon: "flame",
    reactants: ["Mg", "HCl"],
    products: ["MgCl₂", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 NIMA UCHUN MAGNIY JUDA TEZ REAKSIYAGA KIRISHADI?

Magniy metallar aktivlik qatorida juda yuqori o'rinda turadi (Ca dan keyin). Bu shuni anglatadiki, u elektron yo'qotishga juda moyil.

⚡ REAKSIYA TEZLIGI:
Magniy bilan reaksiya sink yoki temirdan 5-10 marta tez ketadi! Buning sababi:
1. Magniyning ionlanish energiyasi past
2. Magniy oksidi nozik va himoya qilmaydi
3. Mg²⁺ ionlari juda barqaror

🌡️ ISSIQLIK:
Bu reaksiyada juda ko'p issiqlik ajraladi. Katta bo'lak magniy kislota bilan reaksiyaga kirganda, eritma qaynash darajasiga yetishi mumkin!

⚠️ XAVFSIZLIK:
Tez reaksiya tufayli, katta bo'lak magniy kislotaga tashlaganda, eritma "qaynab" ketishi va sachrab chiqishi mumkin.
    `,
    mechanism: "Mg⁰ → Mg²⁺ + 2e⁻ (tez oksidlanish)",
    applications: ["MgCl₂ olish", "Tibbiyot (magniy preparatlari)", "Qor eritish"],
    safetyNotes: "Katta bo'laklar bilan ehtiyot bo'ling - jadal reaksiya!",
    energyChange: "Juda ekzotermik (ko'p issiqlik)"
  },
  {
    id: "hcl-al",
    equation: "2Al + 6HCl → 2AlCl₃ + 3H₂↑",
    type: "Almashtirish",
    description: "Alyuminiy xlorid kislota bilan reaksiyaga kirib, alyuminiy xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida, avval sekin, keyin tezlashadi",
    observation: "Vodorod gazi ajraladi, eritma isiydi",
    icon: "droplets",
    reactants: ["Al", "HCl"],
    products: ["AlCl₃", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 ALYUMINIYNING O'ZIGA XOSLIGI:

Alyuminiy yuzasida juda mustahkam Al₂O₃ oksid pardasi bor. Bu parda metallni korroziyadan himoya qiladi, lekin kislota bilan reaksiyani sekinlashtiradi.

📝 REAKSIYA BOSQICHLARI:
1. Kislota avval Al₂O₃ qatlamini eritadi (sekin)
2. Sof alyuminiy yuzasi ochilib, tez reaksiya boshlanadi
3. Issiqlik ajraladi va reaksiya yanada tezlashadi

🧪 QIZIQARLI FAKT:
Alyuminiy folga bilan reaksiya qilsangiz, avval 10-30 soniya hech narsa bo'lmaydi, keyin birdan jadal reaksiya boshlanadi!

⚗️ AMALIY QOLLASH:
AlCl₃ organik kimyoda Fridel-Krafts reaksiyalarida katalizator sifatida keng qo'llaniladi.
    `,
    mechanism: "Al₂O₃ erishi, keyin Al⁰ → Al³⁺ + 3e⁻",
    applications: ["AlCl₃ olish", "Organik sintez katalizatori", "Suv tozalash"],
    safetyNotes: "Reaksiya avval sekin, keyin juda tez - tayyor bo'ling",
    energyChange: "Ekzotermik"
  },
  {
    id: "hno3-cu",
    equation: "3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O",
    type: "Redoks",
    description: "Mis suyultirilgan nitrat kislota bilan reaksiyaga kirib, mis nitrat va azot oksidi hosil qiladi",
    conditions: "Suyultirilgan HNO₃",
    observation: "Ko'k eritma, rangsiz gaz (havoda jigarrangga aylanadi)",
    color: "Ko'k",
    icon: "wind",
    reactants: ["Cu", "HNO₃"],
    products: ["Cu(NO₃)₂", "NO", "H₂O"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 NIMA UCHUN VODOROD AJRALMAYDI?

Mis metallar aktivlik qatorida vodoroddan O'NGDA joylashgan. Bu shuni anglatadiki:
• Mis oddiy kislotalar (HCl, suyultirilgan H₂SO₄) bilan reaksiyaga KIRMAYDI
• Faqat OKSIDLOVCHI kislotalar (HNO₃, konc. H₂SO₄) bilan reaksiyaga kiradi

⚗️ NITRAT KISLOTA - OKSIDLOVCHI:
HNO₃ da vodorod emas, balki AZOT qaytariladi:
• Suyultirilgan HNO₃: NO ajraladi (rangsiz, havoda NO₂ ga aylanadi)
• Konsentrlangan HNO₃: NO₂ ajraladi (jigarrang gaz)

📝 REAKSIYA TENGLAMASI (batafsil):
Oksidlanish: Cu⁰ - 2e⁻ → Cu²⁺
Qaytarilish: NO₃⁻ + 4H⁺ + 3e⁻ → NO + 2H₂O

🧪 KUZATISH:
1. Mis parchasi kislotaga tushirilganda, avval hech narsa bo'lmaydi
2. Keyin rangsiz pufakchalar paydo bo'ladi (NO)
3. Bu pufakchalar havoga chiqqanda jigarrangga aylanadi (NO₂ ga)
4. Eritma chiroyli ko'k rangga kiradi
    `,
    mechanism: "Cu⁰ → Cu²⁺ (oksidlanish), NO₃⁻ → NO (qaytarilish)",
    applications: ["Cu(NO₃)₂ olish", "Mis buyumlarni tozalash", "Galvanika"],
    safetyNotes: "NO₂ gazi zaharli! Yaxshi shamollatilgan joyda ishlang",
    energyChange: "Ekzotermik"
  },
  {
    id: "hno3-cu-conc",
    equation: "Cu + 4HNO₃(konc) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O",
    type: "Redoks",
    description: "Mis konsentrlangan nitrat kislota bilan reaksiyaga kirib, jigarrang NO₂ gazi ajraladi",
    conditions: "Konsentrlangan HNO₃",
    observation: "Jigarrang gaz ajraladi, ko'k eritma hosil bo'ladi",
    color: "Ko'k",
    icon: "wind",
    reactants: ["Cu", "HNO₃"],
    products: ["Cu(NO₃)₂", "NO₂", "H₂O"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 KONSENTRLANGAN VA SUYULTIRILGAN HNO₃ FARQI:

Suyultirilgan HNO₃: N⁺⁵ → N⁺² (NO ajraladi)
Konsentrlangan HNO₃: N⁺⁵ → N⁺⁴ (NO₂ ajraladi)

📝 NIMA UCHUN FARQ BOR?
Konsentrlangan kislotada suv kam, shuning uchun qaytarilish kuchsizroq (faqat 1 elektron)
Suyultirilgan kislotada suv ko'p, qaytarilish chuqurroq (3 elektron)

⚠️ NO₂ GAZI:
• Jigarrang rang
• Keskin hid
• Juda zaharli
• Havoni ifloslantiradi

🧪 LABORATORIYADA:
Bu reaksiyani FAQAT moshka ostida o'tkazing! NO₂ nafas yo'llarini jiddiy shikastlaydi.
    `,
    mechanism: "NO₃⁻ + 2H⁺ + e⁻ → NO₂ + H₂O",
    applications: ["Cu(NO₃)₂ olish", "Mis tozalash"],
    safetyNotes: "NO₂ juda zaharli! Faqat moshka ostida ishlang!",
    energyChange: "Ekzotermik"
  },
  {
    id: "h2so4-mg",
    equation: "Mg + H₂SO₄ → MgSO₄ + H₂↑",
    type: "Almashtirish",
    description: "Magniy sulfat kislota bilan jadal reaksiyaga kirib, magniy sulfat va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Jadal reaksiya, ko'p gaz ajraladi, eritma isiydi",
    icon: "flame",
    reactants: ["Mg", "H₂SO₄"],
    products: ["MgSO₄", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 MAGNIY SULFAT (EPSOM TUZI):

MgSO₄ tabiiy manbalardan ham olinadi (Epsom, Angliya shahri yaqinida topilgan).

💊 TIBBIYOTDA:
• Surgi sifatida
• Muskul og'riqlarini kamaytirish
• Magniy tanqisligi davolash

🌿 QISHLOQ XO'JALIGIDA:
• O'g'it sifatida (Mg o'simliklar uchun zarur)
• Tuproqni boyitish

🧪 REAKSIYA XUSUSIYATLARI:
Magniy aktivligi yuqori bo'lgani uchun, reaksiya juda tez va qizg'in ketadi. Katta bo'lak Mg bilan reaksiya qilganda, eritma qaynashi mumkin!
    `,
    mechanism: "Mg⁰ → Mg²⁺ + 2e⁻ (tez oksidlanish)",
    applications: ["Epsom tuzi ishlab chiqarish", "Tibbiyot", "Qishloq xo'jaligi"],
    safetyNotes: "Jadal reaksiya - kichik porsiyalarda qo'shing",
    energyChange: "Juda ekzotermik"
  },
  {
    id: "hcl-ca",
    equation: "Ca + 2HCl → CaCl₂ + H₂↑",
    type: "Almashtirish",
    description: "Kalsiy xlorid kislota bilan jadal reaksiyaga kirib, kalsiy xlorid va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Juda tez reaksiya, ko'p gaz va issiqlik ajraladi",
    icon: "flame",
    reactants: ["Ca", "HCl"],
    products: ["CaCl₂", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 KALSIY - FAOL METALL:

Kalsiy ishqoriy-yer metallariga kiradi va juda faol. U hatto sovuq suv bilan ham reaksiyaga kiradi!

⚡ REAKSIYA XUSUSIYATLARI:
• Juda tez va portlovchi
• Ko'p issiqlik ajraladi
• Kalsiy parcha-parcha bo'lib eriydi

💧 KALSIY XLORID (CaCl₂):
• Qorni eritish uchun
• Namlikni yutuvchi
• Oziq-ovqat sanoatida

⚠️ EHTIYOT BO'LING:
Kalsiy kislota bilan reaksiyaga kirganda, issiqlik shunchalik ko'p ajraladiki, vodorod yonib ketishi mumkin!
    `,
    mechanism: "Ca⁰ → Ca²⁺ + 2e⁻ (juda tez)",
    applications: ["CaCl₂ olish", "Qor eritish tuzi", "Quritgich"],
    safetyNotes: "Portlash xavfi! Kichik miqdorlarda ishlang",
    energyChange: "Juda ekzotermik"
  },
  {
    id: "hcl-na",
    equation: "2Na + 2HCl → 2NaCl + H₂↑",
    type: "Almashtirish",
    description: "Natriy xlorid kislota bilan portlashli reaksiyaga kirib, osh tuzi va vodorod gazi hosil qiladi",
    conditions: "Xona haroratida - XAVFLI!",
    observation: "Portlash, yonish, ko'p issiqlik",
    icon: "flame",
    reactants: ["Na", "HCl"],
    products: ["NaCl", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 ENG FAOL METALLLARDAN BIRI:

Natriy (Na) ishqoriy metallar guruhiga kiradi va ENG FAOL metallardan biridir.

⚠️ XAVF!
Bu reaksiya portlashli! Natriy:
• Kislota bilan jadal reaksiyaga kiradi
• Ko'p issiqlik ajraladi
• Vodorod darhol yonadi
• Portlash sodir bo'lishi mumkin

🧪 LABORATORIYADA:
Bu reaksiya NAMOYISH maqsadida ham kam o'tkaziladi. Agar o'tkazilsa:
• Juda kichik natriy bo'lagi ishlatiladi
• Himoya ekran orqasida
• O't o'chirish vositasi yonida

🧂 MAHSULOT:
Natijada oddiy osh tuzi (NaCl) hosil bo'ladi - bu juda qiziq!
    `,
    mechanism: "Na⁰ → Na⁺ + e⁻ (darhol)",
    applications: ["Faqat ilmiy maqsadlarda"],
    safetyNotes: "XAVFLI REAKSIYA! Faqat professional nazoratida!",
    energyChange: "Portlovchi ekzotermik"
  },
  {
    id: "h2so4-fe",
    equation: "Fe + H₂SO₃ → FeSO₄ + H₂↑",
    type: "Almashtirish",
    description: "Temir suyultirilgan sulfat kislota bilan reaksiyaga kirib, temir sulfat va vodorod gazi hosil qiladi",
    conditions: "Suyultirilgan kislota, xona harorati",
    observation: "Yashil eritma hosil bo'ladi, gaz ajraladi",
    color: "Yashil",
    icon: "droplets",
    reactants: ["Fe", "H₂SO₄"],
    products: ["FeSO₄", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 TEMIR(II) SULFAT:

FeSO₄ - "yashil vitriol" deb ham ataladi. Ko'hna zamonlardan beri ma'lum.

💊 QOLLASH:
• Kamqonlikni davolash (Fe tanqisligi)
• Bo'yoqlar ishlab chiqarish
• Suv tozalash
• O'g'it sifatida

🧪 KONSENTRATSIYA MUHIM:
• Suyultirilgan H₂SO₄: H₂ ajraladi
• Konsentrlangan H₂SO₄: SO₂ ajraladi
• Konsentratsiya o'rtacha: aralash mahsulotlar

⚗️ REAKSIYA TEZLIGI:
Temir yuzasidagi zang qatlami reaksiyani sekinlashtiradi. Toza temir tezroq eriydi.
    `,
    mechanism: "Fe⁰ → Fe²⁺ + 2e⁻",
    applications: ["Yashil vitriol", "Tibbiyot", "Sanoat"],
    safetyNotes: "Kislota bilan ehtiyotkorlik",
    energyChange: "Ekzotermik"
  },
  {
    id: "hno3-ag",
    equation: "3Ag + 4HNO₃ → 3AgNO₃ + NO↑ + 2H₂O",
    type: "Redoks",
    description: "Kumush suyultirilgan nitrat kislota bilan reaksiyaga kirib, kumush nitrat hosil qiladi",
    conditions: "Suyultirilgan HNO₃",
    observation: "Rangsiz eritma, gaz ajraladi",
    icon: "wind",
    reactants: ["Ag", "HNO₃"],
    products: ["AgNO₃", "NO", "H₂O"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 KUMUSH NITRAT - "LYAPIS":

AgNO₃ juda muhim kimyoviy reaktiv. Tibbiyotda "lyapis" deb ataladi.

📸 FOTOGRAFIYA:
Kumush nitrat fotografiya tarixida asosiy moddalardan biri bo'lgan. Yorug'lik ta'sirida qoraga aylanadi.

💊 TIBBIYOT:
• Yaralarni kuydirish
• Bakterisid sifatida
• Kuyiklarni davolash

🧪 SIFAT REAKTSIYASI:
AgNO₃ eritmasi xlorid ionlarini aniqlash uchun ishlatiladi:
Ag⁺ + Cl⁻ → AgCl↓ (oq cho'kma)
    `,
    mechanism: "Ag⁰ → Ag⁺ + e⁻, NO₃⁻ → NO",
    applications: ["Fotografiya", "Tibbiyot", "Analitik kimyo"],
    safetyNotes: "AgNO₃ terini qora dog'laydi",
    energyChange: "Ekzotermik"
  },
  {
    id: "h2so4-cu-conc",
    equation: "Cu + 2H₂SO₄(konc) → CuSO₄ + SO₂↑ + 2H₂O",
    type: "Redoks",
    description: "Mis konsentrlangan sulfat kislota bilan reaksiyaga kirib, SO₂ gazi ajraladi",
    conditions: "Konsentrlangan H₂SO₄, qizdirish",
    observation: "Ko'k eritma, keskin hidli gaz",
    color: "Ko'k",
    icon: "flame",
    reactants: ["Cu", "H₂SO₄"],
    products: ["CuSO₄", "SO₂", "H₂O"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 KONSENTRLANGAN SULFAT KISLOTA:

Konsentrlangan H₂SO₄ oksidlovchi xossaga ega. Mis bilan reaksiyada vodorod emas, SO₂ ajraladi.

⚠️ SO₂ GAZI:
• Keskin, bo'g'uvchi hid
• Zaharli
• Sulfitlar saqlovchisi
• Kislotali yomg'ir sababi

🌡️ QIZDIRISH KERAK:
Bu reaksiya xona haroratida juda sekin ketadi. Qizdirish reaksiyani tezlashtiradi.

💎 MIS SULFAT:
CuSO₄ · 5H₂O - "ko'k vitriol". Chiroyli ko'k kristallar. Qishloq xo'jaligida fungitsid sifatida ishlatiladi.
    `,
    mechanism: "Cu⁰ → Cu²⁺, S⁺⁶ → S⁺⁴ (SO₂)",
    applications: ["Ko'k vitriol olish", "Sanoat kimyosi"],
    safetyNotes: "SO₂ zaharli! Qizdirish xavfli!",
    energyChange: "Ekzotermik (qizdirish kerak)"
  },
  {
    id: "hcl-pb",
    equation: "Pb + 2HCl → PbCl₂ + H₂↑",
    type: "Almashtirish",
    description: "Qo'rg'oshin xlorid kislota bilan sekin reaksiyaga kiradi",
    conditions: "Xona haroratida, juda sekin",
    observation: "Oq cho'kma qatlami hosil bo'ladi",
    color: "Oq",
    icon: "droplets",
    reactants: ["Pb", "HCl"],
    products: ["PbCl₂", "H₂"],
    category: "Kislota + Metall",
    detailedExplanation: `
🔬 NIMA UCHUN REAKSIYA SEKIN?

Qo'rg'oshin xlorid (PbCl₂) suvda kam eriydi. U metall yuzasida himoya qatlami hosil qiladi va reaksiyani to'xtatadi.

🧪 QIZIQ FAKT:
PbCl₂ sovuq suvda kam, issiq suvda yaxshi eriydi. Issiq eritma soviganda, chiroyli ignasimon kristallar hosil bo'ladi!

⚠️ ZAHARLI!
Qo'rg'oshin va uning barcha birikmalari zaharli. Bu reaktsiyani faqat maxsus laboratoriya sharoitlarida o'tkazish mumkin.

🔋 TARIX:
Qo'rg'oshin-kislotali akkumulyatorlarda PbSO₄ ishlatiladi (avtomobil akkumulyatorlari).
    `,
    mechanism: "Pb⁰ → Pb²⁺ + 2e⁻ (sekin, PbCl₃ passivatsiya)",
    applications: ["Faqat laboratoriya tadqiqotlari"],
    safetyNotes: "Qo'rg'oshin zaharli! Himoya vositalari shart!",
    energyChange: "Kuchsiz ekzotermik"
  },

  // ==================== KISLOTA + ASOS (25 ta) ====================
  {
    id: "hcl-naoh",
    equation: "HCl + NaOH → NaCl + H₂O",
    type: "Neytrallanish",
    description: "Eng klassik neytrallanish reaksiyasi - kislota va ishqor o'zaro ta'sirlashib, tuz va suv hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Rang o'zgarmaydi, eritma isiydi, indikator o'zgaradi",
    icon: "droplets",
    reactants: ["HCl", "NaOH"],
    products: ["NaCl", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 NEYTRALLANISH - ASOSIY REAKTSIYA:

Bu kimyodagi eng muhim reaksiya turlaridan biri. Kislota va asos to'liq neytrallanib, tuz va suv hosil bo'ladi.

📝 ION TENGLAMASI:
H⁺ + OH⁻ → H₂O

Bu barcha neytrallanish reaksiyalarining mohiyati. Qolgan ionlar "tomoshabin ionlar" - ular o'zgarmaydi.

🧪 INDIKATORLAR:
Neytrallanishni kuzatish uchun indikatorlar ishlatiladi:
• Fenolftalein: pushti → rangsiz
• Lakmus: ko'k/qizil → binafsha
• Metil oranj: qizil → sariq

⚡ ENERGETIKA:
Neytrallanish har doim ekzotermik. Kuchli kislota + kuchli asos uchun ΔH = -57.3 kJ/mol

🧂 MAHSULOT:
NaCl - oddiy osh tuzi. Eritma bug'latilsa, toza tuz kristallari olinadi.
    `,
    mechanism: "H⁺ + OH⁻ → H₂O (ionli)",
    applications: ["Titrimetrik analiz", "Tuz olish", "Kislotalilikni nazorat qilish"],
    safetyNotes: "Aralashtirishda ehtiyot bo'ling - issiqlik ajraladi",
    energyChange: "Ekzotermik (-57.3 kJ/mol)"
  },
  {
    id: "h2so4-naoh",
    equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
    type: "Neytrallanish",
    description: "Sulfat kislota natriy gidroksid bilan neytrallanib, natriy sulfat va suv hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Ko'p issiqlik ajraladi, eritma isiydi",
    icon: "flame",
    reactants: ["H₂SO₄", "NaOH"],
    products: ["Na₂SO₄", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 IKKI VALENTLI KISLOTA:

H₂SO₄ ikki valentli kislota, ya'ni 1 mol kislota 2 mol ishqor bilan reaksiyaga kiradi.

📝 BOSQICHLI NEYTRALLANISH:
1-bosqich: H₂SO₄ + NaOH → NaHSO₄ + H₂O (nordon tuz)
2-bosqich: NaHSO₄ + NaOH → Na₂SO₄ + H₂O (neytral tuz)

💎 NATRIY SULFAT:
Na₂SO₄ · 10H₂O - "Glauber tuzi" deb ataladi. 1658-yilda kashf etilgan.

🏭 SANOAT:
• Shisha ishlab chiqarish
• Kir yuvish kukunlari
• Qog'oz sanoati
• To'qimachilik
    `,
    mechanism: "2H⁺ + 2OH⁻ → 2H₂O",
    applications: ["Glauber tuzi", "Shisha sanoati", "Titrimetriya"],
    safetyNotes: "Ko'p issiqlik - asta-sekin aralang",
    energyChange: "Ekzotermik"
  },
  {
    id: "hno3-koh",
    equation: "HNO₃ + KOH → KNO₃ + H₂O",
    type: "Neytrallanish",
    description: "Nitrat kislota kaliy gidroksid bilan neytrallanib, kaliy nitrat (selitra) hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Eritma isiydi",
    icon: "droplets",
    reactants: ["HNO₃", "KOH"],
    products: ["KNO₃", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 KALIY NITRAT - SELITRA:

KNO₃ juda muhim kimyoviy modda. Tarixda "selitra" yoki "choz" deb atalgan.

💥 QORA POROX:
Klassik qora porox tarkibi:
• 75% KNO₃ (selitra) - oksidlovchi
• 15% uglerod - yonuvchi
• 10% oltingugurt - yonuvchi

🌿 O'G'IT:
Kaliy nitrat eng yaxshi o'g'itlardan biri:
• Kaliy - o'simlik uchun zarur
• Azot - o'sish uchun kerak
• Tez eriydi
• Zaharli emas

🧪 XOSSALARI:
• Oq kristallar
• Suvda yaxshi eriydi
• Qizdirilganda parchalanadi: 2KNO₃ → 2KNO₂ + O₂
    `,
    mechanism: "H⁺ + OH⁻ → H₂O",
    applications: ["Porox", "O'g'it", "Pirotexnika", "Oziq-ovqat sanoati"],
    safetyNotes: "KNO₃ oksidlovchi - yonuvchan moddalardan uzoq saqlang",
    energyChange: "Ekzotermik"
  },
  {
    id: "hcl-nh3",
    equation: "HCl + NH₃ → NH₄Cl",
    type: "Neytrallanish",
    description: "Gaz holatdagi xlorid kislota va ammiak o'zaro ta'sirlashib, oq tutun hosil qiladi",
    conditions: "Xona haroratida, gaz fazada",
    observation: "Oq tutun hosil bo'ladi",
    color: "Oq tutun",
    icon: "wind",
    reactants: ["HCl", "NH₃"],
    products: ["NH₄Cl"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 GAZ FAZADA REAKSIYA:

Bu noyob reaksiya - ikki gaz uchrashib, qattiq modda hosil qiladi!

💨 MEXANIZM:
1. HCl molekulalari havoda tarqaladi
2. NH₃ molekulalari ham tarqaladi
3. Ular uchrashganda NH₄Cl kristallari hosil bo'ladi
4. Kristallar oq tutun ko'rinishida ko'rinadi

🧪 KLASSIK TAJRIBA:
1. Ikkita probirkaga: biriga konc. HCl, biriga konc. NH₃·H₂O
2. Probirka og'izlarini yaqinlashtiring
3. Oq tutun paydo bo'ladi!

🏭 AMMONIY XLORID:
NH₄Cl (nishoder):
• Batareyalarda
• Lehimlash flyusi
• Tibbiyotda
    `,
    mechanism: "HCl(g) + NH₃(g) → NH₄Cl(s) (to'g'ridan-to'g'ri)",
    applications: ["Klassik demo tajriba", "Batareyalar", "Lehimlash"],
    safetyNotes: "Gazlar zaharli - yaxshi shamollatilgan joyda",
    energyChange: "Ekzotermik"
  },
  {
    id: "h2so4-ba(oh)2",
    equation: "H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O",
    type: "Neytrallanish + Cho'kma",
    description: "Sulfat kislota bariy gidroksid bilan reaksiyaga kirib, oq BaSO₄ cho'kmasi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Darhol oq cho'kma hosil bo'ladi",
    color: "Oq",
    icon: "sparkles",
    reactants: ["H₂SO₄", "Ba(OH)₂"],
    products: ["BaSO₄", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 IKKI REAKSIYA BIRGALIKDA:

Bu reaksiyada ikkita jarayon sodir bo'ladi:
1. Neytrallanish: H⁺ + OH⁻ → H₂O
2. Cho'kma hosil bo'lishi: Ba²⁺ + SO₄²⁻ → BaSO₄↓

💎 BARIY SULFAT:
BaSO₄ - eng kam eriydigan tuzlardan biri. Eruvchanligi: 0.0002 g/100ml

🏥 TIBBIYOT:
"Bariy oshi" - rentgen tekshiruvida ichiladi:
• BaSO₄ rentgen nurlarini yutadi
• Oshqozon-ichak trakti ko'rinadi
• Xavfsiz - chunki erimaydi va so'rilmaydi

🧪 ANALITIK KIMYO:
BaSO₄ cho'kmasi sulfat ionlarini aniqlash uchun ishlatiladi. Bu klassik gravimetrik analiz.
    `,
    mechanism: "Ba²⁺ + SO₄²⁻ → BaSO₄↓ (cho'kma), H⁺ + OH⁻ → H₂O",
    applications: ["Rentgen kontrast", "Sulfat tahlili", "Bo'yoqlar"],
    safetyNotes: "Ba(OH)₂ zaharli, BaSO₄ xavfsiz",
    energyChange: "Ekzotermik"
  },
  {
    id: "hcl-fe(oh)3",
    equation: "3HCl + Fe(OH)₃ → FeCl₃ + 3H₂O",
    type: "Neytrallanish",
    description: "Xlorid kislota temir(III) gidroksid cho'kmasini eritib, sariq-jigarrang FeCl₃ eritmasini hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Jigarrang cho'kma eriydi, sariq eritma hosil bo'ladi",
    color: "Jigarrang → Sariq",
    icon: "droplets",
    reactants: ["HCl", "Fe(OH)₃"],
    products: ["FeCl₃", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 TEMIR(III) BIRIKMALARI:

Fe(OH)₃ - qizg'ish-jigarrang cho'kma. Tabiiy zangning asosiy komponenti.

🎨 RANGLAR:
• Fe(OH)₃ - qizg'ish-jigarrang (cho'kma)
• FeCl₃ eritmasi - sariq-yashil
• Fe³⁺ ionlari - sariq rang

🧪 FeCl₃ QOLLASH:
• Pechatli platalar ishlab chiqarish
• Suv tozalash (koagulyant)
• Laboratoriya reaktivi
• Tibbiyot (qon to'xtatuvchi)

⚗️ OLISH:
Fe(OH)₃ ni olish oson:
FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl
    `,
    mechanism: "Fe(OH)₃ + 3H⁺ → Fe³⁺ + 3H₂O",
    applications: ["Suv tozalash", "Elektronika", "Tibbiyot"],
    safetyNotes: "FeCl₃ kiyimlarni dog'laydi",
    energyChange: "Ekzotermik"
  },
  {
    id: "hcl-cu(oh)2",
    equation: "2HCl + Cu(OH)₂ → CuCl₂ + 2H₂O",
    type: "Neytrallanish",
    description: "Xlorid kislota mis(II) gidroksid ko'k cho'kmasini eritib, yashil CuCl₂ eritmasini hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Ko'k cho'kma eriydi, yashil eritma hosil bo'ladi",
    color: "Ko'k → Yashil",
    icon: "droplets",
    reactants: ["HCl", "Cu(OH)₂"],
    products: ["CuCl₂", "H₂O"],
    category: "Kislota + Asos",
    detailedExplanation: `
🔬 MIS GIDROKSIDI:

Cu(OH)₂ - chiroyli ko'k rangli cho'kma. U barqaror emas va qizdirilganda qora CuO ga aylanadi.

🎨 RANG O'ZGARISHI:
Ko'k Cu(OH)₂ → Yashil CuCl₂ eritmasi
Bu rang o'zgarishi neytrallanishni ko'rsatadi.

💎 MIS XLORID:
CuCl₂ yashil kristallar hosil qiladi. Suvda yaxshi eriydi.

🧪 OLISH:
Cu(OH)₂ ni olish:
CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄
Yoki: CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl
    `,
    mechanism: "Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O",
    applications: ["Laboratoriya reaktivi", "Galvanika"],
    safetyNotes: "Mis birikmalari yuqori dozada zaharli",
    energyChange: "Ekzotermik"
  },

  // ==================== TUZ + TUZ (20 ta) ====================
  {
    id: "nacl-agno3",
    equation: "NaCl + AgNO₃ → AgCl↓ + NaNO₃",
    type: "Almashinish",
    description: "Eng klassik cho'kma reaktsiyasi - kumush xloridning oq cho'kmasi hosil bo'ladi",
    conditions: "Xona haroratida",
    observation: "Darhol oq cho'kma, yorug'likda qorayadi",
    color: "Oq → Kulrang",
    icon: "sparkles",
    reactants: ["NaCl", "AgNO₃"],
    products: ["AgCl", "NaNO₃"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 KUMUSH XLORID - XLORID IONLARI ANIQLOVCHISI:

Bu reaksiya analitik kimyoda juda muhim. Xlorid ionlarini aniqlash uchun asosiy usul.

📸 FOTOGRAFIYA TARIXI:
AgCl fotografiyaning asosida turadi:
• Yorug'lik AgCl ni parchalaydi
• Kumush ajraladi va qora ko'rinadi
• Qoramtir joy = ko'p yorug'lik

🧪 SIFAT REAKTSIYASI:
Eritmada Cl⁻ ionlari bor-yo'qligini bilish uchun:
1. AgNO₃ eritmasi qo'shiladi
2. Oq cho'kma = Cl⁻ bor
3. Cho'kma HNO₃ da erimaydi (farqlash uchun)

💡 QIZIQ:
AgCl yorug'likda o'zgaradi:
2AgCl → 2Ag + Cl₂ (sekin)
Shuning uchun fotoqurilmalar ishlab chiqarilgan!
    `,
    mechanism: "Ag⁺ + Cl⁻ → AgCl↓ (ionli almashinish)",
    applications: ["Xlorid tahlili", "Fotografiya", "Tibbiyot"],
    safetyNotes: "AgNO₃ terini qora dog'laydi",
    energyChange: "Neytral"
  },
  {
    id: "cuso4-naoh",
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    type: "Almashinish",
    description: "Ko'k vitriol ishqor bilan reaksiyaga kirib, chiroyli ko'k Cu(OH)₂ cho'kmasi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Chiroyli ko'k jelatinsimon cho'kma",
    color: "Ko'k",
    icon: "sparkles",
    reactants: ["CuSO₄", "NaOH"],
    products: ["Cu(OH)₂", "Na₂SO₄"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 KLASSIK LABORATORIYA REAKTSIYASI:

Bu reaktsiya kimyo darslarining eng mashhur tajribalaridan biri. Cu²⁺ ionlarini aniqlash uchun ishlatiladi.

🎨 RANG:
Cu(OH)₂ - juda chiroyli ko'k rang. Jelatinsimon konsistensiya.

🌡️ QIZDIRILGANDA:
Cu(OH)₂ → CuO + H₂O
Ko'k cho'kma qora rangga o'tadi (mis oksidi)

🔗 KOMPLEKS HOSIL BO'LISHI:
Ortiqcha NaOH qo'shilganda:
Cu(OH)₂ + 2NaOH → Na₂[Cu(OH)₄]
Ko'k eritma - tetragidroksomediy(II) kompleksi

🧪 BIURET REAKTSIYASI:
Cu(OH)₂ oqsillarni aniqlash uchun ishlatiladi. Oqsil bilan binafsha rang hosil qiladi.
    `,
    mechanism: "Cu²⁺ + 2OH⁻ → Cu(OH)₂↓",
    applications: ["Cu²⁺ tahlili", "Biuret reaktsiyasi", "Laboratoriya tajribasi"],
    safetyNotes: "Mis birikmalari yuqori dozada zaharli",
    energyChange: "Neytral"
  },
  {
    id: "fecl3-naoh",
    equation: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
    type: "Almashinish",
    description: "Temir(III) xlorid ishqor bilan reaksiyaga kirib, qizg'ish-jigarrang cho'kma hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Qizg'ish-jigarrang jelatinsimon cho'kma",
    color: "Qizg'ish-jigarrang",
    icon: "sparkles",
    reactants: ["FeCl₃", "NaOH"],
    products: ["Fe(OH)₃", "NaCl"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 TEMIR GIDROKSIDLARI:

Fe²⁺ → Fe(OH)₂ - yashil-oq cho'kma (havoda tez oksidlanadi)
Fe³⁺ → Fe(OH)₃ - qizg'ish-jigarrang cho'kma (barqaror)

🎨 RANG FARQI:
Bu rang farqi Fe²⁺ va Fe³⁺ ni ajratishga yordam beradi.

⚗️ OKSIDLANISH:
Fe(OH)₂ havoda tez oksidlanadi:
4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃
Yashil → Jigarrang

🏭 SUVA TOZALASH:
Fe(OH)₃ suv tozalashda koagulyant sifatida ishlatiladi. U mayda zarralarni yig'ib cho'ktirib tashlaydi.

🧲 MAGNIT:
Qizdirilganda Fe₂O₃ hosil bo'ladi - magnit xossalarga ega.
    `,
    mechanism: "Fe³⁺ + 3OH⁻ → Fe(OH)₃↓",
    applications: ["Fe³⁺ tahlili", "Suv tozalash", "Pigmentlar"],
    safetyNotes: "FeCl₃ korroziv, ehtiyot bo'ling",
    energyChange: "Neytral"
  },
  {
    id: "bacl2-na2so4",
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl",
    type: "Almashinish",
    description: "Bariy xlorid natriy sulfat bilan reaksiyaga kirib, oq BaSO₄ cho'kmasi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Darhol zich oq cho'kma",
    color: "Oq",
    icon: "sparkles",
    reactants: ["BaCl₂", "Na₂SO₄"],
    products: ["BaSO₄", "NaCl"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 ENG KAM ERIYDIGAN TUZLARDAN BIRI:

BaSO₄ suvda deyarli erimaydi. Eruvchanligi: 0.0002 g/100ml (25°C)

🏥 TIBBIYOT:
"Bariy sulfat suspenziyasi" rentgen tekshiruvida ichiladi. Xavfsiz chunki:
• Erimaydi
• So'rilmaydi
• O'zgarishsiz chiqariladi

🧪 GRAVIMETRIYA:
Sulfat ionlarini miqdoriy aniqlashda eng aniq usul:
1. BaCl₂ qo'shiladi
2. BaSO₄ cho'kadi
3. Cho'kma yuvilib, quritiladi
4. Og'irligi o'lchanadi

📊 HISOBLASH:
m(SO₄²⁻) = m(BaSO₄) × M(SO₄²⁻)/M(BaSO₄)
    `,
    mechanism: "Ba²⁺ + SO₄²⁻ → BaSO₄↓",
    applications: ["Rentgen", "Sulfat tahlili", "Bo'yoqlar"],
    safetyNotes: "BaCl₂ zaharli! BaSO₄ xavfsiz",
    energyChange: "Neytral"
  },
  {
    id: "pb(no3)2-ki",
    equation: "Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃",
    type: "Almashinish",
    description: "Qo'rg'oshin nitrat kaliy yodid bilan reaksiyaga kirib, chiroyli sariq PbI₂ cho'kmasi hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Yorqin sariq cho'kma - 'Oltin yomg'ir'",
    color: "Sariq",
    icon: "sparkles",
    reactants: ["Pb(NO₃)₂", "KI"],
    products: ["PbI₂", "KNO₃"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 "OLTIN YOMG'IR" TAJRIBASI:

Bu eng chiroyli kimyoviy tajribalardan biri! PbI₂ issiq suvda yaxshi, sovuq suvda kam eriydi.

⭐ OLTIN YOMG'IR:
1. Eritmalari aralashtiriladi - sariq cho'kma
2. Cho'kma qizdiriladi - eriydi
3. Sekin soviganida - oltin parchalar yog'adi!

🎨 RANGLAR:
PbI₂ kristallari oltin-sariq rangda yaltirlab tushadi. Juda chiroyli!

🧪 TAJRIBA TARTIBI:
1. 0.1M Pb(NO₃)₂ tayyorlang
2. 0.1M KI tayyorlang
3. Aralashtirib, qizdiring
4. Sekin soviting - oltin yomg'irni kuzating!

⚠️ ZAHARLI:
Qo'rg'oshin birikmalari zaharli. Faqat laboratoriya sharoitlarida!
    `,
    mechanism: "Pb²⁺ + 2I⁻ → PbI₂↓",
    applications: ["Demo tajriba", "Pb²⁺ va I⁻ tahlili"],
    safetyNotes: "Qo'rg'oshin birikmalari zaharli!",
    energyChange: "Neytral"
  },
  {
    id: "agno3-nacl-photo",
    equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
    type: "Almashinish",
    description: "Kumush nitrat natriy xlorid bilan reaksiyaga kirib, yorug'likka sezgir AgCl hosil qiladi",
    conditions: "Xona haroratida",
    observation: "Oq cho'kma, yorug'likda qorayadi",
    color: "Oq → Qora",
    icon: "sparkles",
    reactants: ["AgNO₃", "NaCl"],
    products: ["AgCl", "NaNO₃"],
    category: "Tuz + Tuz",
    detailedExplanation: `
🔬 FOTOGRAFIYANING KIMYOVIY ASOSI:

AgCl yorug'lik ta'sirida parchalanadi va sof kumush ajraladi. Bu prinsip fotografiyada 150 yildan ortiq ishlatilgan.

📸 JARAYON:
1. AgCl qatlamli plyonka/qog'oz
2. Yorug'lik tushadi → AgCl parchalanadi
3. Qora kumush hosil bo'ladi
4. Qoramtir joy = ko'p yorug'lik

🧪 TAJRIBA:
1. AgNO₃ + NaCl → AgCl↓
2. Cho'kmani qog'ozga surtib quritish
3. Qog'ozga shablon qo'yib quyoshga tutish
4. 10-15 daqiqada rasm paydo bo'ladi!

🔬 KIMYOVIY TENGLAMA:
2AgCl → 2Ag + Cl₂ (yorug'lik ta'sirida)
    `,
    mechanism: "Ag⁺ + Cl⁻ → AgCl↓, keyin yorug'lik parchalaydi",
    applications: ["Fotografiya", "Yorug'lik o'lchash", "Tahlil"],
    safetyNotes: "AgNO₃ terini dog'laydi",
    energyChange: "Neytral (cho'kma), endotermik (parchalanish)"
  },

  // ==================== YONISH REAKSIYALARI (20 ta) ====================
  {
    id: "ch4-o2",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    type: "Yonish",
    description: "Metan (tabiiy gaz) yonishi - asosiy energiya manbai",
    conditions: "Alanga yoki uchqun, 600°C dan yuqori",
    observation: "Ko'k alanga, issiqlik va suv bug'i",
    icon: "flame",
    reactants: ["CH₄", "O₂"],
    products: ["CO₂", "H₂O"],
    category: "Yonish",
    detailedExplanation: `
🔥 TABIIY GAZ YONISHI:

Metan (CH₄) - tabiiy gazning asosiy komponenti. Eng toza yonuvchan gazlardan biri.

⚡ ENERGIYA:
1 mol CH₄ yonganda 890 kJ issiqlik ajraladi. Bu:
• Isitish
• Elektr energiyasi
• Oziq-ovqat tayyorlash

🌍 EKOLOGIYA:
Metan eng "toza" yonuvchi uglevodorod:
• Kam CO₂ ajraladi (ko'mirga nisbatan)
• Kurum hosil bo'lmaydi
• SO₂ ajralmaydi

🔵 ALANGA RANGI:
Toza metanning alangasi ko'k. Sariq alanga = to'liq yonmayapti (xavfli!)

⚠️ XAVF:
Metan + havo aralashmasi (5-15%) portlovchi! Gazdan hidlanishni sezish uchun maxsus hid qo'shiladi.
    `,
    mechanism: "Radikal zanjir reaksiyasi: CH₄ → ·CH₃ → ... → CO₂",
    applications: ["Uy isitish", "Elektr stansiyalari", "Sanoat"],
    safetyNotes: "Portlovchi gaz! Yaxshi shamollatish",
    energyChange: "Juda ekzotermik (-890 kJ/mol)"
  },
  {
    id: "c2h5oh-o2",
    equation: "C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O",
    type: "Yonish",
    description: "Etanol (spirt) yonishi - toza va samarali yonish",
    conditions: "Alanga, xona haroratida yonadi",
    observation: "Ko'k-rangsiz alanga, kam tutun",
    icon: "flame",
    reactants: ["C₂H₅OH", "O₂"],
    products: ["CO₂", "H₂O"],
    category: "Yonish",
    detailedExplanation: `
🔥 SPIRT YONISHI:

Etanol (ichimlik spirti) yaxshi yonadi. Ko'k, deyarli ko'rinmas alanga bilan.

🚗 BIOYOQILGI:
Etanol benzin o'rniga ishlatiladi:
• Braziliyada 25% etanol aralashtiriladi
• E85 yoqilg'isi (85% etanol)
• Yangilanadigan energiya manbai

🧪 SPIRT LAMPASI:
Laboratoriyalarda spirt lampasi ishlatiladi:
• Toza yonadi
• Harorat nazoratchan
• Xavfsiz

⚡ ENERGIYA:
1 mol etanol yonganda 1367 kJ ajraladi. Bu metandan ko'p, lekin og'irligiga ko'ra benzindan kam.

🎭 ALANGA:
Etanol alangasi ko'k va deyarli ko'rinmaydi. Shuning uchun xavfli - odamlar ko'rmay qolishi mumkin!
    `,
    mechanism: "C₂H₅OH → aldegidlar → CO₂ + H₂O",
    applications: ["Bioyoqilg'i", "Spirt lampasi", "Dezinfeksiya"],
    safetyNotes: "Alanga ko'rinmas bo'lishi mumkin!",
    energyChange: "Ekzotermik (-1367 kJ/mol)"
  },
  {
    id: "c3h8-o2",
    equation: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
    type: "Yonish",
    description: "Propan (suyultirilgan gaz) yonishi - oshxona gazi va avtomobil yoqilg'isi",
    conditions: "Alanga, yonish nuqtasi -104°C",
    observation: "Ko'k alanga, ko'p issiqlik",
    icon: "flame",
    reactants: ["C₃H₈", "O₂"],
    products: ["CO₂", "H₂O"],
    category: "Yonish",
    detailedExplanation: `
🔥 SUYULTIRILGAN GAZ:

Propan va butan aralashmasi "suyultirilgan gaz" (LPG) deb ataladi. Ballonlarda sotiladi.

🏠 QOLLASH:
• Oshxona plitalari
• Isitish tizimlari
• Avtomobil yoqilg'isi (avtogas)
• Kemping jihozlari

⚡ AFZALLIKLARI:
• Metandan ko'ra ko'proq energiya
• Oson saqlanadi (suyuq holda)
• Arzon
• Toza yonadi

📊 TAQQOSLASH:
• Propan: 2220 kJ/mol
• Butan: 2878 kJ/mol
• Benzin: ~5400 kJ/mol (o'rtacha)

⚠️ XAVF:
LPG havodan og'ir - pol bo'ylab yig'iladi. Yaxshi shamollatish zarur!
    `,
    mechanism: "Propan oksidlanishi",
    applications: ["Oshxona gazi", "Avtogas", "Sanoat"],
    safetyNotes: "Havodan og'ir - pol bo'ylab yig'iladi!",
    energyChange: "Ekzotermik (-2220 kJ/mol)"
  },
  {
    id: "c-o2",
    equation: "C + O₂ → CO₂",
    type: "Yonish",
    description: "Uglerodning to'liq yonishi - ko'mir, koks yonishi",
    conditions: "Yuqori harorat, 700°C dan yuqori",
    observation: "Qizil alanga, uglerod dioksid gazi",
    icon: "flame",
    reactants: ["C", "O₂"],
    products: ["CO₂"],
    category: "Yonish",
    detailedExplanation: `
🔥 KO'MIR YONISHI:

Uglerod (ko'mir, koks, grafid) yonganda CO₂ hosil bo'ladi.

⚠️ TO'LIQ VA TOLA'MAS YONISH:
To'liq: C + O₂ → CO₂ (yaxshi)
To'la emas: 2C + O₂ → 2CO (xavfli!)

CO - is gazi, rangsiz, hidsiz, juda zaharli!

🏭 SANOAT:
Ko'mir yoqilg'isi sifatida:
• Elektr stansiyalari
• Metallurgiya
• Isitish

🌍 EKOLOGIYA:
Ko'mir yonishi atmosferaga eng ko'p CO₂ chiqaradi. Iqlim o'zgarishining asosiy sabablaridan biri.

🔬 ALLOTROPLAR:
Turli uglerod shakllari (olmos, grafit, fullerene) ham yonsa, bir xil CO₂ hosil bo'ladi!
    `,
    mechanism: "C + O₂ → CO₂ (yuqori haroratda)",
    applications: ["Energetika", "Metallurgiya", "Isitish"],
    safetyNotes: "To'la yonmasa CO hosil bo'ladi - zaharli!",
    energyChange: "Ekzotermik (-393 kJ/mol)"
  },
  {
    id: "s-o2",
    equation: "S + O₂ → SO₂",
    type: "Yonish",
    description: "Oltingugurt yonishi - ko'k alanga va keskin hidli gaz",
    conditions: "Alanga, 250°C dan yuqori",
    observation: "Ko'k alanga, keskin hidli gaz",
    icon: "flame",
    reactants: ["S", "O₂"],
    products: ["SO₂"],
    category: "Yonish",
    detailedExplanation: `
🔥 OLTINGUGURT YONISHI:

Oltingugurt yonganda chiroyli ko'k alanga hosil bo'ladi va keskin hidli SO₂ gazi ajraladi.

🔵 KO'K ALANGA:
Oltingugurt alangasi - kimyodagi eng chiroyli ko'k alangalardan biri. Vulqon otilishlarida ko'rish mumkin.

⚠️ SO₂ - ZAHARLI GAZ:
• Keskin, bo'g'uvchi hid
• Nafas yo'llarini ta'sirlaydi
• Kislotali yomg'ir sababi
• Atmosferani ifloslantiradi

🏭 SANOAT:
SO₂ sulfat kislota ishlab chiqarishda xom ashyo:
SO₂ + ½O₂ → SO₃
SO₃ + H₂O → H₂SO₄

💡 TARIX:
Qadimda oltingugurt "iblis toshi" deb atalgan - uning yonishi do'zax bilan bog'langan.
    `,
    mechanism: "S + O₂ → SO₂",
    applications: ["H₂SO₄ ishlab chiqarish", "Dezinfeksiya", "Oqartirish"],
    safetyNotes: "SO₂ zaharli! Yaxshi shamollatish",
    energyChange: "Ekzotermik (-297 kJ/mol)"
  },
  {
    id: "mg-o2",
    equation: "2Mg + O₂ → 2MgO",
    type: "Yonish",
    description: "Magniy yonishi - juda yorqin oq alanga",
    conditions: "Alanga, 650°C dan yuqori",
    observation: "Juda yorqin oq alanga, ko'zni qamashtiradi",
    color: "Oq",
    icon: "flame",
    reactants: ["Mg", "O₂"],
    products: ["MgO"],
    category: "Yonish",
    detailedExplanation: `
🔥 MAGNIY - ENG YORQIN ALANGA:

Magniy yonganda juda yorqin oq nurli alanga hosil bo'ladi. Bu nur UB nurlarini ham o'z ichiga oladi.

👁️ XAVF:
Magniy alangasiga qarash ko'zni shikastlaydi! Himoya ko'zoynak zarur.

📸 TARIX:
XIX asrda fotografiyada "magniy yoritgich" (flesh) sifatida ishlatilgan. Hozir elektron flash almashgan.

🎆 PIROTEXNIKA:
Magniy oq rang uchun:
• Igna-chaqmoqlar
• Olovbozlik
• Signal raketa

💡 TERMIT:
Mg + Fe₂O₃ aralashmasi "termit" deb ataladi. Yonganda 2500°C gacha qiziydi - temirni eritadi!

🧪 TAJRIBA:
Magniy lenta yoqib, uning yonishini kuzatish eng mashhur kimyo tajribalaridan biri.
    `,
    mechanism: "2Mg + O₂ → 2MgO (tez oksidlanish)",
    applications: ["Pirotexnika", "Flash", "Termit payvandlash"],
    safetyNotes: "Ko'zni himoyalang! UB nurlar!",
    energyChange: "Juda ekzotermik (-602 kJ/mol)"
  },
  {
    id: "fe-o2",
    equation: "3Fe + 2O₂ → Fe₃O₄",
    type: "Yonish",
    description: "Temir yonishi - uchqunlar bilan, magnit oksid hosil bo'ladi",
    conditions: "Yuqori harorat yoki nozik parchalar",
    observation: "Uchqunlar sachraydi, qora oksid hosil bo'ladi",
    color: "Qora",
    icon: "flame",
    reactants: ["Fe", "O₂"],
    products: ["Fe₃O₄"],
    category: "Yonish",
    detailedExplanation: `
🔥 TEMIR YONISHI:

Temir oddiy sharoitda yonmaydi, lekin nozik parchalar (po'lat jun, temir kukuni) yaxshi yonadi.

🎆 UCHQUNLAR:
Po'lat jun yoqilganda chiroyli uchqunlar sachraydi - bu fotografiyada qiziqarli effektlar yaratish uchun ishlatiladi.

🧲 MAGNIT OKSID:
Fe₃O₄ (magnetit) - tabiiy magnit. Eng kuchli magnit minerallardan biri.

⚗️ REAKSIYA TURLARI:
• Sekin oksidlanish: 4Fe + 3O₂ → 2Fe₂O₃ (zang)
• Yonish: 3Fe + 2O₂ → Fe₃O₄ (yuqori haroratda)

🏭 METALLURGIYA:
Fe₃O₄ temirning eng muhim rudalaridan biri. Domna pechida qayta ishlanadi.
    `,
    mechanism: "Fe oksidlanishi yuqori haroratda",
    applications: ["Pirotexnika", "Metallurgiya", "Magnit materiallari"],
    safetyNotes: "Nozik temir parchalarini ehtiyotkorlik bilan ishlating",
    energyChange: "Ekzotermik"
  },
  {
    id: "h2-o2",
    equation: "2H₂ + O₂ → 2H₂O",
    type: "Yonish",
    description: "Vodorod yonishi - eng toza yonish, faqat suv hosil bo'ladi",
    conditions: "Uchqun yoki alanga, 500°C dan yuqori",
    observation: "Rangsiz alanga, faqat suv bug'i",
    icon: "flame",
    reactants: ["H₂", "O₂"],
    products: ["H₂O"],
    category: "Yonish",
    detailedExplanation: `
🔥 ENG TOZA YONISH:

Vodorod yonganda FAQAT suv hosil bo'ladi - ideal ekologik yoqilg'i!

🚀 KOSMIK RAKETALAR:
Vodorod-kislorod yoqilg'isi kosmik raketalarda ishlatiladi:
• NASA Space Shuttle
• Ariane raketasi
• SpaceX (qisman)

💥 PORTLASH XAVFI:
Vodorod-havo aralashmasi (4-75%) juda portlovchi! "Oksivodorod" portlashi juda kuchli.

🔋 KELAJAK YOQILG'ISI:
Vodorod yoqilg'i elementlari:
• Elektr va suv bug'i hosil qiladi
• Ifloslantirmaydi
• Yangilanadigan

🧪 KLASSIK TAJRIBA:
Vodorod va kislorod aralashmasi (2:1) yoqilganda "paf" degan ovoz chiqadi va probirkani suv bilan qoplangan holda qoldiradi.
    `,
    mechanism: "2H₂ + O₂ → 2H₂O (radikal zanjir)",
    applications: ["Kosmik raketalar", "Yoqilg'i elementlari", "Payvandlash"],
    safetyNotes: "Portlovchi aralashma! Juda ehtiyot bo'ling!",
    energyChange: "Juda ekzotermik (-572 kJ/2mol)"
  },

  // ==================== PARCHALANISH REAKSIYALARI (15 ta) ====================
  {
    id: "h2o2-decomp",
    equation: "2H₂O₂ → 2H₂O + O₂↑",
    type: "Parchalanish",
    description: "Vodorod peroksid parchalanishi - katalizator bilan juda tez",
    conditions: "Katalizator (MnO₂, Fe³⁺, katalaza) yoki isitish",
    observation: "Ko'p pufakchalar, kislorod gazi ajraladi",
    icon: "sparkles",
    reactants: ["H₂O₂"],
    products: ["H₂O", "O₂"],
    category: "Parchalanish",
    detailedExplanation: `
🔬 VODOROD PEROKSID PARCHALANISHI:

H₂O₂ o'z-o'zidan sekin parchalanadi, lekin katalizatorlar bu jarayonni minglab marta tezlashtiradi.

🧪 "FIL TISH PASTASI" TAJRIBASI:
1. 30% H₂O₂ + suyuq sovun + KI
2. Jadal ko'pik hosil bo'ladi
3. Ko'pik "fil tishpasta" ga o'xshaydi

⚗️ KATALIZATORLAR:
• MnO₂ (qora kukun) - eng samarali
• KI (kaliy yodid) - tezkor
• Katalaza fermenti (qon, kartoshka) - tabiiy
• Fe³⁺ ionlari

💊 TIBBIYOT:
3% H₂O₂ eritmasi:
• Yaralarni tozalash
• Og'iz chayish
• Oqartirish

🧬 BIOLOGIYA:
Organizmda H₂O₂ katalaza fermenti bilan parchalanadi. Bu ferment juda tez ishlaydi!
    `,
    mechanism: "2H₂O₂ → 2H₂O + O₂ (katalizator yordamida)",
    applications: ["O₂ olish", "Tibbiyot", "Oqartirish"],
    safetyNotes: "Konsentrlangan H₂O₂ kuydiradi!",
    energyChange: "Ekzotermik"
  },
  {
    id: "caco3-decomp",
    equation: "CaCO₃ → Cite + CO₂↑",
    type: "Parchalanish",
    description: "Ohaktosh parchalanishi - so'ndirilmagan ohak olish",
    conditions: "Qizdirish 900°C dan yuqori",
    observation: "CO₂ gazi ajraladi, oq kukun qoladi",
    color: "Oq",
    icon: "flame",
    reactants: ["CaCO₃"],
    products: ["CaO", "CO₂"],
    category: "Parchalanish",
    detailedExplanation: `
🔥 OHAK KUYDIRISH:

Qadimdan ma'lum jarayon - ohaktoshni qizdirib so'ndirilmagan ohak olish.

🏗️ QURILISH:
CaO (so'ndirilmagan ohak) suv bilan:
CaO + H₂O → Ca(OH)₂ + issiqlik
Ca(OH)₂ - so'ndirilgan ohak, ohokor uchun ishlatiladi

🌡️ HARORAT:
900-1000°C da CaCO₃ parchalanadi. Sanoatda maxsus pechlar ishlatiladi.

🏭 SANOAT:
• Sement ishlab chiqarish
• Po'lat metallurgiyasi
• Kimyo sanoati
• Qog'oz sanoati

🧪 LABORATORIYA:
Bu reaksiya karbonatlarni aniqlash uchun ishlatiladi: qizdirilganda CO₂ ajraladi, bu ohak suvini loyqalantiradi.
    `,
    mechanism: "CaCO₃ → CaO + CO₂ (termal parchalanish)",
    applications: ["Ohak olish", "Sement", "Metallurgiya"],
    safetyNotes: "CaO suv bilan reaksiyaga kirganda kuydiraradi!",
    energyChange: "Endotermik (issiqlik kerak)"
  },
  {
    id: "kclo3-decomp",
    equation: "2KClO₃ → 2KCl + 3O₂↑",
    type: "Parchalanish",
    description: "Kaliy xlorat parchalanishi - laboratoriyada kislorod olish",
    conditions: "Qizdirish 400°C, MnO₂ katalizator bilan 200°C",
    observation: "Ko'p kislorod gazi ajraladi",
    icon: "flame",
    reactants: ["KClO₃"],
    products: ["KCl", "O₂"],
    category: "Parchalanish",
    detailedExplanation: `
🔬 KISLOROD OLISHNING KLASSIK USULI:

KClO₃ parchalanishi laboratoriyada kislorod olishning eng mashhur usullaridan biri.

🧪 MnO₂ KATALIZATOR:
MnO₂ qo'shilganda:
• Harorat 400°C dan 200°C ga tushadi
• Reaksiya tezlashadi
• MnO₂ o'zgarmaydi

⚠️ XAVF:
KClO₃ kuchli oksidlovchi! Yonuvchi moddalar bilan aralashtirilganda portlashi mumkin.

🎆 PIROTEXNIKA:
KClO₃ oksidlovchi sifatida:
• Gugurt boshlari
• Signal o'tlari
• Olovbozlik

📊 HISOB:
2 mol KClO₃ → 3 mol O₂
122.5 g KClO₃ → 33.6 L O₂ (n.sh.)
    `,
    mechanism: "2KClO₃ → 2KCl + 3O₂ (termik parchalanish)",
    applications: ["O₂ olish", "Pirotexnika", "Gugurt ishlab chiqarish"],
    safetyNotes: "Kuchli oksidlovchi - portlash xavfi!",
    energyChange: "Ekzotermik"
  },
  {
    id: "h2co3-decomp",
    equation: "H₂CO₃ → H₂O + CO₂↑",
    type: "Parchalanish",
    description: "Karbonat kislota parchalanishi - gazlangan ichimliklar pufakchasi",
    conditions: "Xona haroratida, o'z-o'zidan",
    observation: "CO₂ pufakchalari ajraladi",
    icon: "sparkles",
    reactants: ["H₂CO₃"],
    products: ["H₂O", "CO₂"],
    category: "Parchalanish",
    detailedExplanation: `
🔬 KARBONAT KISLOTA - BARQAROR EMAS:

H₂CO₃ faqat eritmalarda mavjud va darhol parchalanadi. Sof holda ajratib bo'lmaydi.

🥤 GAZLANGAN ICHIMLIKLAR:
Cola, Fanta, Sprite va boshqa ichimliklar CO₂ bilan to'yintirilgan:
• Bosim ostida CO₂ suvda eriydi
• Bosim tushganda (ochilganda) CO₂ ajraladi
• Pufakchalar - CO₂ gazi

🌡️ HARORAT TA'SIRI:
Issiq ichimlikdan CO₂ tezroq ajraladi:
• Sovuq kola - ko'proq gaz
• Issiq kola - "baraban" bo'lib ketadi

🧪 KARBONATLAR:
Boshqa karbonatlar ham kislota bilan:
CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑
Avval H₂CO₃ hosil bo'ladi, keyin darhol parchalanadi.
    `,
    mechanism: "H₂CO₃ ⇌ H₂O + CO₂ (muvozanat)",
    applications: ["Gazlangan ichimliklar", "Karbonatsiya", "Analiz"],
    safetyNotes: "Xavfsiz reaksiya",
    energyChange: "Endotermik (juda kichik)"
  },
  {
    id: "nahco3-decomp",
    equation: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑",
    type: "Parchalanish",
    description: "Ichimlik sodasi parchalanishi - osh pishirishda ko'piklanish",
    conditions: "Qizdirish 80°C dan yuqori",
    observation: "CO₂ gazi ajraladi, xamir ko'piklanadi",
    icon: "sparkles",
    reactants: ["NaHCO₃"],
    products: ["Na₂CO₃", "H₂O", "CO₂"],
    category: "Parchalanish",
    detailedExplanation: `
🔬 ICHIMLIK SODASI - OSHXONA SEHRI:

NaHCO₃ (ichimlik sodasi) qizdirilganda parchalanadi va CO₂ ajraladi. Bu xamirni ko'piklantiradadi.

🍰 OSHPAZLIK:
Non, tort, pechenye tayyorlashda:
1. NaHCO₃ xamirga qo'shiladi
2. Pechda qiziganda CO₂ ajraladi
3. Xamir ichida pufakchalar hosil bo'ladi
4. Mahsulot yumshoq va bo'shliqli bo'ladi

🧪 KISLOTA BILAN:
NaHCO₃ + HCl → NaCl + H₂O + CO₂↑
Bu kislota bilan ham CO₂ ajraladi (sirka, limon bilan)

💊 TIBBIYOT:
• Oshqozon kislotasini neytrallashtirish
• Og'iz chayish
• Teri parvarishi

🧹 UY-RO'ZG'OR:
• Tozalash
• Hidlarni yutish
• Oqartirish
    `,
    mechanism: "2NaHCO₃ → Na₂CO₃ + H₂O + CO₂ (termal)",
    applications: ["Pishirish", "Tibbiyot", "Tozalash"],
    safetyNotes: "Xavfsiz modda",
    energyChange: "Endotermik"
  },

  // ==================== SINTEZ REAKSIYALARI (15 ta) ====================
  {
    id: "n2-h2",
    equation: "N₂ + 3H₂ ⇌ 2NH₃",
    type: "Sintez",
    description: "Gaber jarayoni - ammiak sintezi, eng muhim sanoat reaksiyasi",
    conditions: "400-500°C, 200-300 atm, Fe katalizator",
    observation: "Rangsiz, keskin hidli gaz",
    icon: "wind",
    reactants: ["N₂", "H₂"],
    products: ["NH₃"],
    category: "Sintez",
    detailedExplanation: `
🔬 GABER JARAYONI - INSONIYATNI SAQLAB QOLDI:

Fritz Gaber tomonidan 1909-yilda kashf etilgan bu jarayon minglab yillik qishloq xo'jaligi muammosini hal qildi.

🌾 AHAMIYATI:
• O'g'itlar uchun ammiak
• Yer yuzidagi insonlarning 50% Gaber jarayoni bilan tiriklamoqda
• Nobel mukofoti (1918)

⚗️ SHART-SHAROITLAR:
• 400-500°C (kompromiss harorat)
• 200-300 atm bosim
• Fe katalizator
• Muvozanat reaksiya - chiqimi 15-20%

📊 LE SHATELE PRINSIPI:
• Yuqori bosim → NH₃ ko'payadi
• Past harorat → NH₃ ko'payadi (lekin sekin)
• Optimal sharoit - tezlik va chiqim balans

🏭 SANOAT:
Dunyo bo'yicha yiliga 180 mln tonna NH₃ ishlab chiqariladi. Bularning aksariyati o'g'itlarga ketadi.
    `,
    mechanism: "N≡N + 3H-H → 2NH₃ (Fe yuzasida bosqichma-bosqich)",
    applications: ["O'g'itlar", "Nitrat kislota", "Portlovchi moddalar"],
    safetyNotes: "NH₃ zaharli va kuydiradigan gaz",
    energyChange: "Ekzotermik (-92 kJ/mol)"
  },
  {
    id: "so2-o2",
    equation: "2SO₂ + O₂ ⇌ 2SO₃",
    type: "Sintez",
    description: "Kontakt jarayoni - sulfat kislota ishlab chiqarishning asosi",
    conditions: "400-450°C, V₂O₅ katalizator",
    observation: "Rangsiz gaz (SO₃) hosil bo'ladi",
    icon: "wind",
    reactants: ["SO₂", "O₂"],
    products: ["SO₃"],
    category: "Sintez",
    detailedExplanation: `
🔬 SULFAT KISLOTA ISHLAB CHIQARISH:

H₂SO₄ - "kimyoning qiroli". Dunyo bo'yicha eng ko'p ishlab chiqariladigan kimyoviy modda.

📊 JARAYON BOSQICHLARI:
1. S + O₂ → SO₂ (oltingugurt yoqish)
2. 2SO₂ + O₂ → 2SO₃ (kontakt jarayon)
3. SO₃ + H₂O → H₂SO₄ (absorbsiya)

⚗️ KATALIZATOR:
V₂O₅ (vanadiy pentaoksidi):
• 400-450°C optimal harorat
• Chiqim 98% gacha
• Uzoq muddatli

🏭 QOLLASH:
H₂SO₄ qo'llaniladi:
• O'g'itlar (fosfor, azot)
• Metallurgiya
• Neft qayta ishlash
• Batareyalar
• Sintez

📈 IQTISODIYOT:
"Mamlakat rivojlanganligini uning sulfat kislota ishlab chiqarishiga qarab baholash mumkin" - qadimiy aytim.
    `,
    mechanism: "2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅ yuzasida)",
    applications: ["H₂SO₄ ishlab chiqarish", "O'g'itlar", "Kimyo sanoati"],
    safetyNotes: "SO₃ juda reaktiv, suv bilan shiddatli reaksiya",
    energyChange: "Ekzotermik"
  },
  {
    id: "na-cl2",
    equation: "2Na + Cl₂ → 2NaCl",
    type: "Sintez",
    description: "Natriy va xlor sintezi - osh tuzi hosil bo'lishi",
    conditions: "Xona haroratida, o'z-o'zidan",
    observation: "Yorqin sariq alanga, oq tuz",
    color: "Sariq alanga, oq tuz",
    icon: "flame",
    reactants: ["Na", "Cl₂"],
    products: ["NaCl"],
    category: "Sintez",
    detailedExplanation: `
🔬 DRAMMATIK REAKSIYA:

Natriy (faol metall) va xlor (zaharli gaz) birikib, zararsiz osh tuzini hosil qiladi!

🎭 KIMYOVIY SEHRBOZLIK:
• Na - yumshoq, suv bilan portlaydigan metall
• Cl₂ - sariq-yashil, o'ldiruvchi gaz
• NaCl - kundalik iste'mol mahsuloti!

🔥 REAKSIYA:
Natriy xlor gaziga tashilganda:
1. Darhol yonadi
2. Sariq alanga
3. Oq tutun (NaCl zarrachalari)

⚡ ENERGETIKA:
Bu reaksiya juda ekzotermik. Ionli bog' hosil bo'lganda ko'p energiya ajraladi.

🧪 ELEKTROLIZ:
Bu reaksiyaning teskari jarayoni:
2NaCl → 2Na + Cl₂ (elektroliz)
Sanoatda Na va Cl₂ olish uchun ishlatiladi.
    `,
    mechanism: "2Na⁰ + Cl₂⁰ → 2Na⁺Cl⁻ (ionli bog')",
    applications: ["Demo tajriba", "NaCl olish"],
    safetyNotes: "Na va Cl₂ alohida juda xavfli!",
    energyChange: "Juda ekzotermik"
  },
  {
    id: "fe-s",
    equation: "Fe + S → FeS",
    type: "Sintez",
    description: "Temir va oltingugurt sintezi - klassik laboratoriya tajribasi",
    conditions: "Qizdirish, 600°C dan yuqori",
    observation: "Qizil cho'g' tarqaladi, qora modda hosil bo'ladi",
    color: "Qora",
    icon: "flame",
    reactants: ["Fe", "S"],
    products: ["FeS"],
    category: "Sintez",
    detailedExplanation: `
🔬 KLASSIK TAJRIBA:

Bu tajriba kimyoviy reaksiya va jismoniy aralashma orasidagi farqni ko'rsatadi.

🧲 FARQ:
Aralashma (Fe + S):
• Magnit temir zarrasini tortadi
• Suv S ni suzib ketiradi
• Osonlik bilan ajratiladi

FeS birikmasi:
• Magnit tortmaydi
• Suvda erimaydi
• Ajratib bo'lmaydi

🔥 TAJRIBA TARTIBI:
1. Fe va S kukunlarini aralashtiring (7:4)
2. Probirkaga solib qizdiring
3. Qizil cho'g' tarqalishini kuzating
4. Sovigach, qora FeS olasiz

⚠️ GAZ AJRALADI:
Agar FeS kislotaga tushsa:
FeS + 2HCl → FeCl₂ + H₂S↑
H₂S - juda zaharli, chirigan tuxum hidi!
    `,
    mechanism: "Fe + S → FeS (qattiq holatda diffuziya)",
    applications: ["Demo tajriba", "H₂S olish", "Metallurgiya"],
    safetyNotes: "FeS kislota bilan zaharli H₂S ajratadi!",
    energyChange: "Ekzotermik"
  },
  {
    id: "cao-h2o",
    equation: "CaO + H₂O → Ca(OH)₂",
    type: "Sintez",
    description: "So'ndirilmagan ohak suv bilan - so'ndirish jarayoni",
    conditions: "Xona haroratida, darhol",
    observation: "Ko'p issiqlik, bug' ajraladi, oq kukun",
    color: "Oq",
    icon: "flame",
    reactants: ["CaO", "H₂O"],
    products: ["Ca(OH)₂"],
    category: "Sintez",
    detailedExplanation: `
🔬 OHAK SO'NDIRISH:

Qadimdan ma'lum jarayon. Qurilishda, qishloq xo'jaligida, kimyoda ishlatiladi.

🔥 ISSIQLIK:
Bu reaksiya juda ekzotermik:
• Suv qaynash darajasiga yetadi
• Bug' ajraladi
• "Portlash" sodir bo'lishi mumkin

⚠️ XAVF:
CaO:
• Suvni jadal yutadi
• Terini kuydiraradi
• Ko'zga tushsa og'ir jarohat

🏗️ QURILISH:
• Ohokor tayyorlash
• Suvag'
• Oqlash

🌿 QISHLOQ XO'JALIGI:
• Tuproq kislotaliligini kamaytirish
• Dezinfeksiya
• O'g'it sifatida

🧪 LABORATORIYA:
Ca(OH)₂ eritmasi - "ohak suvi". CO₂ ni aniqlash uchun ishlatiladi:
Ca(OH)₂ + CO₂ → CaCO₃↓ (oq loyqalanish)
    `,
    mechanism: "CaO + H₂O → Ca(OH)₂ (gidratatsiya)",
    applications: ["Qurilish", "Qishloq xo'jaligi", "Kimyo"],
    safetyNotes: "CaO juda kuydiradigan! Himoya vositalari zarur!",
    energyChange: "Juda ekzotermik (-65 kJ/mol)"
  },

  // ==================== ELEKTROLIZ (10 ta) ====================
  {
    id: "h2o-electrolysis",
    equation: "2H₂O → 2H₂↑ + O₂↑",
    type: "Elektroliz",
    description: "Suvning elektrolizi - vodorod va kislorod olish",
    conditions: "Elektr toki, elektrolit (NaOH yoki H₂SO₄)",
    observation: "Katodda H₂, anodda O₂ (2:1 nisbatda)",
    icon: "sparkles",
    reactants: ["H₂O"],
    products: ["H₂", "O₂"],
    category: "Elektroliz",
    detailedExplanation: `
🔬 SUVNI PARCHALASH:

Elektr tokining eng chiroyli qo'llanilishlaridan biri - suvni H₂ va O₂ ga ajratish.

⚡ JARAYON:
Katod (-): 2H₂O + 2e⁻ → H₂ + 2OH⁻
Anod (+): 2H₂O → O₂ + 4H⁺ + 4e⁻

📊 NISBAT:
H₂ : O₂ = 2 : 1 (hajm bo'yicha)
Bu suvning H₂O formulasini tasdiqlaydi!

🔋 YOQILG'I ELEMENTI:
Elektrolizning teskari jarayoni:
2H₂ + O₂ → 2H₂O + elektr energiya
Bu yoqilg'i elementlarining asosi.

🌍 KELAJAK:
"Yashil vodorod" - quyosh/shamol energiyasi bilan suv elektrolizi. Toza energiya manbai!

🧪 TAJRIBA:
Hoffmann apparati bilan elektroliz - klassik laboratoriya tajribasi. Gazlar ikki silindrda yig'iladi.
    `,
    mechanism: "H₂O → H₂ + ½O₂ (elektrolitik parchalanish)",
    applications: ["Vodorod olish", "Kislorod olish", "Yoqilg'i elementlari"],
    safetyNotes: "H₂ + O₂ aralashmasi portlovchi!",
    energyChange: "Endotermik (elektr energiya kerak)"
  },
  {
    id: "nacl-electrolysis",
    equation: "2NaCl → 2Na + Cl₂↑",
    type: "Elektroliz",
    description: "Eritilgan osh tuzining elektrolizi - natriy va xlor olish",
    conditions: "Eritilgan NaCl (801°C), elektr toki",
    observation: "Katodda Na tomchilari, anodda Cl₂ gazi",
    icon: "sparkles",
    reactants: ["NaCl"],
    products: ["Na", "Cl₂"],
    category: "Elektroliz",
    detailedExplanation: `
🔬 NATRIY VA XLOR OLISH:

Sanoatda natriy va xlor osh tuzidan olinadi - elektroliz yo'li bilan.

⚡ JARAYON:
Katod (-): Na⁺ + e⁻ → Na (suyuq)
Anod (+): 2Cl⁻ → Cl₂ + 2e⁻

🌡️ HARORAT:
NaCl 801°C da eriydi. Shunday yuqori haroratda elektroliz o'tkaziladi.

🏭 DAUNS KAMERASI:
Sanoatda maxsus kamera ishlatiladi:
• Natriy yuqoriga suzib chiqadi
• Xlor gaz sifatida yig'iladi
• Ikkalasi ajratilgan holda saqlanadi

🧪 MAHSULOTLAR:
Na - yumshoq metall, neft ostida saqlanadi
Cl₂ - sariq-yashil gaz, zaharli

⚡ ENERGIYA:
Juda ko'p elektr energiya kerak. Shuning uchun Na qimmat.
    `,
    mechanism: "Na⁺ + e⁻ → Na, 2Cl⁻ → Cl₂ + 2e⁻",
    applications: ["Natriy olish", "Xlor olish", "Kimyo sanoati"],
    safetyNotes: "Na va Cl₂ ikkalasi ham xavfli!",
    energyChange: "Endotermik (elektr energiya kerak)"
  },
  {
    id: "cuso4-electrolysis",
    equation: "2CuSO₄ + 2H₂O → 2Cu + O₂↑ + 2H₂SO₄",
    type: "Elektroliz",
    description: "Mis sulfat eritmasining elektrolizi - mis olish",
    conditions: "Suvli eritma, elektr toki, mis elektrodlar",
    observation: "Katodda mis qatlami, anodda O₂",
    color: "Qizg'ish-jigarrang",
    icon: "sparkles",
    reactants: ["CuSO₄", "H₂O"],
    products: ["Cu", "O₂", "H₂SO₄"],
    category: "Elektroliz",
    detailedExplanation: `
🔬 MIS ELEKTROLITIK TOZALASH:

Bu jarayon sanoatda mis tozalash uchun ishlatiladi. 99.99% toza mis olinadi.

⚡ ELEKTRODLAR:
Katod (-): Yupqa sof mis plita
Anod (+): Xom mis plita (tozalanishi kerak)

📝 JARAYON:
Anod: Cu → Cu²⁺ + 2e⁻ (erib tushadi)
Katod: Cu²⁺ + 2e⁻ → Cu (o'sib qoladi)

💎 NATIHA:
• Katodda sof mis qatlami
• Aralashmalar anod ostida cho'kma (nobla metallar ham!)
• Elektrolit tarkibi o'zgarmaydi

🏭 SANOAT:
• Elektr simlari uchun sof mis
• Elektronika uchun
• Qimmatbaho metallar ajratish

⚗️ GALVANIKA:
Shu prinsip galvanik qoplash uchun ham ishlatiladi.
    `,
    mechanism: "Cu²⁺ + 2e⁻ → Cu (katodda), Cu → Cu²⁺ + 2e⁻ (anodda)",
    applications: ["Mis tozalash", "Galvanika", "Elektr sanoati"],
    safetyNotes: "Elektr toki xavfli!",
    energyChange: "Endotermik"
  },

  // ==================== ORGANIK REAKSIYALAR (15 ta) ====================
  {
    id: "ch3ch2oh-oxidation",
    equation: "C₂H₅OH + O₂ → CH₃CHO + H₂O",
    type: "Oksidlanish",
    description: "Etanol oksidlanishi - atsetaldegid hosil bo'lishi",
    conditions: "Cu yoki Pt katalizator, qizdirish",
    observation: "Keskin mevasimon hid (aldegid)",
    icon: "wind",
    reactants: ["C₂H₅OH", "O₂"],
    products: ["CH₃CHO", "H₂O"],
    category: "Organik",
    detailedExplanation: `
🔬 SPIRTLAR OKSIDLANISHI:

Spirtlar oksidlanishi kimyoda juda muhim reaksiya. Mahsulot spirt turiga bog'liq.

📝 BOSQICHLAR:
Birlamchi spirt → Aldegid → Karbon kislota
C₂H₅OH → CH₃CHO → CH₃COOH

🧪 KATALIZATORLAR:
• Cu (mis) - klassik
• Pt (platina) - samaraliroq
• KMnO₄ - laboratoriyada
• K₂Cr₂O₇ - analitik

🍷 VINODA:
Sharob "oksidlanganda" sirka kislotasi hosil bo'ladi:
C₂H₅OH → CH₃COOH (bakteriyalar bilan)

💡 NAFAS TESTI:
Alkogol testi - spirt oksidlanganda rang o'zgarishi (K₂Cr₂O₇ sariq → yashil).

⚗️ SANOAT:
Atsetaldegid sirka kislota va boshqa kimyoviy moddalar ishlab chiqarish uchun xom ashyo.
    `,
    mechanism: "R-OH → R-CHO (vodorod ajratilishi)",
    applications: ["Aldegid olish", "Alkogol testi", "Kimyo sanoati"],
    safetyNotes: "Aldegidlar ko'zlarga ta'sir qiladi",
    energyChange: "Ekzotermik"
  },
  {
    id: "ch3cooh-nahco3",
    equation: "CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂↑",
    type: "Neytrallanish",
    description: "Sirka va soda reaksiyasi - oshxonada ishlatiladigan klassik reaksiya",
    conditions: "Xona haroratida, darhol",
    observation: "Ko'p pufakchalar, CO₂ ajraladi",
    icon: "sparkles",
    reactants: ["CH₃COOH", "NaHCO₃"],
    products: ["CH₃COONa", "H₂O", "CO₂"],
    category: "Organik",
    detailedExplanation: `
🔬 OSHXONA KIMYOSI:

Bu reaksiya oshxonada juda ko'p ishlatiladi - non yopishda, tozalashda, va hatto vulqon modellarida!

🍞 NON YOPISH:
1. Sirka + soda xamirga qo'shiladi
2. CO₂ ajraladi
3. Xamir ko'tariladi
4. Yumshoq non hosil bo'ladi

🌋 VULQON MODELI:
Bolalar tajribasida:
1. Soda konusga solinadi
2. Qizil bo'yoqli sirka qo'shiladi
3. "Lava" otiladi!

🧹 TOZALASH:
• Qozon toshlarini eritish
• Drain tozalash
• Hidlarni yo'qotish

🧪 KIMYOVIY MOHIYAT:
Sirka kuchsiz kislota bo'lsada, karbonatlarni parchalaydi va CO₂ ajratadi.
    `,
    mechanism: "Karbonat kislota hosil bo'lib, darhol parchalanadi",
    applications: ["Oshpazlik", "Tozalash", "Demo tajriba"],
    safetyNotes: "Xavfsiz reaksiya, oshxonada ishlatiladi",
    energyChange: "Kuchsiz ekzotermik"
  },
  {
    id: "esterification",
    equation: "CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O",
    type: "Esterifikatsiya",
    description: "Efir hosil bo'lishi - yoqimli hidli modda",
    conditions: "H₂SO₄ katalizator, qizdirish",
    observation: "Yoqimli mevasimon hid (ananas)",
    icon: "sparkles",
    reactants: ["CH₃COOH", "C₂H₅OH"],
    products: ["CH₃COOC₂H₅", "H₂O"],
    category: "Organik",
    detailedExplanation: `
🔬 EFIR HOSIL BO'LISHI:

Kislota + Spirt → Efir + Suv
Bu reaksiya "esterifikatsiya" deb ataladi.

🍎 MEVA HIDLARI:
Turli efirlar turli hidlar beradi:
• Etil atsetat - ananas, olmama
• Izopentil atsetat - banan
• Oktil atsetat - apelsin
• Etil butirat - ananas

🎨 QOLLASH:
• Parfyumeriya
• Oziq-ovqat aromatizatorlari
• Bo'yoqlar erituvchisi
• Lak ishlab chiqarish

⚗️ SHAROITLAR:
• H₂SO₄ katalizator
• 60-80°C qizdirish
• Muvozanat reaksiya
• Suvni ajratish orqali chiqimni oshirish

🧪 TAJRIBA:
1. Sirka kislota + etanol + H₂SO₄ (bir necha tomchi)
2. 5-10 daqiqa qizdirish
3. Yoqimli ananas hidini his qiling!
    `,
    mechanism: "RCOOH + R'OH ⇌ RCOOR' + H₂O (H⁺ katalizator)",
    applications: ["Parfyumeriya", "Oziq-ovqat", "Erituvchilar"],
    safetyNotes: "Efirlar uchuvchi va yonuvchi",
    energyChange: "Neytral (muvozanat)"
  },
  {
    id: "saponification",
    equation: "C₃H₅(OOCR)₃ + 3NaOH → C₃H₅(OH)₃ + 3RCOONa",
    type: "Saponifikatsiya",
    description: "Sovun tayyorlash - yog' va ishqor reaksiyasi",
    conditions: "Qizdirish, 80-100°C",
    observation: "Qalin massa, sovun hosil bo'ladi",
    icon: "droplets",
    reactants: ["Yog'", "NaOH"],
    products: ["Glitserin", "Sovun"],
    category: "Organik",
    detailedExplanation: `
🔬 SOVUN TAYYORLASH:

Qadimdan ma'lum jarayon - yog' va kul (ishqor) dan sovun tayyorlash.

🧼 JARAYON:
1. Yog' (triglitserid) + NaOH
2. 80-100°C da qizdirish
3. Efir bog'lari uziladi
4. Glitserin va sovun hosil bo'ladi

🧪 KIMYOVIY MOHIYAT:
Yog' = Glitserin + 3 ta yog' kislotasi
Ishqor yog' kislotalarini ajratadi
Sovun = Yog' kislotasi tuzi

💧 SOVUN ISHLASHI:
Sovun molekulasi:
• Bir uchi suvga yoqadi (gidrofil)
• Bir uchi yog'ga yoqadi (gidrofob)
Bu kir yuvish mexanizmi!

🏠 UY SHAROITIDA:
1. Yog' (200g) + NaOH (30g) + suv (100ml)
2. 1-2 soat qaynatish
3. Tuzli suv qo'shib cho'ktirish
4. Sovun tayyyor!
    `,
    mechanism: "Efir gidrolizi + tuz hosil bo'lishi",
    applications: ["Sovun ishlab chiqarish", "Glitserin olish"],
    safetyNotes: "NaOH kuydiradigan - ehtiyot bo'ling!",
    energyChange: "Ekzotermik"
  },
  {
    id: "ch4-cl2",
    equation: "CH₄ + Cl₂ → CH₃Cl + HCl",
    type: "Almashinish",
    description: "Metanning xlorlanishi - radikal almashinish reaksiyasi",
    conditions: "UV yorug'lik yoki 300°C",
    observation: "Rangsiz gaz (CH₃Cl), HCl bug'i",
    icon: "wind",
    reactants: ["CH₄", "Cl₂"],
    products: ["CH₃Cl", "HCl"],
    category: "Organik",
    detailedExplanation: `
🔬 RADIKAL ALMASHINISH:

Bu organik kimyodagi eng muhim reaksiya turlaridan biri. Alkanlar galogenlar bilan shunday reaksiyaga kiradi.

⚡ MEXANIZM:
1. BOSHLASH: Cl₂ → 2Cl• (UV yorug'lik)
2. TARQALISH: 
   Cl• + CH₄ → HCl + •CH₃
   •CH₃ + Cl₂ → CH₃Cl + Cl•
3. TUGASH: Cl• + Cl• → Cl₂

📝 MAHSULOTLAR:
Davom etsa, to'rt xil mahsulot:
CH₃Cl → CH₂Cl₂ → CHCl₃ → CCl₄

🏭 SANOAT AHAMIYATI:
• CH₃Cl - metil xlorid (erituvchi)
• CH₂Cl₂ - dixlormetan (bo'yoq erituvchi)
• CHCl₃ - xloroform (tarixiy narkoz)
• CCl₄ - to'rt xlorli uglerod (yong'in o'chiruvchi)

⚠️ XAVF:
Barcha xlorli uglevodlar zaharli va ekologik xavfli!
    `,
    mechanism: "Radikal zanjir reaksiyasi (initiation, propagation, termination)",
    applications: ["Xloruglevodlar olish", "Sanoat kimyosi"],
    safetyNotes: "Xlorli uglevodlar zaharli!",
    energyChange: "Ekzotermik"
  },

  // ==================== KOMPLEKS REAKSIYALAR (10 ta) ====================
  {
    id: "ag-nh3-complex",
    equation: "AgCl + 2NH₃ → [Ag(NH₃)₂]Cl",
    type: "Kompleks hosil bo'lishi",
    description: "Kumush-ammiak kompleksi - AgCl cho'kmasini eritish",
    conditions: "Ortiqcha ammiak",
    observation: "Oq cho'kma eriydi, rangsiz eritma",
    icon: "droplets",
    reactants: ["AgCl", "NH₃"],
    products: ["[Ag(NH₃)₂]Cl"],
    category: "Kompleks",
    detailedExplanation: `
🔬 KOMPLEKS BIRIKMALAR:

Ba'zi cho'kmalar ammiak bilan kompleks hosil qilib eriydi. Bu xossa tahlilda ishlatiladi.

🧪 TOLLENS REAKTIVI:
[Ag(NH₃)₂]⁺ - "kumush oyna" reaktivi
Aldegidlarni aniqlashda ishlatiladi:
RCHO + 2[Ag(NH₃)₂]⁺ → RCOO⁻ + 2Ag↓ + 4NH₃ + H⁺

🪞 KUMUSH OYNA:
Aldegid kumush kompleksini qaytaradi:
• Probirkada kumush qatlami hosil bo'ladi
• Oyna kabi yarqiraydi
• Klassik aldegid testi

📊 KOMPLEKS BARQARORLIGI:
[Ag(NH₃)₂]⁺ barqaror kompleks:
Kf = [Ag(NH₃)₂⁺]/[Ag⁺][NH₃]² = 1.7×10⁷

🔬 TAHLIL:
AgCl + NH₃ → Ag⁺ bor-yo'qligini aniqlash
Ag⁺ bilan cho'kma, NH₃ bilan eriydi = Ag⁺ tasdiqlandi
    `,
    mechanism: "Ag⁺ + 2NH₃ → [Ag(NH₃)₂]⁺ (ligand almashinishi)",
    applications: ["Tollens reaktivi", "Kumush oyna", "Ag⁺ tahlili"],
    safetyNotes: "Tollens reaktivi tez foydalanilishi kerak",
    energyChange: "Kuchsiz ekzotermik"
  },
  {
    id: "cu-nh3-complex",
    equation: "Cu(OH)₂ + 4NH₃ → [Cu(NH₃)₄](OH)₂",
    type: "Kompleks hosil bo'lishi",
    description: "Mis-ammiak kompleksi - chiroyli ko'k rang",
    conditions: "Ortiqcha ammiak",
    observation: "Ko'k cho'kma eriydi, to'q ko'k eritma",
    color: "To'q ko'k",
    icon: "droplets",
    reactants: ["Cu(OH)₂", "NH₃"],
    products: ["[Cu(NH₃)₄](OH)₂"],
    category: "Kompleks",
    detailedExplanation: `
🔬 "SHIVAYTER REAKTIVI":

Bu kompleks tsellyulozani eritadi - sun'iy ipak (rayon) ishlab chiqarishda ishlatilgan.

💙 TO'Q KO'K RANG:
[Cu(NH₃)₄]²⁺ juda chiroyli to'q ko'k rang beradi. "Ultramarin" ga o'xshash.

🧪 HOSIL QILISH:
1. CuSO₄ eritmasiga NaOH qo'shish → Cu(OH)₂↓ (ko'k)
2. NH₃ qo'shish → Ko'k cho'kma eriydi
3. To'q ko'k eritma hosil bo'ladi

🧵 RAYON IPAK:
XIX asrda sun'iy ipak ishlab chiqarishda:
1. Tsellyuloza + [Cu(NH₃)₄]²⁺ → eritma
2. Kislotaga o'tkazish → ipak tolalari

📊 GEOMETRIYA:
[Cu(NH₃)₄]²⁺ - kvadrat-planar shakl
Cu²⁺ atrofida 4 ta NH₃ molekulasi
    `,
    mechanism: "Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺",
    applications: ["Shivayter reaktivi", "Rayon", "Cu²⁺ tahlili"],
    safetyNotes: "Ammiak hidini nafas olmang",
    energyChange: "Ekzotermik"
  },
  {
    id: "fe3-scn",
    equation: "Fe³⁺ + 3SCN⁻ → Fe(SCN)₃",
    type: "Kompleks hosil bo'lishi",
    description: "Temir-tiotsianat kompleksi - qon qizil rang",
    conditions: "Xona haroratida",
    observation: "Qon qizil rang hosil bo'ladi",
    color: "Qon qizil",
    icon: "sparkles",
    reactants: ["Fe³⁺", "SCN⁻"],
    products: ["Fe(SCN)₃"],
    category: "Kompleks",
    detailedExplanation: `
🔬 FE³⁺ NING SIFAT REAKTSIYASI:

Bu reaksiya Fe³⁺ ionlarini aniqlashning eng sezgir usuli.

🩸 QON QIZIL RANG:
Fe(SCN)₃ yoki [Fe(SCN)]²⁺ qon qizil rang beradi. Juda kam miqdordagi Fe³⁺ ham ko'rinadi!

🧪 TAJRIBA:
1. FeCl₃ eritmasiga KSCN qo'shing
2. Darhol qon qizil rang!
3. Bu Fe³⁺ ning eng yaxshi testi

📊 SEZGIRLIK:
0.001 mg Fe³⁺ ni aniqlash mumkin!

⚗️ KOMPLEKS TURLARI:
Nisbatga qarab turli komplekslar:
[Fe(SCN)]²⁺ - qizil
[Fe(SCN)₂]⁺ - to'qroq
Fe(SCN)₃ - eng to'q

🎭 "SOX'TA QON":
Kinoda "sun'iy qon" sifatida ishlatilgan. FeCl₃ + KSCN = qon rangi!
    `,
    mechanism: "Fe³⁺ + SCN⁻ → [Fe(SCN)]²⁺ (tez)",
    applications: ["Fe³⁺ tahlili", "Sezgir test", "Kino effektlari"],
    safetyNotes: "KSCN zaharli - og'izga olmang",
    energyChange: "Neytral"
  }
];
