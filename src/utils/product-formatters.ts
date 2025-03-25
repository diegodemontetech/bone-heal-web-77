
/**
 * Utility functions for product formatting
 */

/**
 * Format product name to show brand first
 */
export const formatProductName = (name: string): string => {
  // Check if the name contains "Bone Heal" or "Heal Bone" anywhere
  if (name.includes("Bone Heal") || name.includes("Heal Bone")) {
    // If it already starts with a brand name, return as is
    if (name.startsWith("Bone Heal") || name.startsWith("Heal Bone")) {
      return name;
    }
    
    // Extract brand name
    let brandName = "";
    if (name.includes("Bone Heal")) {
      brandName = "Bone Heal";
    } else if (name.includes("Heal Bone")) {
      brandName = "Heal Bone";
    }
    
    // Create new product name with brand first
    const productNameWithoutBrand = name.replace(brandName, "").trim();
    return `${brandName} ${productNameWithoutBrand}`;
  }
  
  return name;
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
