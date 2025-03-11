
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = "Esta funcionalidade está em desenvolvimento e será disponibilizada em breve."
}) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Construction className="mr-2 h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="text-center max-w-md">
            <p className="text-muted-foreground mb-4">
              Nossa equipe está trabalhando para disponibilizar esta funcionalidade o mais rápido possível.
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
