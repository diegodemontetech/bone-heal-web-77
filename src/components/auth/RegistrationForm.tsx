
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RegistrationFormFields from "./RegistrationFormFields";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pessoa_tipo: "fisica",
    },
    mode: "onChange",
  });

  const { data: specialties, isLoading: specialtiesLoading, error } = useQuery({
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
      console.log('Starting registration process with data:', data);
      
      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        if (authError.message.includes('already exists')) {
          toast.error("Este email já está cadastrado.");
        } else {
          toast.error("Erro ao criar conta. Por favor, tente novamente.");
        }
        return;
      }

      if (!authData.user) {
        console.error('No user data returned');
        toast.error("Erro ao criar conta. Por favor, tente novamente.");
        return;
      }

      // 2. Create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            pessoa_tipo: data.pessoa_tipo,
            full_name: data.fullName,
            razao_social: data.razao_social,
            nome_fantasia: data.nome_fantasia,
            cpf: data.cpf,
            cnpj: data.cnpj,
            address: data.address,
            address_number: data.address_number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            phone: data.phone,
            specialty_id: data.specialty,
            cro: data.cro,
            sync_with_omie: true
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast.error("Erro ao criar perfil. Por favor, tente novamente.");
        // Try to clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        return;
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate('/');

    } catch (err) {
      console.error('Registration error:', err);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    }
  };

  if (error) {
    console.error('Error in specialties query:', error);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <RegistrationFormFields form={form} specialties={specialties || []} />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || specialtiesLoading || !form.formState.isValid}
        >
          {isSubmitting ? "Registrando..." : specialtiesLoading ? "Carregando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationForm;
