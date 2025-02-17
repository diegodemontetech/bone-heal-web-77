
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

interface EmailRequest {
  event_type: string
  recipient_email: string
  recipient_name?: string
  variables: Record<string, string>
}

const replaceVariables = (text: string, variables: Record<string, string>) => {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => variables[key] || match)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { event_type, recipient_email, recipient_name, variables }: EmailRequest = await req.json()

    // Busca o template ativo para o evento
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('event_type', event_type)
      .eq('active', true)
      .single()

    if (templateError || !template) {
      throw new Error(`Template not found for event: ${event_type}`)
    }

    // Substitui as variáveis no assunto e corpo do email
    const subject = replaceVariables(template.subject, variables)
    const html = replaceVariables(template.body, variables)

    console.log('Sending email:', {
      event_type,
      recipient_email,
      subject,
      variables
    })

    // Envia o email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: 'Bone Heal <onboarding@resend.dev>',
      to: recipient_email,
      subject,
      html,
    })

    if (emailError) throw emailError

    // Registra o envio no log
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        template_id: template.id,
        recipient_email,
        recipient_name,
        subject,
        body: html,
        variables_used: variables,
        status: 'sent'
      })

    if (logError) {
      console.error('Error logging email:', logError)
    }

    return new Response(
      JSON.stringify({ success: true, data: emailResult }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
