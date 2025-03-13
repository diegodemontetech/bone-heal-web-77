
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import { FormData } from "../RegistrationForm";
import { syncCustomerWithOmie } from "./omie-sync-service";

export const handleModalRegistration = async (data: FormData, onSuccess?: (customer: any) => void) => {
  try {
    console.log("Iniciando cadastro modal de cliente:", data);
    
    // Verificar se o e-mail já existe no sistema
    const { data: existingUsers, error: emailCheckError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', data.email)
      .maybeSingle();
    
    if (emailCheckError) {
      console.error("Erro ao verificar e-mail existente:", emailCheckError);
      throw new Error("Erro ao verificar disponibilidade do e-mail");
    }
    
    if (existingUsers) {
      console.log("Usuário já existe, retornando dados existentes:", existingUsers);
      
      // Se o usuário já existe, apenas use seus dados em vez de criar um novo
      if (onSuccess) {
        // Busca dados completos do usuário existente
        const { data: existingUserData, error: userDataError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', existingUsers.id)
          .single();
          
        if (userDataError) {
          console.error("Erro ao buscar dados do usuário existente:", userDataError);
          throw new Error("Erro ao buscar dados do cliente existente");
        }
        
        toast.success("Cliente encontrado no sistema");
        onSuccess(existingUserData);
      }
      
      return existingUsers;
    }
    
    // Armazenar a sessão atual antes de fazer qualquer alteração
    const { data: adminSession } = await supabase.auth.getSession();
    console.log("Sessão admin capturada antes do signUp:", adminSession?.session?.user?.id);
    
    // Criar um novo usuário/perfil sem fazer autenticação
    const { data: newUser, error: createError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || Math.random().toString(36).slice(-10), // Gera senha aleatória se não fornecida
      options: {
        data: {
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
        }
      }
    });
    
    if (createError) {
      console.error("Erro ao criar usuário:", createError);
      throw new Error(createError.message);
    }
    
    if (!newUser?.user?.id) {
      console.error("Erro: ID do usuário não encontrado na resposta");
      throw new Error("Erro ao finalizar cadastro: ID do usuário ausente");
    }
    
    console.log("Usuário criado com sucesso:", newUser.user.id);
    
    // Buscar o perfil recém-criado para ter certeza que temos todos os dados
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', newUser.user.id)
      .single();
      
    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      throw new Error("Erro ao buscar dados do perfil");
    }
    
    console.log("Perfil de cliente obtido:", profileData);
    
    // Tentar sincronizar com Omie
    try {
      const syncedData = await syncCustomerWithOmie(profileData);
      console.log("Cliente sincronizado com Omie:", syncedData);
      
      // Atualizar o status de sincronização do cliente
      if (syncedData?.omie_code) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            omie_sync: true,
            omie_code: syncedData.omie_code
          })
          .eq('id', newUser.user.id);
        
        if (updateError) {
          console.error("Erro ao atualizar status de sincronização:", updateError);
        }
      }
    } catch (omieError) {
      console.error("Erro na resposta da API Omie:", omieError);
      console.warn("Continuando com o cliente não-sincronizado...");
      // Continuar mesmo se a sincronização falhar
    }
    
    // IMPORTANTE: Deslogar o usuário recém-criado para manter a sessão do admin
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      console.error("Erro ao fazer logout após cadastro:", signOutError);
    } 
    
    // Restaurar a sessão anterior do admin (obtido antes do signUp)
    if (window.adminSessionBeforeSignUp) {
      try {
        console.log("Tentando restaurar sessão admin salva:", window.adminSessionBeforeSignUp.user.id);
        await supabase.auth.setSession(window.adminSessionBeforeSignUp);
        console.log("Sessão do admin restaurada com sucesso");
        
        // Verificar se a restauração funcionou
        const { data: sessionCheck } = await supabase.auth.getSession();
        console.log("Sessão após restauração:", sessionCheck?.session?.user?.id);
        
        // Limpar a sessão armazenada
        delete window.adminSessionBeforeSignUp;
      } catch (err) {
        console.error("Erro ao restaurar sessão do admin:", err);
        
        // Verifica se a sessão admin tem as propriedades necessárias antes de tentar restaurá-la
        if (adminSession?.session && 
            adminSession.session.access_token && 
            adminSession.session.refresh_token) {
          try {
            await supabase.auth.setSession({
              access_token: adminSession.session.access_token,
              refresh_token: adminSession.session.refresh_token
            });
            console.log("Sessão alternativa do admin restaurada");
          } catch (errAlt) {
            console.error("Erro ao restaurar sessão alternativa do admin:", errAlt);
          }
        } else {
          console.error("Sessão do admin não possui tokens válidos para restauração");
        }
      }
    } else if (adminSession?.session && 
               adminSession.session.access_token && 
               adminSession.session.refresh_token) {
      // Tente restaurar usando a sessão capturada no início da função
      try {
        console.log("Tentando restaurar sessão admin capturada:", adminSession.session.user.id);
        await supabase.auth.setSession({
          access_token: adminSession.session.access_token,
          refresh_token: adminSession.session.refresh_token
        });
        console.log("Sessão admin capturada restaurada com sucesso");
      } catch (err) {
        console.error("Erro ao restaurar sessão admin capturada:", err);
      }
    }
    
    // Chamar callback de sucesso com os dados do perfil
    if (onSuccess && profileData) {
      console.log("Chamando callback onSuccess com:", profileData);
      onSuccess(profileData);
    }
    
    toast.success("Cliente cadastrado com sucesso!");
    return profileData;
    
  } catch (error: any) {
    console.error("Erro no cadastro modal:", error);
    toast.error("Erro ao cadastrar cliente: " + error.message);
    throw error;
  }
};
