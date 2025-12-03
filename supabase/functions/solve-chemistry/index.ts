const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')
    
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured')
    }

    // Use Lovable AI to solve the chemistry problem
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

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 2000,
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      console.error('AI Gateway error response:', errorData)
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Juda ko\'p so\'rov yuborildi. Iltimos, biroz kutib qayta urinib ko\'ring.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI xizmati uchun to\'lov kerak. Iltimos, admin bilan bog\'laning.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      throw new Error(`AI so'rov muvaffaqiyatsiz: ${errorData}`)
    }

    const aiData = await aiResponse.json()
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
