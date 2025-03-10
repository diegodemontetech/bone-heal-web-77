
import { useAdminProducts } from "@/hooks/use-admin-products";
import ProductForm from "@/components/admin/ProductForm";
import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductsActions from "@/components/admin/products/ProductsActions";

const AdminProducts = () => {
  const {
    products,
    isLoading,
    error,
    isSyncing,
    isFormOpen,
    editingProduct,
    handleToggleActive,
    handleDelete,
    syncOmieProducts,
    openProductForm,
    closeProductForm,
    handleFormSuccess
  } = useAdminProducts();

  return (
    <div className="p-8">
      <ProductsActions 
        onAddNew={() => openProductForm()}
        onSync={syncOmieProducts}
        isSyncing={isSyncing}
      />

      <ProductsTable
        products={products}
        isLoading={isLoading}
        error={error}
        onEdit={openProductForm}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={closeProductForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AdminProducts;
