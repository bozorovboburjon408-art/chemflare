import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Users, Lightbulb, MessageCircle, ExternalLink, Upload, X, Edit2, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  name: string;
  telegram: string;
  avatar?: string;
}

interface Mentor {
  name: string;
  role: string;
  avatar?: string;
}

const Developers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "Azamat Karimov", telegram: "@Azamat3434" },
    { name: "Bozorov Boburjon", telegram: "@Boburjon2108" },
    { name: "Binaqulov Sohibjon", telegram: "@sohib_2210" },
    { name: "Baxodirov Azizbek", telegram: "@bakhodirov_o6_o7" },
    { name: "Absalomov Shohijahon", telegram: "@renox_17" },
    { name: "Sardor Zarifov", telegram: "@Sardor_Zarifov" },
  ]);

  const [mentors, setMentors] = useState<Mentor[]>([
    { name: "Jo'rayev I.", role: "G'oya beruvchi ustoz" },
    { name: "X. Kamola", role: "Qo'llab-quvvatlovchi ustoz" },
    { name: "Jamol aka", role: "Yordam beruvchi ustoz" },
    { name: "Firdavs aka", role: "Yordam beruvchi ustoz" },
  ]);

  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editingMentor, setEditingMentor] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editTelegram, setEditTelegram] = useState("");
  const [editRole, setEditRole] = useState("");
  
  const memberFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const mentorFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleMemberImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMembers = [...teamMembers];
        newMembers[index].avatar = e.target?.result as string;
        setTeamMembers(newMembers);
        toast.success("Rasm yuklandi!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMentorImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMentors = [...mentors];
        newMentors[index].avatar = e.target?.result as string;
        setMentors(newMentors);
        toast.success("Rasm yuklandi!");
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditMember = (index: number) => {
    setEditingMember(index);
    setEditName(teamMembers[index].name);
    setEditTelegram(teamMembers[index].telegram);
  };

  const saveMemberEdit = (index: number) => {
    const newMembers = [...teamMembers];
    newMembers[index].name = editName;
    newMembers[index].telegram = editTelegram;
    setTeamMembers(newMembers);
    setEditingMember(null);
    toast.success("Ma'lumotlar saqlandi!");
  };

  const startEditMentor = (index: number) => {
    setEditingMentor(index);
    setEditName(mentors[index].name);
    setEditRole(mentors[index].role);
  };

  const saveMentorEdit = (index: number) => {
    const newMentors = [...mentors];
    newMentors[index].name = editName;
    newMentors[index].role = editRole;
    setMentors(newMentors);
    setEditingMentor(null);
    toast.success("Ma'lumotlar saqlandi!");
  };

  const removeAvatar = (type: 'member' | 'mentor', index: number) => {
    if (type === 'member') {
      const newMembers = [...teamMembers];
      newMembers[index].avatar = undefined;
      setTeamMembers(newMembers);
    } else {
      const newMentors = [...mentors];
      newMentors[index].avatar = undefined;
      setMentors(newMentors);
    }
    toast.success("Rasm o'chirildi!");
  };

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
            {mentors.map((mentor, index) => (
              <Card key={index} className="bg-card/50 hover:bg-card/80 transition-colors border-accent/20 group relative">
                <CardContent className="p-5 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => (mentorFileInputRefs.current[index] = el)}
                    onChange={(e) => handleMentorImageUpload(index, e)}
                  />
                  
                  <div className="relative w-16 h-16 mx-auto mb-3">
                    {mentor.avatar ? (
                      <>
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <button
                          onClick={() => removeAvatar('mentor', index)}
                          className="absolute -top-1 -right-1 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center cursor-pointer hover:bg-accent/20 transition-colors"
                        onClick={() => mentorFileInputRefs.current[index]?.click()}
                      >
                        <span className="text-xl font-bold text-accent">
                          {mentor.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => mentorFileInputRefs.current[index]?.click()}
                      className="absolute -bottom-1 -right-1 p-1.5 bg-primary rounded-full text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ImageIcon className="w-3 h-3" />
                    </button>
                  </div>

                  {editingMentor === index ? (
                    <div className="space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Ism"
                        className="text-center text-sm h-8"
                      />
                      <Input
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        placeholder="Rol"
                        className="text-center text-sm h-8"
                      />
                      <Button size="sm" onClick={() => saveMentorEdit(index)} className="w-full h-8">
                        <Check className="w-3 h-3 mr-1" /> Saqlash
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-foreground">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{mentor.role}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditMentor(index)}
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> Tahrirlash
                      </Button>
                    </>
                  )}
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
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all group relative">
                <CardContent className="p-5">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => (memberFileInputRefs.current[index] = el)}
                    onChange={(e) => handleMemberImageUpload(index, e)}
                  />
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {member.avatar ? (
                        <>
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <button
                            onClick={() => removeAvatar('member', index)}
                            className="absolute -top-1 -right-1 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center cursor-pointer hover:from-primary/30 hover:to-accent/30 transition-colors"
                          onClick={() => memberFileInputRefs.current[index]?.click()}
                        >
                          <span className="text-lg font-bold text-primary">
                            {member.name.split(' ').map(n => n.charAt(0)).join('')}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => memberFileInputRefs.current[index]?.click()}
                        className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ImageIcon className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      {editingMember === index ? (
                        <div className="space-y-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Ism"
                            className="text-sm h-8"
                          />
                          <Input
                            value={editTelegram}
                            onChange={(e) => setEditTelegram(e.target.value)}
                            placeholder="Telegram"
                            className="text-sm h-8"
                          />
                          <Button size="sm" onClick={() => saveMemberEdit(index)} className="h-7 text-xs">
                            <Check className="w-3 h-3 mr-1" /> Saqlash
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-foreground">{member.name}</h3>
                          <a 
                            href={`https://t.me/${member.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 mt-1 group-hover:underline"
                          >
                            {member.telegram}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditMember(index)}
                            className="mt-1 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit2 className="w-3 h-3 mr-1" /> Tahrirlash
                          </Button>
                        </>
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
