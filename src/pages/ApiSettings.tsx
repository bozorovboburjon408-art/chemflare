import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Key, Eye, EyeOff, Save, Lock, Plus, Trash2, Link, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ADMIN_CODE = "admin77";

interface CustomApi {
  id?: string;
  key_name: string;
  key_value: string;
  api_url?: string;
  description?: string;
}

const ApiSettings = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customApis, setCustomApis] = useState<CustomApi[]>([]);
  const [newApi, setNewApi] = useState<CustomApi>({ key_name: "", key_value: "", api_url: "", description: "" });
  const [showNewApiKey, setShowNewApiKey] = useState(false);
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

        // Load custom APIs (those that are not GOOGLE_AI_API_KEY or OPENAI_API_KEY)
        const customs = data.settings.filter((s: any) => 
          !['GOOGLE_AI_API_KEY', 'OPENAI_API_KEY'].includes(s.key_name)
        );
        setCustomApis(customs);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAiKeys = async () => {
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
        description: "AI API kalitlari saqlandi",
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

  const handleAddCustomApi = async () => {
    if (!newApi.key_name || !newApi.key_value) {
      toast({
        title: "Xato",
        description: "API nomi va kaliti majburiy",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Create a combined value with URL if provided
      const valueToSave = newApi.api_url 
        ? JSON.stringify({ key: newApi.key_value, url: newApi.api_url, description: newApi.description })
        : newApi.key_value;

      const { data, error } = await supabase.functions.invoke('manage-api-settings', {
        body: {
          action: 'save',
          adminCode: ADMIN_CODE,
          settings: [
            { key_name: newApi.key_name.toUpperCase().replace(/\s+/g, '_'), key_value: valueToSave }
          ]
        }
      });

      if (error) throw error;

      toast({
        title: "Muvaffaqiyat",
        description: "Yangi API qo'shildi",
      });

      setNewApi({ key_name: "", key_value: "", api_url: "", description: "" });
      loadSettings();
    } catch (error) {
      console.error('Error adding custom API:', error);
      toast({
        title: "Xato",
        description: "API qo'shishda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomApi = async (keyName: string) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-api-settings', {
        body: {
          action: 'delete',
          adminCode: ADMIN_CODE,
          keyName: keyName
        }
      });

      if (error) throw error;

      toast({
        title: "Muvaffaqiyat",
        description: "API o'chirildi",
      });

      loadSettings();
    } catch (error) {
      console.error('Error deleting API:', error);
      toast({
        title: "Xato",
        description: "API o'chirishda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const parseCustomApiValue = (value: string): { key: string; url?: string; description?: string } => {
    try {
      return JSON.parse(value);
    } catch {
      return { key: value };
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">API Sozlamalari</h1>
              <p className="text-muted-foreground">AI va boshqa API xizmatlari uchun kalitlarni boshqaring</p>
            </div>
          </div>

          <Tabs defaultValue="ai" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                AI Kalitlari
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Boshqa API'lar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    AI API Kalitlari
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

                      <Button onClick={handleSaveAiKeys} disabled={isSaving} className="w-full">
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
            </TabsContent>

            <TabsContent value="custom">
              <div className="space-y-6">
                {/* Add new API */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Yangi API qo'shish
                    </CardTitle>
                    <CardDescription>
                      Ixtiyoriy tashqi API xizmati qo'shing
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>API nomi *</Label>
                        <Input
                          value={newApi.key_name}
                          onChange={(e) => setNewApi({ ...newApi, key_name: e.target.value })}
                          placeholder="Masalan: WEATHER_API"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>API URL</Label>
                        <Input
                          value={newApi.api_url}
                          onChange={(e) => setNewApi({ ...newApi, api_url: e.target.value })}
                          placeholder="https://api.example.com/v1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>API kalit *</Label>
                      <div className="relative">
                        <Input
                          type={showNewApiKey ? "text" : "password"}
                          value={newApi.key_value}
                          onChange={(e) => setNewApi({ ...newApi, key_value: e.target.value })}
                          placeholder="API kalitingiz"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewApiKey(!showNewApiKey)}
                        >
                          {showNewApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tavsif (ixtiyoriy)</Label>
                      <Input
                        value={newApi.description}
                        onChange={(e) => setNewApi({ ...newApi, description: e.target.value })}
                        placeholder="Bu API nima uchun ishlatiladi"
                      />
                    </div>
                    <Button onClick={handleAddCustomApi} disabled={isSaving} className="w-full">
                      {isSaving ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                          Qo'shilmoqda...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          API qo'shish
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* List of custom APIs */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Qo'shilgan API'lar
                    </CardTitle>
                    <CardDescription>
                      Barcha qo'shilgan API xizmatlari
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-muted-foreground">Yuklanmoqda...</p>
                      </div>
                    ) : customApis.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Hali hech qanday API qo'shilmagan</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customApis.map((api) => {
                          const parsed = parseCustomApiValue(api.key_value);
                          return (
                            <div
                              key={api.key_name}
                              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Key className="w-4 h-4 text-primary" />
                                  <span className="font-medium">{api.key_name}</span>
                                </div>
                                {parsed.url && (
                                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                    <Link className="w-3 h-3" />
                                    <span className="truncate max-w-md">{parsed.url}</span>
                                  </div>
                                )}
                                {parsed.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{parsed.description}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteCustomApi(api.key_name)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
