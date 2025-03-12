import React from 'react';

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
      <h2 className="text-lg font-medium mb-4">Resumo</h2>

      <div className="mb-4">
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          CEP
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="zipCode"
            className="flex-1 focus:ring-primary focus:border-primary block w-full min-w-0 rounded-md sm:text-sm border-gray-300"
            placeholder="Digite seu CEP"
            value={zipCode}
            onChange={onZipCodeChange}
          />
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={onCalculateShipping}
            disabled={isLoading}
          >
            {isLoading ? 'Calculando...' : 'Calcular Frete'}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>

      {shippingCalculated && (
        <div className="mb-4">
          <label htmlFor="shippingOption" className="block text-sm font-medium text-gray-700">
            Opção de Frete
          </label>
          <select
            id="shippingOption"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            value={selectedShippingOption?.id || ''}
            onChange={(e) => {
              const selectedRate = shippingOptions.find(rate => rate.id === e.target.value);
              onShippingOptionChange(selectedRate);
            }}
          >
            <option value="">Selecione uma opção</option>
            {shippingOptions.map((rate) => (
              <option key={rate.id} value={rate.id}>
                {rate.label} - R$ {rate.value}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="py-2 border-t border-b">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Frete</span>
          <span>R$ {shippingCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="py-4 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      {shippingCalculated && (
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onResetShipping}
        >
          Limpar Frete
        </button>
      )}

      <button
        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={onCheckout}
        disabled={!shippingCalculated}
      >
        Finalizar Compra
      </button>
    </div>
  );
};
