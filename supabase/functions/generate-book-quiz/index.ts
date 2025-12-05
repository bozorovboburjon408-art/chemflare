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

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const systemPrompt = `Sen Qwen 2.5 modelsan. Test savollarini tuzishda aniq, qisqa, ilmiy javob ber.

QOIDALAR:
1. Har bir savol 4 ta variant (A, B, C, D) bilan bo'lsin
2. Savollar matn mazmuniga asoslangan bo'lsin
3. To'g'ri javob faqat bitta bo'lsin
4. Testlarda faqat to'g'ri variant va qisqa izoh ber

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

    console.log('Sending request to OpenAI...');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Juda ko'p so'rov yuborildi. Biroz kuting." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "OpenAI API kaliti noto'g'ri. Iltimos, tekshiring." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      throw new Error(`AI request failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');
    
    let content = data.choices?.[0]?.message?.content;

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
