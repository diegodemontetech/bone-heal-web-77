
import { useNavigate } from "react-router-dom";
import { FormData } from "../types/registration-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const useRegistration = () => {
  const navigate = useNavigate();

  // Busca especialidades odontológicas
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

      // 1. Criação do usuário no Supabase Auth
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
        console.error('Erro de autenticação:', authError);
        throw new Error(authError.message);
      }

      if (!authData.user) {
        console.error('Nenhum dado de usuário retornado');
        throw new Error("Não foi possível criar a conta");
      }

      console.log('Usuário criado com sucesso, criando perfil...');

      // 2. Criação do perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
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
        }]);

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Se houver erro, remover o usuário criado
        await supabase.auth.signOut();
        throw new Error("Erro ao criar perfil: " + profileError.message);
      }

      console.log('Registro concluído com sucesso');
      toast.success("Cadastro realizado com sucesso!");
      navigate('/');

    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.message?.includes('already exists')) {
        toast.error("Este email já está cadastrado");
      } else {
        toast.error("Erro no cadastro: " + (error.message || "Por favor tente novamente"));
      }
      throw error;
    }
  };

  return {
    specialties,
    specialtiesLoading,
    handleRegistration
  };
};
