
import {
  FormLabel,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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

  const fieldLabels: Record<string, string> = {
    weight: "Peso",
    height: "Altura",
    width: "Largura",
    length: "Comprimento",
    material: "Material",
    composition: "Composição",
    indication: "Indicação",
    contraindication: "Contraindicação",
    instructions: "Instruções de Uso",
    registration: "Registro ANVISA",
    classification: "Classificação"
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
        console.error("Erro da função:", error);
        throw new Error(`Erro ao chamar a função: ${error.message}`);
      }
      
      if (data && !data.error) {
        // Atualizar os detalhes técnicos
        const newTechnicalDetails = {
          ...technicalDetails,
          ...data.technical_details
        };
        
        onChange(newTechnicalDetails);
        
        toast.success("Detalhes técnicos gerados com sucesso!");
        
        // Expandir automaticamente a primeira seção
        if (Object.keys(detailSections).length > 0) {
          setExpandedSection(Object.keys(detailSections)[0]);
        }
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

  // Helper function to safely get field value as string
  const getFieldValue = (section: string, field: string): string => {
    const sectionData = technicalDetails?.[section] || {};
    const value = sectionData[field];
    
    // Ensure we return a string, not an object
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
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
          className="gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Gerar com IA
        </Button>
      </div>

      <FormItem>
        <FormLabel>Especificações do Produto</FormLabel>
        <FormDescription>
          Informe os detalhes técnicos do produto. Clique em "Gerar com IA" para preencher automaticamente.
        </FormDescription>

        <div className="space-y-3 mt-2">
          {Object.entries(detailSections).map(([sectionKey, section]) => (
            <div key={sectionKey} className="border rounded-md overflow-hidden shadow-sm">
              <div 
                className="flex justify-between items-center px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => toggleSection(sectionKey)}
              >
                <h4 className="font-medium text-slate-800">{section.title}</h4>
                <span>{expandedSection === sectionKey ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
              </div>
              {expandedSection === sectionKey && (
                <div className="p-4 space-y-3 bg-white">
                  {section.fields.map(field => (
                    <div key={field} className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        {fieldLabels[field] || field}
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                        value={getFieldValue(sectionKey, field)}
                        onChange={(e) => updateField(sectionKey, field, e.target.value)}
                        placeholder={`Informe ${fieldLabels[field] || field}...`}
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
