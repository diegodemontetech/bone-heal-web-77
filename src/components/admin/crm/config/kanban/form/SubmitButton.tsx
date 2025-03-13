
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
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
          Adicionar Estágio
        </>
      )}
    </Button>
  );
}
