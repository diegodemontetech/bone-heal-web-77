
import React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";
import { AccountSection } from "./form-sections/AccountSection";
import { FormData } from './RegistrationForm';

interface DentalSpecialty {
  id: string;
  name: string;
  created_at: string;
}

interface RegistrationFormFieldsProps {
  specialties: DentalSpecialty[];
  form: UseFormReturn<FormData>;
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({ 
  specialties, 
  form
}) => {
  return (
    <>
      <PersonalSection form={form} specialties={specialties} />
      <AddressSection form={form} />
      <ContactSection form={form} />
      <AccountSection form={form} />
    </>
  );
};

export default RegistrationFormFields;
