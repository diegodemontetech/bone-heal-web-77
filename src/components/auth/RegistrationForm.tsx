
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserRole } from "@/types/auth";

// Importação dos componentes de formulário
import AccountFormSection from "./form-sections/AccountFormSection";
import ProfessionalFormSection from "./form-sections/ProfessionalFormSection";
import AddressFormSection from "./form-sections/AddressFormSection";
import DocumentsFormSection from "./form-sections/DocumentsFormSection";
import NewsletterFormSection from "./form-sections/NewsletterFormSection";
import { useRegistrationFormLogic } from "./form-logic/RegistrationFormLogic";

// Alterando a regex do telefone para aceitar o formato brasileiro
const phoneRegex = new RegExp(
  /^(\([0-9]{2}\)\s?[0-9]{4,5}-[0-9]{4})$/
);

export const DentistSignUpSchema = z.object({
  pessoa_tipo: z.string().min(1, {
    message: "Selecione o tipo de pessoa."
  }),
  fullName: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  responsavel_tecnico: z.string().optional(),
  cpf_responsavel: z.string().optional(),
  cro_responsavel: z.string().optional(),
  epao: z.string().optional(),
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
}).refine(data => {
  // Se for pessoa física, CPF é obrigatório
  if (data.pessoa_tipo === 'fisica') {
    return !!data.cpf && data.cpf.length >= 11;
  }
  
  // Se for pessoa jurídica, CNPJ e dados do responsável técnico são obrigatórios
  if (data.pessoa_tipo === 'juridica') {
    return !!data.cnpj && 
           data.cnpj.length >= 14 && 
           !!data.responsavel_tecnico &&
           !!data.cpf_responsavel &&
           !!data.cro_responsavel;
  }
  
  return false;
}, {
  message: "Preencha os dados obrigatórios para o tipo de pessoa selecionado",
  path: ["pessoa_tipo"]
});

export type FormData = z.infer<typeof DentistSignUpSchema>;

interface RegistrationFormProps {
  isDentist?: boolean;
  isModal?: boolean;
  onSuccess?: (customer: any) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  isDentist = true, 
  isModal = false,
  onSuccess
}) => {
  const { onSubmit, submitting, syncingWithOmie } = useRegistrationFormLogic(isModal, onSuccess);

  const form = useForm<FormData>({
    resolver: zodResolver(DentistSignUpSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
      fullName: "",
      razao_social: "",
      nome_fantasia: "",
      responsavel_tecnico: "",
      cpf_responsavel: "",
      cro_responsavel: "",
      epao: "",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AccountFormSection form={form} showPassword={true} />
        
        <ProfessionalFormSection form={form} />
        
        <AddressFormSection form={form} />
        
        <DocumentsFormSection form={form} />
        
        <NewsletterFormSection form={form} />

        <Button type="submit" disabled={submitting || syncingWithOmie} className="w-full">
          {submitting || syncingWithOmie ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {syncingWithOmie ? "Sincronizando..." : "Cadastrando..."}
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
