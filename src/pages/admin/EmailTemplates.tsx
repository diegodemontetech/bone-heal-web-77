
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const EmailTemplates = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Templates de Email</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Crie e personalize modelos de email para comunicação com clientes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplates;
