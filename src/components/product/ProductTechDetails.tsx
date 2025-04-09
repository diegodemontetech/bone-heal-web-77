
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
  
  if (isBoneHeal) {
    return <BoneHealTechDetails dimensions={dimensions} indication={indication} />;
  }
  
  if (isHealBone) {
    return <HealBoneTechDetails dimensions={dimensions} indication={indication} />;
  }
  
  return <DefaultTechDetails technicalDetails={product.technical_details} />;
};

export default ProductTechDetails;
