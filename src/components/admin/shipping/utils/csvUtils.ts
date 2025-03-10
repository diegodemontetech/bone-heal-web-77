
import { ShippingRate } from "../types";
import Papa from 'papaparse';

export const downloadCsvTemplate = () => {
  // Cabeçalho do CSV
  const header = ['state', 'region_type', 'service_type', 'rate', 'delivery_days'];
  
  // Exemplo de linha para demonstração
  const exampleRow = ['SP', 'Capital', 'PAC', '20.00', '3'];
  
  // Criar o conteúdo do CSV
  const csvContent = Papa.unparse({
    fields: header,
    data: [exampleRow]
  });
  
  // Criar e disparar o download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'modelo_taxas_frete.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCsvFile = (file: File): Promise<Omit<ShippingRate, 'id'>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rates = results.data.map((row: any) => ({
          state: row.state,
          region_type: row.region_type,
          service_type: row.service_type,
          rate: parseFloat(row.rate),
          delivery_days: parseInt(row.delivery_days, 10)
        }));
        resolve(rates);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

