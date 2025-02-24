
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../types/registration-form";
import { StateAndCitySelector } from "./address/StateAndCitySelector";
import { AddressAndComplement } from "./address/AddressAndComplement";
import { NeighborhoodAndZipCode } from "./address/NeighborhoodAndZipCode";

interface AddressSectionProps {
  form: UseFormReturn<FormData>;
}

export const AddressSection = ({ form }: AddressSectionProps) => {
  return (
    <>
      <AddressAndComplement form={form} />
      <StateAndCitySelector form={form} />
      <NeighborhoodAndZipCode form={form} />
    </>
  );
};

export default AddressSection;
