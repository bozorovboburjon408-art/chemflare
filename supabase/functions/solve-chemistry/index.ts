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

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    const messages = []
    
    const systemPrompt = `Siz kimyo bo'yicha mutaxassis o'qituvchisiz. 

MUHIM FORMATLASH QOIDALARI:
- HECH QACHON LaTeX formatidan foydalanmang (\\frac, \\sqrt, $...$ va h.k. ISHLATMANG!)
- Kasrlar uchun oddiy yozuv: a/b yoki (a)/(b)
- Indekslar uchun Unicode belgilardan foydalaning: ₀₁₂₃₄₅₆₇₈₉ (H₂O, CO₂, H₂SO₄)
- Darajalar uchun Unicode: ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ (10², x³, 2⁻¹)
- Kimyoviy tenglamalar: reaktivlar → mahsulotlar (strelka uchun →)
- Formulalar uchun oddiy matn: m = n × M, n = m/M
- Ionlar uchun: Ca²⁺, SO₄²⁻, OH⁻, H⁺
- Matematik amallar: + - × ÷ = ≈ ≠ < > ≤ ≥

Javobni toza, o'qishga oson formatda bering.`

    if (imageData) {
      messages.push({
        role: 'system',
        content: systemPrompt
      })
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageData }
          },
          {
            type: 'text',
            text: question || 'Bu rasmda ko\'rsatilgan kimyoviy masalani yeching va batafsil tushuntiring.'
          }
        ]
      })
    } else {
      messages.push({
        role: 'system',
        content: systemPrompt
      })
      messages.push({
        role: 'user',
        content: `Quyidagi kimyoviy masalani batafsil yeching va tushuntiring:\n\n${question}\n\nYechimni quyidagi formatda bering:\n1. Berilganlar\n2. Topish kerak\n3. Yechim qadamlari\n4. Javob`
      })
    }

    console.log('Sending request to OpenAI...')
    
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 2000,
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      console.error('OpenAI API error response:', errorData)
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Juda ko\'p so\'rov yuborildi. Iltimos, biroz kutib qayta urinib ko\'ring.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (aiResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API kaliti noto\'g\'ri. Iltimos, tekshiring.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      throw new Error(`AI so'rov muvaffaqiyatsiz: ${errorData}`)
    }

    const aiData = await aiResponse.json()
    console.log('OpenAI response received successfully')
    const solution = aiData.choices[0].message.content

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
