
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useFieldForm } from "./fields/useFieldForm";
import { BasicFieldsSection } from "./fields/BasicFieldsSection";
import { FieldTypeSection } from "./fields/FieldTypeSection";
import { OptionsSection } from "./fields/OptionsSection";
import { MaskSection } from "./fields/MaskSection";
import { DefaultValueSection } from "./fields/DefaultValueSection";
import { FieldOptionsSection } from "./fields/FieldOptionsSection";
import { SubmitButton } from "./fields/SubmitButton";
import { FieldsFormProps } from "./fields/types";

export function FieldsForm({ onSuccess }: FieldsFormProps) {
  const { 
    form, 
    isLoading, 
    setFieldType, 
    watchType, 
    onSubmit,
    getDefaultMask
  } = useFieldForm(onSuccess);

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicFieldsSection form={form} />
            <FieldTypeSection form={form} setFieldType={setFieldType} />
            <OptionsSection form={form} watchType={watchType} />
            <MaskSection form={form} watchType={watchType} getDefaultMask={getDefaultMask} />
            <DefaultValueSection form={form} />
            <FieldOptionsSection form={form} />
            <SubmitButton isLoading={isLoading} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
