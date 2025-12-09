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
    const { substances } = await req.json()
    
    if (!substances || !Array.isArray(substances) || substances.length < 1) {
      return new Response(
        JSON.stringify({ error: 'Kamida bitta modda kiritish kerak' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY')
    
    if (!googleApiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not configured')
    }

    const systemPrompt = `Sen Qwen 2.5 modelsan. Kimyo bo'yicha aniq, qisqa, ilmiy javob ber.

Sizning vazifangiz berilgan moddalar o'rtasida sodir bo'lishi mumkin bo'lgan BARCHA kimyoviy reaksiyalarni aniqlash va tushuntirish.

QOIDALAR VA BILIMLAR:
1. Metallar aktivlik qatori: K, Na, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, H, Cu, Hg, Ag, Pt, Au
2. Eruvchanlık jadvali (eruvchan tuzlar, cho'kma hosil bo'ladigan tuzlar)
3. Kislotalar bilan reaksiyalar (kuchli/kuchsiz, konsentrlangan/suyultirilgan)
4. Ishqorlar bilan reaksiyalar (eruvchan/eruvmas asoslar)
5. Oksidlar kimyosi (kislotali, asosiy, amfoter)
6. Organik reaksiyalar (alkanlar, alkenlar, aromatik)
7. Oksidlanish-qaytarilish reaksiyalari
8. Amfoter xususiyat (Al, Zn va ularning oksid/gidroksidlari)

HAR BIR REAKSIYA UCHUN QAYTARING:
{
  "possible": true/false,
  "reactions": [
    {
      "equation": "to'liq muvozanatlashgan tenglama",
      "conditions": {
        "temperature": "harorat (agar kerak bo'lsa)",
        "pressure": "bosim (agar kerak bo'lsa)", 
        "catalyst": "katalizator (agar kerak bo'lsa)",
        "medium": "muhit (kislotali/ishqoriy/neytral)",
        "concentration": "konsentratsiya (agar muhim bo'lsa)"
      },
      "type": "reaksiya turi",
      "ionicEquation": "ionli tenglama (agar mavjud bo'lsa)",
      "observation": "kuzatiladigan hodisalar (rang o'zgarishi, gaz, cho'kma)",
      "explanation": "qisqa tushuntirish",
      "products": ["mahsulotlar ro'yxati"]
    }
  ],
  "noReactionReason": "agar reaksiya bo'lmasa, sababi"
}

Javobni faqat JSON formatida bering.`;

    const userPrompt = `Quyidagi moddalar o'rtasida sodir bo'lishi mumkin bo'lgan BARCHA reaksiyalarni aniqlang va batafsil tahlil qiling:

Moddalar: ${substances.join(', ')}

Eslatma: 
- Agar bir nechta moddalar berilgan bo'lsa, ularning har bir kombinatsiyasini tekshiring
- Har xil sharoitlardagi turli reaksiyalarni ko'rsating
- Real kimyoviy qoidalarga rioya qiling`;

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    let result: string | undefined
    let usedProvider = ''

    // Try Google AI first
    console.log('Trying Google AI...')
    try {
      const googleResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        })
      })

      if (googleResponse.ok) {
        const googleData = await googleResponse.json()
        result = googleData.candidates?.[0]?.content?.parts?.[0]?.text
        if (result) {
          usedProvider = 'Google AI'
          console.log('Google AI response received successfully')
        }
      } else {
        const errorText = await googleResponse.text()
        console.log('Google AI failed, trying OpenAI fallback...', errorText)
      }
    } catch (e) {
      console.log('Google AI error, trying OpenAI fallback...', e)
    }

    // Fallback to OpenAI if Google AI failed
    if (!result && openaiApiKey) {
      console.log('Using OpenAI fallback...')
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
      })

      if (openaiResponse.ok) {
        const openaiData = await openaiResponse.json()
        result = openaiData.choices?.[0]?.message?.content
        usedProvider = 'OpenAI'
        console.log('OpenAI response received successfully')
      } else {
        const errorText = await openaiResponse.text()
        console.error('OpenAI also failed:', errorText)
        throw new Error('Barcha AI xizmatlari ishlamayapti')
      }
    }

    console.log(`Response received from ${usedProvider}`)
    
    if (!result) {
      throw new Error('AI javob bermadi')
    }
    
    // Clean up JSON from markdown code blocks if present
    result = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Parse and validate JSON
    let parsedResult
    try {
      parsedResult = JSON.parse(result)
    } catch (e) {
      console.error('JSON parse error:', e, 'Raw result:', result)
      return new Response(
        JSON.stringify({ error: 'AI javobini qayta ishlashda xatolik', raw: result }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating reaction:', error)
    const errorMessage = error instanceof Error ? error.message : 'Noma\'lum xatolik yuz berdi'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
