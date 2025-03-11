
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function OmieCustomersSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const syncUsers = async () => {
    setIsLoading(true);
    try {
      // Chamar a Edge Function
      const { data, error } = await supabase.functions.invoke('create-omie-users');
      
      if (error) {
        throw error;
      }
      
      setStats(data.stats);
      toast.success(data.message);
    } catch (error) {
      console.error('Erro ao sincronizar usuários:', error);
      toast.error('Falha ao sincronizar usuários do Omie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sincronização de Clientes Omie</CardTitle>
        <CardDescription>
          Criar usuários automáticos para clientes do Omie que já realizaram pedidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Esta funcionalidade irá criar automaticamente contas de usuários para os clientes
          do Omie que já realizaram pedidos e ainda não possuem um login no sistema.
        </p>
        
        {stats && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded-md">
              <p className="text-xs text-green-700">Usuários Criados</p>
              <p className="text-2xl font-bold text-green-700">{stats.created}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-xs text-blue-700">Usuários Pulados</p>
              <p className="text-2xl font-bold text-blue-700">{stats.skipped}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-xs text-red-700">Erros</p>
              <p className="text-2xl font-bold text-red-700">{stats.errors}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={syncUsers} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> 
              Iniciar Sincronização
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
