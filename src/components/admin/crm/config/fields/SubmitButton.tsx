
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  label?: string;
  loadingLabel?: string;
  icon?: React.ReactNode;
}

export const SubmitButton = ({ 
  isLoading, 
  label = "Adicionar Campo", 
  loadingLabel = "Salvando...",
  icon = <PlusCircle className="mr-2 h-4 w-4" />
}: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  );
};
