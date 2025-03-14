
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import CategorySection from "./palette/CategorySection";
import { 
  triggerItems,
  actionItems,
  conditionItems,
  timerItems
} from "./palette/actionItemsData";

const ActionsPalette = () => {
  const [search, setSearch] = useState("");

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-[600px] overflow-hidden flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ações e Gatilhos</CardTitle>
        <div className="mt-2">
          <Label htmlFor="search-actions" className="sr-only">Buscar</Label>
          <Input
            id="search-actions"
            placeholder="Buscar ações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-2 flex-grow overflow-hidden">
        <ScrollArea className="h-[480px]">
          <Accordion type="multiple" defaultValue={["triggers", "actions", "conditions", "timers"]}>
            <CategorySection
              title="Gatilhos"
              value="triggers"
              items={triggerItems}
              searchTerm={search}
              onDragStart={onDragStart}
            />
            
            <CategorySection
              title="Ações"
              value="actions"
              items={actionItems}
              searchTerm={search}
              onDragStart={onDragStart}
            />
            
            <CategorySection
              title="Condições"
              value="conditions"
              items={conditionItems}
              searchTerm={search}
              onDragStart={onDragStart}
            />

            <CategorySection
              title="Temporizadores"
              value="timers"
              items={timerItems}
              searchTerm={search}
              onDragStart={onDragStart}
            />
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActionsPalette;
