
import React from "react";

interface OmieStatusSectionProps {
  omieCode?: string;
}

export const OmieStatusSection: React.FC<OmieStatusSectionProps> = ({ omieCode }) => {
  if (!omieCode) return null;

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
      <p className="text-green-700 font-medium">
        Cliente sincronizado com Omie
      </p>
      <p className="text-sm text-green-600">
        Código Omie: {omieCode}
      </p>
    </div>
  );
};
