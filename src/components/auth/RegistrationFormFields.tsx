
import React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";
import { AccountSection } from "./form-sections/AccountSection";

interface DentalSpecialty {
  id: string;
  name: string;
  created_at?: string | null;
}

interface RegistrationFormFieldsProps {
  specialties: DentalSpecialty[];
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({ specialties }) => {
  return (
    <>
      <PersonalSection form={form} specialties={specialties} />
      <AddressSection form={form} cities={cities || []} />
      <ContactSection form={form} />
      <AccountSection form={form} />
    </>
  );
};

export default RegistrationFormFields;
