
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Download } from "lucide-react";
import { useShippingRates } from "@/hooks/admin/use-shipping-rates";
import { ShippingRateForm } from "@/components/admin/shipping/ShippingRateForm";
import { ShippingRatesTable } from "@/components/admin/shipping/ShippingRatesTable";
import { ShippingRatesEmptyState } from "@/components/admin/shipping/ShippingRatesEmptyState";

const ShippingRates = () => {
  const {
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
    handleCreateRate,
    handleDeleteRate,
    exportRates
  } = useShippingRates();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Taxas de Envio</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportRates}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          
          <Button onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Taxa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Taxas de Envio</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : rates.length === 0 ? (
            <ShippingRatesEmptyState onAddRate={() => setIsDialogOpen(true)} />
          ) : (
            <ShippingRatesTable 
              rates={rates}
              onEdit={openEditDialog}
              onDelete={handleDeleteRate}
            />
          )}
        </CardContent>
      </Card>

      <ShippingRateForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleCreateRate={handleCreateRate}
        resetForm={resetForm}
      />
    </div>
  );
};

export default ShippingRates;
