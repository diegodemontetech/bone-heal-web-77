
import { useNavigate } from "react-router-dom";
import { FormData } from "../types/registration-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useRegistration = () => {
  const navigate = useNavigate();

  const { data: specialties = [], isLoading: specialtiesLoading } = useQuery({
    queryKey: ['dental-specialties'],
    queryFn: async () => {
      console.log('Fetching dental specialties...');
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching specialties:', error);
        throw error;
      }

      console.log('Fetched specialties:', data);
      return data || [];
    }
  });

  const handleRegistration = async (data: FormData) => {
    try {
      console.log('Starting registration with data:', data);

      // Prepare user metadata
      const userMetadata = {
        full_name: data.fullName,
        pessoa_tipo: data.pessoa_tipo,
        cro: data.cro,
        specialty: data.specialty,
        address: data.address,
        address_number: data.address_number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        phone: data.phone,
        cpf: data.cpf,
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        receive_news: false
      };

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: userMetadata
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        
        // Translate common error messages
        let errorMessage = 'Erro no registro';
        if (authError.message.includes('User already registered')) {
          errorMessage = 'Este email já está registrado';
        } else if (authError.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Email ainda não confirmado';
        }
        
        toast.error(errorMessage);
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Não foi possível criar a conta');
      }

      toast.success('Cadastro realizado com sucesso!');
      navigate('/');

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};

