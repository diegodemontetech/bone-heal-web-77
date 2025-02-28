
/**
 * Formats a zip code input by removing non-digit characters and limiting to 8 digits
 */
export const formatZipCode = (value: string): string => {
  return value.replace(/\D/g, '').substring(0, 8);
};
