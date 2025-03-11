
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow } from "lucide-react";

const N8n = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Workflow className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">n8n Workflows</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Automação com n8n</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure e gerencie workflows de automação usando n8n.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default N8n;
