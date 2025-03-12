
import { toast } from "sonner";

export const syncWithOmieAfterSignup = async (userId: string, syncWithOmie: Function) => {
  let omieSync = false;
  try {
    // Tentar sincronizar com o Omie
    await syncWithOmie(userId);
    console.log("Sincronização com Omie realizada com sucesso");
    omieSync = true;
    return omieSync;
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
    return omieSync;
  }
};
