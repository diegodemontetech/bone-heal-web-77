
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { RegistrationFormFields } from "./RegistrationFormFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres.",
  }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, {
    message: "Nome deve ter no mínimo 2 caracteres.",
  }),
  cnpj: z.string().optional(),
  cro: z.string().min(4, {
    message: "CRO inválido.",
  }),
  specialty: z.string({
    required_error: "Selecione uma especialidade.",
  }),
  address: z.string().min(2, {
    message: "Endereço deve ter no mínimo 2 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Cidade deve ter no mínimo 2 caracteres.",
  }),
  state: z.string().length(2, {
    message: "UF deve ter 2 caracteres.",
  }),
  neighborhood: z.string().min(2, {
    message: "Bairro deve ter no mínimo 2 caracteres.",
  }),
  zipCode: z.string().length(8, {
    message: "CEP deve ter 8 dígitos.",
  }),
  phone: z.string().optional(),
  receiveNews: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem.",
  path: ["confirmPassword"],
});

export default function RegistrationForm() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      cnpj: "",
      cro: "",
      specialty: "",
      address: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
      receiveNews: false,
    },
  });

  useEffect(() => {
    const fetchSpecialties = async () => {
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*');

      if (error) {
        console.error('Erro ao buscar especialidades:', error);
        toast.error('Erro ao carregar especialidades');
        return;
      }

      if (data) {
        console.log('Especialidades carregadas:', data);
        setSpecialties(data);
      }
    };

    fetchSpecialties();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          }
        }
      });

      if (error) throw error;

      toast.success('Cadastro realizado com sucesso! Verifique seu email.');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error('Erro ao realizar cadastro');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegistrationFormFields form={form} specialties={specialties} />
        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}
