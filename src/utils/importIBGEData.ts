
import { supabase } from '@/integrations/supabase/client';

export const importIBGEData = async () => {
  try {
    console.log('Invoking import-ibge-data function...');
    const { data, error } = await supabase.functions.invoke('import-ibge-data', {
      method: 'GET',
    });

    if (error) {
      console.error('Error importing IBGE data:', error);
      throw error;
    }

    console.log('IBGE data import result:', data);
    return data;
  } catch (error) {
    console.error('Failed to import IBGE data:', error);
    throw error;
  }
};
