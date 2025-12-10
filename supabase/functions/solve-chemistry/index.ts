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

async function callGemini(messages: any[], geminiKey: string, imageData?: string) {
  const parts: any[] = []
  
  if (imageData) {
    // Extract base64 data from data URL
    const base64Match = imageData.match(/^data:image\/(\w+);base64,(.+)$/)
    if (base64Match) {
      parts.push({
        inline_data: {
          mime_type: `image/${base64Match[1]}`,
          data: base64Match[2]
        }
      })
    }
  }
  
  parts.push({
    text: messages[messages.length - 1].content
  })

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
          parts: [{ text: 'Tushunarli, men professional kimyo o\'qituvchisi sifatida yordam beraman.' }]
        },
        {
          role: 'user',
          parts: parts
        }
      ],
      generationConfig: {
        maxOutputTokens: 8000,
        temperature: 0.7
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', errorText)
    throw new Error(`Gemini API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text
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

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY sozlanmagan')
    }

    // Prepare content
    const userPrompt = imageData 
      ? (question || 'Bu rasmda ko\'rsatilgan kimyoviy masalani yeching va batafsil tushuntiring.')
      : `Quyidagi kimyoviy masalani batafsil yeching va tushuntiring:\n\n${question}\n\nYechimni quyidagi formatda bering:\n1. Berilganlar\n2. Topish kerak\n3. Yechim qadamlari\n4. Javob`

    console.log('Using Gemini API...')
    
    const solution = await callGemini(
      [{ role: 'user', content: userPrompt }],
      geminiKey,
      imageData
    )
    
    console.log('Gemini API success')

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