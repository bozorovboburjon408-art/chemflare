import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookTitle, chapterTitle, chapterContent, questionCount } = await req.json();

    if (!chapterContent || !questionCount) {
      return new Response(
        JSON.stringify({ error: "Chapter content and question count are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

const systemPrompt = `Sen professional kimyo o'qituvchisisan. Test savollarini tuzishda quyidagi qoidalarga amal qil:

QOIDALAR:
1. Har bir savol 4 ta variant (A, B, C, D) bilan bo'lsin
2. Savollar kimyo faniga oid bo'lsin - kimyoviy elementlar, formulalar, reaksiyalar, qonunlar haqida
3. To'g'ri javob faqat bitta bo'lsin
4. Variantlar bir-biridan aniq farq qilsin
5. Savollar turli qiyinlik darajasida bo'lsin (oson, o'rta, qiyin)
6. Kimyoviy formulalarni to'g'ri yoz (H₂O, CO₂, NaCl va h.k.)
7. Izohda nima uchun bu javob to'g'ri ekanligini qisqacha tushuntir

MAVZULAR (agar matn kam bo'lsa, shu mavzulardan foydalananing):
- Atom tuzilishi va elektron konfiguratsiya
- Davriy jadval va elementlar xossalari
- Kimyoviy bog'lanishlar (ion, kovalent, metall)
- Kimyoviy reaksiyalar turlari
- Oksidlanish-qaytarilish reaksiyalari
- Kislotalar, asoslar, tuzlar
- Eritmalar va konsentratsiya
- Gazlar qonunlari
- Termoximiya va energiya
- Organik kimyo asoslari

JSON formatida javob ber:
{
  "questions": [
    {
      "question": "Savol matni",
      "options": {
        "A": "Birinchi variant",
        "B": "Ikkinchi variant", 
        "C": "Uchinchi variant",
        "D": "To'rtinchi variant"
      },
      "correct": "A",
      "explanation": "Qisqa tushuntirish"
    }
  ]
}`;

    const userPrompt = `Kitob: "${bookTitle}"
Bo'lim: "${chapterTitle}"

Matn:
${chapterContent}

Iltimos, shu matn asosida ${questionCount} ta test savoli tuz. Savollar qiziqarli, o'ylantiradigan va turli qiyinlik darajasida bo'lsin.`;

    console.log('Using Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemPrompt }]
          },
          {
            role: 'model',
            parts: [{ text: 'Tushunarli, men professional kimyo o\'qituvchisi sifatida test savollarini tuzaman.' }]
          },
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 8000,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error('AI xizmati javob bermadi');
    }

    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    console.log('Gemini API response received successfully');

    if (!content) {
      throw new Error("No response from AI");
    }

    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.slice(7);
    }
    if (content.startsWith("```")) {
      content = content.slice(3);
    }
    if (content.endsWith("```")) {
      content = content.slice(0, -3);
    }
    content = content.trim();

    const result = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Quiz yaratishda xatolik" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});