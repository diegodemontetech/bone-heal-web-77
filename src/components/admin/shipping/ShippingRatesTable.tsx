
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImportRatesButton } from "./ImportRatesButton";
import { AddRateForm } from "./AddRateForm";
import { RatesTable } from "./RatesTable";
import { useShippingRates } from "./hooks/useShippingRates";

const ShippingRatesTable = () => {
  const { shippingRates, isLoading } = useShippingRates();

  // Verificar se a tabela está vazia e importar automaticamente
  useEffect(() => {
    if (shippingRates && shippingRates.length === 0) {
      console.log("Tabela de fretes vazia, importação automática disponível");
    }
  }, [shippingRates]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Botão para importar valores padrão */}
          <div className="flex justify-end">
            <ImportRatesButton isLoading={isLoading} />
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
