
import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useLeadActions } from "./hooks/useLeadActions";
import { DrawerHeader } from "./lead-drawer/DrawerHeader";
import { LeadForm } from "./lead-drawer/LeadForm";
import { OrdersHistory } from "./lead-drawer/OrdersHistory";
import { LeadInfo } from "./lead-drawer/LeadInfo";
import { ActionButtons } from "./lead-drawer/ActionButtons";

export interface LeadDrawerProps {
  open: boolean;
  onClose: () => void;
  lead: any | null;
  onLeadUpdated: () => void;
  onStatusChange: (leadId: string, newStageId: string) => Promise<void>;
  stages?: { id: string; name: string }[];
}

export const LeadDrawer = ({ open, onClose, lead, onLeadUpdated, onStatusChange, stages }: LeadDrawerProps) => {
  const [formData, setFormData] = useState<any>({});
  const { users } = useUsersQuery();
  const { updateLead, deleteLead } = useLeadActions();
  
  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  if (!lead) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStageChange = async (newStageId: string) => {
    await onStatusChange(lead.id, newStageId);
  };

  const handleSave = async () => {
    await updateLead(lead.id, formData);
    onLeadUpdated();
  };

  const handleDelete = async () => {
    await deleteLead(lead.id);
    onClose();
    onLeadUpdated();
  };

  return (
    <Sheet open={open} onOpenChange={open => !open && onClose()}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <DrawerHeader onClose={onClose} />

        <LeadForm 
          formData={formData}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          users={users}
        />

        <OrdersHistory orders={lead.orders} />
        
        <LeadInfo lead={lead} />

        <ActionButtons 
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={onClose}
          onStatusChange={handleStageChange}
          currentStageId={lead.stage_id}
          stages={stages}
        />
      </SheetContent>
    </Sheet>
  );
};
