
import React from 'react';
import { type UseFormReturn } from "react-hook-form";
import { PersonalSection } from "./form-sections/PersonalSection";
import { AddressSection } from "./form-sections/AddressSection";
import { ContactSection } from "./form-sections/ContactSection";
import { AccountSection } from "./form-sections/AccountSection";

// Match the expected type from PersonalSection
interface DentalSpecialty {
  id: string;
  name: string;
  created_at: string;  // Make it required to match PersonalSection expectations
}

interface City {
  id: number;
  omie_code: string;
  name: string;
  state: string;
}

// Make sure this matches exactly what's in RegistrationForm
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  cnpj?: string;
  cro: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  zipCode: string;
  phone?: string;
  receiveNews: boolean;
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
