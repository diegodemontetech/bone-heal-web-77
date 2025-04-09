
/**
 * Utility functions for product formatting
 */

/**
 * Format product name to show brand first
 */
export const formatProductName = (name: string): string => {
  // Remove unwanted parentheses
  let cleanName = name.replace(/\(\)|\(\s*\)/g, '').trim();
  
  // Check if the name contains "Bone Heal" or "Heal Bone" anywhere
  if (cleanName.includes("Bone Heal") || cleanName.includes("Heal Bone")) {
    // If it already starts with a brand name, return as is but with ® symbol
    if (cleanName.startsWith("Bone Heal")) {
      return cleanName.replace("Bone Heal", "Bone Heal®");
    } else if (cleanName.startsWith("Heal Bone")) {
      return cleanName.replace("Heal Bone", "Heal Bone®");
    }
    
    // Extract brand name
    let brandName = "";
    if (cleanName.includes("Bone Heal")) {
      brandName = "Bone Heal®";
    } else if (cleanName.includes("Heal Bone")) {
      brandName = "Heal Bone®";
    }
    
    // Create new product name with brand first
    const productNameWithoutBrand = cleanName.replace(/Bone Heal®?|Heal Bone®?/g, "").trim();
    return `${brandName} ${productNameWithoutBrand}`;
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
