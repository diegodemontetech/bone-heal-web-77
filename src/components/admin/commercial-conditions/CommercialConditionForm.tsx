
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCommercialConditionForm } from "./hooks/useCommercialConditionForm";

// Importando as seções do formulário
import BasicInfoSection from "./form-sections/BasicInfoSection";
import DiscountSection from "./form-sections/DiscountSection";
import ValiditySection from "./form-sections/ValiditySection";
import PurchaseConditionsSection from "./form-sections/PurchaseConditionsSection";
import TargetingSection from "./form-sections/TargetingSection";
import OptionsSection from "./form-sections/OptionsSection";

interface CommercialCondition {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean;
  payment_method: string | null;
  min_amount: number | null;
  min_items: number | null;
  valid_until: string | null;
  region: string | null;
  customer_group: string | null;
  free_shipping: boolean;
}

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
        discountValue={formData.discount_value}
        onDiscountTypeChange={(value) => updateField('discount_type', value)}
        onDiscountValueChange={(value) => updateField('discount_value', value)}
      />

      <ValiditySection
        validUntil={formData.valid_until}
        paymentMethod={formData.payment_method}
        onValidUntilChange={(value) => updateField('valid_until', value)}
        onPaymentMethodChange={(value) => updateField('payment_method', value)}
      />

      <PurchaseConditionsSection
        minAmount={formData.min_amount}
        minItems={formData.min_items}
        onMinAmountChange={(value) => updateField('min_amount', value)}
        onMinItemsChange={(value) => updateField('min_items', value)}
      />

      <TargetingSection
        region={formData.region}
        customerGroup={formData.customer_group}
        onRegionChange={(value) => updateField('region', value)}
        onCustomerGroupChange={(value) => updateField('customer_group', value)}
      />

      <OptionsSection
        freeShipping={formData.free_shipping}
        isActive={formData.is_active}
        onFreeShippingChange={(checked) => updateField('free_shipping', checked)}
        onIsActiveChange={(checked) => updateField('is_active', checked)}
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
