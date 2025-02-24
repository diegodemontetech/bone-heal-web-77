import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
  cnpj: string;
  address: string;
  omie_city_code: string;
  cro: string; // Changed from optional to required to match defaultValues
  specialty: string; // Changed from optional to required to match defaultValues
  city: string; // Changed from optional to required to match defaultValues
  state: string; // Changed from optional to required to match defaultValues
  neighborhood: string; // Changed from optional to required to match defaultValues
  zipCode: string; // Changed from optional to required to match defaultValues
  phone: string; // Changed from optional to required to match defaultValues
  receiveNews: boolean; // Changed from optional to required to match defaultValues
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
      cnpj: "",
      address: "",
      omie_city_code: "",
      cro: "",
      specialty: "",
      city: "",
      state: "",
      neighborhood: "",
      zipCode: "",
      phone: "",
      receiveNews: false,
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

    try {
      setLoading(true);
      setError(null);

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            cnpj: values.cnpj,
            address: values.address,
            cro: values.cro,
            specialty: values.specialty,
            city: values.city,
            state: values.state,
            neighborhood: values.neighborhood,
            zip_code: values.zipCode,
            phone: values.phone,
            receive_news: values.receiveNews,
            omie_city_code: values.omie_city_code,
          }
        }
      });

      if (signUpError) throw signUpError;
      
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
