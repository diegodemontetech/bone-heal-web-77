
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { useOmieSync } from "../omie-sync/OmieSync";
import { FormData } from "../RegistrationForm";
import { handleModalRegistration } from "../services/modal-registration-service";
import { handleNormalRegistration } from "../services/registration-service";
import { syncWithOmieAfterSignup } from "../services/normal-omie-sync";
import { handleRegistrationError } from "../services/registration-error-handler";

export const useRegistrationFormLogic = (isModal: boolean = false, onSuccess?: (customer: any) => void) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { syncWithOmie, syncingWithOmie } = useOmieSync();

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      if (isModal) {
        // No modo modal, inserimos diretamente no banco de dados sem autenticação
        await handleModalRegistration(data, onSuccess);
      } else {
        // Fazer cadastro com autenticação (fluxo original)
        const signUpResult = await handleNormalRegistration(data, signUp);
        
        // Tentar sincronizar com o Omie
        const omieSync = await syncWithOmieAfterSignup(signUpResult.user.id, syncWithOmie);
        
        // Mostrar mensagem de sucesso
        toast.success(`Cadastro realizado com sucesso! ${omieSync ? 'Perfil sincronizado com Omie.' : ''} Verifique seu email para confirmar a conta.`);
        
        // Redirecionar para a página de login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      
    } catch (error: any) {
      handleRegistrationError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return { onSubmit, submitting, syncingWithOmie };
};
