
import React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";
import { AccountSection } from "./form-sections/AccountSection";
import { FormData } from './RegistrationForm';

// Match the expected type from PersonalSection
interface DentalSpecialty {
  id: string;
  name: string;
  created_at: string;
}

interface City {
  id: number;
  omie_code: string;
  name: string;
  state: string;
}

interface RegistrationFormFieldsProps {
  specialties: DentalSpecialty[];
  form: UseFormReturn<FormData>;
  cities: City[];
}

const RegistrationFormFields: React.FC<RegistrationFormFieldsProps> = ({ 
  specialties, 
  form,
  cities 
}) => {
  return (
    <>
      <PersonalSection form={form} specialties={specialties} />
      <AddressSection form={form} cities={cities} />
      <ContactSection form={form} />
      <AccountSection form={form} />
    </>
  );
};

export default RegistrationFormFields;
