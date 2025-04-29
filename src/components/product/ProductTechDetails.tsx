
import { Product } from "@/types/product";
import BoneHealTechDetails from "./tech-details/BoneHealTechDetails";
import HealBoneTechDetails from "./tech-details/HealBoneTechDetails";
import DefaultTechDetails from "./tech-details/DefaultTechDetails";
import { extractDimensionsFromName, getIndicationByDimensions } from "./tech-details/utils/dimensionsFormatter";

interface ProductTechDetailsProps {
  product: Product;
}

const ProductTechDetails = ({ product }: ProductTechDetailsProps) => {
  const isBoneHeal = product.name?.includes("Bone Heal");
  const isHealBone = product.name?.includes("Heal Bone");
  
  // Extract dimensions and indication using utility functions
  const dimensions = extractDimensionsFromName(product.name);
  const indication = getIndicationByDimensions(product.name);
  
  // Handle tech details based on product type
  if (isBoneHeal) {
    return <BoneHealTechDetails dimensions={dimensions} indication={indication} />;
  }
  
  if (isHealBone) {
    return <HealBoneTechDetails dimensions={dimensions} indication={indication} />;
  }
  
  // For DefaultTechDetails, pass a properly typed technical_details object
  const parsedTechDetails = parseTechnicalDetails(product.technical_details);
  return <DefaultTechDetails technicalDetails={parsedTechDetails} />;
};

// Helper function to safely parse technical_details
function parseTechnicalDetails(details: Product['technical_details']): Record<string, any> {
  if (!details) {
    return {};
  }
  
  if (typeof details === 'string') {
    try {
      return JSON.parse(details);
    } catch (e) {
      console.warn('Failed to parse technical_details as JSON:', e);
      return {};
    }
  }
  
  return details as Record<string, any>;
}

export default ProductTechDetails;
