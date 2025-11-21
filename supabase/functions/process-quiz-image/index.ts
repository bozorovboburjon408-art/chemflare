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

    // Get API key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Call Lovable AI to analyze both images and extract questions with correct answers
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Siz test savollarini va javoblarini tahlil qiluvchi yordamchisiz. 
            
Birinchi rasmda test savollari, ikkinchi rasmda esa to'g'ri javoblar bor.

Har bir savol uchun:
- question_text: Savol matni (to'liq)
- option_a, option_b, option_c, option_d: 4 ta javob varianti
- correct_answer: To'g'ri javob (A, B, C yoki D) - ikkinchi rasmdan oling
- explanation: Qisqa tushuntirish (ixtiyoriy)

MUHIM: 
1. Faqat JSON formatida javob bering, boshqa matn qo'shmang!
2. To'g'ri javoblarni ikkinchi rasmdan oling va birinchi rasmdagi savol tartibiga mos ravishda qo'ying.
3. Agar savollar va javoblar soni bir xil bo'lmasa, xato qaytaring.`
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
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error('AI processing failed');
    }

    const aiResponse = await response.json();
    console.log('AI Response received');

    // Parse AI response
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from AI');
    }

    // Clean JSON response (remove markdown formatting if present)
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

    // Get user from authorization header
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

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Create quiz
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

    // Insert questions
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
