
/**
 * Utility functions for product formatting
 */

/**
 * Format product name to show brand first with proper registration mark
 */
export const formatProductName = (name: string): string => {
  // Remove unwanted parentheses
  let cleanName = name.replace(/\(\)|\(\s*\)/g, '').trim();
  
  // Check if the name contains "Bone Heal" or "Heal Bone" anywhere
  if (cleanName.includes("Bone Heal") || cleanName.includes("Heal Bone")) {
    // Extract dimensions from name if present
    const dimensionsMatch = cleanName.match(/(\d+)\s*[xX]\s*(\d+)/);
    const dimensions = dimensionsMatch ? `${dimensionsMatch[1]}x${dimensionsMatch[2]}mm` : '';
    
    // Create standardized product name with brand first
    if (cleanName.toLowerCase().includes("bone heal")) {
      // Replace all instances of Bone Heal (with or without ®) with the properly marked version
      return `Bone Heal® Membrana Regenerativa Odontológica${dimensions ? ` ${dimensions}` : ''}`;
    } else if (cleanName.toLowerCase().includes("heal bone")) {
      // Replace all instances of Heal Bone (with or without ®) with the properly marked version
      return `Heal Bone® Membrana Regenerativa Odontológica${dimensions ? ` ${dimensions}` : ''}`;
    }
  }
  
  return cleanName;
};

/**
 * Generate a clean slug for the URL from a product name
 */
export const generateCleanSlug = (name: string, existingSlug?: string): string => {
  if (existingSlug && existingSlug.trim() !== "") {
    return existingSlug;
  }
  
  // Create a clean slug from the name
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-")     // Replace spaces with hyphens
    .replace(/-+/g, "-")      // Remove consecutive hyphens
    .trim();
};

/**
 * Sort products by brand (Bone Heal first, then Heal Bone) and then by name
 */
export const sortProductsByBrand = (products: any[]): any[] => {
  return [...products].sort((a, b) => {
    const aName = a.name?.toLowerCase() || '';
    const bName = b.name?.toLowerCase() || '';
    
    // Check if products contain different brands
    const aHasBoneHeal = aName.includes('bone heal');
    const bHasBoneHeal = bName.includes('bone heal');
    const aHasHealBone = aName.includes('heal bone');
    const bHasHealBone = bName.includes('heal bone');
    
    // Sort by brand priority: Bone Heal first, then Heal Bone
    if (aHasBoneHeal && !bHasBoneHeal) return -1;
    if (!aHasBoneHeal && bHasBoneHeal) return 1;
    if (aHasHealBone && !bHasHealBone) return -1;
    if (!aHasHealBone && bHasHealBone) return 1;
    
    // If same brand or no recognized brand, sort alphabetically
    return aName.localeCompare(bName);
  });
};
