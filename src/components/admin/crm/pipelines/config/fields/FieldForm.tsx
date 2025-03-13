
import { FieldFormData } from "./types";
import { BasicFieldsSection } from "./components/BasicFieldsSection";
import { FieldTypeSection } from "./components/FieldTypeSection";
import { OptionsSection } from "./components/OptionsSection";
import { MaskSection } from "./components/MaskSection";
import { DefaultValueSection } from "./components/DefaultValueSection";
import { FieldOptionsSection } from "./components/FieldOptionsSection";

interface FieldFormProps {
  formData: FieldFormData;
  currentField: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  getDefaultMask: (type: string) => string;
}

export const FieldForm = ({
  formData,
  currentField,
  handleInputChange,
  handleSwitchChange,
  handleSelectChange,
  getDefaultMask
}: FieldFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <BasicFieldsSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />

      <FieldTypeSection 
        type={formData.type} 
        onTypeChange={(value) => handleSelectChange("type", value)} 
      />

      <OptionsSection 
        type={formData.type} 
        options={formData.options} 
        handleInputChange={handleInputChange} 
      />

      <MaskSection 
        type={formData.type} 
        mask={formData.mask} 
        handleInputChange={handleInputChange} 
        getDefaultMask={getDefaultMask} 
      />

      <DefaultValueSection 
        defaultValue={formData.default_value} 
        handleInputChange={handleInputChange} 
      />

      <FieldOptionsSection 
        required={formData.required} 
        displayInKanban={formData.display_in_kanban} 
        onSwitchChange={handleSwitchChange} 
      />
    </div>
  );
};
