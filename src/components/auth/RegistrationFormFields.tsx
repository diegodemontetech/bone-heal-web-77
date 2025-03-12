import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./RegistrationForm";
import AccountFormSection from "./form-sections/AccountFormSection";
import ProfessionalFormSection from "./form-sections/ProfessionalFormSection";
import AddressFormSection from "./form-sections/AddressFormSection";
import DocumentsFormSection from "./form-sections/DocumentsFormSection";
import NewsletterFormSection from "./form-sections/NewsletterFormSection";

interface RegistrationFormFieldsProps {
  form: UseFormReturn<FormData>;
  showPassword?: boolean;
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({ 
  form, 
  showPassword = true 
}) => {
  return (
    <div className="space-y-6">
      <AccountFormSection form={form} showPassword={showPassword} />
      
      <ProfessionalFormSection form={form} />
      
      <AddressFormSection form={form} />
      
      <DocumentsFormSection form={form} />
      
      <NewsletterFormSection form={form} />
    </div>
  );
};

export default RegistrationFormFields;
