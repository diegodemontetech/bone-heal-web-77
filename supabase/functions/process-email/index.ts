
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { Resend } from 'npm:resend'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  template_id: string;
  recipient_email: string;
  recipient_name?: string;
  variables: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!supabaseUrl || !supabaseKey || !resendApiKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const resend = new Resend(resendApiKey)
    
    const { template_id, recipient_email, recipient_name, variables }: EmailRequest = await req.json()

    // Buscar o template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', template_id)
      .single()

    if (templateError) throw templateError

    // Substituir variáveis no template
    let body = template.body
    let subject = template.subject

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      body = body.replace(regex, String(value))
      subject = subject.replace(regex, String(value))
    })

    // Enviar email
    const emailResponse = await resend.emails.send({
      from: 'Bone Heal <contato@boneheal.com.br>',
      to: recipient_email,
      subject: subject,
      html: body,
    })

    // Registrar o envio
    const { error: logError } = await supabase
      .from('email_logs')
      .insert([{
        template_id,
        recipient_email,
        recipient_name,
        subject,
        body,
        variables_used: variables,
        status: emailResponse.error ? 'error' : 'sent',
        error_message: emailResponse.error?.message
      }])

    if (logError) throw logError

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
