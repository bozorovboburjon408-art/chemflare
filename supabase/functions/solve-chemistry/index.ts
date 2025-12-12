import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `Sen kimyo, fizika, matematika va biologiya bo'yicha chuqur tahlil qiladigan va har bir javobda batafsil, manoli tushuntirishlar beradigan AI mutaxassisisan.

ASOSIY TAMOYILLAR:
1. Har bir masalani CHUQUR TAHLIL qil - faqat javob emas, balki NIMA UCHUN bunday bo'lishini tushuntir
2. Nazariy asoslarni tushuntir - qaysi qonun, qoida yoki tamoyilga asoslanganini ayt
3. Har bir qadamni MANTIQIY IZOHLA - o'quvchi tushunishi uchun
4. Amaliy misollar va hayotiy bog'liqliklar keltir
5. Mumkin bo'lgan xatolar va ulardan qochish usullarini ko'rsat

YECHIM STRUKTURASI:
📋 BERILGAN: (barcha ma'lum qiymatlar)
🎯 TOPISH KERAK: (nima topilishi kerak)
📚 NAZARIY ASOS: (qaysi qonun/formula ishlatiladi va NIMA UCHUN)
🔬 YECHIM: (bosqichma-bosqich, har bir qadamni tushuntirib)
✅ JAVOB: (yakuniy natija)
💡 ESLATMA: (muhim nuqtalar, qo'shimcha ma'lumot yoki amaliy qo'llanilishi)

FORMATLASH QOIDALARI:
- LaTeX ISHLATMA! Faqat oddiy matn va Unicode belgilaridan foydalaning
- Indekslar uchun: H₂O, CO₂, H₂SO₄ (pastki indeks: ₀₁₂₃₄₅₆₇₈₉)
- Darajalar uchun: x², 10⁻³, m³ (yuqori indeks: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻)
- Kasrlar uchun: a/b ko'rinishida yoz
- Reaksiya o'qi uchun: → belgisini ishlat
- Ionlar: Ca²⁺, SO₄²⁻, OH⁻, H⁺
- Har bir bo'limni emoji bilan ajrat

TUSHUNTIRISH USLUBI:
- Murakkab tushunchalarni oddiy tilga o'tkaz
- "Bu shuni anglatadiki..." kabi iboralar ishlatib tushuntir
- Agar bir nechta usul bo'lsa, eng samaralisi tushuntir
- Formulalarni yodlash uchun eslatmalar ber
- O'quvchining savol berishi mumkin bo'lgan joylarni oldindan javobla`

async function getApiKeys() {
  let googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
  let openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  let groqApiKey = Deno.env.get('GROQ_API_KEY');

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
          if (setting.key_name === 'GROQ_API_KEY' && !groqApiKey) {
            groqApiKey = setting.key_value;
          }
        }
      }
    } catch (e) {
      console.error('Error fetching API keys from database:', e);
    }
  }

  return { googleApiKey, openaiApiKey, groqApiKey };
}

async function callGroqAPI(userPrompt: string, groqApiKey: string) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callGeminiAPI(parts: any[], googleApiKey: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { maxOutputTokens: 2000 }
    })
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gemini API error (${response.status}): ${errorText}`)
  }
  
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text
}

async function callOpenAI(messages: any[], openaiKey: string, imageData?: string) {
  const userContent: any[] = []
  
  if (imageData) {
    userContent.push({
      type: "image_url",
      image_url: { url: imageData }
    })
  }
  
  userContent.push({
    type: "text",
    text: messages[messages.length - 1].content
  })

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, imageData } = await req.json()
    
    if (!question && !imageData) {
      return new Response(
        JSON.stringify({ error: 'Savol yoki rasm yuklash kerak' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { googleApiKey, openaiApiKey, groqApiKey } = await getApiKeys();
    
    if (!googleApiKey && !openaiApiKey && !groqApiKey) {
      throw new Error('Hech qanday AI API kaliti sozlanmagan. API Sozlamalaridan kalitlarni kiriting.')
    }

    let solution: string | undefined

    // Prepare content for both APIs
    const userPrompt = imageData 
      ? (question || 'Bu rasmda ko\'rsatilgan kimyoviy masalani CHUQUR TAHLIL qiling. Har bir qadamni batafsil tushuntiring, nazariy asoslarini ayting va amaliy misollar keltiring.')
      : `Quyidagi kimyoviy masalani CHUQUR TAHLIL qiling va BATAFSIL tushuntiring:

${question}

MUHIM: Faqat javob emas, balki:
1. Nima uchun aynan shu formula/usul ishlatiladi
2. Har bir qadamning mantiqiy asosi
3. Agar kimyoviy reaksiya bo'lsa - mexanizmini tushuntir
4. Amaliy qo'llanilishi yoki hayotiy misol
5. Mumkin bo'lgan xatolar va ulardan qochish

Javobingiz o'quvchiga masalani to'liq tushunishga yordam bersin.`

    // Try Gemini first
    if (googleApiKey) {
      try {
        console.log('Trying Gemini API...')
        const parts: any[] = [{ text: systemPrompt }]
        
        if (imageData) {
          const matches = imageData.match(/^data:([^;]+);base64,(.+)$/)
          if (matches) {
            parts.push({
              inline_data: {
                mime_type: matches[1],
                data: matches[2]
              }
            })
          }
        }
        parts.push({ text: userPrompt })
        
        solution = await callGeminiAPI(parts, googleApiKey)
        console.log('Gemini API success')
      } catch (geminiError) {
        console.error('Gemini API failed:', geminiError)
        // Will try OpenAI below
      }
    }

    // Fallback to Groq if Gemini failed or not available
    if (!solution && groqApiKey) {
      try {
        console.log('Trying Groq API (fallback)...')
        solution = await callGroqAPI(userPrompt, groqApiKey)
        console.log('Groq API success')
      } catch (groqError) {
        console.error('Groq API failed:', groqError)
      }
    }

    // Fallback to OpenAI if both failed
    if (!solution && openaiApiKey) {
      try {
        console.log('Trying OpenAI API (fallback)...')
        solution = await callOpenAI(
          [{ role: 'user', content: userPrompt }],
          openaiApiKey,
          imageData
        )
        console.log('OpenAI API success')
      } catch (openaiError) {
        console.error('OpenAI API also failed:', openaiError)
      }
    }

    if (!solution) {
      throw new Error('Barcha AI xizmatlari ishlamayapti. Keyinroq qayta urinib ko\'ring.')
    }

    return new Response(
      JSON.stringify({ solution }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error solving chemistry problem:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
