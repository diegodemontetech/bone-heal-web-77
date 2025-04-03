
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface SubmitButtonProps {
  isUploading: boolean;
  isEditing: boolean;
}

export const SubmitButton = ({ isUploading, isEditing }: SubmitButtonProps) => {
  return (
    <Button type="submit" className="w-full" disabled={isUploading}>
      {isUploading ? (
        <>
          <Upload className="w-4 h-4 mr-2 animate-bounce" />
          Enviando...
        </>
      ) : (
        isEditing ? "Atualizar Estudo" : "Criar Estudo"
      )}
    </Button>
  );
};
