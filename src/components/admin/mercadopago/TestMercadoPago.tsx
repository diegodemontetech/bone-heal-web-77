
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { testMercadoPagoConnection } from "@/services/payment-service";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const TestMercadoPago = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    data?: any;
    timestamp?: string;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const result = await testMercadoPagoConnection();
      setTestResult({
        ...result,
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success("Conexão com Mercado Pago testada com sucesso!");
      } else {
        toast.error("Falha no teste de conexão com Mercado Pago");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResult({
        success: false,
        message: `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        timestamp: new Date().toISOString()
      });
      toast.error("Erro ao testar conexão com Mercado Pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Teste de Conexão com Mercado Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Button 
            onClick={handleTestConnection} 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar Conexão com Mercado Pago'
            )}
          </Button>
        </div>
        
        {testResult && (
          <div className={`mt-6 p-4 rounded-lg border ${
            testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? 'Sucesso!' : 'Falha!'}
                </h4>
                <p className="text-sm mt-1">
                  {testResult.message}
                </p>
                
                {testResult.data && (
                  <div className="mt-4 bg-white bg-opacity-60 p-3 rounded border border-gray-200 overflow-auto max-h-48">
                    <pre className="text-xs whitespace-pre-wrap break-words">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  Teste realizado em: {new Date(testResult.timestamp || '').toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 mt-4">
          <p>
            Este teste verifica se as credenciais do Mercado Pago estão configuradas corretamente, 
            tentando obter os métodos de pagamento disponíveis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMercadoPago;
