
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem as CartItemType } from "@/hooks/use-cart";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

export const CartItem = ({ item, updateQuantity, removeItem }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <div className="flex items-center gap-4 mt-2">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
            className="w-20"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => removeItem(item.id)}
          >
            Remover
          </Button>
        </div>
        <p className="font-medium text-primary mt-2">
          R$ {(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};
