
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Shield, Flask, Ruler, FileCheck, Info, AlertTriangle } from "lucide-react";

interface DefaultTechDetailsProps {
  technicalDetails: Record<string, any> | null | undefined;
}

const DefaultTechDetails = ({ technicalDetails }: DefaultTechDetailsProps) => {
  if (!technicalDetails || Object.keys(technicalDetails).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Detalhes técnicos não disponíveis para este produto.</p>
      </div>
    );
  }

  // Formatted display names for technical details sections
  const sectionTitles: Record<string, string> = {
    materials: "Materiais e Composição",
    dimensions: "Dimensões",
    usage: "Uso e Aplicação",
    regulatory: "Informações Regulatórias",
    desenvolvido_por: "Desenvolvido por",
    bullet_points: "Características"
  };

  // Icons for different sections
  const sectionIcons: Record<string, React.ReactNode> = {
    materials: <Flask className="h-5 w-5 text-blue-500" />,
    dimensions: <Ruler className="h-5 w-5 text-purple-500" />,
    usage: <Info className="h-5 w-5 text-green-500" />,
    regulatory: <FileCheck className="h-5 w-5 text-red-500" />,
    indication: <Check className="h-5 w-5 text-emerald-500" />,
    contraindication: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    desenvolvido_por: <Shield className="h-5 w-5 text-indigo-500" />
  };

  // Format structured values from JSON objects
  const formatTechnicalDetail = (key: string, value: any) => {
    if (value === null || value === undefined) return "-";
    
    // If it's a string, return it directly
    if (typeof value === 'string') return value;
    
    // If it's an object (like from JSON), format each key-value pair
    if (typeof value === 'object') {
      // Skip bullet_points array which is handled separately
      if (key === 'bullet_points') return null;
      
      return Object.entries(value).map(([subKey, subValue]) => (
        <div key={subKey} className="mb-2">
          <span className="font-medium capitalize">{subKey.replace(/_/g, " ")}: </span>
          <span>{String(subValue)}</span>
        </div>
      ));
    }
    
    return String(value);
  };

  // Group the technical details by section
  const groupedDetails: Record<string, Record<string, any>> = {};

  Object.entries(technicalDetails).forEach(([key, value]) => {
    // Skip bullet_points for now as they're displayed differently
    if (key === 'bullet_points') return;
    
    if (typeof value === 'object' && value !== null) {
      // This is a section with sub-items (like dimensions with width, height, etc)
      groupedDetails[key] = value;
    } else {
      // This is a direct property
      if (!groupedDetails.other) groupedDetails.other = {};
      groupedDetails.other[key] = value;
    }
  });

  return (
    <div className="space-y-6">
      {/* Display bullet points if they exist */}
      {technicalDetails.bullet_points && Array.isArray(technicalDetails.bullet_points) && (
        <div className="bg-gray-50 p-5 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Características do Produto</h3>
          <ul className="space-y-3">
            {technicalDetails.bullet_points.map((point: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display each section with its details */}
      {Object.entries(groupedDetails).map(([section, details]) => (
        <div key={section} className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            {sectionIcons[section] && (
              <span className="mr-2">{sectionIcons[section]}</span>
            )}
            <h3 className="font-medium text-lg">
              {sectionTitles[section] || section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, " ")}
            </h3>
          </div>
          
          <div className="p-4">
            {Object.entries(details).map(([key, value]) => {
              const formattedValue = formatTechnicalDetail(key, value);
              if (formattedValue === null) return null;
              
              return (
                <div key={key} className="mb-3 last:mb-0">
                  <div className="flex items-start">
                    {sectionIcons[key] && (
                      <span className="mr-2 mt-0.5">{sectionIcons[key]}</span>
                    )}
                    <div>
                      <div className="font-medium text-gray-700 capitalize mb-1">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-gray-600">{formattedValue}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultTechDetails;
