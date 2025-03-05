
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { useOmieSync } from "../omie-sync/OmieSync";
import { FormData } from "../RegistrationForm";
import { UserRole } from "@/types/auth";

export const useRegistrationFormLogic = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { syncWithOmie, syncingWithOmie } = useOmieSync();

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      // Dados do usuário para o cadastro
      const userData = {
        full_name: data.fullName,
        cro: data.cro,
        specialty: data.specialty,
        address: data.address,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        zip_code: data.zipCode,
        phone: data.phone,
        cnpj: data.cnpj || "",
        cpf: data.cpf,
        complemento: data.complemento || "",
        endereco_numero: data.endereco_numero,
        receive_news: data.receiveNews,
        role: UserRole.DENTIST,
        pessoa_fisica: !data.cnpj || data.cnpj.trim() === ""
      };
      
      console.log("Dados do formulário para cadastro:", userData);
      
      // Fazer cadastro com autenticação
      const signUpResult = await signUp(data.email, data.password, userData);
      
      // Verificar se o cadastro foi realizado com sucesso
      if (signUpResult && signUpResult.user) {
        console.log("Usuário cadastrado com sucesso:", signUpResult.user.id);
        
        // Tentar sincronizar com o Omie
        await syncWithOmie(signUpResult.user.id);
        
        // Mostrar mensagem de sucesso
        toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
        
        // Redirecionar para a página de login
        navigate('/login');
      } else {
        console.error("Erro no cadastro: não foi possível obter ID do usuário");
        toast.error("Erro ao finalizar o cadastro. Por favor, tente novamente.");
      }
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast.error("Erro ao realizar cadastro: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setSubmitting(false);
    }
  };

  return { onSubmit, submitting, syncingWithOmie };
};
