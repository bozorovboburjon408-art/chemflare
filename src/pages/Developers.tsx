import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Lightbulb, MessageCircle, ExternalLink, Loader2, Upload, Camera, CameraOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Developer {
  id: string;
  name: string;
  telegram: string | null;
  role: string | null;
  type: string;
  avatar_url: string | null;
  order_num: number;
}

interface OldTeamMember {
  name: string;
  telegram: string;
  avatar?: string;
}

interface OldMentor {
  name: string;
  role: string;
  avatar?: string;
}

const STORAGE_KEYS = {
  TEAM_MEMBERS: "developers_team_members",
  MENTORS: "developers_mentors",
  CAMERA_ENABLED: "robot_camera_enabled",
};

const Developers = () => {
  const [teamMembers, setTeamMembers] = useState<Developer[]>([]);
  const [mentors, setMentors] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.CAMERA_ENABLED) === 'true';
  });
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    // Check camera permission status
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt');
      }).catch(() => {});
    }

    // Check if there's old localStorage data with avatars
    const oldMembers = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
    const oldMentors = localStorage.getItem(STORAGE_KEYS.MENTORS);
    
    if (oldMembers || oldMentors) {
      const members: OldTeamMember[] = oldMembers ? JSON.parse(oldMembers) : [];
      const mentorsList: OldMentor[] = oldMentors ? JSON.parse(oldMentors) : [];
      
      const hasAvatars = members.some(m => m.avatar) || mentorsList.some(m => m.avatar);
      setHasLocalData(hasAvatars);
    }

    fetchDevelopers();
  }, []);

  const toggleCamera = async () => {
    if (!cameraEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        setCameraEnabled(true);
        localStorage.setItem(STORAGE_KEYS.CAMERA_ENABLED, 'true');
        setCameraPermission('granted');
        toast.success("Kamera yoqildi! Robotlar sizni ko'rishi mumkin.");
        
        // Dispatch event to notify BumblebeeMascot
        window.dispatchEvent(new CustomEvent('cameraStatusChanged', { detail: { enabled: true } }));
      } catch (error) {
        console.error('Camera permission denied:', error);
        setCameraPermission('denied');
        toast.error("Kamera ruxsati berilmadi");
      }
    } else {
      setCameraEnabled(false);
      localStorage.setItem(STORAGE_KEYS.CAMERA_ENABLED, 'false');
      toast.info("Kamera o'chirildi");
      
      // Dispatch event to notify BumblebeeMascot
      window.dispatchEvent(new CustomEvent('cameraStatusChanged', { detail: { enabled: false } }));
    }
  };

  const fetchDevelopers = async () => {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('order_num');
    
    if (error) {
      console.error('Error fetching developers:', error);
      setLoading(false);
      return;
    }

    const members = data?.filter(d => d.type === 'member') || [];
    const mentorsList = data?.filter(d => d.type === 'mentor') || [];
    
    setTeamMembers(members);
    setMentors(mentorsList);
    setLoading(false);
  };

  const migrateLocalStorageToSupabase = async () => {
    setMigrating(true);
    
    try {
      const oldMembersStr = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
      const oldMentorsStr = localStorage.getItem(STORAGE_KEYS.MENTORS);
      
      const oldMembers: OldTeamMember[] = oldMembersStr ? JSON.parse(oldMembersStr) : [];
      const oldMentorsList: OldMentor[] = oldMentorsStr ? JSON.parse(oldMentorsStr) : [];

      // Upload member avatars
      for (const oldMember of oldMembers) {
        if (oldMember.avatar && oldMember.avatar.startsWith('data:')) {
          const dbMember = teamMembers.find(m => m.name === oldMember.name);
          if (dbMember) {
            // Convert base64 to blob
            const response = await fetch(oldMember.avatar);
            const blob = await response.blob();
            const fileName = `member-${dbMember.id}.jpg`;
            
            // Upload to storage
            const { error: uploadError } = await supabase.storage
              .from('developer-avatars')
              .upload(fileName, blob, { upsert: true });
            
            if (uploadError) {
              console.error('Upload error:', uploadError);
              continue;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('developer-avatars')
              .getPublicUrl(fileName);
            
            // Update database
            await supabase
              .from('developers')
              .update({ avatar_url: urlData.publicUrl })
              .eq('id', dbMember.id);
          }
        }
      }

      // Upload mentor avatars
      for (const oldMentor of oldMentorsList) {
        if (oldMentor.avatar && oldMentor.avatar.startsWith('data:')) {
          const dbMentor = mentors.find(m => m.name === oldMentor.name);
          if (dbMentor) {
            const response = await fetch(oldMentor.avatar);
            const blob = await response.blob();
            const fileName = `mentor-${dbMentor.id}.jpg`;
            
            const { error: uploadError } = await supabase.storage
              .from('developer-avatars')
              .upload(fileName, blob, { upsert: true });
            
            if (uploadError) {
              console.error('Upload error:', uploadError);
              continue;
            }
            
            const { data: urlData } = supabase.storage
              .from('developer-avatars')
              .getPublicUrl(fileName);
            
            await supabase
              .from('developers')
              .update({ avatar_url: urlData.publicUrl })
              .eq('id', dbMentor.id);
          }
        }
      }

      toast.success("Rasmlar muvaffaqiyatli ko'chirildi!");
      setHasLocalData(false);
      
      // Refresh data
      await fetchDevelopers();
      
    } catch (error) {
      console.error('Migration error:', error);
      toast.error("Xatolik yuz berdi");
    }
    
    setMigrating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Migration Banner */}
        {hasLocalData && (
          <Card className="mb-6 bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Eski rasmlar topildi!</p>
                <p className="text-sm text-muted-foreground">LocalStorage'dagi rasmlarni serverga ko'chirish mumkin</p>
              </div>
              <Button onClick={migrateLocalStorageToSupabase} disabled={migrating}>
                {migrating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Ko'chirish
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            ISHLAB CHIQARUVCHILAR
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bu loyiha — intilish, mehnat va ilmga bo'lgan muhabbatimiz samarasidir
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Bizning Maqsadimiz</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kimyoni <span className="text-primary font-medium">bepul</span>, <span className="text-primary font-medium">sodda</span>, <span className="text-primary font-medium">tushunarli</span> va eng muhimi <span className="text-primary font-medium">mukammal</span> tarzda o'rgatuvchi ilova yaratish edi. Bugun esa shu maqsadimiz ro'yobga chiqdi.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  Bu dastur — ustozlarimizning ilhomi, bizning mehnatimiz va sizning ilmga bo'lgan qiziqishingizdan tug'ilgan katta loyiha.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mentors Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Minnatdorchilik</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="bg-card/50 hover:bg-card/80 transition-colors border-accent/20">
                <CardContent className="p-5 text-center">
                  <div className="w-16 h-16 mx-auto mb-3">
                    {mentor.avatar_url ? (
                      <img 
                        src={mentor.avatar_url} 
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-accent">
                          {mentor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{mentor.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Jamoa A'zolari</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div>
                      {member.avatar_url ? (
                        <img 
                          src={member.avatar_url} 
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">
                            {member.name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      {member.telegram && (
                        <a 
                          href={`https://t.me/${member.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-1 hover:underline"
                        >
                          {member.telegram}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Camera Settings Section */}
        <Card className="mb-8 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                {cameraEnabled ? (
                  <Camera className="w-6 h-6 text-blue-500" />
                ) : (
                  <CameraOff className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-3">Robot Kamerasi</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Kamerani yoqsangiz, robotlar sizni "ko'rishi" mumkin va sizga qarab javob beradi. 
                  Siz ekranda ko'rinmaysiz - faqat robotlar sizni sezadi.
                </p>
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={toggleCamera}
                    variant={cameraEnabled ? "destructive" : "default"}
                    className="gap-2"
                  >
                    {cameraEnabled ? (
                      <>
                        <CameraOff className="w-4 h-4" />
                        Kamerani o'chirish
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Kamerani yoqish
                      </>
                    )}
                  </Button>
                  {cameraPermission === 'denied' && (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      Ruxsat berilmagan
                    </Badge>
                  )}
                  {cameraEnabled && cameraPermission === 'granted' && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Faol
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-accent/10">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Bog'lanish</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Taklif va fikr-mulohazalar uchun biz bilan bemalol bog'lanishingiz mumkin. Telegram username'larimiz yuqorida ko'rsatilgan.
                </p>
                <div className="mt-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    Oldinda yanada ko'proq g'oyalar, yangilanishlar va imkoniyatlar kutmoqda!
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="text-sm">
            Biz bilan qoling — bilim sari birga intilamiz! 🚀
          </p>
        </div>
      </main>
    </div>
  );
};

export default Developers;