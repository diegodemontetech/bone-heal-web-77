
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
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao carregar especialidades:', error);
        throw error;
      }
      return data || [];
    }
  });

  const handleRegistration = async (data: FormData) => {
    try {
      console.log('Iniciando registro com dados:', data);

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
        nome_fantasia: data.nome_fantasia
      };

      // 1. Create auth user with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: userMetadata
        }
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Não foi possível criar a conta");
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate('/');

    } catch (error) {
      console.error('Erro no processo de registro:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário';
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};
