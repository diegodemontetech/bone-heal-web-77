
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
  cpf: z.string().min(11, {
    message: "CPF deve ter 11 dígitos.",
  }),
  receiveNews: z.boolean().default(false),
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
