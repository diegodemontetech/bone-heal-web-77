
import { CartItem } from "@/components/cart/CartItem";
import { CartItem as CartItemType } from "@/types/cart";
import { useCart } from "@/hooks/use-cart";

interface CartItemsSectionProps {
  cartItems: CartItemType[];
  itemCount: number;
}

const CartItemsSection = ({ cartItems, itemCount }: CartItemsSectionProps) => {
  const { removeItem, updateQuantity } = useCart();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium mb-4">Itens ({itemCount})</h2>

      <div className="divide-y">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => removeItem(item.id)}
            onUpdateQuantity={(qty: number) => updateQuantity(item.id, qty)}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemsSection;
