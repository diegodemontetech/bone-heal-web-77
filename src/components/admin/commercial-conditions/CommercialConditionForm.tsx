
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCommercialConditionForm } from "@/hooks/admin/commercial-conditions/useCommercialConditionForm";
import { CommercialCondition } from "@/types/commercial-conditions";

// Importando as seções do formulário
import BasicInfoSection from "./form-sections/BasicInfoSection";
import DiscountSection from "./form-sections/DiscountSection";
import ValiditySection from "./form-sections/ValiditySection";
import PurchaseConditionsSection from "./form-sections/PurchaseConditionsSection";
import TargetingSection from "./form-sections/TargetingSection";
import OptionsSection from "./form-sections/OptionsSection";
import ProductTargetingSection from "./form-sections/ProductTargetingSection";

interface CommercialConditionFormProps {
  onSuccess: () => void;
  existingCondition?: CommercialCondition | null;
}

const CommercialConditionForm = ({ onSuccess, existingCondition }: CommercialConditionFormProps) => {
  const { formData, loading, handleSubmit, updateField } = useCommercialConditionForm({
    onSuccess,
    existingCondition
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoSection
        name={formData.name}
        description={formData.description}
        onNameChange={(value) => updateField('name', value)}
        onDescriptionChange={(value) => updateField('description', value)}
      />

      <DiscountSection
        discountType={formData.discount_type}
        discountValue={formData.discount_value.toString()}
        onDiscountTypeChange={(value) => updateField('discount_type', value)}
        onDiscountValueChange={(value) => updateField('discount_value', value)}
      />

      <ValiditySection
        validFrom={formData.valid_from}
        validUntil={formData.valid_until}
        onValidFromChange={(value) => updateField('valid_from', value)}
        onValidUntilChange={(value) => updateField('valid_until', value)}
      />

      <PurchaseConditionsSection
        minAmount={formData.min_amount}
        minItems={formData.min_items}
        paymentMethod={formData.payment_method}
        onMinAmountChange={(value) => updateField('min_amount', value)}
        onMinItemsChange={(value) => updateField('min_items', value)}
        onPaymentMethodChange={(value) => updateField('payment_method', value)}
      />

      <TargetingSection
        region={formData.region}
        customerGroup={formData.customer_group}
        onRegionChange={(value) => updateField('region', value)}
        onCustomerGroupChange={(value) => updateField('customer_group', value)}
      />

      <ProductTargetingSection
        productId={formData.product_id}
        productCategory={formData.product_category}
        onProductIdChange={(value) => updateField('product_id', value)}
        onProductCategoryChange={(value) => updateField('product_category', value)}
      />

      <OptionsSection
        freeShipping={formData.free_shipping}
        isActive={formData.is_active}
        isCumulative={formData.is_cumulative}
        onFreeShippingChange={(checked) => updateField('free_shipping', checked)}
        onIsActiveChange={(checked) => updateField('is_active', checked)}
        onIsCumulativeChange={(checked) => updateField('is_cumulative', checked)}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {loading 
          ? (existingCondition ? "Atualizando..." : "Criando...") 
          : (existingCondition ? "Atualizar Condição" : "Criar Condição")
        }
      </Button>
    </form>
  );
};

export default CommercialConditionForm;
