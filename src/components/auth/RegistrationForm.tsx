
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
  complemento: string;
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
      complemento: "",
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

      if (error) {
        console.error('Error fetching specialties:', error);
        throw error;
      }
      console.log('Specialties fetched:', data);
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

      const signUpData = {
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            cpf: values.cpf,
            cnpj: values.cnpj,
            razao_social: values.razao_social,
            nome_fantasia: values.nome_fantasia,
            address: values.address,
            complemento: values.complemento,
            cro: values.cro,
            specialty: values.specialty,
            city: values.city,
            state: values.state,
            neighborhood: values.neighborhood,
            zip_code: values.zipCode,
            phone: values.phone,
            receive_news: values.receiveNews,
            omie_city_code: values.omie_city_code,
            pessoa_fisica: values.pessoa_tipo === 'fisica'
          }
        }
      };

      console.log('Attempting signup with data:', signUpData);
      const { error: signUpError, data } = await supabase.auth.signUp(signUpData);

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      console.log('Signup successful:', data);
      toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
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

  if (loadingSpecialties) {
    return <div className="flex items-center justify-center p-4">Carregando...</div>;
  }

  return (
    <Form {...form}>
      <div className="space-y-6 max-w-2xl mx-auto">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-6">
            <RegistrationFormFields 
              specialties={specialties || []} 
              form={form} 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-6 text-lg font-medium transition-colors"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
