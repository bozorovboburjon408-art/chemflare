import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_PASSWORD = "admin77";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const adminPassword = formData.get('password') as string;
    const pdfFile = formData.get('pdf') as File;
    const bookTitle = formData.get('title') as string;
    const bookAuthor = formData.get('author') as string;
    const bookTopic = formData.get('topic') as string;
    const bookDescription = formData.get('description') as string;
    const difficultyLevel = parseInt(formData.get('difficulty_level') as string) || 1;

    // Validate admin password
    if (adminPassword !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Noto'g'ri admin paroli" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pdfFile || !bookTitle || !bookTopic) {
      return new Response(
        JSON.stringify({ error: "PDF fayl, kitob nomi va mavzu majburiy" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF: ${pdfFile.name}, size: ${pdfFile.size}`);

    // Save to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload PDF to storage
    const pdfArrayBuffer = await pdfFile.arrayBuffer();
    const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
    const fileName = `${Date.now()}-${pdfFile.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('book-files')
      .upload(fileName, pdfUint8Array, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      console.error("PDF upload error:", uploadError);
      throw new Error("PDF yuklashda xatolik: " + uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('book-files')
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;
    console.log("PDF uploaded:", pdfUrl);

    // Create book record
    const { data: newBook, error: bookError } = await supabase
      .from('chemistry_books')
      .insert({
        title: bookTitle,
        author: bookAuthor || null,
        description: bookDescription || null,
        topic: bookTopic,
        difficulty_level: difficultyLevel,
        pdf_url: pdfUrl,
      })
      .select()
      .single();

    if (bookError) {
      console.error("Book insert error:", bookError);
      throw new Error("Kitob saqlashda xatolik: " + bookError.message);
    }

    console.log("Book created:", newBook.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Kitob muvaffaqiyatli yuklandi",
        book: newBook
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Noma'lum xatolik" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
