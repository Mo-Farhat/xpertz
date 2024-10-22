import React from 'react';
import { Plus, Minus, Percent } from 'lucide-react';
import { useSalesContext } from './SalesContext';
import { CartItem } from './types';
import { Button } from "../../ui/button";

interface CartProps {
  onSetActiveInput: (inputId: string | null) => void;
  activeInput: string | null;
  numpadValue: string;
  onApplyDiscount: (productId: string, discount: number) => void;
  isHirePurchase: boolean;
}

const Cart: React.FC<CartProps> = ({ onSetActiveInput, activeInput, numpadValue, onApplyDiscount, isHirePurchase }) => {
  const { cart, removeFromCart, addToCart, calculateTotal } = useSalesContext();

  const renderCartItem = (item: CartItem) => {
    const isDiscountActive = activeInput === `product-${item.id}`;
    const currentDiscount = isDiscountActive ? parseFloat(numpadValue) || item.discount : item.discount;
    const discountedPrice = item.price * (1 - currentDiscount / 100);

    return (
      <div key={item.id} className="flex justify-between items-center border-b py-2">
        <div className="flex items-center">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover mr-2" />
          )}
          <div>
            <span className="font-semibold">{item.name}</span>
            <br />
            <span className="text-sm text-gray-600">
              ${item.price.toFixed(2)} x {item.quantity}
              {currentDiscount > 0 && (
                <>
                  <br />
                  <span className="text-green-600">
                    Discount: {currentDiscount.toFixed(2)}%
                    (${discountedPrice.toFixed(2)})
                  </span>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-600 mr-2"
          >
            <Minus size={16} />
          </button>
          <span className="mx-2">{item.quantity}</span>
          <button 
            onClick={() => addToCart(item)}
            className="text-green-500 hover:text-green-600 mr-4"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onSetActiveInput(`product-${item.id}`)}
            className={`p-1 ${isDiscountActive ? 'bg-blue-100' : ''}`}
          >
            <Percent size={16} />
          </button>
        </div>
      </div>
    );
  };

  const total = calculateTotal();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{isHirePurchase ? 'Hire Purchase Cart' : 'Cart'}</h3>
      {cart.map(renderCartItem)}
      <div className="mt-4">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      </div>
      {isHirePurchase && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Hire purchase terms and conditions will be applied at checkout.
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;