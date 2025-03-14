
/**
 * Função auxiliar para ordenar cores por matiz
 * Converte cores hex para HSL e as ordena pelo valor de H (matiz)
 */
export const sortColorsByHue = (colors: string[]): string[] => {
  return [...colors].sort((a, b) => {
    const hueA = hexToHSL(a)[0];
    const hueB = hexToHSL(b)[0];
    return hueA - hueB;
  });
};

/**
 * Converte uma cor hexadecimal para HSL
 * Retorna um array [h, s, l] com valores de matiz, saturação e luminosidade
 */
export const hexToHSL = (hex: string): [number, number, number] => {
  // Remover o # se presente
  hex = hex.replace(/^#/, '');
  
  // Convertendo para RGB
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
  } else {
    r = parseInt(hex.substring(0, 2), 16) / 255;
    g = parseInt(hex.substring(2, 4), 16) / 255;
    b = parseInt(hex.substring(4, 6), 16) / 255;
  }
  
  // Encontrando o mínimo e máximo
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  // Calculando o H e S
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  
  return [h, s * 100, l * 100];
};
