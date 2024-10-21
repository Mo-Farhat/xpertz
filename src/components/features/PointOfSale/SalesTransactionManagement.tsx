import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useSalesContext } from './SalesContext';
import ProductList from './ProductList';
import Cart from './Cart';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import PaymentValidation from './PaymentValidation';
import Numpad from './Numpad';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/use-toast";
import { Product } from './types';

const SalesTransactionManagement: React.FC = () => {
  const { searchTerm, setSearchTerm, error, addToCart, discount, products, setTotalDiscount, applyProductDiscount, setHirePurchaseItems, cart } = useSalesContext();
  const [showPaymentValidation, setShowPaymentValidation] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [numpadValue, setNumpadValue] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackFromPayment = () => {
    setShowPaymentValidation(false);
  };

  const handleNumpadClick = (value: string) => {
    if (activeInput === 'search') {
      setSearchTerm(prev => prev + value);
    } else if (activeInput?.startsWith('product-') || activeInput === 'totalDiscount') {
      setNumpadValue(prev => prev + value);
    }
  };

  const handleDiscountClick = () => {
    if (!activeInput?.startsWith('product-') && activeInput !== 'totalDiscount') {
      setActiveInput('totalDiscount');
      setNumpadValue('');
    }
  };

  const handleBackspaceClick = () => {
    if (activeInput === 'search') {
      setSearchTerm(prev => prev.slice(0, -1));
    } else if (activeInput?.startsWith('product-') || activeInput === 'totalDiscount') {
      setNumpadValue(prev => prev.slice(0, -1));
    }
  };

  const handleEnterClick = () => {
    if (activeInput?.startsWith('product-')) {
      const productId = activeInput.split('-')[1];
      applyProductDiscount(productId, parseFloat(numpadValue));
    } else if (activeInput === 'totalDiscount') {
      setTotalDiscount(parseFloat(numpadValue));
    }
    setNumpadValue('');
    setActiveInput(null);
  };

  const handleHirePurchase = () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the cart before proceeding to Hire Purchase.",
        variant: "destructive",
      });
      return;
    }
    setHirePurchaseItems();
    navigate('/point-of-sale/hire-purchasing');
  };

  if (showPaymentValidation) {
    return <PaymentValidation onBack={handleBackFromPayment} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-4 relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setActiveInput('search')}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <ProductList
          products={products}
          onUpdate={() => {}}
          onDelete={() => {}}
          onAddToCart={(product: Product) => addToCart(product)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <Cart
          onSetActiveInput={setActiveInput}
          activeInput={activeInput}
          numpadValue={numpadValue}
          onApplyDiscount={(productId, discount) => applyProductDiscount(productId, discount)}
        />
        <div className="mt-4">
          <Numpad
            onNumberClick={handleNumpadClick}
            onDiscountClick={handleDiscountClick}
            onBackspaceClick={handleBackspaceClick}
            onEnterClick={handleEnterClick}
          />
        </div>
        <div className="mt-4 space-y-2">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => setShowPaymentValidation(true)}
          >
            Payment
          </Button>
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleHirePurchase}
          >
            Hire Purchase
          </Button>
        </div>
      </div>
      {error && <div className="col-span-2 text-red-500">{error}</div>}
    </div>
  );
};

export default SalesTransactionManagement;