
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TicketStatusTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TicketStatusTabs = ({ activeTab, onTabChange }: TicketStatusTabsProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="open">Abertos</TabsTrigger>
        <TabsTrigger value="in_progress">Em Andamento</TabsTrigger>
        <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TicketStatusTabs;
