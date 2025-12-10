// KIMYO BILIMLAR BAZASI - HAMMA KERAKLI MA'LUMOTLAR

// ==================== ELEMENTLAR VA ATOM MASSALARI ====================
export const elements: Record<string, { name: string; mass: number; symbol: string; number: number; group: string }> = {
  H: { name: "Vodorod", mass: 1.008, symbol: "H", number: 1, group: "Nometall" },
  He: { name: "Geliy", mass: 4.003, symbol: "He", number: 2, group: "Inert gaz" },
  Li: { name: "Litiy", mass: 6.94, symbol: "Li", number: 3, group: "Ishqoriy metall" },
  Be: { name: "Berilliy", mass: 9.012, symbol: "Be", number: 4, group: "Ishqoriy-yer metall" },
  B: { name: "Bor", mass: 10.81, symbol: "B", number: 5, group: "Metalloid" },
  C: { name: "Uglerod", mass: 12.011, symbol: "C", number: 6, group: "Nometall" },
  N: { name: "Azot", mass: 14.007, symbol: "N", number: 7, group: "Nometall" },
  O: { name: "Kislorod", mass: 15.999, symbol: "O", number: 8, group: "Nometall" },
  F: { name: "Ftor", mass: 18.998, symbol: "F", number: 9, group: "Galogen" },
  Ne: { name: "Neon", mass: 20.18, symbol: "Ne", number: 10, group: "Inert gaz" },
  Na: { name: "Natriy", mass: 22.99, symbol: "Na", number: 11, group: "Ishqoriy metall" },
  Mg: { name: "Magniy", mass: 24.305, symbol: "Mg", number: 12, group: "Ishqoriy-yer metall" },
  Al: { name: "Alyuminiy", mass: 26.982, symbol: "Al", number: 13, group: "Metall" },
  Si: { name: "Kremniy", mass: 28.086, symbol: "Si", number: 14, group: "Metalloid" },
  P: { name: "Fosfor", mass: 30.974, symbol: "P", number: 15, group: "Nometall" },
  S: { name: "Oltingugurt", mass: 32.06, symbol: "S", number: 16, group: "Nometall" },
  Cl: { name: "Xlor", mass: 35.45, symbol: "Cl", number: 17, group: "Galogen" },
  Ar: { name: "Argon", mass: 39.948, symbol: "Ar", number: 18, group: "Inert gaz" },
  K: { name: "Kaliy", mass: 39.098, symbol: "K", number: 19, group: "Ishqoriy metall" },
  Ca: { name: "Kalsiy", mass: 40.078, symbol: "Ca", number: 20, group: "Ishqoriy-yer metall" },
  Sc: { name: "Skandiy", mass: 44.956, symbol: "Sc", number: 21, group: "O'tish metall" },
  Ti: { name: "Titan", mass: 47.867, symbol: "Ti", number: 22, group: "O'tish metall" },
  V: { name: "Vanadiy", mass: 50.942, symbol: "V", number: 23, group: "O'tish metall" },
  Cr: { name: "Xrom", mass: 51.996, symbol: "Cr", number: 24, group: "O'tish metall" },
  Mn: { name: "Marganes", mass: 54.938, symbol: "Mn", number: 25, group: "O'tish metall" },
  Fe: { name: "Temir", mass: 55.845, symbol: "Fe", number: 26, group: "O'tish metall" },
  Co: { name: "Kobalt", mass: 58.933, symbol: "Co", number: 27, group: "O'tish metall" },
  Ni: { name: "Nikel", mass: 58.693, symbol: "Ni", number: 28, group: "O'tish metall" },
  Cu: { name: "Mis", mass: 63.546, symbol: "Cu", number: 29, group: "O'tish metall" },
  Zn: { name: "Rux", mass: 65.38, symbol: "Zn", number: 30, group: "O'tish metall" },
  Ga: { name: "Galliy", mass: 69.723, symbol: "Ga", number: 31, group: "Metall" },
  Ge: { name: "Germaniy", mass: 72.63, symbol: "Ge", number: 32, group: "Metalloid" },
  As: { name: "Margimush", mass: 74.922, symbol: "As", number: 33, group: "Metalloid" },
  Se: { name: "Selen", mass: 78.971, symbol: "Se", number: 34, group: "Nometall" },
  Br: { name: "Brom", mass: 79.904, symbol: "Br", number: 35, group: "Galogen" },
  Kr: { name: "Kripton", mass: 83.798, symbol: "Kr", number: 36, group: "Inert gaz" },
  Rb: { name: "Rubidiy", mass: 85.468, symbol: "Rb", number: 37, group: "Ishqoriy metall" },
  Sr: { name: "Stronsiy", mass: 87.62, symbol: "Sr", number: 38, group: "Ishqoriy-yer metall" },
  Y: { name: "Ittriy", mass: 88.906, symbol: "Y", number: 39, group: "O'tish metall" },
  Zr: { name: "Sirkoniy", mass: 91.224, symbol: "Zr", number: 40, group: "O'tish metall" },
  Nb: { name: "Niobiy", mass: 92.906, symbol: "Nb", number: 41, group: "O'tish metall" },
  Mo: { name: "Molibden", mass: 95.95, symbol: "Mo", number: 42, group: "O'tish metall" },
  Ru: { name: "Ruteniy", mass: 101.07, symbol: "Ru", number: 44, group: "O'tish metall" },
  Rh: { name: "Rodiy", mass: 102.91, symbol: "Rh", number: 45, group: "O'tish metall" },
  Pd: { name: "Palladiy", mass: 106.42, symbol: "Pd", number: 46, group: "O'tish metall" },
  Ag: { name: "Kumush", mass: 107.87, symbol: "Ag", number: 47, group: "O'tish metall" },
  Cd: { name: "Kadmiy", mass: 112.41, symbol: "Cd", number: 48, group: "O'tish metall" },
  In: { name: "Indiy", mass: 114.82, symbol: "In", number: 49, group: "Metall" },
  Sn: { name: "Qalay", mass: 118.71, symbol: "Sn", number: 50, group: "Metall" },
  Sb: { name: "Surma", mass: 121.76, symbol: "Sb", number: 51, group: "Metalloid" },
  Te: { name: "Tellur", mass: 127.6, symbol: "Te", number: 52, group: "Metalloid" },
  I: { name: "Yod", mass: 126.9, symbol: "I", number: 53, group: "Galogen" },
  Xe: { name: "Ksenon", mass: 131.29, symbol: "Xe", number: 54, group: "Inert gaz" },
  Cs: { name: "Seziy", mass: 132.91, symbol: "Cs", number: 55, group: "Ishqoriy metall" },
  Ba: { name: "Bariy", mass: 137.33, symbol: "Ba", number: 56, group: "Ishqoriy-yer metall" },
  La: { name: "Lantan", mass: 138.91, symbol: "La", number: 57, group: "Lantanoid" },
  Ce: { name: "Seriy", mass: 140.12, symbol: "Ce", number: 58, group: "Lantanoid" },
  Hf: { name: "Gafniy", mass: 178.49, symbol: "Hf", number: 72, group: "O'tish metall" },
  Ta: { name: "Tantal", mass: 180.95, symbol: "Ta", number: 73, group: "O'tish metall" },
  W: { name: "Volfram", mass: 183.84, symbol: "W", number: 74, group: "O'tish metall" },
  Re: { name: "Reniy", mass: 186.21, symbol: "Re", number: 75, group: "O'tish metall" },
  Os: { name: "Osmiy", mass: 190.23, symbol: "Os", number: 76, group: "O'tish metall" },
  Ir: { name: "Iridiy", mass: 192.22, symbol: "Ir", number: 77, group: "O'tish metall" },
  Pt: { name: "Platina", mass: 195.08, symbol: "Pt", number: 78, group: "O'tish metall" },
  Au: { name: "Oltin", mass: 196.97, symbol: "Au", number: 79, group: "O'tish metall" },
  Hg: { name: "Simob", mass: 200.59, symbol: "Hg", number: 80, group: "O'tish metall" },
  Tl: { name: "Talliy", mass: 204.38, symbol: "Tl", number: 81, group: "Metall" },
  Pb: { name: "Qo'rg'oshin", mass: 207.2, symbol: "Pb", number: 82, group: "Metall" },
  Bi: { name: "Vismut", mass: 208.98, symbol: "Bi", number: 83, group: "Metall" },
  Ra: { name: "Radiy", mass: 226, symbol: "Ra", number: 88, group: "Ishqoriy-yer metall" },
  U: { name: "Uran", mass: 238.03, symbol: "U", number: 92, group: "Aktinoid" },
};

// ==================== UMUMIY FORMULALAR VA BIRIKMALAR ====================
export const compounds: Record<string, { name: string; formula: string; molarMass: number; type: string }> = {
  "H2O": { name: "Suv", formula: "H₂O", molarMass: 18.015, type: "Oksid" },
  "H2": { name: "Vodorod", formula: "H₂", molarMass: 2.016, type: "Gaz" },
  "O2": { name: "Kislorod", formula: "O₂", molarMass: 32, type: "Gaz" },
  "N2": { name: "Azot", formula: "N₂", molarMass: 28.014, type: "Gaz" },
  "CO2": { name: "Karbonat angidrid", formula: "CO₂", molarMass: 44.01, type: "Oksid" },
  "CO": { name: "Uglerod oksid", formula: "CO", molarMass: 28.01, type: "Oksid" },
  "HCl": { name: "Xlorid kislota", formula: "HCl", molarMass: 36.46, type: "Kislota" },
  "H2SO4": { name: "Sulfat kislota", formula: "H₂SO₄", molarMass: 98.079, type: "Kislota" },
  "HNO3": { name: "Nitrat kislota", formula: "HNO₃", molarMass: 63.01, type: "Kislota" },
  "H3PO4": { name: "Fosfat kislota", formula: "H₃PO₄", molarMass: 97.994, type: "Kislota" },
  "H2CO3": { name: "Karbonat kislota", formula: "H₂CO₃", molarMass: 62.03, type: "Kislota" },
  "CH3COOH": { name: "Sirka kislota", formula: "CH₃COOH", molarMass: 60.052, type: "Organik kislota" },
  "NaOH": { name: "Natriy gidroksid", formula: "NaOH", molarMass: 40, type: "Asos" },
  "KOH": { name: "Kaliy gidroksid", formula: "KOH", molarMass: 56.11, type: "Asos" },
  "Ca(OH)2": { name: "Kalsiy gidroksid", formula: "Ca(OH)₂", molarMass: 74.093, type: "Asos" },
  "Mg(OH)2": { name: "Magniy gidroksid", formula: "Mg(OH)₂", molarMass: 58.32, type: "Asos" },
  "Ba(OH)2": { name: "Bariy gidroksid", formula: "Ba(OH)₂", molarMass: 171.34, type: "Asos" },
  "NH3": { name: "Ammiak", formula: "NH₃", molarMass: 17.031, type: "Asos" },
  "NH4OH": { name: "Ammoniy gidroksid", formula: "NH₄OH", molarMass: 35.046, type: "Asos" },
  "NaCl": { name: "Natriy xlorid (osh tuzi)", formula: "NaCl", molarMass: 58.44, type: "Tuz" },
  "KCl": { name: "Kaliy xlorid", formula: "KCl", molarMass: 74.55, type: "Tuz" },
  "CaCl2": { name: "Kalsiy xlorid", formula: "CaCl₂", molarMass: 110.98, type: "Tuz" },
  "MgCl2": { name: "Magniy xlorid", formula: "MgCl₂", molarMass: 95.21, type: "Tuz" },
  "FeCl2": { name: "Temir(II) xlorid", formula: "FeCl₂", molarMass: 126.75, type: "Tuz" },
  "FeCl3": { name: "Temir(III) xlorid", formula: "FeCl₃", molarMass: 162.2, type: "Tuz" },
  "ZnCl2": { name: "Rux xlorid", formula: "ZnCl₂", molarMass: 136.29, type: "Tuz" },
  "AlCl3": { name: "Alyuminiy xlorid", formula: "AlCl₃", molarMass: 133.34, type: "Tuz" },
  "CuCl2": { name: "Mis(II) xlorid", formula: "CuCl₂", molarMass: 134.45, type: "Tuz" },
  "Na2SO4": { name: "Natriy sulfat", formula: "Na₂SO₄", molarMass: 142.04, type: "Tuz" },
  "K2SO4": { name: "Kaliy sulfat", formula: "K₂SO₄", molarMass: 174.26, type: "Tuz" },
  "CaSO4": { name: "Kalsiy sulfat (gips)", formula: "CaSO₄", molarMass: 136.14, type: "Tuz" },
  "MgSO4": { name: "Magniy sulfat", formula: "MgSO₄", molarMass: 120.37, type: "Tuz" },
  "FeSO4": { name: "Temir(II) sulfat", formula: "FeSO₄", molarMass: 151.91, type: "Tuz" },
  "Fe2(SO4)3": { name: "Temir(III) sulfat", formula: "Fe₂(SO₄)₃", molarMass: 399.88, type: "Tuz" },
  "ZnSO4": { name: "Rux sulfat", formula: "ZnSO₄", molarMass: 161.47, type: "Tuz" },
  "CuSO4": { name: "Mis(II) sulfat", formula: "CuSO₄", molarMass: 159.61, type: "Tuz" },
  "Al2(SO4)3": { name: "Alyuminiy sulfat", formula: "Al₂(SO₄)₃", molarMass: 342.15, type: "Tuz" },
  "BaSO4": { name: "Bariy sulfat", formula: "BaSO₄", molarMass: 233.39, type: "Tuz" },
  "Na2CO3": { name: "Natriy karbonat (soda)", formula: "Na₂CO₃", molarMass: 105.99, type: "Tuz" },
  "NaHCO3": { name: "Natriy gidrokarbonat", formula: "NaHCO₃", molarMass: 84.01, type: "Tuz" },
  "K2CO3": { name: "Kaliy karbonat (potash)", formula: "K₂CO₃", molarMass: 138.21, type: "Tuz" },
  "CaCO3": { name: "Kalsiy karbonat (ohaktosh)", formula: "CaCO₃", molarMass: 100.09, type: "Tuz" },
  "MgCO3": { name: "Magniy karbonat", formula: "MgCO₃", molarMass: 84.31, type: "Tuz" },
  "BaCO3": { name: "Bariy karbonat", formula: "BaCO₃", molarMass: 197.34, type: "Tuz" },
  "NaNO3": { name: "Natriy nitrat", formula: "NaNO₃", molarMass: 84.99, type: "Tuz" },
  "KNO3": { name: "Kaliy nitrat", formula: "KNO₃", molarMass: 101.1, type: "Tuz" },
  "Ca(NO3)2": { name: "Kalsiy nitrat", formula: "Ca(NO₃)₂", molarMass: 164.09, type: "Tuz" },
  "AgNO3": { name: "Kumush nitrat", formula: "AgNO₃", molarMass: 169.87, type: "Tuz" },
  "Cu(NO3)2": { name: "Mis(II) nitrat", formula: "Cu(NO₃)₂", molarMass: 187.56, type: "Tuz" },
  "Pb(NO3)2": { name: "Qo'rg'oshin nitrat", formula: "Pb(NO₃)₂", molarMass: 331.21, type: "Tuz" },
  "Na3PO4": { name: "Natriy fosfat", formula: "Na₃PO₄", molarMass: 163.94, type: "Tuz" },
  "Ca3(PO4)2": { name: "Kalsiy fosfat", formula: "Ca₃(PO₄)₂", molarMass: 310.18, type: "Tuz" },
  "CaO": { name: "Kalsiy oksid (kuydirilgan ohak)", formula: "CaO", molarMass: 56.08, type: "Oksid" },
  "MgO": { name: "Magniy oksid", formula: "MgO", molarMass: 40.3, type: "Oksid" },
  "Na2O": { name: "Natriy oksid", formula: "Na₂O", molarMass: 61.98, type: "Oksid" },
  "K2O": { name: "Kaliy oksid", formula: "K₂O", molarMass: 94.2, type: "Oksid" },
  "Al2O3": { name: "Alyuminiy oksid", formula: "Al₂O₃", molarMass: 101.96, type: "Oksid" },
  "Fe2O3": { name: "Temir(III) oksid", formula: "Fe₂O₃", molarMass: 159.69, type: "Oksid" },
  "FeO": { name: "Temir(II) oksid", formula: "FeO", molarMass: 71.84, type: "Oksid" },
  "Fe3O4": { name: "Temir(II,III) oksid", formula: "Fe₃O₄", molarMass: 231.53, type: "Oksid" },
  "CuO": { name: "Mis(II) oksid", formula: "CuO", molarMass: 79.55, type: "Oksid" },
  "Cu2O": { name: "Mis(I) oksid", formula: "Cu₂O", molarMass: 143.09, type: "Oksid" },
  "ZnO": { name: "Rux oksid", formula: "ZnO", molarMass: 81.38, type: "Oksid" },
  "PbO": { name: "Qo'rg'oshin(II) oksid", formula: "PbO", molarMass: 223.2, type: "Oksid" },
  "SO2": { name: "Oltingugurt dioksid", formula: "SO₂", molarMass: 64.07, type: "Oksid" },
  "SO3": { name: "Oltingugurt trioksid", formula: "SO₃", molarMass: 80.06, type: "Oksid" },
  "NO": { name: "Azot oksid", formula: "NO", molarMass: 30.01, type: "Oksid" },
  "NO2": { name: "Azot dioksid", formula: "NO₂", molarMass: 46.01, type: "Oksid" },
  "N2O": { name: "Diazot oksid", formula: "N₂O", molarMass: 44.01, type: "Oksid" },
  "N2O5": { name: "Diazot pentoksid", formula: "N₂O₅", molarMass: 108.01, type: "Oksid" },
  "P2O5": { name: "Fosfor pentoksid", formula: "P₂O₅", molarMass: 141.94, type: "Oksid" },
  "Cl2": { name: "Xlor", formula: "Cl₂", molarMass: 70.9, type: "Gaz" },
  "Br2": { name: "Brom", formula: "Br₂", molarMass: 159.81, type: "Suyuqlik" },
  "I2": { name: "Yod", formula: "I₂", molarMass: 253.81, type: "Qattiq" },
  "CH4": { name: "Metan", formula: "CH₄", molarMass: 16.04, type: "Organik" },
  "C2H6": { name: "Etan", formula: "C₂H₆", molarMass: 30.07, type: "Organik" },
  "C3H8": { name: "Propan", formula: "C₃H₈", molarMass: 44.1, type: "Organik" },
  "C4H10": { name: "Butan", formula: "C₄H₁₀", molarMass: 58.12, type: "Organik" },
  "C2H4": { name: "Etilen", formula: "C₂H₄", molarMass: 28.05, type: "Organik" },
  "C3H6": { name: "Propilen", formula: "C₃H₆", molarMass: 42.08, type: "Organik" },
  "C2H2": { name: "Atsitilen", formula: "C₂H₂", molarMass: 26.04, type: "Organik" },
  "C6H6": { name: "Benzol", formula: "C₆H₆", molarMass: 78.11, type: "Organik" },
  "CH3OH": { name: "Metanol", formula: "CH₃OH", molarMass: 32.04, type: "Organik" },
  "C2H5OH": { name: "Etanol", formula: "C₂H₅OH", molarMass: 46.07, type: "Organik" },
  "HCHO": { name: "Formaldegid", formula: "HCHO", molarMass: 30.03, type: "Organik" },
  "CH3CHO": { name: "Atsetaldegid", formula: "CH₃CHO", molarMass: 44.05, type: "Organik" },
  "HCOOH": { name: "Chumoli kislota", formula: "HCOOH", molarMass: 46.03, type: "Organik" },
  "C6H12O6": { name: "Glyukoza", formula: "C₆H₁₂O₆", molarMass: 180.16, type: "Organik" },
  "C12H22O11": { name: "Saxaroza", formula: "C₁₂H₂₂O₁₁", molarMass: 342.3, type: "Organik" },
  "AgCl": { name: "Kumush xlorid", formula: "AgCl", molarMass: 143.32, type: "Tuz" },
  "AgBr": { name: "Kumush bromid", formula: "AgBr", molarMass: 187.77, type: "Tuz" },
  "AgI": { name: "Kumush yodid", formula: "AgI", molarMass: 234.77, type: "Tuz" },
  "PbCl2": { name: "Qo'rg'oshin xlorid", formula: "PbCl₂", molarMass: 278.1, type: "Tuz" },
  "PbI2": { name: "Qo'rg'oshin yodid", formula: "PbI₂", molarMass: 461.01, type: "Tuz" },
  "KMnO4": { name: "Kaliy permanganat", formula: "KMnO₄", molarMass: 158.03, type: "Tuz" },
  "K2Cr2O7": { name: "Kaliy bixromat", formula: "K₂Cr₂O₇", molarMass: 294.18, type: "Tuz" },
  "H2O2": { name: "Vodorod peroksid", formula: "H₂O₂", molarMass: 34.01, type: "Peroksid" },
  "H2S": { name: "Vodorod sulfid", formula: "H₂S", molarMass: 34.08, type: "Kislota" },
  "NH4Cl": { name: "Ammoniy xlorid", formula: "NH₄Cl", molarMass: 53.49, type: "Tuz" },
  "(NH4)2SO4": { name: "Ammoniy sulfat", formula: "(NH₄)₂SO₄", molarMass: 132.14, type: "Tuz" },
  "NH4NO3": { name: "Ammoniy nitrat", formula: "NH₄NO₃", molarMass: 80.04, type: "Tuz" },
  "KI": { name: "Kaliy yodid", formula: "KI", molarMass: 166.0, type: "Tuz" },
  "KBr": { name: "Kaliy bromid", formula: "KBr", molarMass: 119.0, type: "Tuz" },
  "NaBr": { name: "Natriy bromid", formula: "NaBr", molarMass: 102.89, type: "Tuz" },
  "NaI": { name: "Natriy yodid", formula: "NaI", molarMass: 149.89, type: "Tuz" },
  "BaCl2": { name: "Bariy xlorid", formula: "BaCl₂", molarMass: 208.23, type: "Tuz" },
  "SrCl2": { name: "Stronsiy xlorid", formula: "SrCl₂", molarMass: 158.52, type: "Tuz" },
  "FeBr3": { name: "Temir(III) bromid", formula: "FeBr₃", molarMass: 295.56, type: "Tuz" },
  "AlBr3": { name: "Alyuminiy bromid", formula: "AlBr₃", molarMass: 266.69, type: "Tuz" },
  "MnO2": { name: "Marganes dioksid", formula: "MnO₂", molarMass: 86.94, type: "Oksid" },
  "Cr2O3": { name: "Xrom(III) oksid", formula: "Cr₂O₃", molarMass: 151.99, type: "Oksid" },
  "NiO": { name: "Nikel(II) oksid", formula: "NiO", molarMass: 74.69, type: "Oksid" },
  "CoO": { name: "Kobalt(II) oksid", formula: "CoO", molarMass: 74.93, type: "Oksid" },
  "SnO2": { name: "Qalay(IV) oksid", formula: "SnO₂", molarMass: 150.71, type: "Oksid" },
  "SiO2": { name: "Kremniy dioksid (kvars)", formula: "SiO₂", molarMass: 60.08, type: "Oksid" },
};

// ==================== FIZIK KONSTANTALAR ====================
export const constants = {
  avogadro: { value: 6.022e23, unit: "mol⁻¹", name: "Avogadro soni" },
  gasConstant: { value: 8.314, unit: "J/(mol·K)", name: "Universal gaz konstantasi" },
  molarVolume: { value: 22.4, unit: "L/mol", name: "Normal sharoitda gaz molar hajmi" },
  faraday: { value: 96485, unit: "C/mol", name: "Faradey soni" },
  planck: { value: 6.626e-34, unit: "J·s", name: "Plank konstantasi" },
  lightSpeed: { value: 3e8, unit: "m/s", name: "Yorug'lik tezligi" },
  electronCharge: { value: 1.602e-19, unit: "C", name: "Elektron zaryadi" },
  protonMass: { value: 1.673e-27, unit: "kg", name: "Proton massasi" },
  electronMass: { value: 9.109e-31, unit: "kg", name: "Elektron massasi" },
  neutronMass: { value: 1.675e-27, unit: "kg", name: "Neytron massasi" },
};

// ==================== FORMULALAR ====================
export const formulas = {
  molarMass: {
    name: "Molyar massa",
    formula: "M = m/n",
    description: "M - molyar massa (g/mol), m - massa (g), n - mol soni",
    units: { M: "g/mol", m: "g", n: "mol" }
  },
  molCount: {
    name: "Mol soni",
    formula: "n = m/M = N/Nₐ = V/Vₘ",
    description: "n - mol soni, m - massa, M - molyar massa, N - zarrachalar soni, Nₐ - Avogadro soni, V - hajm, Vₘ - molar hajm",
    units: { n: "mol", m: "g", M: "g/mol", N: "ta", V: "L" }
  },
  concentration: {
    name: "Molyar konsentratsiya",
    formula: "C = n/V",
    description: "C - konsentratsiya (mol/L), n - mol soni, V - eritma hajmi (L)",
    units: { C: "mol/L", n: "mol", V: "L" }
  },
  massPercent: {
    name: "Massa ulushi",
    formula: "ω = (m₁/m₂) × 100%",
    description: "ω - massa ulushi (%), m₁ - erigan modda massasi, m₂ - eritma massasi",
    units: { ω: "%", m: "g" }
  },
  density: {
    name: "Zichlik",
    formula: "ρ = m/V",
    description: "ρ - zichlik (g/mL), m - massa, V - hajm",
    units: { ρ: "g/mL", m: "g", V: "mL" }
  },
  idealGas: {
    name: "Ideal gaz tenglamasi",
    formula: "PV = nRT",
    description: "P - bosim (Pa), V - hajm (L), n - mol soni, R - gaz konstantasi, T - harorat (K)",
    units: { P: "Pa", V: "L", n: "mol", R: "J/(mol·K)", T: "K" }
  },
  pH: {
    name: "pH hisoblash",
    formula: "pH = -log[H⁺]",
    description: "pH - vodorod ko'rsatkichi, [H⁺] - vodorod ionlari konsentratsiyasi",
    units: { pH: "", H: "mol/L" }
  },
  pOH: {
    name: "pOH hisoblash",
    formula: "pOH = -log[OH⁻], pH + pOH = 14",
    description: "pOH - gidroksid ko'rsatkichi, [OH⁻] - gidroksid ionlari konsentratsiyasi",
    units: { pOH: "", OH: "mol/L" }
  },
  dilution: {
    name: "Suyultirish",
    formula: "C₁V₁ = C₂V₂",
    description: "Suyultirish formulasi: boshlang'ich konsentratsiya va hajm = oxirgi konsentratsiya va hajm",
    units: { C: "mol/L", V: "L" }
  },
  heatCapacity: {
    name: "Issiqlik sig'imi",
    formula: "Q = mcΔT",
    description: "Q - issiqlik (J), m - massa (g), c - solishtirma issiqlik sig'imi (J/g·K), ΔT - harorat o'zgarishi (K)",
    units: { Q: "J", m: "g", c: "J/(g·K)", T: "K" }
  },
  reactionRate: {
    name: "Reaksiya tezligi",
    formula: "v = Δc/Δt",
    description: "v - reaksiya tezligi, Δc - konsentratsiya o'zgarishi, Δt - vaqt",
    units: { v: "mol/(L·s)", c: "mol/L", t: "s" }
  },
  equilibriumConstant: {
    name: "Muvozanat konstantasi",
    formula: "K = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ",
    description: "aA + bB ⇌ cC + dD reaksiyasi uchun muvozanat konstantasi",
    units: { K: "" }
  },
  electrolysisFaraday: {
    name: "Elektroliz (Faradey qonuni)",
    formula: "m = (M × I × t) / (n × F)",
    description: "m - ajralgan modda massasi, M - molyar massa, I - tok kuchi, t - vaqt, n - elektronlar soni, F - Faradey soni",
    units: { m: "g", M: "g/mol", I: "A", t: "s", F: "C/mol" }
  }
};

// ==================== MASALALAR YECHISH FUNKSIYALARI ====================

// Formula parsing - formuladagi elementlar va ularning sonini aniqlash
export function parseFormula(formula: string): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Oddiy formulani parse qilish (masalan: H2O, NaCl, H2SO4)
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  
  // Qavslarni hisobga olish
  let cleanFormula = formula.replace(/₂/g, '2').replace(/₃/g, '3').replace(/₄/g, '4')
    .replace(/₅/g, '5').replace(/₆/g, '6').replace(/₇/g, '7').replace(/₈/g, '8').replace(/₉/g, '9');
  
  // Qavsli formulalarni kengaytirish (masalan: Ca(OH)2)
  const bracketRegex = /\(([^)]+)\)(\d+)/g;
  let bracketMatch;
  while ((bracketMatch = bracketRegex.exec(cleanFormula)) !== null) {
    const innerFormula = bracketMatch[1];
    const multiplier = parseInt(bracketMatch[2]);
    let expandedPart = '';
    let innerMatch;
    const innerRegex = /([A-Z][a-z]?)(\d*)/g;
    while ((innerMatch = innerRegex.exec(innerFormula)) !== null) {
      const element = innerMatch[1];
      const count = parseInt(innerMatch[2] || '1') * multiplier;
      expandedPart += element + (count > 1 ? count : '');
    }
    cleanFormula = cleanFormula.replace(bracketMatch[0], expandedPart);
  }
  
  while ((match = regex.exec(cleanFormula)) !== null) {
    const element = match[1];
    const count = parseInt(match[2] || '1');
    if (element && elements[element]) {
      result[element] = (result[element] || 0) + count;
    }
  }
  
  return result;
}

// Molyar massa hisoblash
export function calculateMolarMass(formula: string): { mass: number; breakdown: string } {
  const composition = parseFormula(formula);
  let totalMass = 0;
  const parts: string[] = [];
  
  for (const [element, count] of Object.entries(composition)) {
    if (elements[element]) {
      const elementMass = elements[element].mass * count;
      totalMass += elementMass;
      parts.push(`${element}${count > 1 ? count : ''}: ${count} × ${elements[element].mass} = ${elementMass.toFixed(3)} g/mol`);
    }
  }
  
  return {
    mass: Math.round(totalMass * 1000) / 1000,
    breakdown: parts.join('\n')
  };
}

// Mol soni hisoblash
export function calculateMoles(mass: number, molarMass: number): number {
  return mass / molarMass;
}

// Massa hisoblash
export function calculateMass(moles: number, molarMass: number): number {
  return moles * molarMass;
}

// Konsentratsiya hisoblash
export function calculateConcentration(moles: number, volume: number): number {
  return moles / volume;
}

// pH hisoblash
export function calculatePH(hConcentration: number): number {
  return -Math.log10(hConcentration);
}

// pOH hisoblash
export function calculatePOH(ohConcentration: number): number {
  return -Math.log10(ohConcentration);
}

// Ideal gaz hajmi
export function calculateGasVolume(moles: number, temperature: number, pressure: number): number {
  // PV = nRT, V = nRT/P
  return (moles * 8.314 * temperature) / pressure;
}

// Elektroliz massasi
export function calculateElectrolysisMass(molarMass: number, current: number, time: number, electronCount: number): number {
  return (molarMass * current * time) / (electronCount * 96485);
}

// ==================== MASALA TURLARI VA YECHISH ====================
export interface ChemistrySolution {
  given: string;
  find: string;
  solution: string;
  answer: string;
  note?: string;
}

export function identifyProblemType(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('molyar massa') || lowerQ.includes('molar massa') || lowerQ.includes('molekulyar massa') || lowerQ.includes('mr') || lowerQ.includes('m(') && lowerQ.includes('=')) {
    return 'molar_mass';
  }
  if (lowerQ.includes('mol') && (lowerQ.includes('necha') || lowerQ.includes('qancha') || lowerQ.includes('toping'))) {
    return 'mole_calculation';
  }
  if (lowerQ.includes('massa') && (lowerQ.includes('necha') || lowerQ.includes('qancha') || lowerQ.includes('hosil'))) {
    return 'mass_calculation';
  }
  if (lowerQ.includes('konsentratsiya') || lowerQ.includes('molarlik')) {
    return 'concentration';
  }
  if (lowerQ.includes('ph') || lowerQ.includes('poh')) {
    return 'ph_calculation';
  }
  if (lowerQ.includes('hajm') && (lowerQ.includes('gaz') || lowerQ.includes('n.sh') || lowerQ.includes('normal sharoit'))) {
    return 'gas_volume';
  }
  if (lowerQ.includes('elektroliz')) {
    return 'electrolysis';
  }
  if (lowerQ.includes('foiz') || lowerQ.includes('%') || lowerQ.includes('ulush')) {
    return 'percent_calculation';
  }
  if (lowerQ.includes('tengla') || lowerQ.includes('reaksiya')) {
    return 'reaction_balance';
  }
  if (lowerQ.includes('zichlik') || lowerQ.includes('ρ')) {
    return 'density';
  }
  
  return 'general';
}

// Sonlarni matndan ajratib olish
export function extractNumbers(text: string): number[] {
  const numbers: number[] = [];
  const regex = /(\d+[.,]?\d*)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    numbers.push(parseFloat(match[1].replace(',', '.')));
  }
  return numbers;
}

// Formulalarni matndan ajratib olish
export function extractFormulas(text: string): string[] {
  const formulas: string[] = [];
  // Keng tarqalgan formulalar
  const formulaPatterns = [
    /[A-Z][a-z]?\d*(?:\([A-Z][a-z]?\d*\)\d*)?(?:[A-Z][a-z]?\d*)*/g,
  ];
  
  for (const pattern of formulaPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const formula = match[0];
      if (formula.length > 1 && /[A-Z]/.test(formula)) {
        formulas.push(formula);
      }
    }
  }
  
  return [...new Set(formulas)];
}
