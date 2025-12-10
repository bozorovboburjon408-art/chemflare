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
import { Upload, Loader2, Lock, BookPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminBookUploadProps {
  onUploadSuccess: () => void;
}

const AdminBookUpload = ({ onUploadSuccess }: AdminBookUploadProps) => {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookTopic, setBookTopic] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("1");
  const { toast } = useToast();

  const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      toast({
        title: "Xato",
        description: "Faqat PDF fayl yuklash mumkin",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Xato",
        description: "Fayl hajmi 2GB dan oshmasligi kerak",
        variant: "destructive",
      });
      return;
    }
    
    setPdfFile(file);
  };

  const handleUpload = async () => {
    if (!adminPassword) {
      toast({
        title: "Xato",
        description: "Admin parolini kiriting",
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
      const formData = new FormData();
      formData.append("password", adminPassword);
      formData.append("pdf", pdfFile);
      formData.append("title", bookTitle);
      formData.append("author", bookAuthor);
      formData.append("topic", bookTopic);
      formData.append("description", bookDescription);
      formData.append("difficulty_level", difficultyLevel);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-book-pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Yuklashda xatolik");
      }

      toast({
        title: "Muvaffaqiyat!",
        description: `Kitob yuklandi: ${data.chaptersCount} ta bob yaratildi`,
      });

      // Reset form
      setAdminPassword("");
      setPdfFile(null);
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
            PDF formatdagi kitobni yuklang, AI uni bob-boblarga ajratadi
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
            <Label htmlFor="pdf-file">PDF fayl *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
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
                AI qayta ishlamoqda... (1-3 daqiqa)
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Yuklash va qayta ishlash
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminBookUpload;
