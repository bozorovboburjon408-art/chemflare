import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Loader2, 
  Search,
  Download,
  FileText
} from "lucide-react";
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
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Kimyo Kitobxonasi
              </h1>
              <p className="text-muted-foreground">
                Kimyoni o'rganish uchun kitoblar - yuklab oling va o'qing
              </p>
            </div>
            <AdminBookUpload onUploadSuccess={loadBooks} />
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Kitob, mavzu yoki muallif bo'yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredBooks.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Qidiruv bo'yicha kitoblar topilmadi" 
                  : "Kitobxona hozircha bo'sh"}
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="overflow-hidden hover:shadow-lg transition-all"
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
                    
                    {/* Download Button */}
                    {book.pdf_url ? (
                      <Button 
                        onClick={() => downloadBook(book)}
                        className="w-full gap-2"
                      >
                        <Download className="w-4 h-4" />
                        PDF yuklash
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        variant="outline"
                        className="w-full gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        PDF mavjud emas
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Library;