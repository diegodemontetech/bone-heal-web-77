
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RegistrationFormFields from "./RegistrationFormFields";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-context";
import { UserRole } from "@/types/auth";

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  razao_social: string;
  nome_fantasia: string;
  cpf: string;
  cnpj: string;
  address: string;
  addressNumber: string;
  omie_city_code: string;
  cro: string;
  specialty: string;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  phone: string;
  receiveNews: boolean;
  pessoa_tipo: 'fisica' | 'juridica';
}

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      razao_social: "",
      nome_fantasia: "",
      cpf: "",
      cnpj: "",
      address: "",
      addressNumber: "",
      omie_city_code: "",
      cro: "",
      specialty: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
      receiveNews: false,
      pessoa_tipo: 'fisica'
    }
  });

  const { data: specialties, isLoading: loadingSpecialties } = useQuery({
    queryKey: ['dental-specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: ['omie-cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('omie_cities')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  async function onSubmit(values: FormData) {
    if (values.password !== values.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'As senhas não coincidem'
      });
      return;
    }

    // Validação condicional para CPF/CNPJ
    if (values.pessoa_tipo === 'fisica' && !values.cpf) {
      form.setError('cpf', {
        type: 'manual',
        message: 'CPF é obrigatório para Pessoa Física'
      });
      return;
    }

    if (values.pessoa_tipo === 'juridica' && !values.cnpj) {
      form.setError('cnpj', {
        type: 'manual',
        message: 'CNPJ é obrigatório para Pessoa Jurídica'
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await signUp({
        email: values.email,
        password: values.password,
        full_name: values.fullName,
        cpf: values.cpf,
        cnpj: values.cnpj,
        razao_social: values.razao_social,
        nome_fantasia: values.nome_fantasia,
        address: values.address,
        addressNumber: values.addressNumber,
        cro: values.cro,
        specialty: values.specialty,
        city: values.city,
        state: values.state,
        neighborhood: values.neighborhood,
        zip_code: values.zipCode,
        phone: values.phone,
        pessoa_tipo: values.pessoa_tipo
      });
      
      toast.success('Cadastro realizado com sucesso! Você receberá um email para confirmação.');
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      const errorMessage = error.message || 'Erro ao realizar cadastro. Por favor, tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
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
