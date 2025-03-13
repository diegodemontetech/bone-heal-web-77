
import { Card, CardContent } from "@/components/ui/card";
import { TriggerSection } from "./automation/TriggerSection";
import { ActionTypeTabs } from "./automation/ActionTypeTabs";
import { StatusToggle } from "./automation/StatusToggle";
import { SubmitButton } from "./fields/SubmitButton";
import { useAutomationForm } from "./automation/useAutomationForm";

interface AutomationFormProps {
  onSuccess?: () => void;
}

export function AutomationForm({ onSuccess }: AutomationFormProps) {
  const {
    isLoading,
    stages,
    formData,
    activeTab,
    handleStageChange,
    handleNextStageChange,
    handleHoursTriggerChange,
    handleTabChange,
    handleActionDataChange,
    handleToggleActive,
    handleSubmit
  } = useAutomationForm({ onSuccess });

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <TriggerSection 
            stages={stages}
            stage={formData.stage_id || ''}
            nextStage={formData.next_stage_id || ''}
            hoursTrigger={formData.hours_trigger || 0}
            onStageChange={handleStageChange}
            onNextStageChange={handleNextStageChange}
            onHoursTriggerChange={handleHoursTriggerChange}
          />
          
          <ActionTypeTabs 
            activeTab={activeTab}
            actionData={formData.action_data}
            onTabChange={handleTabChange}
            onActionDataChange={handleActionDataChange}
          />
          
          <StatusToggle 
            isActive={formData.is_active}
            onToggle={handleToggleActive}
          />
          
          <SubmitButton 
            isLoading={isLoading}
            label="Adicionar Automação"
          />
        </form>
      </CardContent>
    </Card>
  );
}
