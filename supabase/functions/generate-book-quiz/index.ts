import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getApiKeys() {
  let googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
  let openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!googleApiKey || !openaiApiKey) {
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: settings } = await supabase
        .from('api_settings')
        .select('key_name, key_value');

      if (settings) {
        for (const setting of settings) {
          if (setting.key_name === 'GOOGLE_AI_API_KEY' && !googleApiKey) {
            googleApiKey = setting.key_value;
          }
          if (setting.key_name === 'OPENAI_API_KEY' && !openaiApiKey) {
            openaiApiKey = setting.key_value;
          }
        }
      }
    } catch (e) {
      console.error('Error fetching API keys from database:', e);
    }
  }

  return { googleApiKey, openaiApiKey };
}

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

    const { googleApiKey, openaiApiKey } = await getApiKeys();
    
    if (!googleApiKey && !openaiApiKey) {
      throw new Error("AI API kaliti sozlanmagan. API Sozlamalaridan kalitlarni kiriting.");
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
