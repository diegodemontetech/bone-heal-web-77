
import { useShippingRatesData } from "./shipping/use-shipping-rates-data";
import { useShippingRatesCrud } from "./shipping/use-shipping-rates-crud";
import { useShippingRatesExportImport } from "./shipping/use-shipping-rates-export-import";
import { UseShippingRatesReturn } from "./shipping/types";
import { ShippingCalculationRate } from "@/types/shipping";
import { useState } from "react";

export const useShippingRates = (): UseShippingRatesReturn => {
  const { rates, loading, fetchRates, setRates } = useShippingRatesData();
  const { 
    formData, 
    isEditing, 
    isDialogOpen, 
    setIsDialogOpen, 
    handleInputChange, 
    handleSelectChange, 
    resetForm, 
    openEditDialog, 
    handleCreateRate, 
    handleDeleteRate 
  } = useShippingRatesCrud();
  const { exportRates, insertShippingRates: importRatesBase } = useShippingRatesExportImport();
  
  // Para compatibilidade com o componente que usa este hook
  const [shippingOptions] = useState<ShippingCalculationRate[]>([]);

  const handleExportRates = () => {
    exportRates(rates);
  };

  const handleCreateRateWithRefresh = async (e: React.FormEvent) => {
    const success = await handleCreateRate(e);
    if (success) {
      await fetchRates();
    }
    return success;
  };

  const handleDeleteRateWithRefresh = async (id: string) => {
    const success = await handleDeleteRate(id);
    if (success) {
      setRates(prev => prev.filter(rate => rate.id !== id));
    }
    return success;
  };

  const handleImportRates = async (rates: any[]) => {
    const success = await importRatesBase(rates);
    if (success) {
      await fetchRates();
    }
    return success;
  };

  return {
    rates,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate: handleCreateRateWithRefresh,
    handleDeleteRate: handleDeleteRateWithRefresh,
    exportRates: handleExportRates,
    insertShippingRates: handleImportRates,
    shippingOptions,
    // Adicionando propriedades para compatibilidade
    shippingRates: rates,
    selectedShippingRate: null,
    calculateShipping: () => {},
    handleShippingRateChange: () => {},
    resetShipping: () => {}
  };
};
