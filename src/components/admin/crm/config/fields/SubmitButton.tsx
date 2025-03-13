
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
}

export const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Campo
        </>
      )}
    </Button>
  );
};
