
import {
  FormLabel,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
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
  onChange,
}: ProductTechnicalDetailsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const detailSections = {
    dimensions: { title: "Dimensões", fields: ["weight", "height", "width", "length"] },
    materials: { title: "Materiais", fields: ["material", "composition"] },
    usage: { title: "Uso", fields: ["indication", "contraindication", "instructions"] },
    regulatory: { title: "Regulatório", fields: ["registration", "classification"] }
  };

  const generateTechnicalDetails = async () => {
    try {
      if (!omieCode) {
        toast.error("É necessário informar o código Omie para gerar os detalhes técnicos");
        return;
      }
      
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke("generate-product-content", {
        body: { 
          omieCode, 
          productName,
          contentType: "technical_details" 
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data && !data.error) {
        // Atualizar os detalhes técnicos
        const newTechnicalDetails = {
          ...technicalDetails,
          ...data.technical_details
        };
        
        onChange(newTechnicalDetails);
        
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateField = (section: string, field: string, value: string) => {
    const updatedDetails = { 
      ...technicalDetails,
      [section]: {
        ...(technicalDetails[section] || {}),
        [field]: value
      }
    };
    onChange(updatedDetails);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Detalhes Técnicos</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={generateTechnicalDetails}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Gerar com IA
        </Button>
      </div>

      <FormItem>
        <FormLabel>Especificações do Produto</FormLabel>
        <FormDescription>
          Informe os detalhes técnicos do produto. Clique em "Gerar com IA" para preencher automaticamente.
        </FormDescription>

        <div className="space-y-4 mt-2">
          {Object.entries(detailSections).map(([sectionKey, section]) => (
            <div key={sectionKey} className="border rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center px-4 py-2 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection(sectionKey)}
              >
                <h4 className="font-medium">{section.title}</h4>
                <span>{expandedSection === sectionKey ? "▼" : "►"}</span>
              </div>
              {expandedSection === sectionKey && (
                <div className="p-4 space-y-3">
                  {section.fields.map(field => (
                    <div key={field} className="space-y-1">
                      <label className="text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md text-sm"
                        value={technicalDetails?.[sectionKey]?.[field] || ""}
                        onChange={(e) => updateField(sectionKey, field, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FormItem>
    </div>
  );
};

export default ProductTechnicalDetails;
