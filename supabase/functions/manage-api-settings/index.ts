import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_CODE = "admin77";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, adminCode, settings, keyName } = await req.json();

    // Verify admin code
    if (adminCode !== ADMIN_CODE) {
      return new Response(
        JSON.stringify({ error: "Noto'g'ri admin kod" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === 'get') {
      // Get all API settings
      const { data, error } = await supabase
        .from('api_settings')
        .select('key_name, key_value');

      if (error) {
        console.error('Error fetching settings:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ settings: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'save') {
      // Save API settings
      for (const setting of settings) {
        if (!setting.key_value || setting.key_value.trim() === '') continue;

        const { error } = await supabase
          .from('api_settings')
          .upsert(
            { key_name: setting.key_name, key_value: setting.key_value },
            { onConflict: 'key_name' }
          );

        if (error) {
          console.error('Error saving setting:', error);
          throw error;
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'delete') {
      // Delete API setting
      if (!keyName) {
        return new Response(
          JSON.stringify({ error: "keyName majburiy" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase
        .from('api_settings')
        .delete()
        .eq('key_name', keyName);

      if (error) {
        console.error('Error deleting setting:', error);
        throw error;
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Noma'lum amal" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in manage-api-settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
