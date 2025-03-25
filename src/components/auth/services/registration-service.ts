
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types/auth";
import { FormData } from "../RegistrationForm";
import { syncCustomerWithOmie } from "./omie-sync-service";

export const handleNormalRegistration = async (data: FormData, signUp: any) => {
  // Dados do usuário para o cadastro
  const userData = {
    full_name: data.pessoa_tipo === 'fisica' ? data.fullName : data.nome_fantasia,
    pessoa_tipo: data.pessoa_tipo,
    // Dados pessoa física
    cpf: data.cpf || "",
    // Dados pessoa jurídica
    razao_social: data.razao_social || "",
    nome_fantasia: data.nome_fantasia || "",
    cnpj: data.cnpj || "",
    responsavel_tecnico: data.responsavel_tecnico || "",
    cpf_responsavel: data.cpf_responsavel || "",
    cro_responsavel: data.cro_responsavel || "",
    epao: data.epao || "",
    // Dados comuns
    cro: data.cro,
    specialty: data.specialty,
    address: data.address,
    city: data.city,
    state: data.state,
    neighborhood: data.neighborhood,
    zip_code: data.zipCode,
    phone: data.phone,
    complemento: data.complemento || "",
    endereco_numero: data.endereco_numero,
    receive_news: data.receiveNews,
    role: UserRole.DENTIST,
    is_pessoa_fisica: data.pessoa_tipo === 'fisica'
  };
  
  console.log("Dados do formulário para cadastro normal:", userData);
  
  // Fazer cadastro com autenticação (fluxo original)
  const signUpResult = await signUp(data.email, data.password, userData);
  
  // Verificar se o cadastro foi realizado com sucesso
  if (signUpResult && signUpResult.user) {
    console.log("Usuário cadastrado com sucesso:", signUpResult.user.id);
    return signUpResult;
  } else {
    console.error("Erro no cadastro: não foi possível obter ID do usuário");
    toast.error("Erro ao finalizar o cadastro. Por favor, tente novamente.");
    throw new Error("Erro ao finalizar o cadastro");
  }
};
