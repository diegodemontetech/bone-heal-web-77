
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface CreateOrderLayoutProps {
  customerSection: ReactNode;
  productsSection: ReactNode;
  summarySection: ReactNode;
}

const CreateOrderLayout = ({
  customerSection,
  productsSection,
  summarySection
}: CreateOrderLayoutProps) => {
  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seleção de Cliente */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            {customerSection}
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            {productsSection}
          </CardContent>
        </Card>

        {/* Resumo */}
        {summarySection}
      </div>
    </div>
  );
};

export default CreateOrderLayout;
