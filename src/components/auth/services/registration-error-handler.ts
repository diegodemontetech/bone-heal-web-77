
import { toast } from "sonner";

export const handleRegistrationError = (error: any) => {
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
  return errorMessage;
};
