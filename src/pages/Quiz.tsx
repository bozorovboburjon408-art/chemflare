import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Quiz = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "AI bilan integratsiya kerak",
        description: "Test rasimini qayta ishlash uchun Lovable Cloud va AI xizmatlarini ulash kerak.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Test va Viktorina
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test rasmini yuklang va AI uni avtomatik ravishda savollarga aylantiradi
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="p-8 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-primary" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Test rasmini yuklang</h3>
                <p className="text-muted-foreground mb-4">
                  JPG, PNG yoki PDF formatdagi test rasmlarini yuklashingiz mumkin
                </p>
              </div>

              <label htmlFor="file-upload">
                <Button 
                  variant="default" 
                  size="lg"
                  disabled={isUploading}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    {isUploading ? "Yuklanmoqda..." : "Rasmni tanlang"}
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3">Qanday ishlaydi:</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Test rasmini yuklang (qo'lda yozilgan yoki bosilgan)</li>
              <li>2. AI test matnini o'qiydi va tahlil qiladi</li>
              <li>3. Savollar avtomatik ravishda bir-biriga aylantiriladi</li>
              <li>4. Har bir savolga javob bering va natijalarni ko'ring</li>
            </ol>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Bu xususiyat Lovable Cloud va AI xizmatlari bilan ishlaydi</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Quiz;
