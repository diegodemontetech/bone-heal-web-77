
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FieldsList } from "./fields/FieldsList";
import { FieldDialog } from "./fields/FieldDialog";
import { useFieldsConfig } from "./fields/useFieldsConfig";
import { FieldsConfigProps } from "./fields/types";

export const FieldsConfig = ({ pipelineId }: FieldsConfigProps) => {
  const {
    fields,
    loading,
    isDialogOpen,
    currentField,
    formData,
    handleOpenDialog,
    handleCloseDialog,
    handleInputChange,
    handleSwitchChange,
    handleSelectChange,
    handleDeleteField,
    handleSubmit,
    getDefaultMask
  } = useFieldsConfig(pipelineId);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Campos do Pipeline</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Novo Campo
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Configure os campos para capturar informações dos leads neste pipeline.
          </p>

          <FieldsList
            fields={fields}
            loading={loading}
            onOpenDialog={handleOpenDialog}
            onDeleteField={handleDeleteField}
          />
        </CardContent>
      </Card>

      <FieldDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        currentField={currentField}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSwitchChange={handleSwitchChange}
        handleSelectChange={handleSelectChange}
        getDefaultMask={getDefaultMask}
      />
    </>
  );
};
