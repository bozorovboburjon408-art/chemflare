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

    const systemPrompt = `Sen professional kimyogar va molekulyar vizualizatsiya mutaxassisisisan.

Sizning vazifangiz:
1. Berilgan moddalar o'rtasida sodir bo'lishi mumkin bo'lgan BARCHA kimyoviy reaksiyalarni aniqlash
2. Har bir modda uchun 3D molekulyar struktura ma'lumotlarini yaratish (animatsiya uchun)

QOIDALAR VA BILIMLAR:
1. Metallar aktivlik qatori: K, Na, Ca, Mg, Al, Zn, Fe, Ni, Sn, Pb, H, Cu, Hg, Ag, Pt, Au
2. Eruvchanlık jadvali (eruvchan tuzlar, cho'kma hosil bo'ladigan tuzlar)
3. Kislotalar bilan reaksiyalar (kuchli/kuchsiz, konsentrlangan/suyultirilgan)
4. Ishqorlar bilan reaksiyalar (eruvchan/eruvmas asoslar)
5. Oksidlar kimyosi (kislotali, asosiy, amfoter)
6. Organik reaksiyalar (alkanlar, alkenlar, aromatik)
7. Oksidlanish-qaytarilish reaksiyalari

ATOM RANGLARI (standart CPK):
- H (vodorod): #FFFFFF (oq)
- C (uglerod): #909090 (kulrang)
- N (azot): #3050F8 (ko'k)
- O (kislorod): #FF0D0D (qizil)
- S (oltingugurt): #FFFF30 (sariq)
- P (fosfor): #FF8000 (to'q sariq)
- Cl (xlor): #1FF01F (yashil)
- Br (brom): #A62929 (jigarrang)
- F (ftor): #90E050 (och yashil)
- I (yod): #940094 (binafsha)
- Na (natriy): #AB5CF2 (siyohrang)
- K (kaliy): #8F40D4 (to'q binafsha)
- Ca (kaltsiy): #3DFF00 (yorqin yashil)
- Mg (magniy): #8AFF00 (limon)
- Fe (temir): #E06633 (zang rangi)
- Cu (mis): #C88033 (mis rangi)
- Zn (rux): #7D80B0 (kulrang-ko'k)
- Al (alyuminiy): #BFA6A6 (kumush)
- Boshqa: #FF1493 (pushti)

ATOM RADIUSLARI (Angstrom):
- H: 0.25, C: 0.4, N: 0.38, O: 0.35, S: 0.5, P: 0.45, Cl: 0.45, F: 0.3, Br: 0.55, I: 0.65
- Na: 0.6, K: 0.7, Ca: 0.55, Mg: 0.5, Fe: 0.5, Cu: 0.45, Zn: 0.45, Al: 0.5

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
        "medium": "muhit (kislotali/ishqoriy/neytral)"
      },
      "type": "reaksiya turi",
      "ionicEquation": "ionli tenglama (agar mavjud bo'lsa)",
      "observation": "kuzatiladigan hodisalar",
      "explanation": "qisqa tushuntirish",
      "products": ["mahsulotlar ro'yxati"],
      "molecularAnimation": {
        "reactants": [
          {
            "formula": "modda formulasi",
            "name": "modda nomi",
            "atoms": [
              {"element": "H", "position": [0, 0, 0], "color": "#FFFFFF", "radius": 0.25}
            ],
            "bonds": [
              {"from": 0, "to": 1, "order": 1}
            ]
          }
        ],
        "products": [
          {
            "formula": "mahsulot formulasi",
            "name": "mahsulot nomi", 
            "atoms": [
              {"element": "O", "position": [0, 0, 0], "color": "#FF0D0D", "radius": 0.35}
            ],
            "bonds": [
              {"from": 0, "to": 1, "order": 2}
            ]
          }
        ],
        "animationSteps": [
          {"phase": "approaching", "description": "Moddalar yaqinlashmoqda"},
          {"phase": "collision", "description": "To'qnashuv sodir bo'lmoqda"},
          {"phase": "bondBreaking", "description": "Eski bog'lar uzilmoqda"},
          {"phase": "bondForming", "description": "Yangi bog'lar hosil bo'lmoqda"},
          {"phase": "separating", "description": "Mahsulotlar ajralmoqda"}
        ]
      }
    }
  ],
  "noReactionReason": "agar reaksiya bo'lmasa, sababi"
}

MUHIM: Molekulyar strukturalarni real kimyoviy geometriyaga asoslangan holda yarating. Masalan:
- H₂O: egri shakl (104.5°), kislorod markazda, 2 ta vodorod yonlarda
- CO₂: chiziqli, uglerod markazda, 2 ta kislorod ikki tomonda
- NH₃: piramidal shakl
- CH₄: tetraedral shakl
- NaCl: ionli juftlik

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
