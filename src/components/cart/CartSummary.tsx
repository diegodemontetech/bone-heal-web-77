
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Truck, ArrowRight } from "lucide-react";

export interface CartSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  zipCode: string;
  onZipCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCalculateShipping: () => void;
  isLoading: boolean;
  error: string | null;
  shippingCalculated: boolean;
  onResetShipping: () => void;
  onCheckout: () => void;
  shippingOptions: any[];
  selectedShippingOption: any;
  onShippingOptionChange: (rate: any) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shippingCost,
  total,
  zipCode,
  onZipCodeChange,
  onCalculateShipping,
  isLoading,
  error,
  shippingCalculated,
  onResetShipping,
  onCheckout,
  shippingOptions,
  selectedShippingOption,
  onShippingOptionChange
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium mb-4 flex items-center">
        <Truck className="mr-2 h-5 w-5 text-primary" />
        Frete e Entrega
      </h2>

      <div className="mb-4">
        <div className="mb-2">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            Digite seu CEP
          </label>
          <div className="mt-1 flex gap-2">
            <Input
              type="text"
              id="zipCode"
              className="flex-1"
              placeholder="00000-000"
              value={zipCode}
              onChange={onZipCodeChange}
              maxLength={9}
            />
            <Button
              type="button"
              onClick={onCalculateShipping}
              disabled={isLoading || !zipCode || zipCode.length < 8}
              className="whitespace-nowrap"
            >
              {isLoading ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        {shippingCalculated && shippingOptions.length > 0 && (
          <div className="mt-4">
            <label htmlFor="shippingOption" className="block text-sm font-medium text-gray-700 mb-1">
              Opções de Entrega
            </label>
            <div className="space-y-2">
              {shippingOptions.map((rate) => (
                <div 
                  key={rate.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedShippingOption?.id === rate.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onShippingOptionChange(rate)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rate.label}</p>
                      <p className="text-sm text-gray-500">
                        {rate.days_min === rate.days_max 
                          ? `Entrega em ${rate.days_min} dia(s)` 
                          : `Entrega em ${rate.days_min}-${rate.days_max} dias`}
                      </p>
                    </div>
                    <p className="font-medium text-primary">{formatCurrency(rate.rate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({subtotal > 0 ? `${subtotal.toFixed(2)}` : '0.00'})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frete</span>
          <span>{formatCurrency(shippingCost)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      {shippingCalculated && (
        <div className="space-y-3">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={onCheckout}
            disabled={!shippingCalculated}
          >
            Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={onResetShipping}
          >
            Alterar frete
          </Button>
        </div>
      )}
    </div>
  );
};
