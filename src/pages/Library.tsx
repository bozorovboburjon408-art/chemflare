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
  ChevronLeft,
  ChevronRight,
  Search,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ChemistryBook {
  id: string;
  title: string;
  author: string | null;
  description: string | null;
  cover_image_url: string | null;
  difficulty_level: number | null;
  topic: string;
}

interface BookChapter {
  id: string;
  book_id: string;
  title: string;
  content: string;
  order_num: number;
}

interface ChapterQuestion {
  id: string;
  chapter_id: string;
  question_text: string;
  correct_answer: string;
  explanation: string | null;
  order_num: number;
}

const Library = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<ChemistryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<ChemistryBook | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);
  const [questions, setQuestions] = useState<ChapterQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
      setUser(session?.user ?? null);
    });
  };

  const loadBooks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chemistry_books')
        .select('*')
        .order('difficulty_level', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setBooks(data || []);
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

  const openBook = async (book: ChemistryBook) => {
    setSelectedBook(book);
    
    try {
      const { data, error } = await supabase
        .from('book_chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('order_num');

      if (error) throw error;
      setChapters(data || []);
      
      if (data && data.length > 0) {
        openChapter(data[0]);
      }
    } catch (error: any) {
      console.error('Error loading chapters:', error);
      toast({
        title: "Xato",
        description: "Bo'limlarni yuklashda xatolik",
        variant: "destructive",
      });
    }
  };

  const openChapter = async (chapter: BookChapter) => {
    setSelectedChapter(chapter);

    try {
      const { data, error } = await supabase
        .from('chapter_questions')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('order_num');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error loading questions:', error);
    }
  };

  const goBack = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
      setQuestions([]);
    } else if (selectedBook) {
      setSelectedBook(null);
      setChapters([]);
    }
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!selectedChapter) return;
    
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      openChapter(chapters[newIndex]);
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

  // Chapter reading view
  if (selectedChapter && selectedBook) {
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < chapters.length - 1;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>

            <Card className="p-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">{selectedBook.title}</p>
                <h1 className="text-3xl font-bold mb-2">{selectedChapter.title}</h1>
                <Badge variant="outline">
                  {currentIndex + 1}-bob / {chapters.length}
                </Badge>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                <div className="whitespace-pre-wrap leading-relaxed">
                  {selectedChapter.content}
                </div>
              </div>

              {questions.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Nazorat savollari
                  </h3>
                  <div className="space-y-4">
                    {questions.map((q, idx) => (
                      <Card key={q.id} className="p-4 bg-muted/30">
                        <p className="font-medium mb-2">
                          {idx + 1}. {q.question_text}
                        </p>
                        <details className="text-sm">
                          <summary className="cursor-pointer text-primary hover:underline">
                            Javobni ko'rish
                          </summary>
                          <div className="mt-2 p-3 bg-background rounded">
                            <p className="font-semibold text-green-600 dark:text-green-400 mb-1">
                              {q.correct_answer}
                            </p>
                            {q.explanation && (
                              <p className="text-muted-foreground">{q.explanation}</p>
                            )}
                          </div>
                        </details>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => navigateChapter('prev')}
                  disabled={!hasPrev}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Oldingi bob
                </Button>
                <Button
                  onClick={() => navigateChapter('next')}
                  disabled={!hasNext}
                >
                  Keyingi bob
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Book chapters view
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={goBack} className="mb-6">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Kitobxonaga qaytish
            </Button>

            <Card className="p-8 mb-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-48 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
                  {selectedBook.author && (
                    <p className="text-muted-foreground mb-3">
                      Muallif: {selectedBook.author}
                    </p>
                  )}
                  {selectedBook.description && (
                    <p className="text-muted-foreground mb-4">
                      {selectedBook.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Badge>{selectedBook.topic}</Badge>
                    {selectedBook.difficulty_level !== null && (
                      <Badge variant="outline">
                        Daraja: {selectedBook.difficulty_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <h2 className="text-2xl font-semibold mb-4">Bo'limlar</h2>
            {chapters.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Bu kitob uchun bo'limlar hali qo'shilmagan
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {chapters.map((chapter, idx) => (
                  <Card
                    key={chapter.id}
                    className="p-4 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => openChapter(chapter)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{chapter.title}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Main library view
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Kimyo Kitobxonasi
          </h1>
          <p className="text-muted-foreground mb-8">
            Kimyoni o'rganish uchun kitoblar va o'quv materiallari
          </p>

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
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openBook(book)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-primary" />
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
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{book.topic}</Badge>
                      {book.difficulty_level !== null && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Daraja {book.difficulty_level}
                        </Badge>
                      )}
                    </div>
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
