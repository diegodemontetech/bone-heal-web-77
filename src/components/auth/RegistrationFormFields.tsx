
import { UseFormReturn } from "react-hook-form";
import { AccountSection } from "./form-sections/AccountSection";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";

interface RegistrationFormFieldsProps {
  form: UseFormReturn<any>;
  specialties: Array<{
    id: string;
    name: string;
    created_at: string | null;
  }>;
}

export const RegistrationFormFields = ({ form, specialties }: RegistrationFormFieldsProps) => {
  console.log('Renderizando campos com especialidades:', specialties);

  return (
    <>
      <AccountSection form={form} />
      <PersonalSection form={form} specialties={specialties} />
      <AddressSection form={form} />
      <ContactSection form={form} />
    </>
  );
};
