import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FlaskConical, Plus, Play, Trash2, Upload, Lock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface Experiment {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  created_at: string;
}

const ADMIN_CODE = "admin77";
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const Experiments = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  
  // Admin state
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Upload state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const { data, error } = await supabase
        .from("experiments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExperiments(data || []);
    } catch (error) {
      console.error("Error fetching experiments:", error);
      toast.error("Tajribalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAdmin(true);
      setShowAdminDialog(false);
      setAdminCode("");
      toast.success("Admin rejimiga kirdingiz");
    } else {
      toast.error("Noto'g'ri kod");
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error("Video hajmi 50MB dan oshmasligi kerak");
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Faqat rasm fayllarini yuklang");
        return;
      }
      setThumbnailFile(file);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Sarlavha kiriting");
      return;
    }
    if (!videoFile) {
      toast.error("Video faylni tanlang");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload video
      const videoExt = videoFile.name.split(".").pop();
      const videoPath = `videos/${Date.now()}.${videoExt}`;
      
      setUploadProgress(20);
      
      const { error: videoError } = await supabase.storage
        .from("experiment-files")
        .upload(videoPath, videoFile);

      if (videoError) throw videoError;

      const { data: videoUrlData } = supabase.storage
        .from("experiment-files")
        .getPublicUrl(videoPath);

      setUploadProgress(60);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split(".").pop();
        const thumbPath = `thumbnails/${Date.now()}.${thumbExt}`;
        
        const { error: thumbError } = await supabase.storage
          .from("experiment-files")
          .upload(thumbPath, thumbnailFile);

        if (thumbError) throw thumbError;

        const { data: thumbUrlData } = supabase.storage
          .from("experiment-files")
          .getPublicUrl(thumbPath);

        thumbnailUrl = thumbUrlData.publicUrl;
      }

      setUploadProgress(80);

      // Save to database
      const { error: dbError } = await supabase
        .from("experiments")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          video_url: videoUrlData.publicUrl,
          thumbnail_url: thumbnailUrl,
        });

      if (dbError) throw dbError;

      setUploadProgress(100);
      toast.success("Tajriba muvaffaqiyatli yuklandi!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setVideoFile(null);
      setThumbnailFile(null);
      setShowUploadDialog(false);
      
      // Refresh list
      fetchExperiments();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Yuklashda xatolik yuz berdi");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (experiment: Experiment) => {
    if (!confirm("Bu tajribani o'chirishni xohlaysizmi?")) return;

    try {
      // Delete from database
      const { error } = await supabase
        .from("experiments")
        .delete()
        .eq("id", experiment.id);

      if (error) throw error;

      toast.success("Tajriba o'chirildi");
      fetchExperiments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Kimyoviy Tajribalar</h1>
          </div>
          
          <div className="flex gap-2">
            {!isAdmin ? (
              <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Admin kirish</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Admin kodi</Label>
                      <Input
                        type="password"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        placeholder="Kodni kiriting"
                        onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
                      />
                    </div>
                    <Button onClick={handleAdminLogin} className="w-full">
                      Kirish
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <>
                <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tajriba qo'shish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Yangi tajriba yuklash</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Sarlavha *</Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Tajriba nomi"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Izoh</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tajriba haqida ma'lumot..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Muqova rasmi</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                        {thumbnailFile && (
                          <p className="text-sm text-muted-foreground">
                            {thumbnailFile.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Video * (max 50MB)</Label>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                        />
                        {videoFile && (
                          <p className="text-sm text-muted-foreground">
                            {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                          </p>
                        )}
                      </div>
                      
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-center text-muted-foreground">
                            Yuklanmoqda... {uploadProgress}%
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        onClick={handleUpload} 
                        className="w-full"
                        disabled={isUploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Yuklanmoqda..." : "Yuklash"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAdmin(false)}
                >
                  Chiqish
                </Button>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardContent className="p-4">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : experiments.length === 0 ? (
          <div className="text-center py-16">
            <FlaskConical className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Hali tajribalar yo'q
            </h2>
            <p className="text-muted-foreground">
              Admin tajribalarni qo'shishi kerak
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => (
              <Card 
                key={experiment.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => setSelectedExperiment(experiment)}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {experiment.thumbnail_url ? (
                    <img
                      src={experiment.thumbnail_url}
                      alt={experiment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <FlaskConical className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {experiment.title}
                      </h3>
                      {experiment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {experiment.description}
                        </p>
                      )}
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(experiment);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Video Player Dialog */}
        <Dialog 
          open={!!selectedExperiment} 
          onOpenChange={(open) => !open && setSelectedExperiment(null)}
        >
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {selectedExperiment && (
              <>
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>{selectedExperiment.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-6 pt-4">
                  <div className="relative w-full bg-black rounded-lg overflow-hidden">
                    <video
                      src={selectedExperiment.video_url}
                      controls
                      autoPlay
                      playsInline
                      className="w-full max-h-[70vh] object-contain"
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                  {selectedExperiment.description && (
                    <p className="text-muted-foreground">
                      {selectedExperiment.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Experiments;
