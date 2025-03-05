
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const zApiInstanceId = Deno.env.get('ZAPI_INSTANCE_ID')
    const zApiToken = Deno.env.get('ZAPI_TOKEN')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { phone, message, name } = await req.json()

    console.log('Sending WhatsApp message:', { phone, message, name })

    const response = await fetch(`https://api.z-api.io/instances/${zApiInstanceId}/token/${zApiToken}/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        message,
      }),
    })

    if (!response.ok) {
      throw new Error(`Z-API error: ${response.statusText}`)
    }

    const result = await response.json()

    // Registrar contato no banco de dados para CRM
    if (name) {
      await supabase.from('leads').upsert({
        phone, 
        name, 
        last_contact: new Date().toISOString(),
        source: 'whatsapp_widget'
      }, {
        onConflict: 'phone'
      })
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
