import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_PASSWORD = "admin77";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const adminPassword = formData.get('password') as string;
    const pdfFile = formData.get('pdf') as File;
    const bookTitle = formData.get('title') as string;
    const bookAuthor = formData.get('author') as string;
    const bookTopic = formData.get('topic') as string;
    const bookDescription = formData.get('description') as string;
    const difficultyLevel = parseInt(formData.get('difficulty_level') as string) || 1;

    // Validate admin password
    if (adminPassword !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Noto'g'ri admin paroli" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pdfFile || !bookTitle || !bookTopic) {
      return new Response(
        JSON.stringify({ error: "PDF fayl, kitob nomi va mavzu majburiy" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF: ${pdfFile.name}, size: ${pdfFile.size}`);

    // Read PDF as base64 (chunked to avoid stack overflow)
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in chunks to avoid stack overflow
    let binaryString = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64Pdf = btoa(binaryString);
    
    console.log(`PDF converted to base64, length: ${base64Pdf.length}`);

    const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY');

    if (!deepseekKey) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }

    const systemPrompt = `Sen kimyo kitoblarini tahlil qiluvchi mutaxassissan. 
PDF hujjat matnini olib, uni kitob formatiga o'tkazishing kerak.

VAZIFA:
1. PDF matnini tahlil qil
2. Mantiqiy bo'limlarga (boblarga) ajrat
3. Har bir bob uchun sarlavha va to'liq mazmun yoz
4. Har bir bob uchun 3-5 ta nazorat savoli va javoblarini yoz

MUHIM:
- Haqiqiy kimyoviy ma'lumotlarni saqla
- Formulalarni to'g'ri yoz (H₂O, CO₂, etc.)
- Har bir bob 500-2000 so'z bo'lsin
- Savollar bob mazmuniga mos kelsin

JSON formatda javob ber:
{
  "chapters": [
    {
      "title": "Bob nomi",
      "content": "Bob matni...",
      "order_num": 1,
      "questions": [
        {
          "question_text": "Savol matni?",
          "correct_answer": "To'g'ri javob",
          "explanation": "Tushuntirish"
        }
      ]
    }
  ]
}`;

    console.log("Using DeepSeek API...");
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Kitob nomi: "${bookTitle}"\nMavzu: ${bookTopic}\n\nUshbu PDF ni tahlil qilib, kitob formatiga o'tkaz.\n\nPDF content (base64): ${base64Pdf.substring(0, 10000)}...`
          }
        ],
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.log("DeepSeek API failed:", response.status, errText);
      throw new Error("DeepSeek API xatosi");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error("AI javob bermadi");
    }

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const bookData = JSON.parse(cleanedText);
    
    console.log("DeepSeek API success");

    if (!bookData || !bookData.chapters) {
      throw new Error("AI PDF ni qayta ishlashda xatolik yuz berdi");
    }

    // Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create book
    const { data: newBook, error: bookError } = await supabase
      .from('chemistry_books')
      .insert({
        title: bookTitle,
        author: bookAuthor || null,
        description: bookDescription || null,
        topic: bookTopic,
        difficulty_level: difficultyLevel,
      })
      .select()
      .single();

    if (bookError) {
      console.error("Book insert error:", bookError);
      throw new Error("Kitob saqlashda xatolik: " + bookError.message);
    }

    console.log("Book created:", newBook.id);

    // Create chapters and questions
    for (const chapter of bookData.chapters) {
      const { data: newChapter, error: chapterError } = await supabase
        .from('book_chapters')
        .insert({
          book_id: newBook.id,
          title: chapter.title,
          content: chapter.content,
          order_num: chapter.order_num || bookData.chapters.indexOf(chapter) + 1,
        })
        .select()
        .single();

      if (chapterError) {
        console.error("Chapter insert error:", chapterError);
        continue;
      }

      console.log("Chapter created:", newChapter.id);

      // Insert questions
      if (chapter.questions && chapter.questions.length > 0) {
        const questionsToInsert = chapter.questions.map((q: any, idx: number) => ({
          chapter_id: newChapter.id,
          question_text: q.question_text,
          correct_answer: q.correct_answer,
          explanation: q.explanation || null,
          order_num: idx + 1,
        }));

        const { error: questionsError } = await supabase
          .from('chapter_questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error("Questions insert error:", questionsError);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Kitob muvaffaqiyatli yuklandi (DeepSeek)`,
        book: newBook,
        chaptersCount: bookData.chapters.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Noma\'lum xatolik' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});