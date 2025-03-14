
import { ArrowLeft } from "lucide-react";

const NoFlowSelected = () => {
  return (
    <div className="h-[600px] flex items-center justify-center border rounded-md">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Selecione um fluxo para editar ou crie um novo</p>
        <ArrowLeft className="mx-auto h-6 w-6 text-muted-foreground" />
      </div>
    </div>
  );
};

export default NoFlowSelected;
