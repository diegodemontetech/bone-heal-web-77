
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EventRequest {
  event_type: string;
  data: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { event_type, data }: EventRequest = await req.json()

    // Buscar templates ativos para este evento
    const { data: templates, error: templatesError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('trigger_event', event_type)
      .eq('active', true)
      .eq('auto_send', true)

    if (templatesError) throw templatesError

    // Processar cada template
    const emailPromises = templates.map(template => 
      supabase.functions.invoke('process-email', {
        body: {
          template_id: template.id,
          recipient_email: data.email,
          recipient_name: data.name,
          variables: data
        }
      })
    )

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing event:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
