import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, answersImageBase64, title } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Questions image is required');
    }
    
    if (!answersImageBase64) {
      throw new Error('Answers image is required');
    }

    console.log('Processing quiz images...');

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const systemPrompt = `Sen Qwen 2.5 modelsan. Test rasmlarini tahlil qilib, aniq va to'g'ri ma'lumot ber.

Birinchi rasmda test savollari, ikkinchi rasmda esa to'g'ri javoblar bor.

Har bir savol uchun:
- question_text: Savol matni (to'liq)
- option_a, option_b, option_c, option_d: 4 ta javob varianti
- correct_answer: To'g'ri javob (A, B, C yoki D) - ikkinchi rasmdan oling
- explanation: Qisqa tushuntirish

MUHIM: Faqat JSON formatida javob ber, boshqa matn qo'shma!`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'BIRINCHI RASM - Test savollari:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              },
              {
                type: 'text',
                text: 'IKKINCHI RASM - To\'g\'ri javoblar:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: answersImageBase64
                }
              },
              {
                type: 'text',
                text: 'Ikkala rasmni tahlil qilib, savollarni javoblari bilan birga JSON formatida qaytaring:'
              }
            ]
          }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API kaliti noto\'g\'ri. Iltimos, tekshiring.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error('AI processing failed');
    }

    const aiResponse = await response.json();
    console.log('OpenAI response received');

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from AI');
    }

    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const questions = JSON.parse(jsonStr);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No valid questions found in the images');
    }

    console.log(`Successfully extracted ${questions.length} questions with answers`);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: quiz, error: quizError } = await supabaseClient
      .from('quizzes')
      .insert({
        user_id: user.id,
        title: title || `Test - ${new Date().toLocaleDateString('uz-UZ')}`,
        description: `${questions.length} ta savol`,
      })
      .select()
      .single();

    if (quizError) {
      console.error('Quiz creation error:', quizError);
      throw new Error('Failed to create quiz');
    }

    const questionsToInsert = questions.map((q: any, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation || null,
      order_num: index + 1,
    }));

    const { error: questionsError } = await supabaseClient
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error('Questions insertion error:', questionsError);
      throw new Error('Failed to insert questions');
    }

    return new Response(
      JSON.stringify({
        success: true,
        quizId: quiz.id,
        questionCount: questions.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing quiz image:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
