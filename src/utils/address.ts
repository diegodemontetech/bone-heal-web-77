
// API do ViaCEP para buscar endereço a partir do CEP
export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export async function fetchAddressFromCep(cep: string): Promise<ViaCepAddress | null> {
  try {
    // Limpa o CEP para ter apenas números
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      throw new Error('CEP inválido');
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
    return null;
  }
}

// Função que será implementada futuramente com Mapbox para autocompletar endereços
export async function searchAddressWithMapbox(query: string, accessToken: string) {
  try {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
    const params = new URLSearchParams({
      access_token: accessToken,
      country: 'br',
      language: 'pt',
      types: 'address',
      limit: '5'
    });

    const response = await fetch(`${endpoint}?${params}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar endereço com Mapbox:', error);
    return null;
  }
}
