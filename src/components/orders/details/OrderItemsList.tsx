
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderItemsListProps {
  items?: OrderItem[];
}

const OrderItemsList = ({ items }: OrderItemsListProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemsList;
