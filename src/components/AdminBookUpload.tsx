import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2, Lock, BookPlus, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminBookUploadProps {
  onUploadSuccess: () => void;
}

const AdminBookUpload = ({ onUploadSuccess }: AdminBookUploadProps) => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookTopic, setBookTopic] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("1");
  const { toast } = useToast();

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else if (file) {
      toast({
        title: "Xato",
        description: "Faqat PDF fayl yuklash mumkin",
        variant: "destructive",
      });
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        title: "Xato",
        description: "Faqat rasm fayl yuklash mumkin",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (adminPassword !== "admin77") {
      toast({
        title: "Xato",
        description: "Admin paroli noto'g'ri",
        variant: "destructive",
      });
      return;
    }

    if (!pdfFile) {
      toast({
        title: "Xato",
        description: "PDF fayl tanlang",
        variant: "destructive",
      });
      return;
    }

    if (!bookTitle || !bookTopic) {
      toast({
        title: "Xato",
        description: "Kitob nomi va mavzuni kiriting",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const timestamp = Date.now();
      
      // Upload PDF to storage
      const pdfPath = `pdfs/${timestamp}_${pdfFile.name}`;
      const { error: pdfError } = await supabase.storage
        .from('book-files')
        .upload(pdfPath, pdfFile);

      if (pdfError) throw pdfError;

      const { data: pdfUrlData } = supabase.storage
        .from('book-files')
        .getPublicUrl(pdfPath);

      // Upload cover image if provided
      let coverUrl = null;
      if (coverImage) {
        const coverPath = `covers/${timestamp}_${coverImage.name}`;
        const { error: coverError } = await supabase.storage
          .from('book-files')
          .upload(coverPath, coverImage);

        if (coverError) throw coverError;

        const { data: coverUrlData } = supabase.storage
          .from('book-files')
          .getPublicUrl(coverPath);
        
        coverUrl = coverUrlData.publicUrl;
      }

      // Insert book record into database
      const { error: dbError } = await supabase
        .from('chemistry_books')
        .insert({
          title: bookTitle,
          author: bookAuthor || null,
          topic: bookTopic,
          description: bookDescription || null,
          difficulty_level: parseInt(difficultyLevel),
          cover_image_url: coverUrl,
          pdf_url: pdfUrlData.publicUrl,
        });

      if (dbError) throw dbError;

      toast({
        title: "Muvaffaqiyat!",
        description: "Kitob muvaffaqiyatli yuklandi",
      });

      // Reset form
      setAdminPassword("");
      setPdfFile(null);
      setCoverImage(null);
      setCoverPreview(null);
      setBookTitle("");
      setBookAuthor("");
      setBookTopic("");
      setBookDescription("");
      setDifficultyLevel("1");
      setOpen(false);
      onUploadSuccess();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Xato",
        description: error.message || "Kitob yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookPlus className="w-4 h-4" />
          Admin: Kitob yuklash
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin - Kitob yuklash
          </DialogTitle>
          <DialogDescription>
            PDF kitob va muqova rasmini yuklang
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin paroli *</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Admin parolini kiriting"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-image">Muqova rasmi</Label>
            <div className="flex items-center gap-4">
              {coverPreview ? (
                <img 
                  src={coverPreview} 
                  alt="Cover preview" 
                  className="w-20 h-28 object-cover rounded border"
                />
              ) : (
                <div className="w-20 h-28 bg-muted rounded border flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <Input
                id="cover-image"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF fayl *</Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
            />
            {pdfFile && (
              <p className="text-sm text-muted-foreground">
                Tanlangan: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-title">Kitob nomi *</Label>
            <Input
              id="book-title"
              placeholder="Kitob nomini kiriting"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-author">Muallif</Label>
            <Input
              id="book-author"
              placeholder="Muallif ismini kiriting"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-topic">Mavzu *</Label>
            <Select value={bookTopic} onValueChange={setBookTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Mavzuni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Umumiy kimyo">Umumiy kimyo</SelectItem>
                <SelectItem value="Organik kimyo">Organik kimyo</SelectItem>
                <SelectItem value="Anorganik kimyo">Anorganik kimyo</SelectItem>
                <SelectItem value="Analitik kimyo">Analitik kimyo</SelectItem>
                <SelectItem value="Fizikaviy kimyo">Fizikaviy kimyo</SelectItem>
                <SelectItem value="Biokimyo">Biokimyo</SelectItem>
                <SelectItem value="Boshqa">Boshqa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Qiyinlik darajasi</Label>
            <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Boshlang'ich</SelectItem>
                <SelectItem value="2">2 - Oson</SelectItem>
                <SelectItem value="3">3 - O'rta</SelectItem>
                <SelectItem value="4">4 - Qiyin</SelectItem>
                <SelectItem value="5">5 - Ilg'or</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="book-description">Tavsif</Label>
            <Textarea
              id="book-description"
              placeholder="Kitob haqida qisqacha ma'lumot"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Kitobni yuklash
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookUpload;