import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import PageHero from "@/components/PageHero";
import AnimatedCard from "@/components/AnimatedCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Loader2, 
  Search,
  Download,
  FileText,
  Trash2,
  Library as LibraryIcon
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminBookUpload from "@/components/AdminBookUpload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface ChemistryBook {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_image_url: string | null;
  difficulty_level: number | null;
  topic: string;
  pdf_url: string | null;
}

const Library = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<ChemistryBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState("");
  const [deletingBookId, setDeletingBookId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        loadBooks();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chemistry_books')
        .select('*')
        .order('difficulty_level', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setBooks((data as ChemistryBook[]) || []);
    } catch (error: any) {
      console.error('Error loading books:', error);
      toast({
        title: "Xato",
        description: "Kitoblarni yuklashda xatolik",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBook = (book: ChemistryBook) => {
    if (book.pdf_url) {
      window.open(book.pdf_url, '_blank');
    } else {
      toast({
        title: "Xato",
        description: "Bu kitob uchun PDF fayl mavjud emas",
        variant: "destructive",
      });
    }
  };

  const deleteBook = async (bookId: string) => {
    if (adminPassword !== "admin77") {
      toast({
        title: "Xato",
        description: "Admin paroli noto'g'ri",
        variant: "destructive",
      });
      return;
    }

    setDeletingBookId(bookId);
    try {
      const { error } = await supabase
        .from('chemistry_books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      toast({
        title: "Muvaffaqiyat",
        description: "Kitob o'chirildi",
      });
      setAdminPassword("");
      loadBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast({
        title: "Xato",
        description: "Kitobni o'chirishda xatolik",
        variant: "destructive",
      });
    } finally {
      setDeletingBookId(null);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <PageHero
          icon={<LibraryIcon className="w-full h-full" />}
          title="Kimyo Kitobxonasi"
          subtitle="Kimyoni o'rganish uchun kitoblar - yuklab oling va o'qing"
          gradient="from-secondary via-primary to-accent"
          stats={[
            { value: `${books.length}+`, label: "Kitoblar" },
            { value: "PDF", label: "Formatda" },
            { value: "Bepul", label: "Yuklab olish" }
          ]}
        />
        
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end mb-6"
            >
              <AdminBookUpload onUploadSuccess={loadBooks} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mb-8"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Kitob, mavzu yoki muallif bo'yicha qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </motion.div>

            {filteredBooks.length === 0 ? (
              <AnimatedCard delay={0.4} className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? "Qidiruv bo'yicha kitoblar topilmadi" 
                    : "Kitobxona hozircha bo'sh"}
                </p>
              </AnimatedCard>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book, index) => (
                  <AnimatedCard
                    key={book.id}
                    delay={0.4 + index * 0.1}
                    className="overflow-hidden"
                  >
                  {/* Cover Image */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                    {book.cover_image_url ? (
                      <img 
                        src={book.cover_image_url} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <BookOpen className="w-20 h-20 text-primary" />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                    {book.author && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {book.author}
                      </p>
                    )}
                    {book.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    <div className="flex gap-2 flex-wrap mb-4">
                      <Badge variant="outline">{book.topic}</Badge>
                      {book.difficulty_level !== null && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Daraja {book.difficulty_level}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {book.pdf_url ? (
                        <Button 
                          onClick={() => downloadBook(book)}
                          className="flex-1 gap-2"
                        >
                          <Download className="w-4 h-4" />
                          PDF yuklash
                        </Button>
                      ) : (
                        <Button 
                          disabled
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          PDF yo'q
                        </Button>
                      )}
                      
                      {/* Admin Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Kitobni o'chirish</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{book.title}" kitobini o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="py-4">
                            <Input
                              type="password"
                              placeholder="Admin parolini kiriting"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAdminPassword("")}>
                              Bekor qilish
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteBook(book.id)}
                              disabled={deletingBookId === book.id}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {deletingBookId === book.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                "O'chirish"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Library;