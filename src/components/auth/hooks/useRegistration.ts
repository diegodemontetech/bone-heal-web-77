
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
      try {
        const { data, error } = await supabase
          .from('dental_specialties')
          .select('*')
          .order('name');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
        toast.error('Erro ao carregar especialidades');
        return [];
      }
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

      if (authError) throw authError;
      if (!authData.user) throw new Error("Não foi possível criar a conta");

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          pessoa_tipo: data.pessoa_tipo,
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
          email: data.email
        });

      if (profileError) {
        await supabase.auth.signOut();
        throw profileError;
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate('/');

    } catch (error: any) {
      console.error('Erro no registro:', error);
      if (error.message?.includes('already exists')) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error("Erro ao realizar cadastro. Por favor, tente novamente.");
      }
    }
  };

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};
