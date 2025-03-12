
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormData } from "../RegistrationForm";
import { syncCustomerWithOmie } from "./omie-sync-service";

export const handleModalRegistration = async (data: FormData, onSuccess?: (customer: any) => void) => {
  try {
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
      role: 'dentist',
      pessoa_fisica: !data.cnpj || data.cnpj.trim() === ""
    };
    
    console.log("Dados do formulário para cadastro em modal:", userData);
    
    // Modificamos para usar .auth.signUp para criar o usuário
    const { data: newUser, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || "123456", // Senha padrão se não fornecida
      options: {
        data: {
          ...userData,
          email: data.email
        }
      }
    });

    if (authError) {
      console.error("Erro ao criar usuário:", authError);
      throw authError;
    }
    
    console.log("Usuário criado com sucesso:", newUser);
    
    // Buscar o profile criado pelo trigger depois do signUp
    // Adicionamos um pequeno delay para permitir que o trigger execute
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let newCustomer = null;
    
    // Primeiro tenta buscar pelo email
    const { data: profileByEmail, error: emailError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", data.email)
      .single();
      
    if (emailError || !profileByEmail) {
      console.log("Não foi possível encontrar perfil por email, tentando por ID...");
      
      // Se não encontrar por email, tenta buscar por ID (se disponível)
      if (newUser?.user?.id) {
        const { data: profileById, error: idError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", newUser.user.id)
          .single();
          
        if (idError) {
          console.error("Erro ao buscar perfil por ID:", idError);
          // Criar o perfil manualmente se não existir
          const { data: manualProfile, error: insertError } = await supabase
            .from("profiles")
            .insert([{
              id: newUser.user.id,
              ...userData,
              email: data.email
            }])
            .select("*")
            .single();
            
          if (insertError) {
            console.error("Erro ao criar perfil manualmente:", insertError);
            throw new Error("Não foi possível criar o perfil do usuário");
          }
          
          newCustomer = manualProfile;
        } else {
          newCustomer = profileById;
        }
      } else {
        throw new Error("Não foi possível obter ID do usuário");
      }
    } else {
      newCustomer = profileByEmail;
    }
    
    if (newCustomer) {
      console.log("Perfil de cliente obtido:", newCustomer);
      
      // Tentar sincronizar com o Omie
      const syncedCustomer = await syncCustomerWithOmie(newCustomer);
      
      // Verificar que temos um cliente com dados completos
      if (!syncedCustomer || !syncedCustomer.id) {
        console.error("Cliente sincronizado incompleto:", syncedCustomer);
        throw new Error("Dados do cliente sincronizado incompletos");
      }
      
      // Chamar o callback de sucesso, se fornecido
      if (onSuccess) {
        console.log("Chamando callback onSuccess com:", syncedCustomer);
        onSuccess(syncedCustomer);
      } else {
        console.error("Callback onSuccess não fornecido");
        toast.error("Erro na configuração do formulário");
      }

      return syncedCustomer;
    } else {
      throw new Error("Não foi possível obter dados do cliente");
    }
    
  } catch (dbError: any) {
    console.error("Erro ao criar cliente no banco de dados:", dbError);
    toast.error("Erro ao cadastrar cliente: " + dbError.message);
    throw dbError;
  }
};
