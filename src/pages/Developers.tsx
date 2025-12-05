import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Lightbulb, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Developer {
  id: string;
  name: string;
  telegram: string | null;
  role: string | null;
  type: string;
  avatar_url: string | null;
  order_num: number;
}

const Developers = () => {
  const [teamMembers, setTeamMembers] = useState<Developer[]>([]);
  const [mentors, setMentors] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchDevelopers();
  }, []);

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