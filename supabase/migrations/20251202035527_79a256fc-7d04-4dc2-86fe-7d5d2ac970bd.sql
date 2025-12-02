-- Delete existing books and their related data
DELETE FROM chapter_questions;
DELETE FROM book_chapters;
DELETE FROM chemistry_books;

-- Insert 1-QISM: Boshlang'ich Kimyo
INSERT INTO chemistry_books (id, title, author, description, difficulty_level, topic) VALUES
('b1000000-0000-0000-0000-000000000001', 'Boshlang''ich Kimyo (1-qism)', 'Asilbek Salohiddinov', 'Oliy o''quv yurtlariga kiruvchilar uchun qo''llanma. Kimyoning asosiy tushunchalari, formulalar, anorganik moddalar sinflari.', 1, 'Boshlang''ich');

-- Insert 2-QISM: Umumiy Kimyo
INSERT INTO chemistry_books (id, title, author, description, difficulty_level, topic) VALUES
('b2000000-0000-0000-0000-000000000002', 'Umumiy Kimyo (2-qism)', 'Asilbek Salohiddinov', 'Atom tuzilishi, davriy qonun, kimyoviy bog''lanish, oksidlanish-qaytarilish, eritmalar, termodinamika, kinetika, elektrokimyo.', 2, 'Umumiy kimyo');

-- Insert 3-QISM: Anorganik Kimyo
INSERT INTO chemistry_books (id, title, author, description, difficulty_level, topic) VALUES
('b3000000-0000-0000-0000-000000000003', 'Anorganik Kimyo (3-qism)', 'Asilbek Salohiddinov', 'Nodir gazlar, galogenlar, xalkogenlar, azot va fosfor, uglerod guruhi, metallar va ularning birikmalari.', 3, 'Anorganik kimyo');

-- 1-QISM chapters
INSERT INTO book_chapters (book_id, title, content, order_num) VALUES
('b1000000-0000-0000-0000-000000000001', 'Kirish. Kimyoning asosiy tushunchalari', 
'Kimyo moddalar, moddalarning xossalari va ularning bir-biriga aylanishi to''g''risidagi fandir.

ASOSIY TUSHUNCHALAR:
• Modda – bu materiya formasi. Zarrachalardan tashkil topib massa saqlanish qonuniga amal qiladi.
• Molekula – bu moddaning eng kichik va mustaqil mavjud bo''la oladigan zarrachasi.
• Atom – bu moddaning kimyoviy jihatdan bo''linmaydigan eng kichik zarrachasi.
• Ion – elektron zaryadlangan atomlar yoki atomlar to''plami.

XOSSALAR TURLARI:
1. Fizikaviy xossalar: suyuqlanish, qaynash, muzlash temperaturalari, eruvchanligi, zichligi, elektr va issiqlik o''tkazuvchanligi.
2. Kimyoviy xossalar: metall yoki metallmasligi, oksidlovchi yoki qaytaruvchiligi, asosli yoki kislotaliligi.

Kimyoviy element – yadro zaryadlari bir xil bo''lgan atomlar to''plami. Hozirda 110 ta kimyoviy element ma''lum, ulardan 89 tasi tabiatda mavjud.', 1),

('b1000000-0000-0000-0000-000000000001', 'Atom va uning tarkibi', 
'ATOM TARKIBI:
• Yadro: proton (musbat zaryadli) va neytron (zaryadlanmagan)
• Elektronlar: manfiy zaryadli zarrachalar yadro atrofida harakatlanadi

MUHIM TUSHUNCHALAR:
• Atom nomeri (Z) = protonlar soni = elektronlar soni
• Massa soni (A) = protonlar + neytronlar
• Izotoplar – protonlar soni bir xil, neytronlar soni farqli atomlar (masalan: ¹H, ²H, ³H)
• Izobarlar – massa soni bir xil, protonlar soni farqli atomlar
• Izotonlar – neytronlar soni bir xil atomlar

ELEKTRON KONFIGURATSIYASI:
• Elektronlar energetik pog''onalarga (qavatlar) joylashadi: K, L, M, N, O, P, Q
• Har bir qavatdagi maksimal elektronlar soni: 2n² (n – qavat nomeri)
• s, p, d, f – orbitallar turlari', 2),

('b1000000-0000-0000-0000-000000000001', 'Valentlik va oksidlanish darajasi', 
'VALENTLIK – atomning boshqa atomlar bilan hosil qila oladigan bog''lar soni.

VALENTLIK QOIDALARI:
• Vodorod valentligi doim 1 ga teng
• Kislorod valentligi ko''p hollarda 2 ga teng
• Metallar konstantali valentlikka ega (Na-1, Ca-2, Al-3)
• Ba''zi elementlar o''zgaruvchan valentlikka ega (Fe – 2, 3; S – 2, 4, 6)

OKSIDLANISH DARAJASI – shartli zaryad, atomga berilgan barcha elektronlarni tortiladigan element atomi oldinga chiqadi.

QOIDALAR:
• Oddiy moddalarda oksidlanish darajasi = 0
• Birikmalarda H = +1 (gidridlarda -1)
• Birikmalarda O = -2 (OF₂ da +2, peroksidlarda -1)
• Metallar musbat oksidlanish darajasiga ega
• Molekuladagi barcha atomlar oksidlanish darajalarining yig''indisi = 0', 3),

('b1000000-0000-0000-0000-000000000001', 'Mol va Avogadro qonuni', 
'MOL – moddaning 6,02×10²³ ta zarracha tutgan miqdori.

AVOGADRO SONI: Nₐ = 6,02×10²³ mol⁻¹

MOLYAR MASSA (M) – 1 mol moddaning massasi (g/mol)
• M = m/n (m – massa, n – mol miqdori)

MOLYAR HAJM – 1 mol gazning normal sharoitda egallagan hajmi
• Vm = 22,4 L/mol (n.sh. da)

AVOGADRO QONUNI:
"Bir xil sharoit (bosim va harorat)da teng hajmdagi gazlarda teng sondagi molekulalar bo''ladi"

GAZLAR UCHUN FORMULALAR:
• n = V/22,4 (normal sharoitda)
• PV = nRT (ideal gaz tenglamasi)
• D = M₁/M₂ (gazlarning nisbiy zichligi)', 4),

('b1000000-0000-0000-0000-000000000001', 'Oksidlar', 
'OKSIDLAR – kislorod bilan boshqa elementlar birikmasidan hosil bo''lgan murakkab moddalar.

OKSIDLAR TASNIFI:

1. TUZ HOSIL QILUVCHI OKSIDLAR:
   a) Asosli oksidlar (metall oksidlari): Na₂O, CaO, FeO
      • Suv bilan ishqor hosil qiladi: Na₂O + H₂O → 2NaOH
      • Kislota bilan tuz hosil qiladi: CaO + 2HCl → CaCl₂ + H₂O

   b) Kislotali oksidlar (metallmas oksidlari): CO₂, SO₃, P₂O₅
      • Suv bilan kislota hosil qiladi: SO₃ + H₂O → H₂SO₄
      • Ishqor bilan tuz hosil qiladi: CO₂ + 2NaOH → Na₂CO₃ + H₂O

   c) Amfoter oksidlar: Al₂O₃, ZnO, Cr₂O₃
      • Ham kislota, ham ishqor bilan reaksiyaga kirishadi

2. TUZ HOSIL QILMAYDIGAN OKSIDLAR: CO, NO, N₂O', 5),

('b1000000-0000-0000-0000-000000000001', 'Asoslar', 
'ASOSLAR – metall kation va gidroksid anionidan tashkil topgan murakkab moddalar.

FORMULASI: Me(OH)n (n – metall valentligi)

TASNIFI:
1. ERUVCHAN ASOSLAR (Ishqorlar): NaOH, KOH, Ca(OH)₂, Ba(OH)₂
2. ERIMAYDIGAN ASOSLAR: Cu(OH)₂, Fe(OH)₃, Al(OH)₃

OLINISHI:
• Faol metall + suv → ishqor + H₂: 2Na + 2H₂O → 2NaOH + H₂↑
• Metall oksid + suv → ishqor: CaO + H₂O → Ca(OH)₂
• Tuz + ishqor → yangi tuz + yangi asos

KIMYOVIY XOSSALARI:
• Indikatorlar rangini o''zgartiradi (lakmus – ko''k, fenolftalein – pushti)
• Kislota bilan neytrallashish reaksiyasi: NaOH + HCl → NaCl + H₂O
• Kislotali oksid bilan: 2NaOH + CO₂ → Na₂CO₃ + H₂O
• Tuzlar bilan: 2NaOH + CuSO₄ → Cu(OH)₂↓ + Na₂SO₄', 6),

('b1000000-0000-0000-0000-000000000001', 'Kislotalar', 
'KISLOTALAR – vodorod kation va kislota qoldig''idan tashkil topgan murakkab moddalar.

TASNIFI:

1. KISLORODSIZ KISLOTALAR: HCl, HBr, HI, H₂S, HF
2. KISLORODLI KISLOTALAR: H₂SO₄, HNO₃, H₃PO₄, H₂CO₃

KUCHLI KISLOTALAR: HCl, HBr, HI, H₂SO₄, HNO₃
KUCHSIZ KISLOTALAR: H₂CO₃, H₂S, H₂SiO₃, CH₃COOH

OLINISHI:
• Metallmas oksid + suv: SO₃ + H₂O → H₂SO₄
• Tuz + kuchli kislota: NaCl + H₂SO₄ → NaHSO₄ + HCl↑
• To''g''ridan-to''g''ri sintez: H₂ + Cl₂ → 2HCl

KIMYOVIY XOSSALARI:
• Indikatorlar: lakmus – qizil, metiloranj – qizil
• Metall + kislota → tuz + H₂: Zn + 2HCl → ZnCl₂ + H₂↑
• Metall oksid + kislota → tuz + suv: CuO + H₂SO₄ → CuSO₄ + H₂O
• Asos + kislota → tuz + suv: Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O
• Tuz + kislota → yangi tuz + yangi kislota', 7),

('b1000000-0000-0000-0000-000000000001', 'Tuzlar', 
'TUZLAR – metall kation va kislota qoldig''idan tashkil topgan murakkab moddalar.

TASNIFI:

1. O''RTA TUZLAR: NaCl, K₂SO₄, CaCO₃ – butunlay neytrallangan tuzlar
2. NORDON TUZLAR: NaHCO₃, Ca(HSO₄)₂ – tarkibida vodorod bor
3. ASOSLI TUZLAR: CuOHCl, FeOHCl₂ – tarkibida gidroksil gruppasi bor
4. QO''SH TUZLAR: KAl(SO₄)₂ – ikki xil metall tutadi
5. KOMPLEKS TUZLAR: K₃[Fe(CN)₆] – kompleks ion tutadi

OLINISHI:
• Metall + metallmas: 2Na + Cl₂ → 2NaCl
• Metall + kislota: Zn + H₂SO₄ → ZnSO₄ + H₂↑
• Metall oksid + kislota: MgO + 2HCl → MgCl₂ + H₂O
• Asos + kislota: NaOH + HNO₃ → NaNO₃ + H₂O
• Asos + kislotali oksid: 2KOH + CO₂ → K₂CO₃ + H₂O
• Tuz + tuz: AgNO₃ + NaCl → AgCl↓ + NaNO₃

ERUVCHANLIK JADVALI – qaysi tuzlar suvda erishi/erimasligini ko''rsatadi.', 8);

-- 2-QISM chapters
INSERT INTO book_chapters (book_id, title, content, order_num) VALUES
('b2000000-0000-0000-0000-000000000002', 'Atom tuzilishi', 
'ATOM MODELLARI TARIXI:
• 1897 – Tomson: "Keks modeli" – musbat zaryadli sharcha ichida elektronlar
• 1911 – Rezerford: Planetar model – yadro atrofida elektronlar aylanadi
• 1913 – Bor: Kvantlangan orbitalar – elektronlar ma''lum energetik sathda
• 1926 – Kvant mexanik model – elektronlar buluti

BOR POSTULATLARI:
1. Elektron faqat ruxsat etilgan orbitalar bo''ylab harakatlanadi
2. Bu orbitada elektron energiya chiqarmaydi/yutmaydi
3. Orbitadan orbitaga o''tishda energiya chiqaradi/yutadi: ΔE = hν

KVANT SONLARI:
• n – bosh kvant son (qavat nomeri): 1, 2, 3, 4...
• l – orbital kvant son (orbital shakli): 0 dan (n-1) gacha
• m – magnit kvant son (orbital yo''nalishi): -l dan +l gacha
• s – spin kvant son: +1/2 yoki -1/2

ORBITAL TURLARI:
• s – sferik shakl (l=0), 2 ta elektron sig''adi
• p – gantel shakl (l=1), 6 ta elektron sig''adi
• d – murakkab shakl (l=2), 10 ta elektron sig''adi
• f – juda murakkab (l=3), 14 ta elektron sig''adi', 1),

('b2000000-0000-0000-0000-000000000002', 'Davriy qonun va Mendeleyev jadvali', 
'DAVRIY QONUN (D.I.Mendeleyev, 1869):
"Kimyoviy elementlar va ulardan hosil bo''luvchi oddiy hamda murakkab moddalarning xossalari elementlar atomlarining yadro zaryadlari (atom nomerlari) bilan davriy bog''lanishda bo''ladi."

DAVRIY JADVAL TUZILISHI:
• 7 ta DAVR (gorizontal qator)
• 8 ta GURUH (vertikal ustun)
• Har bir guruh A va B kichik guruhlarga bo''linadi

DAVRDA CHAPDAN O''NGGA:
• Atom radiusi kamayadi
• Elektromanfiylik ortadi
• Metall xossalari susayadi
• Metallmas xossalari kuchayadi

GURUHDA YUQORIDAN PASTGA:
• Atom radiusi ortadi
• Elektromanfiylik kamayadi
• Metall xossalari kuchayadi
• Metallmas xossalari susayadi

MUHIM QOIDALAR:
• Guruh nomeri = tashqi qavatdagi elektronlar soni (A guruh uchun)
• Davr nomeri = elektronlar qavatlar soni
• A guruh – asosiy guruh elementlari (s va p elementlar)
• B guruh – yonaki guruh elementlari (d elementlar)', 2),

('b2000000-0000-0000-0000-000000000002', 'Kimyoviy bog''lanish', 
'KIMYOVIY BOG''LANISH – atomlarni molekulada yoki kristallda birlashtiruvchi kuch.

BOG''LANISH TURLARI:

1. KOVALENT BOG''LANISH – atomlar orasida elektron juftlarining umumiylashuvi
   • Qutbsiz kovalent: H₂, O₂, N₂, Cl₂ (bir xil atomlar)
   • Qutbli kovalent: HCl, H₂O, NH₃ (turli xil atomlar)
   
2. ION BOG''LANISH – elektronning to''liq ko''chishi
   • Metall + metallmas: Na⁺Cl⁻, Ca²⁺O²⁻
   • Elektromanfiylik farqi > 1.7

3. METALL BOG''LANISH – metallar kristallarida
   • Elektronlar "gazi" – erkin harakatlanuvchi elektronlar
   • Elektr va issiqlik o''tkazuvchanlik sababi

4. VODOROD BOG''LANISH – H atomi orqali molekulalar orasidagi bog''lanish
   • H₂O, NH₃, HF da kuchli
   • Suvning yuqori qaynash harorati sababi

KRISTALL PANJARALAR:
• Ion panjara: NaCl – yuqori suyuqlanish t°
• Molekulyar panjara: muz, yod – past suyuqlanish t°
• Atom panjara: olmos, SiO₂ – juda qattiq
• Metall panjara: metallar – elektr o''tkazadi', 3),

('b2000000-0000-0000-0000-000000000002', 'Oksidlanish-qaytarilish reaksiyalari', 
'OQR – elektronlar ko''chishi bilan boradigan reaksiyalar.

ASOSIY TUSHUNCHALAR:
• OKSIDLANISH – elektronlar yo''qotish (oks.darajasi ortadi)
• QAYTARILISH – elektronlar olish (oks.darajasi kamayadi)
• OKSIDLOVCHI – elektron oluvchi, o''zi qaytariladi
• QAYTARUVCHI – elektron beruvchi, o''zi oksidlanadi

KUCHLI OKSIDLOVCHILAR:
• F₂, Cl₂, Br₂, O₂
• Kons. HNO₃, kons. H₂SO₄
• KMnO₄, K₂Cr₂O₇

KUCHLI QAYTARUVCHILAR:
• Faol metallar: Na, K, Ca, Mg, Al, Zn
• H₂S, SO₂, HI
• C, CO

OQR TENGLAMASINI TUZISH (Elektron balans usuli):
1. Oksidlanish darajalarini aniqlash
2. O''zgargan elementlarni topish
3. Elektron balansni tuzish
4. Koeffitsiyentlarni qo''yish

MISOL: Fe + CuSO₄ → FeSO₄ + Cu
Fe⁰ - 2e → Fe²⁺ (oksidlanish)
Cu²⁺ + 2e → Cu⁰ (qaytarilish)', 4),

('b2000000-0000-0000-0000-000000000002', 'Eritmalar', 
'ERITMA – ikki yoki undan ortiq moddaning bir-jinsli aralashmasi.

ERITMA TARKIBI:
• Erituvchi (ko''p miqdorda) – odatda suv
• Erigan modda (kam miqdorda)

KONSENTRATSIYA TURLARI:

1. MASSA ULUSHI (w):
   w = (m_eritilgan / m_eritma) × 100%

2. MOLYAR KONSENTRATSIYA (C):
   C = n / V [mol/L]

3. MOLYAL KONSENTRATSIYA (Cm):
   Cm = n / m_erituvchi [mol/kg]

4. NORMAL KONSENTRATSIYA (N):
   N = n_ekv / V [ekv/L]

ERUVCHANLIK – ma''lum haroratda erituvchida erishi mumkin bo''lgan moddaning maksimal miqdori.

SUVNING QATTIQLIGI:
• Ca²⁺ va Mg²⁺ tuzlari sababli
• Vaqtinchalik qattiqlik: Ca(HCO₃)₂ – qaynatish bilan yo''qotiladi
• Doimiy qattiqlik: CaSO₄ – kimyoviy usulda yo''qotiladi

GIDROLIZ – tuzlarning suv bilan o''zaro ta''siri natijasida kislotali yoki ishqoriy muhit hosil bo''lishi.', 5),

('b2000000-0000-0000-0000-000000000002', 'Kimyoviy termodinamika', 
'TERMODINAMIK TUSHUNCHALAR:

ICHKI ENERGIYA (U) – sistema zarrachalarining jami energiyasi
ENTALPIYA (H) – sistema ichki energiyasi va bosim ishining yig''indisi: H = U + pV
ENTROPIYA (S) – sistemadagi tartibsizlik o''lchovi
GIBBS ENERGIYASI (G) – sistema erkin energiyasi: G = H - TS

ISSIQLIK EFFEKTI (Q):
• Ekzotermik reaksiya: Q > 0, issiqlik ajraladi
• Endotermik reaksiya: Q < 0, issiqlik yutiladi

GESS QONUNI:
"Reaksiyaning issiqlik effekti faqat boshlang''ich va oxirgi holatga bog''liq, oraliq bosqichlarga bog''liq emas."

TERMOKIMYOVIY TENGLAMALAR:
C + O₂ = CO₂ + 393 kJ/mol (ekzotermik)
N₂ + O₂ = 2NO - 180 kJ/mol (endotermik)

REAKSIYA YO''NALISHI:
• ΔG < 0 – reaksiya o''z-o''zidan boradi
• ΔG > 0 – reaksiya o''z-o''zidan bormaydi
• ΔG = 0 – muvozanat holati', 6),

('b2000000-0000-0000-0000-000000000002', 'Kimyoviy kinetika', 
'REAKSIYA TEZLIGI – birlik vaqtda moddalar konsentratsiyasining o''zgarishi.

v = ΔC / Δt [mol/(L·s)]

TA''SIR ETUVCHI OMILLAR:

1. KONSENTRATSIYA:
   Massa ta''sir qonuni: v = k·[A]ᵃ·[B]ᵇ
   k – tezlik konstantasi

2. HARORAT:
   Vant-Goff qoidasi: harorat har 10°C ga ortganda tezlik 2-4 marta ortadi
   vₜ₂ = vₜ₁ · γ^((t₂-t₁)/10)

3. KATALIZATOR:
   • Faollanish energiyasini kamaytiradi
   • O''zi reaksiyada sarflanmaydi
   • Musbat katalizator – tezlashtiradi
   • Manfiy katalizator (ingibitor) – sekinlashtiradi

4. ZARRACHALAR SIRT MAYDONI:
   Qattiq moddalar maydalansa, reaksiya tezlashadi

FAOLLANISH ENERGIYASI (Ea):
Reaksiya boshlashi uchun zarur bo''lgan minimal energiya

KIMYOVIY MUVOZANAT:
To''g''ri va teskari reaksiyalar tezliklari tenglashganda
Kc = [mahsulotlar] / [reagentlar]

LE-SHATELYE PRINSIPI:
Sistema muvozanatga ta''sir ko''rsatilsa, muvozanat bu ta''sirni kamaytirish tomonga siljiydi.', 7),

('b2000000-0000-0000-0000-000000000002', 'Elektrokimyo', 
'ELEKTROKIMYOVIY JARAYONLAR:

STANDART ELEKTROD POTENSIALI (E°):
• Metallning ionlarga aylanish qobiliyati
• Li = -3.04V (eng faol) ... Au = +1.50V (eng nofaol)
• Kuchlanishlar qatori: Li, K, Ca, Na, Mg, Al, Zn, Fe, Ni, Sn, Pb, H₂, Cu, Ag, Pt, Au

GALVANIK ELEMENT:
• Kimyoviy energiyani elektr energiyasiga aylantiradi
• Anod (-): oksidlanish, elektron beradi
• Katod (+): qaytarilish, elektron oladi
• EYuK = E°(katod) - E°(anod)

ELEKTROLIZ:
• Elektr energiyasini kimyoviy energiyaga aylantiradi
• Katodda: kationlar qaytariladi (metallar ajraladi)
• Anodda: anionlar oksidlanadi

FARADEY QONUNLARI:
1. m = k·I·t (ajralgan modda massasi tokga va vaqtga proporsional)
2. m = (M·I·t)/(n·F) 
   F = 96500 Kl/mol (Faradey soni)

KORROZIYA:
• Metalllarning muhit ta''sirida buzilishi
• Kimyoviy korroziya: to''g''ridan-to''g''ri oksidlanish
• Elektrokimyoviy korroziya: galvanik juftlik hosil bo''lish

KORROZIYADAN HIMOYA:
• Qoplama: bo''yash, galvanizlash
• Protektorli himoya: faolroq metall ulanadi
• Ingibitorlar: muhitga qo''shiladi', 8);

-- 3-QISM chapters  
INSERT INTO book_chapters (book_id, title, content, order_num) VALUES
('b3000000-0000-0000-0000-000000000003', 'Nodir gazlar', 
'NODIR (INERT) GAZLAR – VIII A guruh elementlari: He, Ne, Ar, Kr, Xe, Rn

XUSUSIYATLARI:
• Tashqi qavati to''la to''ldirilgan (s²p⁶ yoki He uchun s²)
• Juda kam reaktiv
• Rangsiz, hidsiz gazlar
• Tabiatda erkin holda mavjud

GELIY (He):
• Eng yengil nodir gaz
• Quyoshda ko''p miqdorda
• Aerostatlarda, suyuqlantirilgan gazlarda

NEON (Ne):
• Reklama yoritgichlarida (qizil rang)
• Lazer texnikasida

ARGON (Ar):
• Havoda eng ko''p (0.93%)
• Payvandlashda himoya gazi
• Lampochkalarda

KRIPTON (Kr), KSENON (Xe):
• Kam tarqalgan
• Xe ba''zi ftor birikmalari hosil qiladi: XeF₂, XeF₄

RADON (Rn):
• Radioaktiv
• Yer po''stida uran parchalanishidan hosil', 1),

('b3000000-0000-0000-0000-000000000003', 'Galogenlar', 
'GALOGENLAR – VII A guruh elementlari: F, Cl, Br, I, At

UMUMIY XUSUSIYAT:
• Tashqi qavatda 7 ta elektron (ns²np⁵)
• Kuchli oksidlovchilar
• -1 oksidlanish darajasida tuzlar hosil qiladi

FTOR (F₂):
• Eng kuchli oksidlovchi
• Sariq-yashil gaz, juda zaharli
• Suv bilan: 2F₂ + 2H₂O → 4HF + O₂
• Ftoroplastlar, frenonlar ishlab chiqarishda

XLOR (Cl₂):
• Sariq-yashil gaz, bo''g''uvchi hidi
• Suv bilan: Cl₂ + H₂O ⇌ HCl + HClO
• Ishqor bilan: Cl₂ + 2NaOH → NaCl + NaClO + H₂O
• Suvni zararsizlantirish, oqartirish, PVC ishlab chiqarish

XLOR BIRIKMALARI:
• HCl – xlorid kislota (oshqozon shirasi tarkibida)
• NaCl – osh tuzi
• CaOCl₂ – oqartiruvchi ohak

BROM (Br₂):
• Qizil-jigarrang suyuqlik
• Dori-darmonlar, bo''yoqlar ishlab chiqarishda

YOD (I₂):
• Qora-binafsha kristallar
• Sublimatsiyalanadi
• Tibbiyotda antiseptik (yod tinkturasi)
• Qalqonsimon bez uchun zarur', 2),

('b3000000-0000-0000-0000-000000000003', 'Kislorod va oltingugurt', 
'KISLOROD (O₂):
• Havoning 21% ni tashkil qiladi
• Yonish va nafas olish uchun zarur
• Sanoatda: suyuq havo fraktsiyalash
• Laboratoriyada: 2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑

OZON (O₃):
• Kislorodning allotropik shakli
• Kuchli oksidlovchi
• Atmosferada UV nurlardan himoya
• O₃ → O₂ + O (faol kislorod)

OLTINGUGURT (S):
• Sariq kristall modda
• Vulqonlar atrofida tabiatda mavjud
• Allotropiyasi: rombik va monoklin

OLTINGUGURT BIRIKMALARI:

H₂S – vodorod sulfid:
• Rangsiz, chirigan tuxum hidli gaz
• Zaharli, kuchli qaytaruvchi
• 2H₂S + O₂ → 2S + 2H₂O

SO₂ – oltingugurt dioksid:
• Rangsiz, o''tkir hidli gaz
• SO₂ + H₂O → H₂SO₃ (sulfat kislota)

SO₃ – oltingugurt trioksid:
• Rangsiz kristall
• SO₃ + H₂O → H₂SO₄ (sulfat kislota)

H₂SO₄ – sulfat kislota:
• "Kimyoning qoni"
• Suvgir modda
• Metallar bilan: Zn + H₂SO₄(suy) → ZnSO₄ + H₂↑
• Konsentrlangani bilan: Cu + 2H₂SO₄(kons) → CuSO₄ + SO₂ + 2H₂O', 3),

('b3000000-0000-0000-0000-000000000003', 'Azot va fosfor', 
'AZOT (N₂):
• Havoning 78% ni tashkil qiladi
• Uch kovalent bog'' (N≡N) – juda mustahkam
• Kimyoviy jihatdan kam faol

AZOT BIRIKMALARI:

NH₃ – ammiak:
• Rangsiz, o''tkir hidli gaz
• Suvda yaxshi eriydi: NH₃ + H₂O ⇌ NH₄OH
• Kislota bilan: NH₃ + HCl → NH₄Cl
• O''g''it (ammiakli selitra) ishlab chiqarishda

AZOT OKSIDLARI:
• N₂O – kulgu gazi (anesteziyada)
• NO – rangsiz gaz, havoda oksidlanadi
• NO₂ – qo''ng''ir gaz, zaharli

HNO₃ – nitrat kislota:
• Kuchli oksidlovchi
• Suyultirilgani: 3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 2NO + 4H₂O
• Konsentrlangani: Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O

FOSFOR (P):
• Allotropiyasi: oq, qizil, qora fosfor
• Oq P – zaharli, havoda o''z-o''zidan yonadi
• Qizil P – barqaror, gugurt boshchasida

FOSFOR BIRIKMALARI:
• H₃PO₄ – ortofosfat kislota (o''g''itlarda)
• P₂O₅ – kuchli suvyutuvchi
• Ca₃(PO₄)₂ – fosforit rudasi', 4),

('b3000000-0000-0000-0000-000000000003', 'Uglerod va kremniy', 
'UGLEROD (C):
ALLOTROPIK SHAKLLARI:
• Olmos – eng qattiq, shaffof kristall
• Grafit – yumshoq, qora, elektr o''tkazadi
• Fulleren – C₆₀ molekulasi (futbol to''pi shakl)
• Grafen – bir atom qalinlikdagi grafit qatlami

UGLEROD BIRIKMALARI:

CO – uglerod monoksid:
• Rangsiz, hidsiz, juda zaharli gaz
• Kuchli qaytaruvchi: Fe₂O₃ + 3CO → 2Fe + 3CO₂

CO₂ – uglerod dioksid:
• Rangsiz gaz, o''zida yonmaydi
• CO₂ + H₂O ⇌ H₂CO₃ (karbonat kislota)
• Qattiq holati – "quruq muz"
• Issiqxona effektiga sabab

H₂CO₃ – karbonat kislota:
• Kuchsiz, beqaror kislota
• Karbonatlar – CaCO₃ (ohaktosh, marmar)

KREMNIY (Si):
• Yer po''stidagi ikkinchi element (28%)
• Yarim o''tkazgich
• Kompyuter chiplari asosi

SiO₂ – kremniy dioksid:
• Qum, kvars, shisha tarkibida
• Silikat sanoati asosi

SILIKATLAR:
• Na₂SiO₃ – suyuq shisha
• Sement, shisha, keramika ishlab chiqarish', 5),

('b3000000-0000-0000-0000-000000000003', 'Metallar', 
'METALLARNING UMUMIY XOSSALARI:
• Metall yaltiroq
• Elektr va issiqlik o''tkazuvchanlik
• Bolg''alanish, cho''zilish
• Yuqori suyuqlanish harorati (Hg dan tashqari)

METALLAR FAOLLIK QATORI:
Li, K, Ca, Na, Mg, Al, Zn, Fe, Ni, Sn, Pb, H₂, Cu, Hg, Ag, Pt, Au
(faollikdan nofaollikka)

QOIDALAR:
• H₂ dan chapdagi metallar suvdan vodorod siqib chiqaradi
• H₂ dan chapdagi metallar suyultirilgan kislotalardan H₂ siqib chiqaradi
• Faolroq metall kamroq faol metalni tuz eritmasidan siqib chiqaradi

METALLURGIYA:
• Pirometallurgiya: yuqori haroratda qaytarish
  Fe₂O₃ + 3CO → 2Fe + 3CO₂ (domna pechi)
• Gidrometallurgiya: eritmadan ajratish
• Elektrometallurgiya: elektroliz yo''li bilan

QOTISHMALAR:
• Po''lat: Fe + C (0.3-2%)
• Bronza: Cu + Sn
• Latun: Cu + Zn
• Duralyumin: Al + Cu + Mg + Mn', 6),

('b3000000-0000-0000-0000-000000000003', 'Ishqoriy va ishqoriy-yer metallar', 
'ISHQORIY METALLAR – I A guruh: Li, Na, K, Rb, Cs, Fr
• Tashqi qavatda 1 ta elektron (ns¹)
• Eng faol metallar
• Yumshoq, yengil, past suyuqlanish t°

NATRIY (Na):
• Kumushrang yumshoq metall
• Suv bilan: 2Na + 2H₂O → 2NaOH + H₂↑
• Havoda tez oksidlanadi
• Kerosin ostida saqlanadi

NATRIY BIRIKMALARI:
• NaCl – osh tuzi
• NaOH – o''yuvchi natriy (sovun ishlab chiqarish)
• Na₂CO₃ – soda (shisha ishlab chiqarish)
• NaHCO₃ – iste''mol sodasi

KALIY (K):
• Natriydan faolroq
• O''g''itlarda muhim (KCl, K₂SO₄)

ISHQORIY-YER METALLAR – II A guruh: Be, Mg, Ca, Sr, Ba, Ra
• Tashqi qavatda 2 ta elektron (ns²)
• Ishqoriy metallardan kamroq faol

KALSIY (Ca):
• Ca + 2H₂O → Ca(OH)₂ + H₂↑
• CaO – so''ndirilmagan ohak
• Ca(OH)₂ – so''ndirilgan ohak
• CaCO₃ – ohaktosh, marmar
• CaSO₄·2H₂O – gips

MAGNIY (Mg):
• Yengil metall, qotishmalarda (duralyumin)
• Yonganida yorqin oq nur chiqaradi', 7),

('b3000000-0000-0000-0000-000000000003', 'Temir va uning birikmalari', 
'TEMIR (Fe):
• Eng ko''p ishlatiladigan metall
• Atom nomeri 26, massa 56
• d-element, VIII B guruh

TEMIRNING FIZIKAVIY XOSSALARI:
• Kumushrang metall
• Magnetga tortiladi
• Suyuqlanish t° = 1539°C

TEMIRNING KIMYOVIY XOSSALARI:

1. Metallmaslar bilan:
   • 2Fe + 3Cl₂ → 2FeCl₃
   • 4Fe + 3O₂ → 2Fe₂O₃ (zang)
   • Fe + S → FeS

2. Suv bilan:
   • 3Fe + 4H₂O → Fe₃O₄ + 4H₂ (yuqori t°)

3. Kislotalar bilan:
   • Fe + H₂SO₄(suy) → FeSO₄ + H₂↑
   • Fe + 2HCl → FeCl₂ + H₂↑

TEMIR BIRIKMALARI:

Fe(II) – temir(II) birikmalari:
• FeO – qora
• Fe(OH)₂ – oq, havoda oksidlanadi
• FeSO₄ – yashil kuporos

Fe(III) – temir(III) birikmalari:
• Fe₂O₃ – qizil-jigarrang (gematit)
• Fe(OH)₃ – qo''ng''ir cho''kma
• FeCl₃ – jigarrang kristall

CHO''YAN VA PO''LAT:
• Cho''yan: 2-4% C, qattiq, mo''rt
• Po''lat: 0.3-2% C, mustahkam, egiluvchan
• Zanglamaydigan po''lat: Cr va Ni qo''shimchasi', 8);

-- Add chapter questions for each chapter
-- 1-QISM questions
INSERT INTO chapter_questions (chapter_id, question_text, correct_answer, explanation, order_num) VALUES
((SELECT id FROM book_chapters WHERE title = 'Kirish. Kimyoning asosiy tushunchalari' LIMIT 1), 
'Moddaning eng kichik va mustaqil mavjud bo''la oladigan zarrachasi nima deyiladi?', 
'Molekula', 
'Molekula moddaning barcha xossalarini o''zida saqlaydi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kirish. Kimyoning asosiy tushunchalari' LIMIT 1),
'Hozirda tabiatda nechta kimyoviy element mavjud?',
'89 ta',
'110 ta element ma''lum, 89 tasi tabiatda, qolganlari sun''iy.', 2),

((SELECT id FROM book_chapters WHERE title = 'Atom va uning tarkibi' LIMIT 1),
'Izotoplar nima bilan farqlanadi?',
'Neytronlar soni bilan',
'Izotoplarda protonlar soni bir xil, neytronlar soni farqli.', 1),

((SELECT id FROM book_chapters WHERE title = 'Valentlik va oksidlanish darajasi' LIMIT 1),
'Oddiy moddalarda oksidlanish darajasi nimaga teng?',
'0',
'Oddiy moddalarda atomlar elektron almashgan emas.', 1),

((SELECT id FROM book_chapters WHERE title = 'Mol va Avogadro qonuni' LIMIT 1),
'1 mol gazning normal sharoitdagi hajmi qancha?',
'22.4 litr',
'Bu molyar hajm deyiladi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Oksidlar' LIMIT 1),
'CaO qaysi oksidlar turkumiga kiradi?',
'Asosli oksid',
'Metall oksidlari asosli oksidlar hisoblanadi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Asoslar' LIMIT 1),
'Fenolftalein ishqoriy muhitda qanday rang oladi?',
'Pushti (malina)',
'Ishqorlar indikatorlar rangini o''zgartiradi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kislotalar' LIMIT 1),
'Qaysi kislota kuchsiz hisoblanadi?',
'H₂CO₃',
'Karbonat kislota kuchsiz kislotalar qatoriga kiradi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Tuzlar' LIMIT 1),
'NaHCO₃ qaysi tuzlar turkumiga kiradi?',
'Nordon tuz',
'Tarkibida vodorod atomi bor.', 1);

-- 2-QISM questions
INSERT INTO chapter_questions (chapter_id, question_text, correct_answer, explanation, order_num) VALUES
((SELECT id FROM book_chapters WHERE title = 'Atom tuzilishi' LIMIT 1),
'p-orbital qanday shaklga ega?',
'Gantel (dumaloq sakkizlik)',
'p-orbital ikki bo''lakli shakl.', 1),

((SELECT id FROM book_chapters WHERE title = 'Davriy qonun va Mendeleyev jadvali' LIMIT 1),
'Davrda chapdan o''ngga elektromanfiylik qanday o''zgaradi?',
'Ortadi',
'Atom radiusi kichrayishi sababli.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kimyoviy bog''lanish' LIMIT 1),
'H₂O da qanday bog''lanish mavjud?',
'Qutbli kovalent',
'Turli atomlar orasida kovalent bog''.', 1),

((SELECT id FROM book_chapters WHERE title = 'Oksidlanish-qaytarilish reaksiyalari' LIMIT 1),
'Oksidlanish jarayonida nima sodir bo''ladi?',
'Elektronlar yo''qotiladi',
'Oksidlanish darajasi ortadi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Eritmalar' LIMIT 1),
'Molyar konsentratsiya qanday o''lchanadi?',
'mol/L',
'C = n/V formulasi bo''yicha.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kimyoviy termodinamika' LIMIT 1),
'Ekzotermik reaksiyada nima sodir bo''ladi?',
'Issiqlik ajraladi',
'Q > 0 bo''ladi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kimyoviy kinetika' LIMIT 1),
'Katalizator reaksiya tezligini qanday oshiradi?',
'Faollanish energiyasini kamaytiradi',
'Katalizator o''zi sarflanmaydi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Elektrokimyo' LIMIT 1),
'Galvanik elementda katodda qanday jarayon boradi?',
'Qaytarilish',
'Katod musbat qutb, elektron oladi.', 1);

-- 3-QISM questions
INSERT INTO chapter_questions (chapter_id, question_text, correct_answer, explanation, order_num) VALUES
((SELECT id FROM book_chapters WHERE title = 'Nodir gazlar' LIMIT 1),
'Havoda qaysi nodir gaz eng ko''p?',
'Argon',
'Havoda 0.93% argon mavjud.', 1),

((SELECT id FROM book_chapters WHERE title = 'Galogenlar' LIMIT 1),
'Eng kuchli oksidlovchi galogen qaysi?',
'Ftor (F₂)',
'Ftor barcha galogenlardan faol.', 1),

((SELECT id FROM book_chapters WHERE title = 'Kislorod va oltingugurt' LIMIT 1),
'H₂SO₄ konsentrlangan kislota mis bilan qanday mahsulot beradi?',
'SO₂ gazi ajraladi',
'Cu + 2H₂SO₄(kons) → CuSO₄ + SO₂ + 2H₂O', 1),

((SELECT id FROM book_chapters WHERE title = 'Azot va fosfor' LIMIT 1),
'Havoning necha foizini azot tashkil qiladi?',
'78%',
'Azot havoning asosiy qismi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Uglerod va kremniy' LIMIT 1),
'Olmosning allotropik shakli qaysi elementga tegishli?',
'Uglerod (C)',
'Olmos, grafit, fulleren – uglerod shakllari.', 1),

((SELECT id FROM book_chapters WHERE title = 'Metallar' LIMIT 1),
'Kuchlanishlar qatorida vodoroddan chapdagi metallar suvdan nimani siqib chiqaradi?',
'Vodorodni',
'Faol metallar suv bilan reaksiyaga kirishadi.', 1),

((SELECT id FROM book_chapters WHERE title = 'Ishqoriy va ishqoriy-yer metallar' LIMIT 1),
'Natriy qaysi suyuqlik ostida saqlanadi?',
'Kerosin',
'Havoda tez oksidlanishi uchun.', 1),

((SELECT id FROM book_chapters WHERE title = 'Temir va uning birikmalari' LIMIT 1),
'Po''latda uglerod necha foiz bo''ladi?',
'0.3-2%',
'Cho''yanda 2-4% uglerod.', 1);