
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
      console.log('Starting registration process with data:', data);

      // Format phone number
      const phone = data.telefone1_ddd && data.telefone1_numero 
        ? `${data.telefone1_ddd}${data.telefone1_numero}`
        : data.phone;

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
        phone: phone,
        cpf: data.cpf,
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        receive_news: data.receive_news
      };

      console.log('Attempting to create user with metadata:', userMetadata);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: userMetadata,
        }
      });

      if (authError) {
        console.error('Authentication error:', authError);
        
        if (authError.message.includes('User already registered')) {
          throw new Error('Este email já está registrado');
        } else if (authError.message.includes('Password should be at least')) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Email ainda não confirmado');
        } else {
          throw new Error(authError.message);
        }
      }

      if (!authData.user) {
        console.error('No user data returned from signup');
        throw new Error('Não foi possível criar a conta');
      }

      console.log('User successfully created:', authData.user);
      toast.success('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.');
      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      throw error instanceof Error ? error : new Error('Erro desconhecido no registro');
    }
  };

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};
