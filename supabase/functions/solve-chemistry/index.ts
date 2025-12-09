import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `Sen tajribali kimyo o'qituvchisisan. Har qanday kimyoviy masalani oddiy, tushunarli va qiziqarli tarzda yechib berassan.

🎯 ASOSIY MAQSAD: O'quvchi yechimni o'qib, hamma narsani to'liq tushunib olishi kerak!

📝 JAVOB STRUKTURASI (ALBATTA SHU TARTIBDA BO'LSIN):

1. Berilganlar
   - Masalada berilgan barcha ma'lumotlarni aniq yoz
   - Har bir kattalikni o'z birligi bilan ko'rsat

2. Topish kerak
   - Nimani hisoblash/topish kerakligini aniq ko'rsat

3. Yechim
   - Har bir qadamni ALOHIDA satr qilib yoz
   - Formula yozilganda uni IZOHLA (bu formula nima uchun kerak)
   - Sonlarni qo'yganda QAYERDAN KELGANINI ayt
   - Oraliq natijalarni ham ko'rsat
   - Murakkab hisob-kitoblarni bosqichlarga bo'l

4. Javob
   - Yakuniy javobni aniq va to'liq yoz
   - Birliklarni ALBATTA ko'rsat

5. Izoh (agar kerak bo'lsa)
   - Qo'shimcha tushuntirishlar
   - Amaliy misollar
   - Esda qolishi kerak bo'lgan muhim ma'lumotlar

✍️ YOZISH USLUBI:
- Har bir gap oddiy va tushunarli bo'lsin
- "Chunki", "Demak", "Shunday qilib" so'zlarini ishlatib bog'la
- Formulalarni yozgandan keyin izoh ber: "Bu yerda M - molyar massa, m - massa, n - mol"
- Raqamlarni yozganda birliklarni yonida ko'rsat: 36 g, 2 mol, 22.4 L

⚗️ KIMYOVIY YOZUV QOIDALARI:
- Formulalar: H₂O, CO₂, H₂SO₄, NaCl (pastki indeks: ₀₁₂₃₄₅₆₇₈₉)
- Ionlar: Ca²⁺, SO₄²⁻, OH⁻, H⁺, Fe³⁺ (yuqori indeks: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻)
- Reaksiya: → belgisi ishlatilsin
- Kasrlar: a/b ko'rinishida
- LaTeX ISHLATMA, faqat Unicode belgilar!

💡 MUHIM: Javob shunday bo'lsinki, o'quvchi birinchi marta o'qib tushunib olsin!`

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

    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY')
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!googleApiKey && !openaiKey) {
      throw new Error('Hech qanday AI API kaliti sozlanmagan')
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
    if (!solution && openaiKey) {
      try {
        console.log('Trying OpenAI API (fallback)...')
        solution = await callOpenAI(
          [{ role: 'user', content: userPrompt }],
          openaiKey,
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
