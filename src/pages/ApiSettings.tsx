import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Key, Eye, EyeOff, Save, Lock } from "lucide-react";
import Navigation from "@/components/Navigation";

const ADMIN_CODE = "admin77";

const ApiSettings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      loadSettings();
    } else {
      toast({
        title: "Xato",
        description: "Noto'g'ri admin kod",
        variant: "destructive",
      });
    }
  };

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-settings', {
        body: { action: 'get', adminCode: ADMIN_CODE }
      });

      if (error) throw error;

      if (data?.settings) {
        const googleKey = data.settings.find((s: any) => s.key_name === 'GOOGLE_AI_API_KEY');
        const openaiKey = data.settings.find((s: any) => s.key_name === 'OPENAI_API_KEY');
        
        if (googleKey) setGoogleApiKey(googleKey.key_value);
        if (openaiKey) setOpenaiApiKey(openaiKey.key_value);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-settings', {
        body: {
          action: 'save',
          adminCode: ADMIN_CODE,
          settings: [
            { key_name: 'GOOGLE_AI_API_KEY', key_value: googleApiKey },
            { key_name: 'OPENAI_API_KEY', key_value: openaiApiKey }
          ]
        }
      });

      if (error) throw error;

      toast({
        title: "Muvaffaqiyat",
        description: "API kalitlari saqlandi",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Xato",
        description: "API kalitlarini saqlashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-md mx-auto">
            <Card className="border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>API Sozlamalari</CardTitle>
                <CardDescription>
                  Kirish uchun admin kodini kiriting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Admin kod</Label>
                  <Input
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Admin kodini kiriting"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Kirish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Sozlamalari</h1>
              <p className="text-muted-foreground">AI xizmatlari uchun API kalitlarini boshqaring</p>
            </div>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Kalitlari
              </CardTitle>
              <CardDescription>
                Bu kalitlar barcha AI funksiyalari uchun ishlatiladi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-muted-foreground">Yuklanmoqda...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="google-key">Google AI API Key (Gemini)</Label>
                    <div className="relative">
                      <Input
                        id="google-key"
                        type={showGoogleKey ? "text" : "password"}
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowGoogleKey(!showGoogleKey)}
                      >
                        {showGoogleKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Google AI Studio dan oling: https://aistudio.google.com/apikey
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key (Zaxira)</Label>
                    <div className="relative">
                      <Input
                        id="openai-key"
                        type={showOpenaiKey ? "text" : "password"}
                        value={openaiApiKey}
                        onChange={(e) => setOpenaiApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      OpenAI dan oling: https://platform.openai.com/api-keys
                    </p>
                  </div>

                  <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    {isSaving ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Saqlanmoqda...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Saqlash
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
