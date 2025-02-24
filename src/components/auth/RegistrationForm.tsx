
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RegistrationFormFields from "./RegistrationFormFields";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  pessoa_tipo: z.enum(['fisica', 'juridica'], {
    required_error: "Você precisa selecionar o tipo de pessoa.",
  }),
  fullName: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().min(5, {
    message: "Endereço deve ter pelo menos 5 caracteres.",
  }),
  address_number: z.string().min(1, {
    message: "Número do endereço é obrigatório.",
  }),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, {
    message: "Bairro deve ter pelo menos 3 caracteres.",
  }),
  city: z.string().min(3, {
    message: "Cidade deve ter pelo menos 3 caracteres.",
  }),
  state: z.string().min(2, {
    message: "Estado deve ter pelo menos 2 caracteres.",
  }),
  zip_code: z.string().min(8, {
    message: "CEP deve ter pelo menos 8 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string(),
  specialty: z.string().uuid({
    message: "Selecione uma especialidade válida.",
  }),
  cro: z.string().min(3, {
    message: "CRO deve ter pelo menos 3 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

export type FormData = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
    },
    mode: "onChange", // Enable real-time validation
  });

  const { data: specialties, isLoading, error } = useQuery({
    queryKey: ['dental-specialties'],
    queryFn: async () => {
      console.log('Fetching dental specialties...');
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching specialties:', error);
        toast.error('Erro ao carregar especialidades');
        throw error;
      }
      
      console.log('Fetched specialties:', data);
      return data;
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form data:', data);
      // ... rest of your submission logic
      toast.success("Cadastro realizado com sucesso!");
    } catch (err) {
      console.error('Registration error:', err);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    }
  };

  if (error) {
    console.error('Error in specialties query:', error);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <RegistrationFormFields form={form} specialties={specialties || []} />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Carregando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
