
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Product } from '@/types/product';
import { parseTechnicalDetails } from '@/types/custom-supabase';

interface ProductBulletPointsProps {
  product: Product;
  className?: string;
}

const ProductBulletPoints = ({ product, className = '' }: ProductBulletPointsProps) => {
  // Use the safer parser from our custom types
  const techDetails = parseTechnicalDetails(product.technical_details ?? null);
  
  // Default bullet points for any product if none are specified
  const defaultBulletPoints = [
    'Barreira 100% impermeável',
    'Não precisa de fixação',
    'Não requer remoção',
    'Elimina o segundo tempo cirúrgico',
    'Alta previsibilidade'
  ];
  
  // Use product-specific bullet points if available, otherwise use defaults
  const bulletPoints = techDetails.bullet_points || defaultBulletPoints;

  return (
    <div className={`space-y-2 ${className}`}>
      {bulletPoints.map((point, index) => (
        <div key={index} className="flex items-start">
          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mr-2 mt-0.5" />
          <p className="text-gray-700">{point}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductBulletPoints;
