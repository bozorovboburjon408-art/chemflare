import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `Sen kimyo, fizika, matematika va biologiya bo'yicha aniq, qisqa, ilmiy javob beradigan AI yordamchisan.

VAZIFALAR:
1. Reaksiyalarni to'g'ri yozib, tengla va izohla
2. Kalkulyatorda mol, massa, konsentratsiya va matematik hisoblarni bosqichma-bosqich yech
3. Javobni aniq, tushunarli va ilmiy asosda ber

FORMATLASH QOIDALARI:
- LaTeX ISHLATMA! Faqat oddiy matn va Unicode belgilaridan foydalaning
- Indekslar uchun: H₂O, CO₂, H₂SO₄ (pastki indeks: ₀₁₂₃₄₅₆₇₈₉)
- Darajalar uchun: x², 10⁻³, m³ (yuqori indeks: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻)
- Kasrlar uchun: a/b ko'rinishida yoz
- Reaksiya o'qi uchun: → belgisini ishlat
- Ionlar: Ca²⁺, SO₄²⁻, OH⁻, H⁺`

async function getApiKeys() {
  // Check multiple env var names for Google API key
  let googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
  let openaiApiKey = Deno.env.get('OPENAI_API_KEY');

  // If not found, try database
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

    const { googleApiKey, openaiApiKey } = await getApiKeys();
    
    if (!googleApiKey && !openaiApiKey) {
      throw new Error('Hech qanday AI API kaliti sozlanmagan. API Sozlamalaridan kalitlarni kiriting.')
    }

    let solution: string | undefined

    // Prepare content for both APIs
    const userPrompt = imageData 
      ? (question || 'Bu rasmda ko\'rsatilgan kimyoviy masalani yeching va batafsil tushuntiring.')
      : `Quyidagi kimyoviy masalani batafsil yeching va tushuntiring:\n\n${question}\n\nYechimni quyidagi formatda bering:\n1. Berilganlar\n2. Topish kerak\n3. Yechim qadamlari\n4. Javob`

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

    // Fallback to OpenAI if Gemini failed or not available
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
        throw new Error('Barcha AI xizmatlari ishlamayapti. Keyinroq qayta urinib ko\'ring.')
      }
    }

    if (!solution) {
      throw new Error('AI javob bermadi')
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
