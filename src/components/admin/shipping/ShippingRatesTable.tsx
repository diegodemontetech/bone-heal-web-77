import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImportRatesButton } from "./ImportRatesButton";
import { CsvUpload } from "./CsvUpload";
import { AddRateForm } from "./AddRateForm";
import { RatesTable } from "./RatesTable";
import { useShippingRates } from "./hooks/useShippingRates";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/hooks/auth/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShippingRatesTable = () => {
  const { shippingRates, isLoading, isError, error, refetch } = useShippingRates();
  const { session, isAdmin } = useAuthContext();

  // Verificar autenticação e permissões
  useEffect(() => {
    if (!session) {
      console.warn("Usuário não autenticado ao acessar página de taxas de frete");
    } else if (!isAdmin) {
      console.warn("Usuário não é administrador ao acessar página de taxas de frete");
    }
  }, [session, isAdmin]);

  // Verificar se a tabela está vazia e importar automaticamente
  useEffect(() => {
    if (!isLoading) {
      if (shippingRates && shippingRates.length === 0) {
        console.log("Tabela de fretes vazia, importação automática disponível");
      } else {
        console.log(`Tabela de fretes contém ${shippingRates?.length || 0} registros`);
      }
    }
  }, [isLoading, shippingRates]);

  // Verificar se há erros de conexão com o Supabase
  useEffect(() => {
    if (isError) {
      console.error("Erro ao carregar taxas de frete:", error);
    }
  }, [isError, error]);

  if (!session) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso não autorizado</AlertTitle>
        <AlertDescription>
          Você precisa estar autenticado para acessar esta página.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso restrito</AlertTitle>
        <AlertDescription>
          Apenas administradores podem acessar a configuração de taxas de frete.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Mostrar estado atual da consulta */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando taxas de frete...</span>
            </div>
          )}
          
          {isError && (
            <div className="bg-red-50 p-4 rounded-md text-red-800 mb-4">
              <p className="font-medium">Erro ao carregar taxas de frete</p>
              <p className="text-sm">{String(error)}</p>
              <p className="text-sm mt-2">Verifique a conexão com o Supabase e tente novamente.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()}
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Área de importação */}
          <div className="flex flex-col gap-4">
            <ImportRatesButton isLoading={isLoading} />
            <CsvUpload />
          </div>

          {/* Formulário para adicionar nova taxa */}
          <AddRateForm />

          {/* Tabela de taxas */}
          <RatesTable shippingRates={shippingRates} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingRatesTable;
