
/**
 * Extracts dimensions from product name
 */
export const extractDimensionsFromName = (productName: string | undefined): string => {
  if (!productName) return "Consulte embalagem";
  
  // Try to extract dimensions using regex pattern
  const dimensionsMatch = productName.match(/(\d+)\s*[xX]\s*(\d+)/);
  if (dimensionsMatch && dimensionsMatch.length >= 3) {
    return `${dimensionsMatch[1]}mm x ${dimensionsMatch[2]}mm`;
  }
  
  // If not found by regex, check common dimensions
  if (productName.includes("15x40") || productName.includes("15 x 40")) {
    return "15mm x 40mm";
  } else if (productName.includes("20x30") || productName.includes("20 x 30")) {
    return "20mm x 30mm";
  } else if (productName.includes("30x40") || productName.includes("30 x 40")) {
    return "30mm x 40mm";
  }
  
  return "Consulte embalagem";
};

/**
 * Gets indication based on dimensions in the product name
 */
export const getIndicationByDimensions = (productName: string | undefined): string => {
  if (!productName) return "Consulte a embalagem para indicações específicas.";
  
  if (productName.includes("15x40") || productName.includes("15 x 40")) {
    return "Indicado para defeitos correspondentes a exodontia unitária.";
  } else if (productName.includes("20x30") || productName.includes("20 x 30")) {
    return "Indicado para defeitos correspondentes a exodontia de 2 elementos contíguos.";
  } else if (productName.includes("30x40") || productName.includes("30 x 40")) {
    return "Indicado para defeitos correspondentes a exodontia de 3 a 4 elementos contíguos.";
  }
  
  return "Consulte a embalagem para indicações específicas.";
};
