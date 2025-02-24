
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
        console.error('Error loading specialties:', error);
        toast.error('Error loading specialties');
        return [];
      }
    }
  });

  const handleRegistration = async (data: FormData) => {
    try {
      console.log('Starting registration process with data:', data);

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
        console.error('Auth error:', authError);
        throw authError;
      }

      if (!authData.user) {
        console.error('No user data returned');
        throw new Error("Could not create account");
      }

      console.log('Auth successful, creating profile...');

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
        console.error('Profile creation error:', profileError);
        await supabase.auth.signOut();
        throw profileError;
      }

      console.log('Registration successful');
      toast.success("Registration successful!");
      navigate('/');

    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message?.includes('already exists')) {
        toast.error("This email is already registered");
      } else {
        toast.error("Registration error: " + (error.message || "Please try again"));
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
