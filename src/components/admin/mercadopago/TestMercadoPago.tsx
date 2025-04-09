
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TestMercadoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchMercadoPagoSettings = async () => {
      try {
        setIsLoading(true);
        
        // Use a direct query instead of RPC
        const { data, error } = await supabase
          .from('system_settings')
          .select('key, value')
          .in('key', ['mp_access_token', 'mp_public_key', 'mp_client_id', 'mp_client_secret']);
        
        if (error) {
          console.error('Error fetching MercadoPago settings:', error);
          toast.error('Erro ao carregar configurações do MercadoPago');
          return;
        }
        
        if (data && Array.isArray(data)) {
          data.forEach((setting: any) => {
            if (setting.key === 'mp_access_token') {
              setAccessToken(setting.value || '');
            } else if (setting.key === 'mp_public_key') {
              setPublicKey(setting.value || '');
            } else if (setting.key === 'mp_client_id') {
              setClientId(setting.value || '');
            } else if (setting.key === 'mp_client_secret') {
              setClientSecret(setting.value || '');
            }
          });
        }
      } catch (err) {
        console.error('Unexpected error loading MercadoPago settings:', err);
        toast.error('Erro inesperado ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMercadoPagoSettings();
  }, []);

  const handleTest = async () => {
    if (!accessToken) {
      toast.error('Token de acesso não configurado');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://api.mercadopago.com/v1/payment_methods', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      toast.success('Integração com MercadoPago funcionando corretamente!');
      console.log('Payment methods:', data);
    } catch (error) {
      console.error('Error testing MercadoPago:', error);
      toast.error('Erro ao testar integração com MercadoPago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Configurações do MercadoPago</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Access Token:</p>
              <p className="text-sm bg-gray-100 p-2 rounded break-all">
                {accessToken ? `${accessToken.substring(0, 10)}...${accessToken.substring(accessToken.length - 5)}` : 'Não configurado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Public Key:</p>
              <p className="text-sm bg-gray-100 p-2 rounded break-all">
                {publicKey ? `${publicKey.substring(0, 10)}...${publicKey.substring(publicKey.length - 5)}` : 'Não configurado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Client ID:</p>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {clientId || 'Não configurado'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Client Secret:</p>
              <p className="text-sm bg-gray-100 p-2 rounded">
                {clientSecret ? '••••••••••••••••' : 'Não configurado'}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleTest} 
            disabled={isLoading || !accessToken}
            className="mt-4"
          >
            {isLoading ? 'Testando...' : 'Testar Integração'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMercadoPago;
