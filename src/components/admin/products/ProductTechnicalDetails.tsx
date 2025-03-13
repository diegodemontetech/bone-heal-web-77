
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductTechnicalDetailsProps {
  omieCode: string;
  productName: string;
  technicalDetails: Record<string, any>;
  onChange: (details: Record<string, any>) => void;
}

const ProductTechnicalDetails = ({
  omieCode,
  productName,
  technicalDetails,
  onChange
}: ProductTechnicalDetailsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const handleGenerateDetails = async () => {
    if (!omieCode) {
      toast.error("É necessário informar o código Omie para gerar os detalhes técnicos");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-product-content", {
        body: { omieCode, productName }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && !data.error && data.technical_details) {
        onChange(data.technical_details);
        toast.success("Detalhes técnicos gerados com sucesso!");
      } else {
        throw new Error(data?.error || "Erro ao gerar detalhes técnicos");
      }
    } catch (error: any) {
      console.error("Erro ao gerar detalhes técnicos:", error);
      toast.error(`Erro ao gerar detalhes técnicos: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddField = () => {
    if (!newFieldKey.trim()) {
      toast.error("Informe o nome do campo");
      return;
    }
    
    const updatedDetails = {
      ...technicalDetails,
      [newFieldKey.trim()]: newFieldValue
    };
    
    onChange(updatedDetails);
    setNewFieldKey("");
    setNewFieldValue("");
  };

  const handleRemoveField = (key: string) => {
    const updatedDetails = { ...technicalDetails };
    delete updatedDetails[key];
    onChange(updatedDetails);
  };

  const handleUpdateField = (key: string, value: string) => {
    onChange({
      ...technicalDetails,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Detalhes Técnicos</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={handleGenerateDetails}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Loader2 className="h-4 w-4 mr-2" />
          )}
          Gerar Detalhes Técnicos
        </Button>
      </div>

      <div className="space-y-3 border rounded-md p-4">
        {Object.entries(technicalDetails).length > 0 ? (
          Object.entries(technicalDetails).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{key}</p>
                <Textarea
                  value={value as string}
                  onChange={(e) => handleUpdateField(key, e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveField(key)}
                className="mt-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum detalhe técnico adicionado
          </p>
        )}

        <div className="pt-2 border-t mt-4">
          <h4 className="text-sm font-medium mb-2">Adicionar novo campo</h4>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Nome do campo"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Valor"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleAddField}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTechnicalDetails;
