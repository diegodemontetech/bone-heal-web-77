
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface ContactFormValues {
  name: string;
  phone: string;
  email: string;
  department: string;
  message: string;
  onSuccess: () => void;
}

export const useContactFormSubmit = ({ name, phone, email, department, message, onSuccess }: ContactFormValues) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !department) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to contact_leads table for admin management
      const { error } = await supabase.from('contact_leads').insert({
        name,
        phone,
        email: email || null,
        reason: department,
        source: 'contact_form',
        status: 'pending',
        message: message || null
      });
      
      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }
      
      // Also create a CRM contact in the Hunting pipeline
      try {
        // Get the first stage ID of the Hunting pipeline
        const { data: stageData } = await supabase
          .from('crm_stages')
          .select('id')
          .eq('pipeline_id', 'a1f15c3f-5c88-4a9a-b867-6107e160f045') // Hunting Ativo pipeline ID
          .order('order_index', { ascending: true })
          .limit(1);
        
        if (stageData && stageData.length > 0) {
          const stageId = stageData[0].id;
          
          // Create CRM contact
          await supabase.from('crm_contacts').insert({
            full_name: name,
            whatsapp: phone,
            email: email || null,
            pipeline_id: 'a1f15c3f-5c88-4a9a-b867-6107e160f045', // Hunting Ativo pipeline ID
            stage_id: stageId,
            observations: `Contato via formulário do site. Departamento: ${department}. Mensagem: ${message}`,
            client_type: 'Lead'
          });
        }
      } catch (crmError) {
        // Log CRM creation error but don't fail the submission
        console.error('Error creating CRM contact:', crmError);
      }
      
      // Notify the team via email about the new contact
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: `consultoria@boneheal.com.br, ${department === 'Comercial' ? 'vendas@boneheal.com.br' : 
              department === 'Logística' ? 'logistica@boneheal.com.br' : 'sac@boneheal.com.br'}`,
            subject: `Novo contato via site - ${department}`,
            text: `
              Nome: ${name}
              Telefone: ${phone}
              Email: ${email || 'Não informado'}
              Departamento: ${department}
              Mensagem: ${message || 'Não informada'}
            `,
            html: `
              <h2>Novo contato via site - ${department}</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email || 'Não informado'}</p>
              <p><strong>Departamento:</strong> ${department}</p>
              <p><strong>Mensagem:</strong> ${message || 'Não informada'}</p>
            `
          }
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // Don't fail the submission if email fails
      }
      
      toast.success("Mensagem enviada com sucesso!");
      onSuccess();
      
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
