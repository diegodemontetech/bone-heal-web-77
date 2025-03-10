
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth-context";
import { useOmieSync } from "../omie-sync/OmieSync";
import { FormData } from "../RegistrationForm";
import { UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationFormLogic = (isModal: boolean = false, onSuccess?: (customer: any) => void) => {
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
      
      if (isModal) {
        // No modo modal, inserimos diretamente no banco de dados sem autenticação
        try {
          const { data: newCustomer, error } = await supabase
            .from("profiles")
            .insert({
              ...userData,
              email: data.email,
              role: UserRole.DENTIST
            })
            .select()
            .single();

          if (error) throw error;
          
          console.log("Cliente cadastrado com sucesso:", newCustomer);
          
          // Tentar sincronizar com o Omie
          try {
            const response = await fetch(`${window.location.origin}/api/omie-customer`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ profile: newCustomer }),
            });
            
            const result = await response.json();
            
            if (result.success) {
              console.log("Sincronização com Omie realizada com sucesso");
              
              // Atualizar o cliente com o código Omie
              const { data: updatedCustomer, error: updateError } = await supabase
                .from("profiles")
                .update({ omie_code: result.omie_code, omie_sync: true })
                .eq("id", newCustomer.id)
                .select()
                .single();
                
              if (!updateError && updatedCustomer) {
                newCustomer.omie_code = result.omie_code;
                newCustomer.omie_sync = true;
              }
            }
          } catch (omieError) {
            console.error("Erro ao sincronizar com Omie:", omieError);
          }
          
          // Chamar o callback de sucesso, se fornecido
          if (onSuccess) {
            onSuccess(newCustomer);
          }
          
        } catch (dbError: any) {
          console.error("Erro ao criar cliente no banco de dados:", dbError);
          toast.error("Erro ao cadastrar cliente: " + dbError.message);
        }
      } else {
        // Fazer cadastro com autenticação (fluxo original)
        const signUpResult = await signUp(data.email, data.password, userData);
        
        // Verificar se o cadastro foi realizado com sucesso
        if (signUpResult && signUpResult.user) {
          console.log("Usuário cadastrado com sucesso:", signUpResult.user.id);
          
          let omieSync = false;
          try {
            // Tentar sincronizar com o Omie
            await syncWithOmie(signUpResult.user.id);
            console.log("Sincronização com Omie realizada com sucesso");
            omieSync = true;
          } catch (omieError: any) {
            console.error("Erro ao sincronizar com Omie:", omieError);
            
            // Verificar se o erro foi no parsing de JSON (possível resposta HTML em vez de JSON)
            const errorMessage = omieError?.message || "";
            if (errorMessage.includes("Unexpected token") || errorMessage.includes("is not valid JSON")) {
              toast.error("Erro de comunicação com o sistema Omie. Tente novamente mais tarde.");
            } else {
              // Outros erros
              toast.error("Aviso: Não foi possível sincronizar com o sistema Omie. Seu cadastro foi realizado, mas será necessário sincronizar posteriormente.");
            }
          }
          
          // Mostrar mensagem de sucesso
          toast.success(`Cadastro realizado com sucesso! ${omieSync ? 'Perfil sincronizado com Omie.' : ''} Verifique seu email para confirmar a conta.`);
          
          // Redirecionar para a página de login
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          console.error("Erro no cadastro: não foi possível obter ID do usuário");
          toast.error("Erro ao finalizar o cadastro. Por favor, tente novamente.");
        }
      }
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = "Erro ao realizar cadastro";
      
      if (error.message.includes("Email already registered")) {
        errorMessage = "Este email já está cadastrado. Tente recuperar sua senha ou usar outro email.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else {
        errorMessage += ": " + (error.message || "Erro desconhecido");
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return { onSubmit, submitting, syncingWithOmie };
};
