
import { Avatar } from '@/components/ui/avatar';

interface ChatHeaderProps {
  selectedLead: {
    name: string;
    phone: string;
  } | null;
}

const ChatHeader = ({ selectedLead }: ChatHeaderProps) => {
  if (!selectedLead) return null;

  return (
    <div className="p-4 border-b flex items-center gap-3">
      <Avatar>
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {selectedLead.name ? selectedLead.name.charAt(0).toUpperCase() : 'C'}
        </div>
      </Avatar>
      <div>
        <h3 className="font-medium">{selectedLead.name || 'Cliente'}</h3>
        <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
