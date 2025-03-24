
import { useEffect } from "react";

interface LeadsKanbanProps {
  pipelineId?: string;
}

const LeadsKanban = ({ pipelineId }: LeadsKanbanProps) => {
  useEffect(() => {
    console.log("LeadsKanban loaded with pipeline ID:", pipelineId);
  }, [pipelineId]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Novos Leads</h3>
          <div className="space-y-2">
            {/* Lead cards will go here */}
            <div className="bg-white p-3 rounded shadow-sm border">
              <p className="font-medium">Lead de Exemplo</p>
              <p className="text-xs text-gray-500">contato@exemplo.com</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Contato Inicial</h3>
          <div className="space-y-2">
            {/* Lead cards will go here */}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Proposta Enviada</h3>
          <div className="space-y-2">
            {/* Lead cards will go here */}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-sm mb-2">Fechamento</h3>
          <div className="space-y-2">
            {/* Lead cards will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsKanban;
