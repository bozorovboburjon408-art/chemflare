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

    const googleApiKey = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!googleApiKey) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let content: string | undefined;
    let usedProvider = '';

    // Try Google AI first
    console.log('Trying Google AI...');
    try {
      const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              { text: userPrompt }
            ]
          }],
          generationConfig: {
            maxOutputTokens: 4000,
          }
        }),
      });

      if (googleResponse.ok) {
        const googleData = await googleResponse.json();
        content = googleData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content) {
          usedProvider = 'Google AI';
          console.log('Google AI response received successfully');
        }
      } else {
        const errorText = await googleResponse.text();
        console.log('Google AI failed, trying OpenAI fallback...', errorText);
      }
    } catch (e) {
      console.log('Google AI error, trying OpenAI fallback...', e);
    }

    // Fallback to OpenAI if Google AI failed
    if (!content && openaiApiKey) {
      console.log('Using OpenAI fallback...');
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 4000,
        })
      });

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json();
        content = openaiData.choices?.[0]?.message?.content;
        usedProvider = 'OpenAI';
        console.log('OpenAI response received successfully');
      } else {
        const errorText = await openaiResponse.text();
        console.error('OpenAI also failed:', errorText);
        throw new Error('Barcha AI xizmatlari ishlamayapti');
      }
    }

    console.log(`Response received from ${usedProvider}`);

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
