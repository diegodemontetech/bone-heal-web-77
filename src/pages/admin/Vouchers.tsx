
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Plus } from "lucide-react";
import { VoucherDialog } from "@/components/admin/vouchers/VoucherDialog";
import { VouchersList } from "@/components/admin/vouchers/VouchersList";
import { useVouchers } from "@/hooks/admin/use-vouchers";
import { FormEvent } from "react";

const Vouchers = () => {
  const {
    vouchers,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    currentVoucher,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateVoucher,
    handleDeleteVoucher,
    formatDate
  } = useVouchers();

  // Fix the handleSubmit function to properly invoke the voucher creation
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCreateVoucher(e);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Cupons de Desconto</h1>
        </div>
        
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Cupons</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhum cupom encontrado. Crie seu primeiro cupom de desconto.</p>
              <Button 
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Cupom
              </Button>
            </div>
          ) : (
            <VouchersList 
              vouchers={vouchers}
              onEdit={openEditDialog}
              onDelete={handleDeleteVoucher}
              formatDate={formatDate}
            />
          )}
        </CardContent>
      </Card>

      <VoucherDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditing={isEditing}
        currentVoucher={currentVoucher}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Vouchers;
