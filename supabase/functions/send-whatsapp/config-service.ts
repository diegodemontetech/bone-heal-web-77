
import { WhatsAppConfig } from "../_shared/types.ts";

// Serviço para gerenciar configurações do WhatsApp
export function getWhatsAppConfig(): WhatsAppConfig {
  return {
    evolutionApiUrl: Deno.env.get('EVOLUTION_API_URL'),
    evolutionApiKey: Deno.env.get('EVOLUTION_API_KEY'),
    zApiInstanceId: Deno.env.get('ZAPI_INSTANCE_ID'),
    zApiToken: Deno.env.get('ZAPI_TOKEN')
  };
}

// Verificar se a configuração tem pelo menos um serviço configurado
export function hasAnyConfiguredService(config: WhatsAppConfig): boolean {
  return !!(
    (config.evolutionApiUrl && config.evolutionApiKey) || 
    (config.zApiInstanceId && config.zApiToken)
  );
}

// Verificar se a Evolution API está configurada
export function hasEvolutionApi(config: WhatsAppConfig): boolean {
  return !!(config.evolutionApiUrl && config.evolutionApiKey);
}

// Verificar se a Z-API está configurada
export function hasZApi(config: WhatsAppConfig): boolean {
  return !!(config.zApiInstanceId && config.zApiToken);
}
