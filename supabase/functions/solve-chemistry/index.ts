import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    if (!googleApiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured')
    }

    const systemPrompt = `Sen Qwen 2.5 modelsan. Kimyo, fizika, matematika va biologiya bo'yicha aniq, qisqa, ilmiy javob ber.

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

    const parts: any[] = [{ text: systemPrompt }]

    if (imageData) {
      // Extract base64 data and mime type from data URL
      const matches = imageData.match(/^data:([^;]+);base64,(.+)$/)
      if (matches) {
        parts.push({
          inline_data: {
            mime_type: matches[1],
            data: matches[2]
          }
        })
      }
      parts.push({ 
        text: question || 'Bu rasmda ko\'rsatilgan kimyoviy masalani yeching va batafsil tushuntiring.' 
      })
    } else {
      parts.push({ 
        text: `Quyidagi kimyoviy masalani batafsil yeching va tushuntiring:\n\n${question}\n\nYechimni quyidagi formatda bering:\n1. Berilganlar\n2. Topish kerak\n3. Yechim qadamlari\n4. Javob` 
      })
    }

    console.log('Sending request to Google AI...')
    
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          maxOutputTokens: 2000,
        }
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      console.error('Google AI error response:', errorData)
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Juda ko\'p so\'rov yuborildi. Iltimos, biroz kutib qayta urinib ko\'ring.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      throw new Error(`AI so'rov muvaffaqiyatsiz: ${errorData}`)
    }

    const aiData = await aiResponse.json()
    console.log('Google AI response received successfully')
    
    const solution = aiData.candidates?.[0]?.content?.parts?.[0]?.text

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
