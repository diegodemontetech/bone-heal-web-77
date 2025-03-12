import React from 'react';
import { CartItem as CartItemType } from '@/types/cart';

export interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity
}) => {
  return (
    <div className="flex items-center py-4">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
      <div className="flex-grow">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
            onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
          >
            -
          </button>
          <input
            type="number"
            className="bg-gray-100 text-gray-700 text-center w-16 py-1"
            value={item.quantity}
            readOnly
          />
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          Remover
        </button>
      </div>
    </div>
  );
};
