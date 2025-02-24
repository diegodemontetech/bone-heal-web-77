
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RegistrationFormFields from "./RegistrationFormFields";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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

type FormData = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['dental-specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar especialidades:', error);
        throw error;
      }

      return data.map(specialty => ({
        ...specialty,
        created_at: specialty.created_at || new Date().toISOString()
      }));
    },
  });

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['omie-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omie_cities')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar cidades:', error);
        throw error;
      }

      return data || [];
    },
  });

  const form = useForm<FormData>({
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
    } as FormData,
  });

  async function onSubmit(values: FormData) {
    try {
      setLoading(true);
      setError(null);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            cro: values.cro,
            specialty: values.specialty,
            address: values.address,
            city: values.city,
            state: values.state,
            neighborhood: values.neighborhood,
            zip_code: values.zipCode,
            phone: values.phone || '',
            cnpj: values.cnpj || '',
            receive_news: values.receiveNews,
          }
        }
      });

      if (signUpError) {
        console.error('Erro no signUp:', signUpError);
        throw signUpError;
      }

      console.log('Registro realizado com sucesso:', signUpData);
      
      toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao realizar cadastro. Por favor, tente novamente.');
      toast.error(error.message || 'Erro ao realizar cadastro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loadingSpecialties || loadingCities) {
    return <div>Carregando...</div>;
  }

  return (
    <Form {...form}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegistrationFormFields 
          specialties={specialties || []} 
          form={form} 
          cities={cities || []}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
