import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useSalesContext } from './SalesContext';
import ProductList from './ProductList';
import Cart from './Cart';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import PaymentValidation from './PaymentValidation';
import HirePurchasePaymentValidation from './HirePurchasePaymentValidation';
import Numpad from './Numpad';
import { useToast } from "../../hooks/use-toast";
import { Product } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

const SalesTransactionManagement: React.FC = () => {
  const { searchTerm, setSearchTerm, error, addToCart, discount, products, setTotalDiscount, applyProductDiscount } = useSalesContext();
  const [showPaymentValidation, setShowPaymentValidation] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [activeTab, setActiveTab] = useState('regular');
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

  if (showPaymentValidation) {
    return activeTab === 'hirePurchase' 
      ? <HirePurchasePaymentValidation onBack={handleBackFromPayment} />
      : <PaymentValidation onBack={handleBackFromPayment} />;
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="regular">Regular Sale</TabsTrigger>
            <TabsTrigger value="hirePurchase">Hire Purchase</TabsTrigger>
          </TabsList>
          <TabsContent value="regular">
            <Cart
              onSetActiveInput={setActiveInput}
              activeInput={activeInput}
              numpadValue={numpadValue}
              onApplyDiscount={(productId, discount) => applyProductDiscount(productId, discount)}
              isHirePurchase={false}
            />
          </TabsContent>
          <TabsContent value="hirePurchase">
            <Cart
              onSetActiveInput={setActiveInput}
              activeInput={activeInput}
              numpadValue={numpadValue}
              onApplyDiscount={(productId, discount) => applyProductDiscount(productId, discount)}
              isHirePurchase={true}
            />
          </TabsContent>
        </Tabs>
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
            Proceed to Payment
          </Button>
        </div>
      </div>
      {error && <div className="col-span-2 text-red-500">{error}</div>}
    </div>
  );
};

export default SalesTransactionManagement;