
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth-context";
import { Loader2 } from "lucide-react";
import { UserRole } from "@/types/auth";
import { toast } from "sonner";

// Importação dos componentes de formulário
import AccountFormSection from "./form-sections/AccountFormSection";
import ProfessionalFormSection from "./form-sections/ProfessionalFormSection";
import AddressFormSection from "./form-sections/AddressFormSection";
import DocumentsFormSection from "./form-sections/DocumentsFormSection";
import NewsletterFormSection from "./form-sections/NewsletterFormSection";

// Alterando a regex do telefone para aceitar o formato brasileiro
const phoneRegex = new RegExp(
  /^(\([0-9]{2}\)\s?[0-9]{4,5}-[0-9]{4})$/
);

export const DentistSignUpSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  cro: z.string().min(5, {
    message: "CRO deve ter pelo menos 5 caracteres.",
  }),
  specialty: z.string().min(2, {
    message: "Especialidade deve ter pelo menos 2 caracteres.",
  }),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  endereco_numero: z.string().min(1, {
    message: "Número é obrigatório",
  }),
  complemento: z.string().optional(),
  city: z.string().min(3, {
    message: "Cidade deve ter pelo menos 3 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado deve ter pelo menos 2 caracteres.",
  }),
  neighborhood: z.string().min(3, {
    message: "Bairro deve ter pelo menos 3 caracteres.",
  }),
  zipCode: z.string().min(8, {
    message: "CEP deve ter 8 caracteres.",
  }),
  phone: z.string().regex(phoneRegex, {
    message: "Formato de telefone inválido. Use (XX) XXXXX-XXXX.",
  }),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  receiveNews: z.boolean().default(false),
});

export type FormData = z.infer<typeof DentistSignUpSchema>;

interface RegistrationFormProps {
  isDentist?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isDentist = true }) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { signUp } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(DentistSignUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      cro: "",
      specialty: "",
      address: "",
      endereco_numero: "",
      complemento: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
      cnpj: "",
      cpf: "",
      receiveNews: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      const signUpResult = await signUp(data.email, data.password, {
        full_name: data.fullName,
        cro: data.cro,
        specialty: data.specialty,
        address: data.address,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        zip_code: data.zipCode,
        phone: data.phone,
        cnpj: data.cnpj,
        cpf: data.cpf,
        complemento: data.complemento,
        endereco_numero: data.endereco_numero,
        receive_news: data.receiveNews,
        role: UserRole.DENTIST
      });
      
      // Verificar se o cadastro foi realizado com sucesso
      if (signUpResult && signUpResult.user) {
        // Tentar sincronizar com o Omie
        try {
          console.log("Sincronizando usuário com Omie:", signUpResult.user.id);
          const response = await fetch(`${window.location.origin}/api/omie-customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: signUpResult.user.id }),
          });
          
          const result = await response.json();
          
          if (result.success) {
            toast.success("Perfil sincronizado com o Omie");
          } else {
            console.error("Erro ao sincronizar com o Omie:", result.error);
            toast.error("Erro ao sincronizar com o Omie: " + (result.error || "Erro desconhecido"));
          }
        } catch (omieError) {
          console.error("Erro ao fazer requisição para o Omie:", omieError);
        }
      }
      
      // Mostrar mensagem de sucesso
      toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      
      // Redirecionar para a página de login
      navigate('/login');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error("Erro ao realizar cadastro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AccountFormSection form={form} />
        
        <ProfessionalFormSection form={form} />
        
        <AddressFormSection form={form} />
        
        <DocumentsFormSection form={form} />
        
        <NewsletterFormSection form={form} />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
