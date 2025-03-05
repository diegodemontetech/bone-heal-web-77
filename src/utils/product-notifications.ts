
import { useToast } from "@/components/ui/use-toast";

export const useProductNotifications = () => {
  const { toast } = useToast();

  const notifyProductCreated = () => {
    toast({
      title: "Produto criado com sucesso!",
      description: "O produto foi cadastrado e está sincronizado com o Omie."
    });
  };

  const notifyProductUpdated = () => {
    toast({
      title: "Produto atualizado com sucesso!",
      description: "O produto foi atualizado e está sincronizado com o Omie."
    });
  };

  const notifyProductError = (error: any) => {
    toast({
      title: "Erro ao salvar produto",
      description: error.message,
      variant: "destructive",
    });
  };

  return {
    notifyProductCreated,
    notifyProductUpdated,
    notifyProductError
  };
};
