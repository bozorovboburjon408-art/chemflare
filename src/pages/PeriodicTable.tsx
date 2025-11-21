import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Element {
  symbol: string;
  name: string;
  nameUz: string;
  atomicNumber: number;
  atomicMass: string;
  category: string;
  electrons: string;
  description: string;
}

const elements: Element[] = [
  { symbol: "H", name: "Hydrogen", nameUz: "Vodorod", atomicNumber: 1, atomicMass: "1.008", category: "nonmetal", electrons: "1", description: "Eng yengil element, yulduzlarda ko'p uchraydi" },
  { symbol: "He", name: "Helium", nameUz: "Geliy", atomicNumber: 2, atomicMass: "4.003", category: "noble", electrons: "2", description: "Inert gaz, havodagi sharlar uchun ishlatiladi" },
  { symbol: "Li", name: "Lithium", nameUz: "Litiy", atomicNumber: 3, atomicMass: "6.941", category: "alkali", electrons: "2,1", description: "Eng yengil metall, batareyalarda ishlatiladi" },
  { symbol: "Be", name: "Beryllium", nameUz: "Berilliy", atomicNumber: 4, atomicMass: "9.012", category: "alkaline", electrons: "2,2", description: "Qattiq va yengil metall" },
  { symbol: "B", name: "Boron", nameUz: "Bor", atomicNumber: 5, atomicMass: "10.81", category: "metalloid", electrons: "2,3", description: "Yarim o'tkazgich xususiyatlariga ega" },
  { symbol: "C", name: "Carbon", nameUz: "Uglerod", atomicNumber: 6, atomicMass: "12.01", category: "nonmetal", electrons: "2,4", description: "Hayot asosi, organik birikmalar tuzilishi" },
  { symbol: "N", name: "Nitrogen", nameUz: "Azot", atomicNumber: 7, atomicMass: "14.01", category: "nonmetal", electrons: "2,5", description: "Havo tarkibining 78%ini tashkil qiladi" },
  { symbol: "O", name: "Oxygen", nameUz: "Kislorod", atomicNumber: 8, atomicMass: "16.00", category: "nonmetal", electrons: "2,6", description: "Nafas olish va yonish uchun zarur" },
  { symbol: "F", name: "Fluorine", nameUz: "Ftor", atomicNumber: 9, atomicMass: "19.00", category: "halogen", electrons: "2,7", description: "Eng reaktiv element" },
  { symbol: "Ne", name: "Neon", nameUz: "Neon", atomicNumber: 10, atomicMass: "20.18", category: "noble", electrons: "2,8", description: "Reklamalarda yorug'lik uchun ishlatiladi" },
  { symbol: "Na", name: "Sodium", nameUz: "Natriy", atomicNumber: 11, atomicMass: "22.99", category: "alkali", electrons: "2,8,1", description: "Osh tuzi (NaCl) tarkibida" },
  { symbol: "Mg", name: "Magnesium", nameUz: "Magniy", atomicNumber: 12, atomicMass: "24.31", category: "alkaline", electrons: "2,8,2", description: "Yengil va mustahkam qotishmalarda" },
  { symbol: "Al", name: "Aluminum", nameUz: "Alyuminiy", atomicNumber: 13, atomicMass: "26.98", category: "metal", electrons: "2,8,3", description: "Yengil va korroziyaga chidamli" },
  { symbol: "Si", name: "Silicon", nameUz: "Kremniy", atomicNumber: 14, atomicMass: "28.09", category: "metalloid", electrons: "2,8,4", description: "Mikrochiplar va qum tarkibida" },
  { symbol: "P", name: "Phosphorus", nameUz: "Fosfor", atomicNumber: 15, atomicMass: "30.97", category: "nonmetal", electrons: "2,8,5", description: "DNK va ATP tarkibida muhim" },
  { symbol: "S", name: "Sulfur", nameUz: "Oltingugurt", atomicNumber: 16, atomicMass: "32.07", category: "nonmetal", electrons: "2,8,6", description: "Oqsil va kislotalar tarkibida" },
  { symbol: "Cl", name: "Chlorine", nameUz: "Xlor", atomicNumber: 17, atomicMass: "35.45", category: "halogen", electrons: "2,8,7", description: "Dezinfeksiya va osh tuzi tarkibida" },
  { symbol: "Ar", name: "Argon", nameUz: "Argon", atomicNumber: 18, atomicMass: "39.95", category: "noble", electrons: "2,8,8", description: "Payvandlashda himoya gazi sifatida" },
  { symbol: "K", name: "Potassium", nameUz: "Kaliy", atomicNumber: 19, atomicMass: "39.10", category: "alkali", electrons: "2,8,8,1", description: "O'g'it va tirik organizmlar uchun zarur" },
  { symbol: "Ca", name: "Calcium", nameUz: "Kaltsiy", atomicNumber: 20, atomicMass: "40.08", category: "alkaline", electrons: "2,8,8,2", description: "Suyak va tish tarkibida" },
];

const categoryColors = {
  nonmetal: "bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30",
  noble: "bg-purple-500/20 border-purple-500/40 hover:bg-purple-500/30",
  alkali: "bg-red-500/20 border-red-500/40 hover:bg-red-500/30",
  alkaline: "bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30",
  metalloid: "bg-green-500/20 border-green-500/40 hover:bg-green-500/30",
  halogen: "bg-yellow-500/20 border-yellow-500/40 hover:bg-yellow-500/30",
  metal: "bg-gray-500/20 border-gray-500/40 hover:bg-gray-500/30",
};

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Kimyoviy Elementlar Davriy Jadvali
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Barcha elementlarni o'rganing va ularning xususiyatlari haqida batafsil ma'lumot oling
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2 md:gap-3">
          {elements.map((element) => (
            <Card
              key={element.symbol}
              onClick={() => setSelectedElement(element)}
              className={`p-3 cursor-pointer border-2 transition-all hover:scale-105 hover:shadow-elegant ${
                categoryColors[element.category as keyof typeof categoryColors]
              }`}
            >
              <div className="text-xs text-muted-foreground text-right mb-1">
                {element.atomicNumber}
              </div>
              <div className="text-2xl font-bold text-center text-foreground mb-1">
                {element.symbol}
              </div>
              <div className="text-xs text-center text-muted-foreground truncate">
                {element.nameUz}
              </div>
              <div className="text-xs text-center text-muted-foreground mt-1">
                {element.atomicMass}
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
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
        </div>
      </main>

      <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
        <DialogContent className="max-w-md">
          {selectedElement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center justify-between">
                  <span>{selectedElement.nameUz}</span>
                  <span className="text-4xl font-bold text-primary">{selectedElement.symbol}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Atom raqami</p>
                    <p className="text-xl font-semibold">{selectedElement.atomicNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atom massasi</p>
                    <p className="text-xl font-semibold">{selectedElement.atomicMass}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Elektronlar taqsimoti</p>
                  <p className="text-lg font-semibold">{selectedElement.electrons}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inglizcha nomi</p>
                  <p className="text-lg font-semibold">{selectedElement.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ma'lumot</p>
                  <p className="text-foreground">{selectedElement.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeriodicTable;
