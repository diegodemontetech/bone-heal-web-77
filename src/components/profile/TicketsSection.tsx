
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Headset } from "lucide-react";
import { SupportButtonsSection } from "./SupportButtonsSection";

export const TicketsSection = () => {
  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Headset className="mr-2 h-5 w-5 text-primary" />
          Suporte
        </CardTitle>
        <CardDescription>
          Acompanhe seus chamados de suporte ou abra um novo chamado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SupportButtonsSection />
      </CardContent>
    </Card>
  );
};
