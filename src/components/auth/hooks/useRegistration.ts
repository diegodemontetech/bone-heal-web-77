
import { useNavigate } from "react-router-dom";
import { FormData } from "../types/registration-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useRegistration = () => {
  const navigate = useNavigate();
  
  const { data: specialties, isLoading: specialtiesLoading } = useQuery({
    queryKey: ['dental-specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dental_specialties')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching specialties:', error);
        toast.error('Erro ao carregar especialidades');
        throw error;
      }
      
      return data;
    }
  });

  const handleRegistration = async (data: FormData) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            pessoa_tipo: data.pessoa_tipo,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already exists')) {
          toast.error("Este email já está cadastrado.");
        } else {
          toast.error("Erro ao criar conta. Por favor, tente novamente.");
        }
        return;
      }

      if (!authData.user) {
        toast.error("Erro ao criar conta. Por favor, tente novamente.");
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
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
          specialty: data.specialty,
          cro: data.cro,
          sync_with_omie: true,
          email: data.email
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error("Erro ao criar perfil. Por favor, tente novamente.");
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

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};
