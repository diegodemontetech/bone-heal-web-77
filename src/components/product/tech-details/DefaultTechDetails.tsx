
import React from 'react';
import { TechDetailsProps } from './types';

const DefaultTechDetails: React.FC<TechDetailsProps> = ({ technicalDetails }) => {
  // Early return if no technical details
  if (!technicalDetails || Object.keys(technicalDetails).length === 0) {
    return (
      <div className="text-gray-500 italic">
        Detalhes técnicos não disponíveis para este produto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(technicalDetails).map(([key, value]) => (
        <div key={key} className="border-b pb-2">
          <h4 className="font-medium text-gray-800 capitalize mb-1">
            {key.replace(/_/g, ' ')}
          </h4>
          <div className="text-gray-600">
            {typeof value === 'string' ? (
              value
            ) : Array.isArray(value) ? (
              <ul className="list-disc pl-5">
                {value.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              JSON.stringify(value)
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DefaultTechDetails;
