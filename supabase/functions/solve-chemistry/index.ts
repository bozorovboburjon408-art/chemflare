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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const authHeader = req.headers.get('Authorization')!

    // Use Lovable AI to solve the chemistry problem
    const messages = []
    
    if (imageData) {
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
        role: 'user',
        content: `Siz kimyo bo'yicha mutaxassis o'qituvchisiz. Quyidagi kimyoviy masalani batafsil yeching va tushuntiring:\n\n${question}\n\nYechimni quyidagi formatda bering:\n1. Berilganlar\n2. Topish kerak\n3. Yechim qadamlari\n4. Javob`
      })
    }

    const aiResponse = await fetch(`${supabaseUrl}/functions/v1/lovable-ai`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 2000,
        temperature: 0.3,
      })
    })

    if (!aiResponse.ok) {
      const errorData = await aiResponse.text()
      throw new Error(`AI request failed: ${errorData}`)
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
